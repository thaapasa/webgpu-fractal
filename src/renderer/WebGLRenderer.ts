/**
 * WebGL Renderer - Manages WebGL 2 context and canvas
 *
 * "The foundation of everything. Obviously."
 * - Skippy the Magnificent
 */

export class WebGLRenderer {
  public readonly gl: WebGL2RenderingContext;
  public readonly canvas: HTMLCanvasElement;
  private animationFrameId: number | null = null;
  private renderCallback: (() => void) | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    
    const gl = canvas.getContext('webgl2', {
      antialias: false, // Better performance for our use case
      depth: false, // We don't need depth buffer
      stencil: false, // We don't need stencil buffer
      alpha: false, // We don't need transparency
      preserveDrawingBuffer: false, // Better performance
      powerPreference: 'high-performance', // Prefer discrete GPU if available
    });

    if (!gl) {
      throw new Error('WebGL 2 is not supported in this browser');
    }

    this.gl = gl;

    // Handle context loss
    canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      this.stop();
      console.warn('WebGL context lost');
    });

    canvas.addEventListener('webglcontextrestored', () => {
      console.log('WebGL context restored');
      // Context will be recreated, but we'll need to reinitialize shaders
    });
  }

  /**
   * Resize the canvas to match the given dimensions
   */
  resize(width: number, height: number): void {
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Clear the canvas to the specified color
   */
  clear(r: number = 0, g: number = 0, b: number = 0, a: number = 1): void {
    this.gl.clearColor(r, g, b, a);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }

  /**
   * Start the render loop
   */
  start(renderCallback: () => void): void {
    if (this.animationFrameId !== null) {
      return; // Already running
    }
    
    this.renderCallback = renderCallback;
    const loop = () => {
      if (this.renderCallback) {
        this.renderCallback();
      }
      this.animationFrameId = requestAnimationFrame(loop);
    };
    this.animationFrameId = requestAnimationFrame(loop);
  }

  /**
   * Stop the render loop
   */
  stop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.renderCallback = null;
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    this.stop();
    // WebGL context cleanup happens automatically when canvas is removed
  }
}
