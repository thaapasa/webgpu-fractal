// Final Composite Pass
// Combines fractal image with bloom and applies vignette, sharpen,
// chromatic aberration, and filmic tone mapping

struct PostProcessUniforms {
  resolution: vec2f,                     // offset 0
  texelSize: vec2f,                      // offset 8
  bloomThreshold: f32,                   // offset 16
  bloomIntensity: f32,                   // offset 20
  vignetteIntensity: f32,                // offset 24
  vignetteSoftness: f32,                 // offset 28
  sharpenStrength: f32,                  // offset 32
  chromaticAberrationIntensity: f32,     // offset 36
  exposure: f32,                         // offset 40
  saturation: f32,                       // offset 44
  temperature: f32,                      // offset 48
  bloomEnabled: i32,                     // offset 52
  vignetteEnabled: i32,                  // offset 56
  sharpenEnabled: i32,                   // offset 60
  chromaticAberrationEnabled: i32,       // offset 64
  toneMappingEnabled: i32,               // offset 68
  // Ghost Mirrors
  ghostMirrorEnabled: i32,               // offset 72
  ghostMirrorOpacity: f32,               // offset 76
  ghostMirrorMode: i32,                  // offset 80
  // Kaleidoscope
  kaleidoscopeEnabled: i32,              // offset 84
  kaleidoscopeSegments: f32,             // offset 88
  // Wave Distortion
  waveEnabled: i32,                      // offset 92
  waveAmplitude: f32,                    // offset 96
  waveFrequency: f32,                    // offset 100
  time: f32,                             // offset 104
  // Feedback Trails
  feedbackEnabled: i32,                  // offset 108
  feedbackDecay: f32,                    // offset 112
  _pad1: f32,                            // offset 116 (pad to 16-byte alignment)
}

struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,
}

@group(0) @binding(0) var texSampler: sampler;
@group(0) @binding(1) var fractalTexture: texture_2d<f32>;
@group(0) @binding(2) var bloomTexture: texture_2d<f32>;
@group(0) @binding(3) var<uniform> u: PostProcessUniforms;
@group(0) @binding(4) var historyTexture: texture_2d<f32>;

@vertex
fn vertexMain(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
  var pos = array<vec2f, 3>(
    vec2f(-1.0, -1.0),
    vec2f(3.0, -1.0),
    vec2f(-1.0, 3.0)
  );
  var output: VertexOutput;
  output.position = vec4f(pos[vertexIndex], 0.0, 1.0);
  let p = pos[vertexIndex];
  output.uv = vec2f((p.x + 1.0) * 0.5, (1.0 - p.y) * 0.5);
  return output;
}

// ACES filmic tone mapping approximation (Narkowicz 2015)
fn acesToneMap(x: vec3f) -> vec3f {
  let a = 2.51;
  let b = 0.03;
  let c = 2.43;
  let d = 0.59;
  let e = 0.14;
  return clamp((x * (a * x + b)) / (x * (c * x + d) + e), vec3f(0.0), vec3f(1.0));
}

const PI: f32 = 3.14159265359;

@fragment
fn fragmentMain(input: VertexOutput) -> @location(0) vec4f {
  var color: vec3f;
  var uv = input.uv;

  // --- Kaleidoscope (UV transform, applied first) ---
  if (u.kaleidoscopeEnabled != 0) {
    let centered = uv - 0.5;
    let angle = atan2(centered.y, centered.x);
    let radius = length(centered);
    let segAngle = 2.0 * PI / u.kaleidoscopeSegments;
    // Fold angle into one segment and mirror alternating segments
    var foldedAngle = angle % segAngle;
    if (foldedAngle < 0.0) { foldedAngle += segAngle; }
    // Mirror: reflect odd segments for seamless joins
    let segIndex = floor((angle + PI) / segAngle);
    if (i32(segIndex) % 2 == 1) {
      foldedAngle = segAngle - foldedAngle;
    }
    uv = vec2f(cos(foldedAngle), sin(foldedAngle)) * radius + 0.5;
  }

  // --- Wave Distortion (UV transform) ---
  if (u.waveEnabled != 0) {
    let wave_x = sin(uv.y * u.waveFrequency * PI * 2.0 + u.time * 2.0) * u.waveAmplitude;
    let wave_y = cos(uv.x * u.waveFrequency * PI * 2.0 + u.time * 1.7) * u.waveAmplitude;
    uv = uv + vec2f(wave_x, wave_y);
  }

  // --- Adaptive Sharpening (Laplacian) ---
  // Applied first, before chromatic aberration, so it operates on clean samples
  if (u.sharpenEnabled != 0) {
    let ts = u.texelSize;
    let center = textureSample(fractalTexture, texSampler, uv).rgb;
    let top = textureSample(fractalTexture, texSampler, uv + vec2f(0.0, -ts.y)).rgb;
    let bot = textureSample(fractalTexture, texSampler, uv + vec2f(0.0, ts.y)).rgb;
    let lft = textureSample(fractalTexture, texSampler, uv + vec2f(-ts.x, 0.0)).rgb;
    let rht = textureSample(fractalTexture, texSampler, uv + vec2f(ts.x, 0.0)).rgb;
    let detail = 4.0 * center - top - bot - lft - rht;
    let contrast = length(detail);
    let adaptiveStrength = u.sharpenStrength * smoothstep(0.0, 0.1, contrast);
    color = center + detail * adaptiveStrength;
  } else {
    color = textureSample(fractalTexture, texSampler, uv).rgb;
  }

  // --- Chromatic Aberration ---
  // Offsets R/G/B channels radially from center for a prismatic effect
  // Applied after sharpening so the fringing isn't amplified by the Laplacian
  if (u.chromaticAberrationEnabled != 0) {
    let dir = uv - 0.5;
    let dist = length(dir);
    let offset = dir * dist * u.chromaticAberrationIntensity * 0.02;
    color.r = textureSample(fractalTexture, texSampler, uv + offset).r;
    color.g = color.g; // Keep center sample (already computed above or by sharpen)
    color.b = textureSample(fractalTexture, texSampler, uv - offset).b;
  }

  // --- Bloom (additive blend) ---
  if (u.bloomEnabled != 0) {
    let bloom = textureSample(bloomTexture, texSampler, uv).rgb;
    color = color + bloom * u.bloomIntensity;
  }

  // --- Ghost Mirrors (translucent mirrored overlays) ---
  if (u.ghostMirrorEnabled != 0) {
    let mode = u.ghostMirrorMode;
    let opacity = u.ghostMirrorOpacity;
    if (mode == 0 || mode == 2) {
      // Horizontal mirror
      let mirrorH = textureSample(fractalTexture, texSampler, vec2f(1.0 - uv.x, uv.y)).rgb;
      color = mix(color, max(color, mirrorH), opacity);
    }
    if (mode == 1 || mode == 2) {
      // Vertical mirror
      let mirrorV = textureSample(fractalTexture, texSampler, vec2f(uv.x, 1.0 - uv.y)).rgb;
      color = mix(color, max(color, mirrorV), opacity);
    }
    if (mode == 3) {
      // Diagonal: flip both axes + blend
      let mirrorD = textureSample(fractalTexture, texSampler, vec2f(1.0 - uv.x, 1.0 - uv.y)).rgb;
      color = mix(color, max(color, mirrorD), opacity);
    }
  }

  // --- Filmic Tone Mapping & Color Grading ---
  if (u.toneMappingEnabled != 0) {
    // Exposure
    color = color * u.exposure;
    // Saturation
    let luma = dot(color, vec3f(0.2126, 0.7152, 0.0722));
    color = mix(vec3f(luma), color, u.saturation);
    // Color temperature (warm/cool shift)
    color.r = color.r * (1.0 + u.temperature * 0.1);
    color.b = color.b * (1.0 - u.temperature * 0.1);
    // ACES filmic curve
    color = acesToneMap(color);
  }

  // --- Vignette (applied last for consistent darkening) ---
  if (u.vignetteEnabled != 0) {
    let dist = length(uv - 0.5) * 1.414; // Normalized: 0 at center, ~1 at corners
    let vig = 1.0 - smoothstep(1.0 - u.vignetteSoftness, 1.0, dist) * u.vignetteIntensity;
    color = color * vig;
  }

  // --- Feedback Trails (blend with previous frame) ---
  if (u.feedbackEnabled != 0) {
    let history = textureSample(historyTexture, texSampler, input.uv).rgb;
    color = mix(color, history, u.feedbackDecay);
  }

  return vec4f(max(color, vec3f(0.0)), 1.0);
}
