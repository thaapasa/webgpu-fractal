# Fractal Type Interpolation Design

_"Trust the awesomeness."_ - Skippy the Magnificent

## Status: ✅ IMPLEMENTED

This document describes how smooth interpolation between different fractal types during Tourist Mode
transitions works. Rather than abruptly switching fractal formulas, fractals morph between them by
parameterizing the operations that differ.

This includes **two orthogonal blend axes**:

1. **Mandelbrot ↔ Julia blend**: Morphing between c-space and z-space exploration
2. **Formula blend**: Morphing between different z² variants (Mandelbrot, Burning Ship, etc.)

## Mandelbrot ↔ Julia Interpolation

This is embarrassingly elegant. The only difference between Mandelbrot and Julia sets is the
_initial conditions_:

| Mode       | Initial z          | Constant c         |
| ---------- | ------------------ | ------------------ |
| Mandelbrot | z = 0              | c = pixel position |
| Julia      | z = pixel position | c = juliaC (fixed) |

To interpolate, we simply blend the initial conditions:

```wgsl
// juliaBlend: 0.0 = Mandelbrot, 1.0 = Julia
let z = mix(vec2f(0.0), pos, juliaBlend);
let c = mix(pos, juliaC, juliaBlend);
```

The iteration loop remains **identical**. The fractal smoothly morphs from exploring c-space
(Mandelbrot) to exploring z-space (Julia).

**Performance impact:** One additional `mix()` call for setup. Negligible.

## Mathematical Foundation

Most z² fractals in this project follow a pattern:

```
z_new = transform(z)² + c
```

Where `transform()` varies by fractal type. The differences can be expressed as:

| Fractal       | Pre-square transform | Post-square transform       |
| ------------- | -------------------- | --------------------------- |
| Mandelbrot    | z                    | z²                          |
| Burning Ship  | (abs(Re), -abs(Im))  | z²                          |
| Tricorn       | z                    | conj(z²)                    |
| Celtic        | z                    | (abs(Re(z²)), Im(z²))       |
| Buffalo       | z                    | (abs(Re(z²)), -abs(Im(z²))) |
| Funky         | (Re, abs(Im))        | z²                          |
| Perpendicular | (abs(Re), Im)        | z²                          |

## Interpolation Parameters

We can parameterize these transforms with blend factors (0 to 1):

### Pre-square operations (applied to z before squaring)

- `preAbsRe`: When 1, use |Re(z)|. (Perpendicular uses this)
- `preAbsIm`: When 1, use |Im(z)|. (Burning Ship, Funky use this)
- `preNegIm`: When 1, negate Im after abs. (Burning Ship uses this)

### Post-square operations (applied to z² before adding c)

- `postAbsRe`: When 1, use |Re(z²)|. (Celtic, Buffalo use this)
- `postAbsIm`: When 1, use |Im(z²)|. (Buffalo uses this)
- `conjugate`: When 1, negate Im(z²). (Tricorn uses this)
- `postNegIm`: When 1, negate Im. (Buffalo uses this)

### Fractal type to blend parameters mapping

```
Mandelbrot:     preAbsRe=0, preAbsIm=0, preNegIm=0, postAbsRe=0, postAbsIm=0, conjugate=0, postNegIm=0
Burning Ship:   preAbsRe=1, preAbsIm=1, preNegIm=1, postAbsRe=0, postAbsIm=0, conjugate=0, postNegIm=0
Tricorn:        preAbsRe=0, preAbsIm=0, preNegIm=0, postAbsRe=0, postAbsIm=0, conjugate=1, postNegIm=0
Celtic:         preAbsRe=0, preAbsIm=0, preNegIm=0, postAbsRe=1, postAbsIm=0, conjugate=0, postNegIm=0
Buffalo:        preAbsRe=0, preAbsIm=0, preNegIm=0, postAbsRe=1, postAbsIm=1, conjugate=0, postNegIm=1
Funky:          preAbsRe=0, preAbsIm=1, preNegIm=0, postAbsRe=0, postAbsIm=0, conjugate=0, postNegIm=0
Perpendicular:  preAbsRe=1, preAbsIm=0, preNegIm=0, postAbsRe=0, postAbsIm=0, conjugate=0, postNegIm=1
```

## Shader Implementation

The blended iteration is implemented in `src/renderer/shaders/mandelbrot.wgsl`:

```wgsl
// Blended z² iteration - parameterizes all z² variants into a unified formula
fn iterateBlended(z: vec2f, c: vec2f) -> vec2f {
  // Pre-square transforms
  var zp = z;
  zp.x = mix(z.x, abs(z.x), u.blendPreAbsRe);
  zp.y = mix(z.y, abs(z.y), u.blendPreAbsIm);
  zp.y = mix(zp.y, -abs(z.y), u.blendPreNegIm);

  // Compute z²
  let zSqRe = zp.x * zp.x - zp.y * zp.y;
  let zSqIm = 2.0 * zp.x * zp.y;

  // Post-square transforms
  var resultRe = mix(zSqRe, abs(zSqRe), u.blendPostAbsRe);
  var resultIm = mix(zSqIm, abs(zSqIm), u.blendPostAbsIm);
  resultIm = mix(resultIm, -resultIm, u.blendPostNegIm);

  return vec2f(resultRe + c.x, resultIm + c.y);
}
```

## Key Implementation Files

- `src/fractal/FractalBlend.ts` - Blend parameter definitions and interpolation
- `src/renderer/shaders/mandelbrot.wgsl` - Shader with `iterateBlended()` function
- `src/tourist/TouristMode.ts` - Interpolates blend params during transitions
- `src/state/FractalState.ts` - Holds `interpolatedBlendParams` state

## Incompatible Fractals

The following cannot be smoothly interpolated with the z² family:

- **Multibrot³/⁴**: Different polynomial degree (z³, z⁴). No mathematical path from z² to z³.
- **Phoenix**: Has memory term (z\_{n-1}). Fundamentally different iteration structure.

When transitioning to/from these, we should:

1. Fade to black (or a neutral color)
2. Switch fractal type
3. Fade back in

## Performance Impact

The blended approach adds per-iteration:

- 6 `mix()` operations (hardware-accelerated on GPU)
- 3 `abs()` operations
- ~10-15 extra FP ops total

**Estimated overhead: <5%** on modern GPUs. This is negligible compared to the thousands of
iterations per pixel.

## Uniform Buffer Additions

Add these to the uniform struct:

```wgsl
// Fractal blend parameters (offset TBD)
blendT: f32,              // Overall blend factor (0 = fractalType, 1 = blendTarget)
blendTargetType: i32,     // Target fractal type to blend toward
```

The TypeScript side would compute the 7 blend parameters based on source/target types and `blendT`.

## Tourist Mode Integration

During transitions, `TouristMode.ts` automatically:

1. Gets blend params for source and target fractal types via `getFractalBlendParams()`
2. Interpolates all 7 parameters using `interpolateBlendParams()` with eased `t`
3. Passes interpolated params to engine via `onUpdate()` callback
4. Engine stores in `state.interpolatedBlendParams` and passes to shader

When both source and target are blendable (z² family), smooth morphing occurs. For non-blendable
types (Phoenix, Multibrot3/4), the shader falls back to the legacy discrete iteration path.

## Future Work

- ~~Support blending Julia constants during transitions~~ ✅ Done!
- Experiment with non-linear blend curves (ease-in-out)
- Possibly pre-compute "interesting" interpolation midpoints

## Example Transitions

### Mandelbrot → Mandelbrot Julia

```
juliaBlend: 0 → 1
All formula params: unchanged (all zeros)
```

Result: Smooth morph from c-space to z-space exploration. The Mandelbrot set "opens up" into the
Julia set for the current juliaC value.

### Mandelbrot → Burning Ship

```
juliaBlend: 0 → 0 (stays Mandelbrot-style)
preAbsRe: 0 → 1, preAbsIm: 0 → 1, preNegIm: 0 → 1
```

Result: The smooth curves of Mandelbrot gradually become the angular, flame-like shapes of Burning
Ship.

### Mandelbrot → Burning Ship Julia

```
juliaBlend: 0 → 1
preAbsRe: 0 → 1, preAbsIm: 0 → 1, preNegIm: 0 → 1
```

Result: BOTH transformations happen simultaneously! The fractal morphs from Mandelbrot to Burning
Ship while also transitioning from c-space to z-space.

### Burning Ship Julia → Celtic

```
juliaBlend: 1 → 0
preAbsRe: 1 → 0, preAbsIm: 1 → 0, preNegIm: 1 → 0
postAbsRe: 0 → 1
```

Result: Complex multi-parameter morph. The pre-square abs operations fade out while post-square abs
fades in, AND it transitions from Julia back to Mandelbrot-style.

---

_"This is embarrassingly simple for an entity of my capabilities."_
