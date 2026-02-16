/**
 * WebGPU Fractal Engine - HDR-capable fractal renderer
 *
 * "WebGPU: Finally, graphics done right."
 * - Skippy the Magnificent
 */

import { WebGPURenderer } from '../renderer/WebGPURenderer';
import { ViewState } from '../controls/ViewState';
import { InputHandler } from '../controls/InputHandler';
import {
  FractalType,
  FRACTAL_TYPE_NAMES,
  BASE_FRACTAL_COUNT,
  isJuliaType,
  getBaseFractalType,
  getJuliaVariant,
} from '../types';
import {
  BookmarkState,
  readUrlBookmark,
  updateUrlHash,
  copyShareableUrl,
} from '../bookmark/BookmarkManager';
import { getLocationByKey } from '../bookmark/famousLocations';
import { TouristMode } from '../tourist/TouristMode';
import {
  getCosinePalette,
  getGradientPalette,
  getCosinePaletteParams,
  getGradientPaletteParams,
  getCosinePaletteName,
  getGradientPaletteName,
  COSINE_PALETTE_COUNT,
  GRADIENT_PALETTE_COUNT,
  PaletteType,
  PaletteParams,
} from '../renderer/Palettes';
import { OverlayManager, DebugOverlayState } from '../ui';

import shaderSource from '../renderer/shaders/mandelbrot.wgsl?raw';

/** Base iterations at zoom 1 */
const MAX_ITERATIONS_BASE = 256;
const MAX_ITERATIONS_BASE_JULIA = 512;
const MAX_ITERATIONS_AUTO_CAP = 4096;
const MAX_ITERATIONS_LOG_SCALE = 640;
const MAX_ITERATIONS_LOG_POWER = 1.65;
const ITERATION_ADJUST_RATIO = 1.5;

function maxIterationsForZoom(zoom: number, isJulia: boolean = false): number {
  const z = Math.max(1, zoom);
  const L = Math.log10(z);
  const base = isJulia ? MAX_ITERATIONS_BASE_JULIA : MAX_ITERATIONS_BASE;
  const n = base + MAX_ITERATIONS_LOG_SCALE * Math.pow(L, MAX_ITERATIONS_LOG_POWER);
  return Math.round(Math.max(base, Math.min(MAX_ITERATIONS_AUTO_CAP, n)));
}

// Uniform buffer structure (must match WGSL)
// Base uniforms: 64 bytes
// Palette params: ~160 bytes (vec3s with padding)
// Total: 256 bytes (nice round number)
const UNIFORM_BUFFER_SIZE = 256;

export class WebGPUFractalEngine {
  private renderer: WebGPURenderer;
  private viewState: ViewState;
  private inputHandler: InputHandler;

  private pipeline!: GPURenderPipeline;
  private uniformBuffer!: GPUBuffer;
  private bindGroup!: GPUBindGroup;

  private maxIterationsOverride: number | null = null;
  private fractalType: FractalType = FractalType.Mandelbrot;
  private juliaC: [number, number] = [-0.7, 0.27015];
  private juliaPickerMode = false;
  private isActivelyPickingJulia = false; // True when mouse is down and previewing Julia
  private savedViewState: { centerX: number; centerY: number; zoom: number } | null = null;
  private savedFractalType: FractalType | null = null;

  private paletteType: PaletteType = 'cosine';
  private cosinePaletteIndex = 1; // Fire
  private gradientPaletteIndex = 0; // Blue
  private colorOffset = 0.0;

  /** HDR brightness bias: -1 to +1, shifts which regions appear bright */
  private hdrBrightnessBias = 0.0;
  /** SDR gradient brightness multiplier: 0.2 to 2.0 */
  private sdrGradientBrightness = 1.0;

  private overlays!: OverlayManager;

  private touristMode: TouristMode | null = null;

  // Interpolated palette params override (used during tourist mode transitions)
  private interpolatedPaletteParams: PaletteParams | null = null;

  private constructor(renderer: WebGPURenderer, canvas: HTMLCanvasElement) {
    this.renderer = renderer;
    this.viewState = new ViewState();

    this.inputHandler = new InputHandler(canvas, this.viewState, () => {
      this.render();
    });

    this.setupInputCallbacks();
    this.setupOverlays(canvas);
  }

  static async create(canvas: HTMLCanvasElement): Promise<WebGPUFractalEngine> {
    const renderer = await WebGPURenderer.create(canvas);
    const engine = new WebGPUFractalEngine(renderer, canvas);
    await engine.initializePipeline();

    // Listen for HDR display changes
    renderer.setOnHdrChange(() => {
      console.log('HDR status changed, re-rendering...');
      engine.render();
    });

    window.addEventListener('resize', engine.handleResize);
    window.addEventListener('hashchange', engine.handleHashChange);

    engine.loadBookmark();
    engine.handleResize();

    return engine;
  }

  private async initializePipeline(): Promise<void> {
    const device = this.renderer.device;

    // Create shader module
    const shaderModule = device.createShaderModule({
      label: 'Mandelbrot Shader',
      code: shaderSource,
    });

    // Create uniform buffer
    this.uniformBuffer = device.createBuffer({
      label: 'Uniforms',
      size: UNIFORM_BUFFER_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    // Create bind group layout
    const bindGroupLayout = device.createBindGroupLayout({
      label: 'Bind Group Layout',
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
          buffer: { type: 'uniform' },
        },
      ],
    });

    // Create bind group
    this.bindGroup = device.createBindGroup({
      label: 'Bind Group',
      layout: bindGroupLayout,
      entries: [
        {
          binding: 0,
          resource: { buffer: this.uniformBuffer },
        },
      ],
    });

    // Create pipeline layout
    const pipelineLayout = device.createPipelineLayout({
      label: 'Pipeline Layout',
      bindGroupLayouts: [bindGroupLayout],
    });

    // Create render pipeline
    this.pipeline = device.createRenderPipeline({
      label: 'Mandelbrot Pipeline',
      layout: pipelineLayout,
      vertex: {
        module: shaderModule,
        entryPoint: 'vertexMain',
      },
      fragment: {
        module: shaderModule,
        entryPoint: 'fragmentMain',
        targets: [
          {
            format: this.renderer.format,
          },
        ],
      },
      primitive: {
        topology: 'triangle-list',
      },
    });

    console.log('WebGPU pipeline initialized');
  }

  private setupInputCallbacks(): void {
    this.inputHandler.setIterationAdjustCallback((direction) => {
      this.adjustMaxIterations(direction);
    });
    this.inputHandler.setIterationResetCallback(() => {
      this.clearMaxIterationsOverride();
    });
    this.inputHandler.setCosinePaletteCycleCallback((direction) => {
      this.cycleCosinePalette(direction);
    });
    this.inputHandler.setGradientPaletteCycleCallback((direction) => {
      this.cycleGradientPalette(direction);
    });
    this.inputHandler.setColorOffsetCallback((delta) => {
      this.adjustColorOffset(delta);
    });
    this.inputHandler.setColorOffsetResetCallback(() => {
      this.resetColorOffset();
    });
    this.inputHandler.setToggleAACallback(() => {
      // AA not supported in WebGPU version (HDR is always on)
      console.log('AA not available in WebGPU HDR mode');
    });
    this.inputHandler.setToggleHDRCallback(() => {
      this.toggleHDR();
    });
    this.inputHandler.setAdjustHdrBrightnessCallback((direction) => {
      this.adjustHdrBrightness(direction);
    });
    this.inputHandler.setResetHdrBrightnessCallback(() => {
      this.resetHdrBrightness();
    });
    this.inputHandler.setFractalCycleCallback((direction) => {
      this.cycleFractalType(direction);
    });
    this.inputHandler.setToggleJuliaModeCallback(() => {
      this.toggleJuliaPickerMode();
    });
    this.inputHandler.setJuliaPickCallback((x, y) => {
      this.pickJuliaConstant(x, y);
    });
    this.inputHandler.setJuliaPickEndCallback(() => {
      this.endJuliaPicking();
    });
    this.inputHandler.setShareCallback(() => {
      this.shareBookmark();
    });
    this.inputHandler.setLocationSelectCallback((key) => {
      this.goToLocation(key);
    });
    this.inputHandler.setLocationAnimateCallback((key) => {
      this.animateToLocation(key);
    });
    this.inputHandler.setToggleHelpCallback(() => {
      this.toggleHelp();
    });
    this.inputHandler.setToggleScreenshotModeCallback(() => {
      this.toggleScreenshotMode();
    });
    this.inputHandler.setToggleTouristModeCallback(() => {
      this.toggleTouristMode();
    });
    this.inputHandler.setUserInputCallback(() => {
      this.handleUserInput();
    });
  }

  private setupOverlays(canvas: HTMLCanvasElement): void {
    const parent = canvas.parentElement;
    if (!parent) {
      throw new Error('Canvas must have a parent element for overlays');
    }
    this.overlays = new OverlayManager(parent);
  }

  private handleResize = (): void => {
    this.renderer.resize(window.innerWidth, window.innerHeight);
    this.render();
  };

  private handleHashChange = (): void => {
    this.loadBookmark();
  };

  private render(): void {
    const device = this.renderer.device;
    const canvas = this.renderer.canvas;
    const now = performance.now();

    // Update FPS counter
    this.overlays.tickFPS(now);

    const isJulia = isJuliaType(this.fractalType);
    const maxIter =
      this.maxIterationsOverride ?? maxIterationsForZoom(this.viewState.zoom, isJulia);

    // Update debug overlay
    const paletteName =
      this.paletteType === 'cosine'
        ? getCosinePaletteName(this.cosinePaletteIndex)
        : getGradientPaletteName(this.gradientPaletteIndex);

    const debugState: DebugOverlayState = {
      fractalName: FRACTAL_TYPE_NAMES[this.fractalType],
      zoom: this.viewState.zoom,
      maxIterations: maxIter,
      isManualIterations: this.maxIterationsOverride !== null,
      paletteName,
      colorOffset: this.colorOffset,
      isJulia,
      juliaC: this.juliaC,
      hdrEnabled: this.renderer.hdrEnabled,
      hdrBrightnessBias: this.hdrBrightnessBias,
      displaySupportsHDR: this.renderer.displaySupportsHDR,
      sdrGradientBrightness: this.sdrGradientBrightness,
      paletteType: this.paletteType,
      juliaPickerMode: this.juliaPickerMode,
    };
    this.overlays.updateDebug(debugState);

    // Update uniforms
    const uniformData = new ArrayBuffer(UNIFORM_BUFFER_SIZE);
    const floatView = new Float32Array(uniformData);
    const intView = new Int32Array(uniformData);

    // Get current palette info and params based on palette type
    // Use interpolated params during tourist mode transitions, otherwise look up by index
    const isCosine = this.paletteType === 'cosine';
    const palette = isCosine
      ? getCosinePalette(this.cosinePaletteIndex)
      : getGradientPalette(this.gradientPaletteIndex);
    const paletteParams =
      this.interpolatedPaletteParams ??
      (isCosine
        ? getCosinePaletteParams(this.cosinePaletteIndex)
        : getGradientPaletteParams(this.gradientPaletteIndex, this.renderer.hdrEnabled));

    // Pack base uniforms (must match WGSL struct layout with padding)
    floatView[0] = canvas.width; // resolution.x
    floatView[1] = canvas.height; // resolution.y
    floatView[2] = this.viewState.centerX; // center.x
    floatView[3] = this.viewState.centerY; // center.y
    floatView[4] = this.viewState.zoom; // zoom
    intView[5] = maxIter; // maxIterations
    floatView[6] = performance.now() * 0.001; // time
    floatView[7] = this.colorOffset; // colorOffset
    intView[8] = this.fractalType; // fractalType
    // padding at 9 (_pad_jc)
    floatView[10] = this.juliaC[0]; // juliaC.x
    floatView[11] = this.juliaC[1]; // juliaC.y
    intView[12] = this.renderer.hdrEnabled ? 1 : 0; // hdrEnabled
    floatView[13] = this.hdrBrightnessBias; // hdrBrightnessBias
    intView[14] = paletteParams.type === 'cosine' ? 0 : 1; // paletteType
    intView[15] = palette.isMonotonic ? 1 : 0; // isMonotonic
    floatView[16] = this.sdrGradientBrightness; // sdrGradientBrightness
    // padding at 17, 18, 19 (_pad0, _pad1, _pad2)

    // Pack palette parameters (offset 20 = 80 bytes, 16-byte aligned for vec3f)
    if (paletteParams.type === 'cosine') {
      // paletteA (vec3 + padding)
      floatView[20] = paletteParams.a[0];
      floatView[21] = paletteParams.a[1];
      floatView[22] = paletteParams.a[2];
      // padding at 23
      // paletteB
      floatView[24] = paletteParams.b[0];
      floatView[25] = paletteParams.b[1];
      floatView[26] = paletteParams.b[2];
      // padding at 27
      // paletteC
      floatView[28] = paletteParams.c[0];
      floatView[29] = paletteParams.c[1];
      floatView[30] = paletteParams.c[2];
      // padding at 31
      // paletteD
      floatView[32] = paletteParams.d[0];
      floatView[33] = paletteParams.d[1];
      floatView[34] = paletteParams.d[2];
      // padding at 35
    }

    // Gradient colors start at offset 36 (144 bytes)
    if (paletteParams.type === 'gradient') {
      // gradientC1
      floatView[36] = paletteParams.c1[0];
      floatView[37] = paletteParams.c1[1];
      floatView[38] = paletteParams.c1[2];
      // padding at 39
      // gradientC2
      floatView[40] = paletteParams.c2[0];
      floatView[41] = paletteParams.c2[1];
      floatView[42] = paletteParams.c2[2];
      // padding at 43
      // gradientC3
      floatView[44] = paletteParams.c3[0];
      floatView[45] = paletteParams.c3[1];
      floatView[46] = paletteParams.c3[2];
      // padding at 47
      // gradientC4
      floatView[48] = paletteParams.c4[0];
      floatView[49] = paletteParams.c4[1];
      floatView[50] = paletteParams.c4[2];
      // padding at 51
      // gradientC5
      floatView[52] = paletteParams.c5[0];
      floatView[53] = paletteParams.c5[1];
      floatView[54] = paletteParams.c5[2];
      // padding at 55
    }

    device.queue.writeBuffer(this.uniformBuffer, 0, uniformData);

    // Render
    const commandEncoder = device.createCommandEncoder();
    const textureView = this.renderer.getCurrentTexture().createView();

    const renderPass = commandEncoder.beginRenderPass({
      colorAttachments: [
        {
          view: textureView,
          clearValue: { r: 0, g: 0, b: 0, a: 1 },
          loadOp: 'clear',
          storeOp: 'store',
        },
      ],
    });

    renderPass.setPipeline(this.pipeline);
    renderPass.setBindGroup(0, this.bindGroup);
    renderPass.draw(3); // Fullscreen triangle
    renderPass.end();

    device.queue.submit([commandEncoder.finish()]);
  }

  start(): void {
    this.renderer.start(() => this.render());
  }

  stop(): void {
    this.renderer.stop();
  }

  // --- Iteration controls ---

  private adjustMaxIterations(direction: 1 | -1): void {
    const isJulia = isJuliaType(this.fractalType);
    const currentIter =
      this.maxIterationsOverride ?? maxIterationsForZoom(this.viewState.zoom, isJulia);
    const newIter =
      direction > 0 ? currentIter * ITERATION_ADJUST_RATIO : currentIter / ITERATION_ADJUST_RATIO;
    this.maxIterationsOverride = Math.round(Math.max(1, newIter));
    this.render();
  }

  private clearMaxIterationsOverride(): void {
    this.maxIterationsOverride = null;
    this.render();
  }

  // --- HDR controls ---

  private toggleHDR(): void {
    // HDR is controlled by the renderer, we just adjust brightness bias
    console.log(`HDR is ${this.renderer.hdrEnabled ? 'enabled' : 'not available'}`);
    this.render();
  }

  /**
   * Adjust brightness.
   * - In HDR mode: adjusts HDR brightness bias
   * - In SDR mode with gradient palette: adjusts gradient color brightness
   * @param direction 1 for brighter, -1 for dimmer
   */
  private adjustHdrBrightness(direction: 1 | -1): void {
    if (this.renderer.hdrEnabled) {
      // HDR mode: adjust HDR brightness bias
      this.hdrBrightnessBias = Math.max(-1, Math.min(1, this.hdrBrightnessBias + direction * 0.1));
    } else if (this.paletteType === 'gradient') {
      // SDR mode with gradient palette: adjust gradient brightness
      // Adjust by 0.2 each step, clamped to 0.1 to 5.0
      this.sdrGradientBrightness = Math.max(
        0.1,
        Math.min(10.0, this.sdrGradientBrightness + direction * 0.2)
      );
    }
    // Cosine palettes in SDR mode: do nothing (no effect)
    this.render();
  }

  /**
   * Reset brightness to default.
   * - Resets HDR brightness bias to 0
   * - Resets SDR gradient brightness to 1.0
   */
  private resetHdrBrightness(): void {
    this.hdrBrightnessBias = 0;
    this.sdrGradientBrightness = 1.0;
    this.render();
  }

  // --- Palette controls ---

  private cycleCosinePalette(direction: 1 | -1): void {
    this.cosinePaletteIndex =
      (this.cosinePaletteIndex + direction + COSINE_PALETTE_COUNT) % COSINE_PALETTE_COUNT;
    this.paletteType = 'cosine';
    this.render();
  }

  private cycleGradientPalette(direction: 1 | -1): void {
    this.gradientPaletteIndex =
      (this.gradientPaletteIndex + direction + GRADIENT_PALETTE_COUNT) % GRADIENT_PALETTE_COUNT;
    this.paletteType = 'gradient';
    this.render();
  }

  private adjustColorOffset(delta: number): void {
    this.colorOffset += delta;
    this.render();
  }

  private resetColorOffset(): void {
    this.colorOffset = 0;
    this.render();
  }

  // --- Fractal type controls ---

  private cycleFractalType(direction: 1 | -1 = 1): void {
    // Get the base fractal type (non-Julia) using bitwise: base = type & ~1
    const baseType = getBaseFractalType(this.fractalType);
    // Base types are even: 0, 2, 4, 6, 8, 10, 12, 14, 16
    // Divide by 2 to get the index: 0, 1, 2, 3, 4, 5, 6, 7, 8
    const currentIndex = baseType >> 1;
    const nextIndex = (currentIndex + direction + BASE_FRACTAL_COUNT) % BASE_FRACTAL_COUNT;
    // Multiply by 2 to get the new base type
    const newFractalType = (nextIndex << 1) as FractalType;

    if (this.juliaPickerMode) {
      this.juliaPickerMode = false;
      this.inputHandler.setJuliaPickerMode(false);
    }

    // Reset view to famous location 1 of the new fractal type
    const location = getLocationByKey('1', newFractalType);
    if (location) {
      this.applyLocationState(location.state);
      this.showLocationNotification(location.name, location.description);
    } else {
      // Fallback if no location defined
      this.fractalType = newFractalType;
    }

    this.render();
  }

  private toggleJuliaPickerMode(): void {
    if (isJuliaType(this.fractalType)) {
      this.exitJuliaMode();
      return;
    }
    this.juliaPickerMode = !this.juliaPickerMode;
    this.inputHandler.setJuliaPickerMode(this.juliaPickerMode);
    this.render();
  }

  private pickJuliaConstant(fractalX: number, fractalY: number): void {
    if (!this.juliaPickerMode) return;

    // First call - save state and switch to Julia mode
    if (!this.isActivelyPickingJulia) {
      this.savedViewState = {
        centerX: this.viewState.centerX,
        centerY: this.viewState.centerY,
        zoom: this.viewState.zoom,
      };
      this.savedFractalType = this.fractalType;
      this.fractalType = getJuliaVariant(this.fractalType);

      // Reset view for Julia set
      this.viewState.centerX = 0;
      this.viewState.centerY = 0;
      this.viewState.zoom = 0.5;

      this.isActivelyPickingJulia = true;
    }

    // Update Julia constant and render
    this.juliaC = [fractalX, fractalY];
    this.render();
  }

  /**
   * Called when Julia picking ends (mouse up)
   * Finalizes the pick and exits picker mode
   */
  private endJuliaPicking(): void {
    if (!this.isActivelyPickingJulia) return;

    this.isActivelyPickingJulia = false;
    this.juliaPickerMode = false;
    this.inputHandler.setJuliaPickerMode(false);
    this.render();
  }

  private exitJuliaMode(): void {
    if (this.savedViewState) {
      this.viewState.centerX = this.savedViewState.centerX;
      this.viewState.centerY = this.savedViewState.centerY;
      this.viewState.zoom = this.savedViewState.zoom;
      this.savedViewState = null;
    }
    if (this.savedFractalType !== null) {
      this.fractalType = this.savedFractalType;
      this.savedFractalType = null;
    } else {
      // Fall back to base fractal type
      this.fractalType = getBaseFractalType(this.fractalType);
    }
    this.juliaPickerMode = false;
    this.inputHandler.setJuliaPickerMode(false);
    this.render();
  }

  // --- Bookmarks ---

  private getBookmarkState(): BookmarkState {
    return {
      fractalType: this.fractalType,
      centerX: this.viewState.centerX,
      centerY: this.viewState.centerY,
      zoom: this.viewState.zoom,
      paletteType: this.paletteType,
      cosinePaletteIndex: this.cosinePaletteIndex,
      gradientPaletteIndex: this.gradientPaletteIndex,
      colorOffset: this.colorOffset,
      juliaC: this.juliaC,
      maxIterationsOverride: this.maxIterationsOverride,
      aaEnabled: false, // AA not supported in WebGPU version
    };
  }

  private loadBookmark(): void {
    const bookmark = readUrlBookmark();
    if (!bookmark) return;

    if (bookmark.centerX !== undefined) this.viewState.centerX = bookmark.centerX;
    if (bookmark.centerY !== undefined) this.viewState.centerY = bookmark.centerY;
    if (bookmark.zoom !== undefined) this.viewState.zoom = bookmark.zoom;
    if (bookmark.maxIterationsOverride !== undefined) {
      this.maxIterationsOverride = bookmark.maxIterationsOverride;
    }

    // New palette parameters
    if (bookmark.paletteType !== undefined) {
      this.paletteType = bookmark.paletteType;
    }
    if (bookmark.cosinePaletteIndex !== undefined) {
      this.cosinePaletteIndex = bookmark.cosinePaletteIndex % COSINE_PALETTE_COUNT;
    }
    if (bookmark.gradientPaletteIndex !== undefined) {
      this.gradientPaletteIndex = bookmark.gradientPaletteIndex % GRADIENT_PALETTE_COUNT;
    }

    // Legacy: handle old paletteIndex if present (for backward compatibility)
    // This is a best-effort mapping - old URLs will get close-ish results
    if (bookmark.paletteIndex !== undefined && bookmark.paletteType === undefined) {
      // Old palette indices: 0=Rainbow, 1=Blue, 2=Gold, 3=Grayscale, 4=Fire, 5=Ice,
      // 6=Sepia, 7=Ocean, 8=Purple, 9=Forest, 10=Sunset, 11=Electric
      // Cosine: Rainbow(0), Fire(4), Ice(5), Sunset(10), Electric(11)
      // Gradient: Blue(1), Gold(2), Grayscale(3), Sepia(6), Ocean(7), Purple(8), Forest(9)
      const cosineIndices = [0, 4, 5, 10, 11];
      if (cosineIndices.includes(bookmark.paletteIndex)) {
        this.paletteType = 'cosine';
        this.cosinePaletteIndex = cosineIndices.indexOf(bookmark.paletteIndex);
      } else {
        this.paletteType = 'gradient';
        const gradientIndices = [1, 2, 3, 6, 7, 8, 9];
        this.gradientPaletteIndex = gradientIndices.indexOf(bookmark.paletteIndex);
      }
    }

    if (bookmark.colorOffset !== undefined) {
      this.colorOffset = bookmark.colorOffset;
    }
    if (bookmark.fractalType !== undefined) {
      this.fractalType = bookmark.fractalType;
    }
    if (bookmark.juliaC !== undefined) {
      this.juliaC = bookmark.juliaC;
    }

    this.render();
  }

  private goToLocation(key: string): void {
    const location = getLocationByKey(key, this.fractalType);
    if (!location) return;

    this.applyLocationState(location.state);
    this.showLocationNotification(location.name, location.description);
    this.updateUrlBookmark();
    this.render();
  }

  /**
   * Animate smoothly to a location (long-press on number key)
   */
  private animateToLocation(key: string): void {
    const location = getLocationByKey(key, this.fractalType);
    if (!location) return;

    // Create tourist mode instance if it doesn't exist
    if (!this.touristMode) {
      this.touristMode = new TouristMode(
        {
          onUpdate: (state) => this.applyTouristUpdate(state),
          onRender: () => this.render(),
          onLocationNotification: (name, description) =>
            this.showLocationNotification(name, description),
        },
        this.getBookmarkState()
      );
    }

    // Do a single animated transition to the location
    this.touristMode.animateToLocation(location, this.getBookmarkState());
  }

  /**
   * Apply a location's state to the engine.
   * Shared by goToLocation() and cycleFractalType().
   */
  private applyLocationState(state: BookmarkState): void {
    this.viewState.centerX = state.centerX;
    this.viewState.centerY = state.centerY;
    this.viewState.zoom = state.zoom;
    this.maxIterationsOverride = state.maxIterationsOverride;
    this.fractalType = state.fractalType;
    this.juliaC = state.juliaC;
    this.paletteType = state.paletteType;
    this.cosinePaletteIndex = state.cosinePaletteIndex;
    this.gradientPaletteIndex = state.gradientPaletteIndex;
    this.colorOffset = state.colorOffset;
  }

  private showLocationNotification(name: string, description: string): void {
    this.overlays.notification.showLocation(name, description);
  }

  private updateUrlBookmark(): void {
    updateUrlHash(this.getBookmarkState());
  }

  async shareBookmark(): Promise<void> {
    const success = await copyShareableUrl(this.getBookmarkState());
    this.showShareNotification(success);
    if (success) {
      this.updateUrlBookmark();
    }

    // On localhost, also print createLocation() code for easy copy-paste
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      this.logCreateLocationCode();
    }
  }

  /**
   * Log a ready-to-paste createLocation() call to the console.
   * Only useful during development for curating famous locations.
   */
  private logCreateLocationCode(): void {
    const fractalTypeName = this.getFractalTypeEnumName(this.fractalType);
    const isJulia = isJuliaType(this.fractalType);

    // Build options object, only including non-default values
    const options: string[] = [];

    if (this.paletteType === 'gradient') {
      options.push(`paletteType: 'gradient'`);
      if (this.gradientPaletteIndex !== 0) {
        options.push(`gradientPaletteIndex: ${this.gradientPaletteIndex}`);
      }
    } else {
      // Cosine palette (default type)
      if (this.cosinePaletteIndex !== 1) {
        options.push(`cosinePaletteIndex: ${this.cosinePaletteIndex}`);
      }
    }

    if (Math.abs(this.colorOffset) > 0.001) {
      options.push(`colorOffset: ${this.colorOffset}`);
    }

    if (isJulia) {
      options.push(`juliaC: [${this.juliaC[0]}, ${this.juliaC[1]}]`);
    }

    if (this.maxIterationsOverride !== null) {
      options.push(`maxIterationsOverride: ${this.maxIterationsOverride}`);
    }

    const optionsStr = options.length > 0 ? `,\n    { ${options.join(', ')} }` : '';

    const code = `createLocation(
    'TODO: Name',
    'TODO: Description',
    'TODO: Key (1-9)',
    FractalType.${fractalTypeName},
    ${this.viewState.centerX}, ${this.viewState.centerY}, ${this.viewState.zoom}${optionsStr}
  ),`;

    console.log(
      '%c📍 createLocation() code:',
      'color: #4ade80; font-weight: bold; font-size: 14px;'
    );
    console.log(code);
  }

  /**
   * Get the enum key name for a FractalType value.
   */
  private getFractalTypeEnumName(type: FractalType): string {
    // Reverse lookup in FractalType enum
    const entries = Object.entries(FractalType);
    for (const [key, value] of entries) {
      if (value === type && isNaN(Number(key))) {
        return key;
      }
    }
    return `Unknown(${type})`;
  }

  private showShareNotification(success: boolean): void {
    this.overlays.notification.showShareResult(success);
  }

  // --- UI toggles ---

  private toggleHelp(): void {
    this.overlays.toggleHelp();
  }

  private toggleScreenshotMode(): void {
    this.overlays.toggleScreenshotMode();
  }

  // --- Tourist Mode ---

  private toggleTouristMode(): void {
    if (this.touristMode?.isActive()) {
      this.stopTouristMode();
    } else {
      this.startTouristMode();
    }
  }

  private startTouristMode(): void {
    // Create tourist mode instance if it doesn't exist
    if (!this.touristMode) {
      this.touristMode = new TouristMode(
        {
          onUpdate: (state, interpolatedPaletteParams) =>
            this.applyTouristUpdate(state, interpolatedPaletteParams),
          onRender: () => this.render(),
          onLocationNotification: (name, description) =>
            this.showLocationNotification(name, description),
        },
        this.getBookmarkState()
      );
    }

    this.touristMode.start(this.getBookmarkState());
    this.showTouristModeNotification(true);
  }

  private stopTouristMode(): void {
    if (this.touristMode) {
      this.touristMode.stop();
      this.interpolatedPaletteParams = null; // Clear the override
      this.showTouristModeNotification(false);
      this.updateUrlBookmark();
    }
  }

  private handleUserInput(): void {
    // Stop tourist mode on any user interaction
    if (this.touristMode?.isActive()) {
      this.stopTouristMode();
    }
  }

  private applyTouristUpdate(
    state: Partial<BookmarkState>,
    interpolatedPaletteParams?: PaletteParams
  ): void {
    if (state.centerX !== undefined) this.viewState.centerX = state.centerX;
    if (state.centerY !== undefined) this.viewState.centerY = state.centerY;
    if (state.zoom !== undefined) this.viewState.zoom = state.zoom;
    if (state.fractalType !== undefined) this.fractalType = state.fractalType;
    if (state.paletteType !== undefined) this.paletteType = state.paletteType;
    if (state.cosinePaletteIndex !== undefined) this.cosinePaletteIndex = state.cosinePaletteIndex;
    if (state.gradientPaletteIndex !== undefined)
      this.gradientPaletteIndex = state.gradientPaletteIndex;
    if (state.colorOffset !== undefined) this.colorOffset = state.colorOffset;

    // Store interpolated palette params for use in render()
    this.interpolatedPaletteParams = interpolatedPaletteParams ?? null;
    if (state.juliaC !== undefined) this.juliaC = state.juliaC;
  }

  private showTouristModeNotification(started: boolean): void {
    this.overlays.notification.showTouristMode(started);
  }

  destroy(): void {
    this.touristMode?.stop();
    this.stop();
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('hashchange', this.handleHashChange);
    this.overlays.destroy();
    this.inputHandler.destroy();
    this.renderer.destroy();
  }
}
