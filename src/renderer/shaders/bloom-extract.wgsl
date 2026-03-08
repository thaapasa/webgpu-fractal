// Bloom Brightness Extraction Pass
// Extracts pixels above a luminance threshold for bloom processing

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
  _pad1: f32,                            // offset 72
  _pad2: f32,                            // offset 76
}

struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,
}

@group(0) @binding(0) var texSampler: sampler;
@group(0) @binding(1) var inputTexture: texture_2d<f32>;
@group(0) @binding(2) var<uniform> u: PostProcessUniforms;

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

@fragment
fn fragmentMain(input: VertexOutput) -> @location(0) vec4f {
  let color = textureSample(inputTexture, texSampler, input.uv);
  let luminance = dot(color.rgb, vec3f(0.2126, 0.7152, 0.0722));
  let contribution = max(luminance - u.bloomThreshold, 0.0);
  let factor = contribution / max(luminance, 0.001);
  return vec4f(color.rgb * factor, 1.0);
}
