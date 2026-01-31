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

  /** Whether HDR rendering is supported and enabled. */
  public readonly hdrSupported: boolean;
  /** Whether the display supports HDR (high dynamic range). */
  public readonly displaySupportsHDR: boolean;
  /** The EXT_color_buffer_float extension, if available. */
  public readonly floatBufferExt: unknown | null;
  /** The EXT_color_buffer_half_float extension (fallback). */
  public readonly halfFloatBufferExt: unknown | null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    
    // Detect HDR display support
    this.displaySupportsHDR = this.detectHDRDisplay();

    // For HDR, we need specific context attributes
    const contextAttributes: WebGLContextAttributes = {
      antialias: false,
      depth: false,
      stencil: false,
      alpha: false,
      preserveDrawingBuffer: false,
      powerPreference: 'high-performance',
    };

    const gl = canvas.getContext('webgl2', contextAttributes);

    if (!gl) {
      throw new Error('WebGL 2 is not supported in this browser');
    }

    this.gl = gl;

    // Check for float buffer extensions (required for HDR render targets)
    this.floatBufferExt = gl.getExtension('EXT_color_buffer_float');
    this.halfFloatBufferExt = gl.getExtension('EXT_color_buffer_half_float');

    // Also get OES_texture_float_linear for proper filtering of float textures
    const floatLinear = gl.getExtension('OES_texture_float_linear');

    console.log('WebGL HDR capability check:');
    console.log('  - EXT_color_buffer_float:', this.floatBufferExt ? 'YES' : 'NO');
    console.log('  - EXT_color_buffer_half_float:', this.halfFloatBufferExt ? 'YES' : 'NO');
    console.log('  - OES_texture_float_linear:', floatLinear ? 'YES' : 'NO');
    console.log('  - Display supports HDR:', this.displaySupportsHDR);
    console.log('  - dynamic-range: high:', window.matchMedia?.('(dynamic-range: high)').matches);
    console.log('  - color-gamut: p3:', window.matchMedia?.('(color-gamut: p3)').matches);

    // Try to configure canvas for HDR output
    if (this.displaySupportsHDR) {
      try {
        const glAny = gl as any;
        const canvasAny = canvas as any;

        console.log('  - Current drawingBufferColorSpace:', glAny.drawingBufferColorSpace);

        // For HDR, we need to set the colorspace that supports extended range
        // Options: 'srgb', 'display-p3', 'rec2100-hlg', 'rec2100-pq'
        // rec2100-pq is the proper HDR colorspace with PQ transfer function
        const hdrColorspaces = ['rec2100-pq', 'rec2100-hlg', 'display-p3'];

        for (const colorspace of hdrColorspaces) {
          try {
            glAny.drawingBufferColorSpace = colorspace;
            console.log(`  - Set drawingBufferColorSpace to ${colorspace}`);
            break;
          } catch {
            console.log(`  - ${colorspace} not supported`);
          }
        }

        // Also set unpackColorSpace for consistency
        if ('unpackColorSpace' in gl) {
          try {
            glAny.unpackColorSpace = glAny.drawingBufferColorSpace;
          } catch {
            // Ignore if not supported
          }
        }

        // Try the HDR configuration API (Chrome 113+)
        if (typeof canvasAny.configureHighDynamicRange === 'function') {
          canvasAny.configureHighDynamicRange({ mode: 'extended' });
          console.log('  - Called configureHighDynamicRange({ mode: extended })');
        } else {
          console.log('  - configureHighDynamicRange API not available');
        }

        console.log('Canvas configured for HDR, colorspace:', glAny.drawingBufferColorSpace);
      } catch (e) {
        console.log('Could not configure canvas for HDR:', e);
      }
    }

    this.hdrSupported = this.displaySupportsHDR;

    if (this.hdrSupported) {
      console.log('HDR rendering fully supported! Float buffers + HDR display available.');
    } else if (this.floatBufferExt || this.halfFloatBufferExt) {
      console.log('Float buffers supported, but display may not support HDR.');
    } else {
      console.log('HDR not supported (float buffer extensions unavailable).');
    }

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
   * Detect if the display supports HDR.
   * Uses CSS media queries for dynamic-range and color-gamut.
   */
  private detectHDRDisplay(): boolean {
    // Check for high dynamic range support
    if (window.matchMedia?.('(dynamic-range: high)').matches) {
      return true;
    }
    // P3 color gamut is often a good indicator of HDR-capable display
    if (window.matchMedia?.('(color-gamut: p3)').matches) {
      return true;
    }
    return false;
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    this.stop();
    // WebGL context cleanup happens automatically when canvas is removed
  }
}
