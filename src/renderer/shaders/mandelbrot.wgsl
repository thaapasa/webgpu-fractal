// WebGPU Shader for Mandelbrot Set with HDR support
// WGSL (WebGPU Shading Language)

struct Uniforms {
  resolution: vec2f,
  center: vec2f,
  zoom: f32,
  maxIterations: i32,
  time: f32,
  paletteIndex: i32,
  colorOffset: f32,
  fractalType: i32,
  juliaC: vec2f,
  hdrEnabled: i32,
  hdrPeakNits: f32,
}

@group(0) @binding(0) var<uniform> u: Uniforms;

struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,
}

@vertex
fn vertexMain(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
  // Fullscreen triangle (more efficient than quad)
  var pos = array<vec2f, 3>(
    vec2f(-1.0, -1.0),
    vec2f(3.0, -1.0),
    vec2f(-1.0, 3.0)
  );

  var output: VertexOutput;
  output.position = vec4f(pos[vertexIndex], 0.0, 1.0);
  output.uv = (pos[vertexIndex] + 1.0) * 0.5;
  // Don't flip Y - keep consistent with WebGL coordinate system
  return output;
}

// Cosine palette
fn palette(t: f32, a: vec3f, b: vec3f, c: vec3f, d: vec3f) -> vec3f {
  return a + b * cos(6.28318 * (c * t + d));
}

// HDR brightness curve
fn hdrBrightnessCurve(normalized: f32, peakMultiplier: f32) -> f32 {
  let LOW_END = 0.15;
  let HIGH_START = 0.50;  // Start ramping up earlier (was 0.80)

  if (normalized < LOW_END) {
    // Quick rise from dim to standard
    let t = normalized / LOW_END;
    return mix(0.1, 1.0, sqrt(t));
  } else if (normalized < HIGH_START) {
    // Gradual rise through middle range
    let t = (normalized - LOW_END) / (HIGH_START - LOW_END);
    return mix(1.0, 1.5, t);  // Slight boost in middle
  } else {
    // Dramatic ramp to peak brightness
    let t = (normalized - HIGH_START) / (1.0 - HIGH_START);
    let eased = pow(t, 1.2);  // Less aggressive curve for smoother ramp
    return mix(1.5, peakMultiplier, eased);
  }
}

fn getColor(t_in: f32, paletteIdx: i32, isCycling: bool) -> vec3f {
  var t = t_in;
  if (isCycling) {
    t = fract(t);
  } else {
    t = clamp(t, 0.0, 1.0);
  }

  // HDR palettes: colors have high luminosity, HDR curve controls perceived brightness
  // All palettes designed to have decent brightness at all points

  if (paletteIdx == 0) {
    // Rainbow - vibrant cycling colors
    return palette(t, vec3f(0.6), vec3f(0.4), vec3f(1.0), vec3f(0.0, 0.33, 0.67));
  } else if (paletteIdx == 1) {
    // Blue HDR - rich blues with good luminosity throughout
    let c1 = vec3f(0.15, 0.2, 0.5);   // deep blue (not black)
    let c2 = vec3f(0.2, 0.4, 0.7);    // medium blue
    let c3 = vec3f(0.3, 0.6, 0.85);   // sky blue
    let c4 = vec3f(0.5, 0.8, 0.95);   // light blue
    let c5 = vec3f(0.8, 0.95, 1.0);   // bright cyan-white
    if (t < 0.25) { return mix(c1, c2, t * 4.0); }
    else if (t < 0.5) { return mix(c2, c3, (t - 0.25) * 4.0); }
    else if (t < 0.75) { return mix(c3, c4, (t - 0.5) * 4.0); }
    else { return mix(c4, c5, (t - 0.75) * 4.0); }
  } else if (paletteIdx == 2) {
    // Gold HDR - warm golds with luminosity
    let c1 = vec3f(0.4, 0.25, 0.1);   // warm brown
    let c2 = vec3f(0.6, 0.4, 0.15);   // bronze
    let c3 = vec3f(0.8, 0.55, 0.2);   // gold
    let c4 = vec3f(0.95, 0.75, 0.35); // bright gold
    let c5 = vec3f(1.0, 0.95, 0.7);   // pale gold
    if (t < 0.25) { return mix(c1, c2, t * 4.0); }
    else if (t < 0.5) { return mix(c2, c3, (t - 0.25) * 4.0); }
    else if (t < 0.75) { return mix(c3, c4, (t - 0.5) * 4.0); }
    else { return mix(c4, c5, (t - 0.75) * 4.0); }
  } else if (paletteIdx == 3) {
    // Grayscale HDR - neutral grays, never too dark
    let c1 = vec3f(0.25, 0.25, 0.27); // medium-dark gray
    let c2 = vec3f(0.4, 0.4, 0.42);   // medium gray
    let c3 = vec3f(0.6, 0.6, 0.6);    // light gray
    let c4 = vec3f(0.8, 0.8, 0.78);   // pale gray
    let c5 = vec3f(1.0, 0.98, 0.95);  // warm white
    if (t < 0.25) { return mix(c1, c2, t * 4.0); }
    else if (t < 0.5) { return mix(c2, c3, (t - 0.25) * 4.0); }
    else if (t < 0.75) { return mix(c3, c4, (t - 0.5) * 4.0); }
    else { return mix(c4, c5, (t - 0.75) * 4.0); }
  } else if (paletteIdx == 4) {
    // Fire HDR - hot colors with glow
    return palette(t, vec3f(0.6, 0.4, 0.3), vec3f(0.4, 0.4, 0.3), vec3f(1.0, 1.0, 0.5), vec3f(0.0, 0.1, 0.2));
  } else if (paletteIdx == 5) {
    // Ice HDR - cool colors
    return palette(t, vec3f(0.5, 0.6, 0.7), vec3f(0.3, 0.3, 0.3), vec3f(1.0, 0.7, 0.4), vec3f(0.0, 0.15, 0.20));
  } else if (paletteIdx == 6) {
    // Sepia HDR - warm browns with luminosity
    let c1 = vec3f(0.35, 0.25, 0.18); // warm brown
    let c2 = vec3f(0.5, 0.38, 0.25);  // tan
    let c3 = vec3f(0.65, 0.52, 0.38); // light tan
    let c4 = vec3f(0.82, 0.72, 0.58); // cream
    let c5 = vec3f(1.0, 0.95, 0.88);  // warm white
    if (t < 0.25) { return mix(c1, c2, t * 4.0); }
    else if (t < 0.5) { return mix(c2, c3, (t - 0.25) * 4.0); }
    else if (t < 0.75) { return mix(c3, c4, (t - 0.5) * 4.0); }
    else { return mix(c4, c5, (t - 0.75) * 4.0); }
  } else if (paletteIdx == 7) {
    // Ocean HDR - teals and aquas
    let c1 = vec3f(0.1, 0.3, 0.4);    // deep teal
    let c2 = vec3f(0.15, 0.45, 0.55); // teal
    let c3 = vec3f(0.25, 0.6, 0.65);  // aqua
    let c4 = vec3f(0.45, 0.78, 0.8);  // light aqua
    let c5 = vec3f(0.7, 0.95, 0.92);  // bright aqua
    if (t < 0.25) { return mix(c1, c2, t * 4.0); }
    else if (t < 0.5) { return mix(c2, c3, (t - 0.25) * 4.0); }
    else if (t < 0.75) { return mix(c3, c4, (t - 0.5) * 4.0); }
    else { return mix(c4, c5, (t - 0.75) * 4.0); }
  } else if (paletteIdx == 8) {
    // Purple HDR - rich purples
    let c1 = vec3f(0.3, 0.15, 0.45);  // deep purple
    let c2 = vec3f(0.45, 0.25, 0.6);  // purple
    let c3 = vec3f(0.6, 0.4, 0.75);   // orchid
    let c4 = vec3f(0.78, 0.6, 0.88);  // light purple
    let c5 = vec3f(0.95, 0.85, 1.0);  // pale lavender
    if (t < 0.25) { return mix(c1, c2, t * 4.0); }
    else if (t < 0.5) { return mix(c2, c3, (t - 0.25) * 4.0); }
    else if (t < 0.75) { return mix(c3, c4, (t - 0.5) * 4.0); }
    else { return mix(c4, c5, (t - 0.75) * 4.0); }
  } else if (paletteIdx == 9) {
    // Forest HDR - greens
    let c1 = vec3f(0.15, 0.3, 0.12);  // forest green
    let c2 = vec3f(0.25, 0.45, 0.2);  // green
    let c3 = vec3f(0.4, 0.6, 0.35);   // light green
    let c4 = vec3f(0.6, 0.78, 0.5);   // pale green
    let c5 = vec3f(0.8, 0.95, 0.7);   // bright lime
    if (t < 0.25) { return mix(c1, c2, t * 4.0); }
    else if (t < 0.5) { return mix(c2, c3, (t - 0.25) * 4.0); }
    else if (t < 0.75) { return mix(c3, c4, (t - 0.5) * 4.0); }
    else { return mix(c4, c5, (t - 0.75) * 4.0); }
  } else if (paletteIdx == 10) {
    // Sunset HDR - warm oranges and pinks
    return palette(t, vec3f(0.6, 0.45, 0.4), vec3f(0.35, 0.35, 0.3), vec3f(1.0, 1.0, 0.5), vec3f(0.0, 0.1, 0.2));
  } else {
    // Electric HDR - vibrant neon
    return palette(t, vec3f(0.55, 0.55, 0.6), vec3f(0.45, 0.45, 0.4), vec3f(1.0), vec3f(0.3, 0.2, 0.2));
  }
}

@fragment
fn fragmentMain(input: VertexOutput) -> @location(0) vec4f {
  let aspect = u.resolution.x / u.resolution.y;
  var uv = input.uv - 0.5;
  uv.x *= aspect;
  let pos = u.center + uv / u.zoom;

  // Setup for fractal type
  var z: vec2f;
  var c: vec2f;
  let isJulia = (u.fractalType == 2 || u.fractalType == 3);
  let isBurningShip = (u.fractalType == 1 || u.fractalType == 3);

  if (isJulia) {
    z = pos;
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
    if (zMagSq > 4.0) { break; }

    if (isBurningShip) {
      z = vec2f(abs(z.x), -abs(z.y));
    }
    z = vec2f(z.x * z.x - z.y * z.y + c.x, 2.0 * z.x * z.y + c.y);
    iterations++;
  }

  if (iterations >= maxIter) {
    // Inside the set - pure black
    return vec4f(0.0, 0.0, 0.0, 1.0);
  }

  // Smooth iteration count
  let smoothIter = f32(iterations) + 1.0 - log2(log2(max(dot(z, z), 4.0)));
  let normalized = smoothIter / f32(maxIter);

  // Determine palette type
  let isMonotonic = (u.paletteIndex >= 1 && u.paletteIndex <= 3) ||
                    (u.paletteIndex >= 6 && u.paletteIndex <= 9);

  var t: f32;
  if (isMonotonic) {
    t = normalized + u.colorOffset;
  } else {
    let numCycles = 8.0;
    t = normalized * numCycles + u.colorOffset;
  }

  var color = getColor(t, u.paletteIndex, !isMonotonic);

  // Add subtle glow near boundary
  let edgeFactor = 1.0 - f32(iterations) / f32(maxIter);
  let glow = pow(edgeFactor, 0.5) * 0.3;
  color = color * (1.0 + glow);

  // Apply HDR brightness if enabled
  if (u.hdrEnabled != 0) {
    let peakMultiplier = u.hdrPeakNits / 100.0;
    let brightnessMult = hdrBrightnessCurve(normalized, peakMultiplier);
    color = color * brightnessMult;
    // For HDR, don't clamp - let values > 1.0 be displayed brighter
    return vec4f(color, 1.0);
  } else {
    // SDR: clamp to 1.0
    return vec4f(min(color, vec3f(1.0)), 1.0);
  }
}
