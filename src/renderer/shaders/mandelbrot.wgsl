// WebGPU Shader for Mandelbrot Set with HDR support
// Version 2: Palette parameters passed from TypeScript (no branching)

struct Uniforms {
  resolution: vec2f,         // offset 0, size 8
  center: vec2f,             // offset 8, size 8
  zoom: f32,                 // offset 16, size 4
  maxIterations: i32,        // offset 20, size 4
  time: f32,                 // offset 24, size 4
  colorOffset: f32,          // offset 28, size 4
  fractalType: i32,          // offset 32, size 4
  _pad_jc: f32,              // offset 36, size 4 (padding for juliaC alignment)
  juliaC: vec2f,             // offset 40, size 8
  hdrEnabled: i32,           // offset 48, size 4
  hdrBrightnessBias: f32,    // offset 52, size 4
  paletteType: i32,          // offset 56, size 4
  isMonotonic: i32,          // offset 60, size 4
  sdrGradientBrightness: f32, // offset 64, size 4
  _pad0: f32,                // offset 68, size 4
  _pad1: f32,                // offset 72, size 4
  _pad2: f32,                // offset 76, size 4
  // Now at offset 80 = 16-byte aligned for vec3f
  // Cosine palette: color = a + b * cos(2π * (c * t + d))
  paletteA: vec3f,           // offset 80, size 12
  _padA: f32,                // offset 92, size 4
  paletteB: vec3f,           // offset 96, size 12
  _padB: f32,                // offset 108, size 4
  paletteC: vec3f,           // offset 112, size 12
  _padC: f32,                // offset 124, size 4
  paletteD: vec3f,           // offset 128, size 12
  _padD: f32,                // offset 140, size 4
  // Gradient palette: 5 color stops (offset 144)
  gradientC1: vec3f,         // offset 144, size 12
  _padG1: f32,               // offset 156, size 4
  gradientC2: vec3f,         // offset 160, size 12
  _padG2: f32,               // offset 172, size 4
  gradientC3: vec3f,         // offset 176, size 12
  _padG3: f32,               // offset 188, size 4
  gradientC4: vec3f,         // offset 192, size 12
  _padG4: f32,               // offset 204, size 4
  gradientC5: vec3f,         // offset 208, size 12
  _padG5: f32,               // offset 220, size 4
}

@group(0) @binding(0) var<uniform> u: Uniforms;

struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,
}

@vertex
fn vertexMain(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
  var pos = array<vec2f, 3>(
    vec2f(-1.0, -1.0),
    vec2f(3.0, -1.0),
    vec2f(-1.0, 3.0)
  );
  var output: VertexOutput;
  output.position = vec4f(pos[vertexIndex], 0.0, 1.0);
  output.uv = (pos[vertexIndex] + 1.0) * 0.5;
  return output;
}

// Cosine palette formula
fn cosineColor(t: f32, a: vec3f, b: vec3f, c: vec3f, d: vec3f) -> vec3f {
  return a + b * cos(6.28318 * (c * t + d));
}

// 5-stop gradient
fn gradientColor(t: f32, c1: vec3f, c2: vec3f, c3: vec3f, c4: vec3f, c5: vec3f) -> vec3f {
  if (t < 0.25) { return mix(c1, c2, t * 4.0); }
  else if (t < 0.5) { return mix(c2, c3, (t - 0.25) * 4.0); }
  else if (t < 0.75) { return mix(c3, c4, (t - 0.5) * 4.0); }
  else { return mix(c4, c5, (t - 0.75) * 4.0); }
}

// Get color based on palette type
fn getColor(t_in: f32, isCycling: bool) -> vec3f {
  var t = t_in;
  if (isCycling) {
    t = fract(t);
  } else {
    t = clamp(t, 0.0, 1.0);
  }

  if (u.paletteType == 0) {
    return cosineColor(t, u.paletteA, u.paletteB, u.paletteC, u.paletteD);
  } else {
    var color = gradientColor(t, u.gradientC1, u.gradientC2, u.gradientC3, u.gradientC4, u.gradientC5);
    // Apply SDR gradient brightness adjustment (only affects SDR mode)
    if (u.hdrEnabled == 0) {
      color = color * u.sdrGradientBrightness;
    }
    return color;
  }
}

// HDR brightness curve for MONOTONIC palettes
// bias: -1 to +1, shifts the bright region earlier (positive) or later (negative)
fn hdrBrightnessCurveMonotonic(normalized: f32, bias: f32) -> f32 {
  // Shift the normalized value by bias to move bright regions
  // bias > 0: more of the image becomes bright (bright region starts earlier)
  // bias < 0: less of the image is bright (bright region starts later)
  let shifted = clamp(normalized + bias * 0.4, 0.0, 1.0);

  let LOW_END = 0.05;
  let MID_START = 0.30;
  let HIGH_START = 0.60;
  let PEAK = 10.0; // Fixed peak multiplier for HDR

  if (shifted < LOW_END) {
    let t = shifted / LOW_END;
    return mix(0.0, 0.15, sqrt(t));
  } else if (shifted < MID_START) {
    let t = (shifted - LOW_END) / (MID_START - LOW_END);
    return mix(0.15, 0.5, t);
  } else if (shifted < HIGH_START) {
    let t = (shifted - MID_START) / (HIGH_START - MID_START);
    return mix(0.5, 1.0, t);
  } else {
    let t = (shifted - HIGH_START) / (1.0 - HIGH_START);
    let eased = pow(t, 1.1);
    return mix(1.0, PEAK, eased);
  }
}

// HDR brightness curve for CYCLING palettes
// bias: -1 to +1, shifts the HDR highlight region
fn hdrBrightnessCurveCycling(normalized: f32, bias: f32) -> f32 {
  // Shift where the HDR boost kicks in
  // bias > 0: HDR highlights appear earlier (more of image gets boost)
  // bias < 0: HDR highlights appear later (only near-boundary gets boost)
  let HIGH_START = clamp(0.70 - bias * 0.25, 0.3, 0.95);
  let PEAK = 10.0; // Fixed peak multiplier for HDR

  if (normalized < HIGH_START) {
    let t = normalized / HIGH_START;
    return mix(0.85, 1.0, t);
  } else {
    let t = (normalized - HIGH_START) / (1.0 - HIGH_START);
    let eased = pow(t, 1.2);
    return mix(1.0, PEAK, eased);
  }
}

@fragment
fn fragmentMain(input: VertexOutput) -> @location(0) vec4f {
  let aspect = u.resolution.x / u.resolution.y;
  var uv = input.uv - 0.5;
  uv.x *= aspect;
  let pos = u.center + uv / u.zoom;

  var z: vec2f;
  var c: vec2f;
  var zPrev: vec2f = vec2f(0.0); // For Phoenix fractal

  // Determine if this is a Julia variant (odd types have bit 0 set)
  let fType = u.fractalType;
  let isJulia = (fType & 1) == 1;
  let baseType = fType >> 1; // 0=Mandelbrot, 1=BurningShip, 2=Tricorn, etc.

  // Phoenix is naturally Julia-style - always start z at pixel position
  let isPhoenix = baseType == 5;

  if (isJulia) {
    // For Phoenix Julia, swap and negate to match conventional orientation
    // (feathers extending horizontally, correct vertical orientation)
    if (isPhoenix) {
      z = vec2f(-pos.y, pos.x);  // Rotate 90° CCW to match reference images
    } else {
      z = pos;
    }
    c = u.juliaC;
  } else {
    z = vec2f(0.0);
    c = pos;
  }

  var iterations = 0;
  let maxIter = u.maxIterations;

  for (var i = 0; i < 65536; i++) {
    if (i >= maxIter) { break; }
    let zMagSq = dot(z, z);
    if (zMagSq > 256.0) { break; } // Larger escape for higher powers

    let zTemp = z;

    // Fractal type dispatch using base type (fType >> 1 clears Julia bit)
    // 0: Mandelbrot/Julia, 1: Burning Ship, 2: Tricorn, 3: Celtic,
    // 4: Buffalo, 5: Phoenix, 6: Multibrot3, 7: Multibrot4, 8: Perpendicular

    if (baseType == 0) {
      // Mandelbrot / Julia: z² + c
      z = vec2f(z.x * z.x - z.y * z.y + c.x, 2.0 * z.x * z.y + c.y);
    }
    else if (baseType == 1) {
      // Burning Ship: |z|² + c (take abs before squaring)
      z = vec2f(abs(z.x), -abs(z.y));
      z = vec2f(z.x * z.x - z.y * z.y + c.x, 2.0 * z.x * z.y + c.y);
    }
    else if (baseType == 2) {
      // Tricorn: conj(z)² + c
      z = vec2f(z.x * z.x - z.y * z.y + c.x, -2.0 * z.x * z.y + c.y);
    }
    else if (baseType == 3) {
      // Celtic: |Re(z²)| + Im(z²)i + c
      let zSqReal = z.x * z.x - z.y * z.y;
      let zSqImag = 2.0 * z.x * z.y;
      z = vec2f(abs(zSqReal) + c.x, zSqImag + c.y);
    }
    else if (baseType == 4) {
      // Buffalo: |Re(z²)| - |Im(z²)|i + c
      let zSqReal = z.x * z.x - z.y * z.y;
      let zSqImag = 2.0 * z.x * z.y;
      z = vec2f(abs(zSqReal) + c.x, -abs(zSqImag) + c.y);
    }
    else if (baseType == 5) {
      // Phoenix: z_{n+1} = z_n² + p + q * z_{n-1}
      // Classic formula from Shigehiro Ushiki
      // We swap real/imag to rotate 90° and match conventional orientation
      // where the "beak" points right and "feathers" extend horizontally
      let p = c.y;  // Swapped: use imag as real constant
      let q = c.x;  // Swapped: use real as coupling constant
      let zSq = vec2f(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y);
      let newZ = vec2f(
        zSq.x + p + q * zPrev.x,
        zSq.y + q * zPrev.y
      );
      zPrev = z;
      z = newZ;
    }
    else if (baseType == 6) {
      // Multibrot3: z³ + c
      let zSq = vec2f(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y);
      z = vec2f(z.x * zSq.x - z.y * zSq.y + c.x, z.x * zSq.y + z.y * zSq.x + c.y);
    }
    else if (baseType == 7) {
      // Multibrot4: z⁴ + c
      let zSq = vec2f(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y);
      z = vec2f(zSq.x * zSq.x - zSq.y * zSq.y + c.x, 2.0 * zSq.x * zSq.y + c.y);
    }
    else if (baseType == 8) {
      // Funky Mandelbrot (happy accident!): Re(z) + |Im(z)|i then square
      z = vec2f(z.x, abs(z.y));
      z = vec2f(z.x * z.x - z.y * z.y + c.x, 2.0 * z.x * z.y + c.y);
    }
    else if (baseType == 9) {
      // Perpendicular Mandelbrot: (|Re(z)| - i·Im(z))² + c
      // w = |x| - iy, w² = |x|² - y² - 2|x|yi
      let ax = abs(z.x);
      z = vec2f(ax * ax - z.y * z.y + c.x, -2.0 * ax * z.y + c.y);
    }
    else {
      // Fallback to standard Mandelbrot
      z = vec2f(z.x * z.x - z.y * z.y + c.x, 2.0 * z.x * z.y + c.y);
    }

    iterations++;
  }

  if (iterations >= maxIter) {
    return vec4f(0.0, 0.0, 0.0, 1.0);
  }

  // Smooth iteration count - adjust log base for higher power fractals
  var logBase = 2.0;
  if (baseType == 6) { logBase = 3.0; }      // Multibrot3
  else if (baseType == 7) { logBase = 4.0; } // Multibrot4

  let smoothIter = f32(iterations) + 1.0 - log2(log2(max(dot(z, z), 4.0))) / log2(logBase);
  let normalized = smoothIter / f32(maxIter);

  let isMonotonic = u.isMonotonic != 0;
  let isCycling = !isMonotonic;

  var t: f32;
  if (isMonotonic) {
    t = normalized + u.colorOffset;
  } else {
    let numCycles = 8.0;
    t = normalized * numCycles + u.colorOffset;
  }

  var color = getColor(t, isCycling);

  if (u.hdrEnabled != 0) {
    var brightnessMult: f32;

    if (isMonotonic) {
      brightnessMult = hdrBrightnessCurveMonotonic(normalized, u.hdrBrightnessBias);
    } else {
      brightnessMult = hdrBrightnessCurveCycling(normalized, u.hdrBrightnessBias);
    }

    color = color * brightnessMult;
    return vec4f(color, 1.0);
  } else {
    let edgeFactor = 1.0 - f32(iterations) / f32(maxIter);
    let glow = pow(edgeFactor, 0.5) * 0.3;
    color = color * (1.0 + glow);
    return vec4f(min(color, vec3f(1.0)), 1.0);
  }
}
