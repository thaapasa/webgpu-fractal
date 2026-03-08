// Separable Gaussian Blur Pass
// Direction is controlled by uniform: (1,0) for horizontal, (0,1) for vertical

struct BlurUniforms {
  texelSize: vec2f,              // offset 0
  direction: vec2f,              // offset 8
}

struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,
}

@group(0) @binding(0) var texSampler: sampler;
@group(0) @binding(1) var inputTexture: texture_2d<f32>;
@group(0) @binding(2) var<uniform> u: BlurUniforms;

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
  // 9-tap Gaussian kernel (sigma ~ 1.5)
  let w0 = 0.227027;
  let w1 = 0.1945946;
  let w2 = 0.1216216;
  let w3 = 0.054054;
  let w4 = 0.016216;

  let step = u.texelSize * u.direction;

  var result = textureSample(inputTexture, texSampler, input.uv).rgb * w0;

  result += textureSample(inputTexture, texSampler, input.uv + step * 1.0).rgb * w1;
  result += textureSample(inputTexture, texSampler, input.uv - step * 1.0).rgb * w1;

  result += textureSample(inputTexture, texSampler, input.uv + step * 2.0).rgb * w2;
  result += textureSample(inputTexture, texSampler, input.uv - step * 2.0).rgb * w2;

  result += textureSample(inputTexture, texSampler, input.uv + step * 3.0).rgb * w3;
  result += textureSample(inputTexture, texSampler, input.uv - step * 3.0).rgb * w3;

  result += textureSample(inputTexture, texSampler, input.uv + step * 4.0).rgb * w4;
  result += textureSample(inputTexture, texSampler, input.uv - step * 4.0).rgb * w4;

  return vec4f(result, 1.0);
}
