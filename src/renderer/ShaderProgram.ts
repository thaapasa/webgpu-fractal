/**
 * Shader Program - Compiles, links, and manages GLSL shaders
 *
 * "Shader compilation. Because apparently GPUs don't speak TypeScript."
 * - Skippy the Magnificent
 */

import type { UniformValue } from '../types';

export class ShaderProgram {
  public readonly program: WebGLProgram;
  private gl: WebGL2RenderingContext;
  private uniformLocations: Map<string, WebGLUniformLocation | null> = new Map();
  private warnedUniforms: Set<string> = new Set();

  constructor(
    gl: WebGL2RenderingContext,
    vertexSource: string,
    fragmentSource: string
  ) {
    this.gl = gl;

    const vertexShader = this.compileShader(gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = this.compileShader(gl.FRAGMENT_SHADER, fragmentSource);

    this.program = this.linkProgram(vertexShader, fragmentShader);

    // Clean up shaders (they're linked into the program now)
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
  }

  /**
   * Compile a shader from source
   */
  private compileShader(type: number, source: string): WebGLShader {
    const shader = this.gl.createShader(type);
    if (!shader) {
      throw new Error(`Failed to create ${type === this.gl.VERTEX_SHADER ? 'vertex' : 'fragment'} shader`);
    }

    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      const info = this.gl.getShaderInfoLog(shader);
      const shaderType = type === this.gl.VERTEX_SHADER ? 'VERTEX' : 'FRAGMENT';
      const error = `Shader compilation error (${shaderType}):\n${info}\n\nShader source:\n${source}`;
      this.gl.deleteShader(shader);
      throw new Error(error);
    }

    return shader;
  }

  /**
   * Link vertex and fragment shaders into a program
   */
  private linkProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram {
    const program = this.gl.createProgram();
    if (!program) {
      throw new Error('Failed to create shader program');
    }

    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);

    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      const info = this.gl.getProgramInfoLog(program);
      this.gl.deleteProgram(program);
      throw new Error(`Program linking error:\n${info}`);
    }

    return program;
  }

  /**
   * Get uniform location (cached)
   */
  private getUniformLocation(name: string): WebGLUniformLocation | null {
    if (this.uniformLocations.has(name)) {
      return this.uniformLocations.get(name)!;
    }

    const location = this.gl.getUniformLocation(this.program, name);
    this.uniformLocations.set(name, location);
    return location;
  }

  /**
   * Warn once per missing uniform (avoids spamming the console every frame)
   */
  private warnMissingUniform(name: string): void {
    if (!this.warnedUniforms.has(name)) {
      this.warnedUniforms.add(name);
      console.warn(`Uniform "${name}" not found in shader program (may be optimized out)`);
    }
  }

  /**
   * Use this shader program
   */
  use(): void {
    this.gl.useProgram(this.program);
  }

  /**
   * Set a uniform value
   */
  setUniform(name: string, value: UniformValue): void {
    const location = this.getUniformLocation(name);
    if (location === null) {
      this.warnMissingUniform(name);
      return;
    }

    if (typeof value === 'number') {
      this.gl.uniform1f(location, value);
    } else if (value.length === 2) {
      this.gl.uniform2f(location, value[0], value[1]);
    } else if (value.length === 3) {
      this.gl.uniform3f(location, value[0], value[1], value[2]);
    } else if (value.length === 4) {
      this.gl.uniform4f(location, value[0], value[1], value[2], value[3]);
    }
  }

  /**
   * Set an integer uniform (for u_maxIterations)
   */
  setUniformInt(name: string, value: number): void {
    const location = this.getUniformLocation(name);
    if (location === null) {
      this.warnMissingUniform(name);
      return;
    }
    this.gl.uniform1i(location, value);
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    this.gl.deleteProgram(this.program);
    this.uniformLocations.clear();
    this.warnedUniforms.clear();
  }
}
