#version 300 es

/**
 * Vertex Shader - Fullscreen Quad
 *
 * "Two triangles. That's it. Even a monkey could understand this."
 * - Skippy the Magnificent
 */

layout(location = 0) in vec2 a_position;

out vec2 v_uv;

void main() {
  // Pass through position as UV coordinates (ranging from 0 to 1)
  v_uv = a_position;
  
  // Map to clip space (-1 to 1)
  gl_Position = vec4(a_position * 2.0 - 1.0, 0.0, 1.0);
}
