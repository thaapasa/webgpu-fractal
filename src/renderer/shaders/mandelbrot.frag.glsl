#version 300 es

/**
 * Fragment Shader - Mandelbrot Set Computation
 *
 * "This is where the magic happens. On the GPU. In parallel. For every pixel.
 *  Simultaneously. You're welcome."
 * - Skippy the Magnificent
 */

precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform vec2 u_resolution;      // Canvas size in pixels
uniform vec2 u_center;          // Current view center in fractal coordinates
uniform float u_zoom;           // Current zoom level
uniform int u_maxIterations;    // Iteration limit (quality vs performance)
uniform vec3 u_colorA;          // Color scheme start
uniform vec3 u_colorB;          // Color scheme end

void main() {
  // Convert UV coordinates (0-1) to fractal coordinates
  // Use aspect ratio so the fractal isn't stretched on non-square canvases
  float aspect = u_resolution.x / u_resolution.y;
  vec2 uv = v_uv - 0.5;
  uv.x *= aspect;
  vec2 c = u_center + uv / u_zoom;
  
  // Mandelbrot iteration: z = z² + c
  vec2 z = vec2(0.0);
  int iterations = 0;
  
  // Iterate until escape or max iterations
  for (int i = 0; i < 256; i++) {
    if (i >= u_maxIterations) break;
    
    // Check if escaped (|z| > 2)
    float zMagSq = dot(z, z);
    if (zMagSq > 4.0) break;
    
    // z = z² + c
    z = vec2(
      z.x * z.x - z.y * z.y + c.x,
      2.0 * z.x * z.y + c.y
    );
    
    iterations++;
  }
  
  // Smooth coloring using iteration count
  // If we hit max iterations, we're in the set (black)
  if (iterations >= u_maxIterations) {
    fragColor = vec4(0.0, 0.0, 0.0, 1.0);
  } else {
    // Smooth escape time for better coloring
    float smoothIter = float(iterations) + 1.0 - log2(log2(dot(z, z)));
    float t = smoothIter / float(u_maxIterations);
    
    // Interpolate between colorA and colorB
    vec3 color = mix(u_colorA, u_colorB, t);
    fragColor = vec4(color, 1.0);
  }
}
