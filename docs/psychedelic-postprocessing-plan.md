# Psychedelic Post-Processing Effects Plan

## Context

The current post-processing pipeline (bloom, sharpen, chromatic aberration, tone mapping, vignette)
produces subtle, tasteful effects. The goal is to add **wild, transformative** effects that
completely change the visual character — mirrored ghost overlays, kaleidoscope symmetry,
feedback trails, wave distortion, and more.

## Current Architecture

- 4-pass pipeline: bloom extract -> blur H -> blur V -> composite
- All creative effects live in the composite shader (`composite.wgsl`)
- Presets defined in `PostProcessState.ts` (Clean/Cinematic/Vivid/Dreamy)
- Uniform buffer has room for expansion (80 bytes used of available space)
- Textures: intermediateTexture (full-res), bloom textures (half-res)

### Key Files

- `src/renderer/postprocess/PostProcessingPipeline.ts` — pipeline orchestration
- `src/renderer/postprocess/PostProcessState.ts` — presets and settings
- `src/renderer/shaders/composite.wgsl` — where most effects are applied
- `src/renderer/shaders/bloom-extract.wgsl`, `blur.wgsl` — bloom passes
- `src/fractal/WebGPUFractalEngine.ts` — render loop integration (lines 378-405)

## Proposed Effects (ranked by impact vs effort)

### Tier 1: Composite Shader Only (UV tricks, no new passes)

These can all be done by modifying UV coordinates or blending in the composite shader.

#### 1. Ghost Mirrors
Overlay translucent mirrored copies of the fractal image. Flip horizontally, vertically,
or both, and blend at reduced opacity. Multiple mirror layers at different opacities for
a Rorschach/spirit-world look.

- **Implementation**: In composite shader, sample the texture at mirrored UVs
  (`vec2(1-uv.x, uv.y)`, `vec2(uv.x, 1-uv.y)`, etc.), blend additively with opacity control
- **Uniforms needed**: `ghostMirrorEnabled: i32`, `ghostMirrorOpacity: f32`,
  `ghostMirrorMode: i32` (horizontal/vertical/both/diagonal)

#### 2. Kaleidoscope
Slice the image into angular segments and mirror them around the center to create
mandala-like symmetry (4-fold, 6-fold, 8-fold).

- **Implementation**: Convert UV to polar coords, fold the angle into a segment using
  `mod` and mirror, convert back to cartesian, sample texture
- **Uniforms needed**: `kaleidoscopeEnabled: i32`, `kaleidoscopeSegments: f32` (e.g. 4, 6, 8)

#### 3. Wave Distortion
Animated sine-wave ripples across the image — like viewing the fractal through water.

- **Implementation**: Offset UV by `sin(uv.y * freq + time) * amplitude` (and similarly for
  vertical waves). Uses the existing `time` uniform or pass it through post-process uniforms.
- **Uniforms needed**: `waveEnabled: i32`, `waveAmplitude: f32`, `waveFrequency: f32`

#### 4. Extreme Color Channel Separation
Much more aggressive than current chromatic aberration — split R, G, B and rotate them
around the center at different angles. Three overlapping fractal ghosts in different colors.

- **Implementation**: Sample R, G, B channels at three different UV positions, each rotated
  around center by a different angle
- **Uniforms needed**: `channelSplitEnabled: i32`, `channelSplitAngle: f32`,
  `channelSplitDistance: f32`

#### 5. Polar Warp
Transform the image from rectangular to polar coordinates, wrapping the fractal into
circular mandala patterns.

- **Implementation**: Remap UV from cartesian to polar (or vice versa) before sampling
- **Uniforms needed**: `polarWarpEnabled: i32`, `polarWarpStrength: f32`

### Tier 2: Need Additional Resources (new textures or passes)

#### 6. Feedback Trails (Crown Jewel)
Keep a copy of the previous frame and blend it with the current frame at high opacity
(80-95%). Creates ghostly motion trails during pan/zoom — the fractal smears behind
itself like a comet. Tourist mode would be mesmerizing.

- **Implementation**: Requires a persistent "history" texture that survives between frames.
  Each frame: blend current render with history texture, write result to history, display.
  Needs a new render pass and a ping-pong texture pair.
- **Uniforms needed**: `feedbackEnabled: i32`, `feedbackDecay: f32` (0.8-0.95),
  `feedbackBlendMode: i32` (additive/alpha/screen)

#### 7. Radial Zoom Blur
Blur radially outward from center — tunnel/vortex effect, especially powerful during zoom.

- **Implementation**: In composite shader, sample texture at multiple points along a ray
  from center to current pixel, average them. More samples = smoother but heavier.
  Could also be done as a separate blur pass with radial kernel.
- **Uniforms needed**: `radialBlurEnabled: i32`, `radialBlurStrength: f32`,
  `radialBlurSamples: i32`

#### 8. Edge Glow / Neon Outlines
Detect edges (Sobel/Laplacian on luminance) and make them glow with neon colors.
The fractal boundary lit up like Tron circuits.

- **Implementation**: Could be done in composite (sample neighbors, compute gradient,
  add glow), but a proper version would extract edges in a separate pass then bloom them.
- **Uniforms needed**: `edgeGlowEnabled: i32`, `edgeGlowIntensity: f32`,
  `edgeGlowColor: vec3f`

## Recommended Implementation Order

### Phase 1: "Psychedelic" Preset (composite shader changes only)
1. Ghost Mirrors
2. Kaleidoscope
3. Wave Distortion
4. New preset combining these effects

### Phase 2: Enhanced Effects
5. Extreme Color Channel Separation
6. Polar Warp
7. Radial Zoom Blur

### Phase 3: The Crown Jewel
8. Feedback Trails (needs new texture management + render pass)
9. Edge Glow

## New Presets

| Preset | Effects |
|--------|---------|
| **Psychedelic** | Ghost mirrors (opacity 0.3) + kaleidoscope (6 segments) + wave distortion (subtle) |
| **Acid Trip** | Strong wave distortion + color channel split + kaleidoscope (8 segments) |
| **Ethereal** | Feedback trails (decay 0.9) + ghost mirrors + soft bloom |
| **Neon** | Edge glow + high saturation + vignette |
