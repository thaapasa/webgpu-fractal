/**
 * WebGPU Fractal Engine - HDR-capable fractal renderer
 *
 * "WebGPU: Finally, graphics done right."
 * - Skippy the Magnificent
 */

import { WebGPURenderer } from '../renderer/WebGPURenderer';
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
  PaletteParams,
} from '../renderer/Palette';
import { OverlayManager, type DebugOverlayState } from '../ui';
import { FractalState, maxIterationsForZoom } from '../state';
import { FractalBlendParams } from './FractalBlend';

import shaderSource from '../renderer/shaders/mandelbrot.wgsl?raw';

const ITERATION_ADJUST_RATIO = 1.5;

// Uniform buffer structure (must match WGSL)
// Base uniforms: 68 bytes
// Palette params: ~144 bytes (vec3s with padding)
// Blend params: ~32 bytes
// Total: 256 bytes (nice round number, 16-byte aligned)
const UNIFORM_BUFFER_SIZE = 256;

export class WebGPUFractalEngine {
  private renderer: WebGPURenderer;
  private state: FractalState;
  private inputHandler: InputHandler;

  private pipeline!: GPURenderPipeline;
  private uniformBuffer!: GPUBuffer;
  private bindGroup!: GPUBindGroup;

  private overlays!: OverlayManager;

  private touristMode: TouristMode | null = null;

  private constructor(renderer: WebGPURenderer, canvas: HTMLCanvasElement) {
    this.renderer = renderer;
    this.state = new FractalState();

    this.inputHandler = new InputHandler(
      canvas,
      this.state.view,
      () => this.render(),
      this.createInputCallbacks()
    );

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

  private createInputCallbacks(): import('../controls/InputCallbacks').InputCallbacks {
    return {
      onIterationAdjust: (direction) => this.adjustMaxIterations(direction),
      onIterationReset: () => this.clearMaxIterationsOverride(),
      onCosinePaletteCycle: (direction) => this.cycleCosinePalette(direction),
      onGradientPaletteCycle: (direction) => this.cycleGradientPalette(direction),
      onColorOffsetAdjust: (delta) => this.adjustColorOffset(delta),
      onColorOffsetReset: () => this.resetColorOffset(),
      onBrightnessAdjust: (direction) => this.adjustHdrBrightness(direction),
      onBrightnessReset: () => this.resetHdrBrightness(),
      onFractalCycle: (direction) => this.cycleFractalType(direction),
      onToggleJuliaMode: () => this.toggleJuliaPickerMode(),
      onJuliaPick: (x, y) => this.pickJuliaConstant(x, y),
      onJuliaPickEnd: () => this.endJuliaPicking(),
      onShare: () => this.shareBookmark(),
      onLocationSelect: (key) => this.goToLocation(key),
      onLocationAnimate: (key) => this.animateToLocation(key),
      onToggleHelp: () => this.toggleHelp(),
      onToggleScreenshotMode: () => this.toggleScreenshotMode(),
      onToggleTouristMode: () => this.toggleTouristMode(),
      onUserInput: () => this.handleUserInput(),
    };
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

    const isJulia = isJuliaType(this.state.fractalType);
    const maxIter =
      this.state.maxIterationsOverride ?? maxIterationsForZoom(this.state.view.zoom, isJulia);

    // Update debug overlay
    const paletteName =
      this.state.paletteType === 'cosine'
        ? getCosinePaletteName(this.state.cosinePaletteIndex)
        : getGradientPaletteName(this.state.gradientPaletteIndex);

    const debugState: DebugOverlayState = {
      fractalName: FRACTAL_TYPE_NAMES[this.state.fractalType],
      zoom: this.state.view.zoom,
      maxIterations: maxIter,
      isManualIterations: this.state.maxIterationsOverride !== null,
      paletteName,
      colorOffset: this.state.colorOffset,
      isJulia,
      juliaC: this.state.juliaC,
      hdrEnabled: this.renderer.hdrEnabled,
      hdrBrightnessBias: this.state.hdrBrightnessBias,
      displaySupportsHDR: this.renderer.displaySupportsHDR,
      sdrGradientBrightness: this.state.sdrGradientBrightness,
      paletteType: this.state.paletteType,
      juliaPickerMode: this.state.juliaPickerMode,
    };
    this.overlays.updateDebug(debugState);

    // Update uniforms
    const uniformData = new ArrayBuffer(UNIFORM_BUFFER_SIZE);
    const floatView = new Float32Array(uniformData);
    const intView = new Int32Array(uniformData);

    // Get current palette info and params based on palette type
    // Use interpolated params during tourist mode transitions, otherwise look up by index
    const isCosine = this.state.paletteType === 'cosine';
    const palette = isCosine
      ? getCosinePalette(this.state.cosinePaletteIndex)
      : getGradientPalette(this.state.gradientPaletteIndex);
    const paletteParams =
      this.state.interpolatedPaletteParams ??
      (isCosine
        ? getCosinePaletteParams(this.state.cosinePaletteIndex)
        : getGradientPaletteParams(this.state.gradientPaletteIndex, this.renderer.hdrEnabled));

    // Pack base uniforms (must match WGSL struct layout with padding)
    floatView[0] = canvas.width; // resolution.x
    floatView[1] = canvas.height; // resolution.y
    floatView[2] = this.state.view.centerX; // center.x
    floatView[3] = this.state.view.centerY; // center.y
    floatView[4] = this.state.view.zoom; // zoom
    intView[5] = maxIter; // maxIterations
    floatView[6] = performance.now() * 0.001; // time
    floatView[7] = this.state.colorOffset; // colorOffset
    intView[8] = this.state.fractalType; // fractalType
    // padding at 9 (_pad_jc)
    floatView[10] = this.state.juliaC[0]; // juliaC.x
    floatView[11] = this.state.juliaC[1]; // juliaC.y
    intView[12] = this.renderer.hdrEnabled ? 1 : 0; // hdrEnabled
    floatView[13] = this.state.hdrBrightnessBias; // hdrBrightnessBias
    intView[14] = paletteParams.type === 'cosine' ? 0 : 1; // paletteType
    intView[15] = palette.isMonotonic ? 1 : 0; // isMonotonic
    floatView[16] = this.state.sdrGradientBrightness; // sdrGradientBrightness

    // Blend parameters (offsets 17-19)
    const blendParams = this.state.interpolatedBlendParams;
    floatView[17] = blendParams?.juliaBlend ?? 0; // blendJulia
    floatView[18] = blendParams?.preAbsRe ?? 0; // blendPreAbsRe
    floatView[19] = blendParams?.preAbsIm ?? 0; // blendPreAbsIm

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

    // More blend parameters (offset 56 = 224 bytes)
    floatView[56] = blendParams?.preNegIm ?? 0; // blendPreNegIm
    floatView[57] = blendParams?.postAbsRe ?? 0; // blendPostAbsRe
    floatView[58] = blendParams?.postAbsIm ?? 0; // blendPostAbsIm
    floatView[59] = blendParams?.postNegIm ?? 0; // blendPostNegIm
    intView[60] = blendParams !== null ? 1 : 0; // blendEnabled
    // padding at 61, 62, 63 (_padBlend)

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
    const isJulia = isJuliaType(this.state.fractalType);
    const currentIter =
      this.state.maxIterationsOverride ?? maxIterationsForZoom(this.state.view.zoom, isJulia);
    const newIter =
      direction > 0 ? currentIter * ITERATION_ADJUST_RATIO : currentIter / ITERATION_ADJUST_RATIO;
    this.state.maxIterationsOverride = Math.round(Math.max(1, newIter));
    this.render();
  }

  private clearMaxIterationsOverride(): void {
    this.state.maxIterationsOverride = null;
    this.render();
  }

  // --- HDR controls ---

  /**
   * Adjust brightness.
   * - In HDR mode: adjusts HDR brightness bias
   * - In SDR mode with gradient palette: adjusts gradient color brightness
   * @param direction 1 for brighter, -1 for dimmer
   */
  private adjustHdrBrightness(direction: 1 | -1): void {
    if (this.renderer.hdrEnabled) {
      // HDR mode: adjust HDR brightness bias
      this.state.hdrBrightnessBias = Math.max(
        -1,
        Math.min(1, this.state.hdrBrightnessBias + direction * 0.1)
      );
    } else if (this.state.paletteType === 'gradient') {
      // SDR mode with gradient palette: adjust gradient brightness
      // Adjust by 0.2 each step, clamped to 0.1 to 5.0
      this.state.sdrGradientBrightness = Math.max(
        0.1,
        Math.min(10.0, this.state.sdrGradientBrightness + direction * 0.2)
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
    this.state.hdrBrightnessBias = 0;
    this.state.sdrGradientBrightness = 1.0;
    this.render();
  }

  // --- Palette controls ---

  private cycleCosinePalette(direction: 1 | -1): void {
    this.state.cosinePaletteIndex =
      (this.state.cosinePaletteIndex + direction + COSINE_PALETTE_COUNT) % COSINE_PALETTE_COUNT;
    this.state.paletteType = 'cosine';
    this.render();
  }

  private cycleGradientPalette(direction: 1 | -1): void {
    this.state.gradientPaletteIndex =
      (this.state.gradientPaletteIndex + direction + GRADIENT_PALETTE_COUNT) %
      GRADIENT_PALETTE_COUNT;
    this.state.paletteType = 'gradient';
    this.render();
  }

  private adjustColorOffset(delta: number): void {
    this.state.colorOffset += delta;
    this.render();
  }

  private resetColorOffset(): void {
    this.state.colorOffset = 0;
    this.render();
  }

  // --- Fractal type controls ---

  private cycleFractalType(direction: 1 | -1 = 1): void {
    // Get the base fractal type (non-Julia) using bitwise: base = type & ~1
    const baseType = getBaseFractalType(this.state.fractalType);
    // Base types are even: 0, 2, 4, 6, 8, 10, 12, 14, 16
    // Divide by 2 to get the index: 0, 1, 2, 3, 4, 5, 6, 7, 8
    const currentIndex = baseType >> 1;
    const nextIndex = (currentIndex + direction + BASE_FRACTAL_COUNT) % BASE_FRACTAL_COUNT;
    // Multiply by 2 to get the new base type
    const newFractalType = (nextIndex << 1) as FractalType;

    if (this.state.juliaPickerMode) {
      this.state.juliaPickerMode = false;
      this.inputHandler.setJuliaPickerMode(false);
    }

    // Reset view to famous location 1 of the new fractal type
    const location = getLocationByKey('1', newFractalType);
    if (location) {
      this.applyLocationState(location.state);
      this.state.clearInterpolationState();
      this.showLocationNotification(location.name, location.description);
    } else {
      // Fallback if no location defined
      this.state.fractalType = newFractalType;
      this.state.clearInterpolationState();
    }

    this.render();
  }

  private toggleJuliaPickerMode(): void {
    if (isJuliaType(this.state.fractalType)) {
      this.exitJuliaMode();
      return;
    }
    this.state.juliaPickerMode = !this.state.juliaPickerMode;
    this.inputHandler.setJuliaPickerMode(this.state.juliaPickerMode);
    this.render();
  }

  private pickJuliaConstant(fractalX: number, fractalY: number): void {
    if (!this.state.juliaPickerMode) return;

    // First call - save state and switch to Julia mode
    if (!this.state.isActivelyPickingJulia) {
      this.state.savedViewState = {
        centerX: this.state.view.centerX,
        centerY: this.state.view.centerY,
        zoom: this.state.view.zoom,
      };
      this.state.savedFractalType = this.state.fractalType;
      this.state.fractalType = getJuliaVariant(this.state.fractalType);

      // Reset view for Julia set
      this.state.view.centerX = 0;
      this.state.view.centerY = 0;
      this.state.view.zoom = 0.5;

      this.state.isActivelyPickingJulia = true;
    }

    // Update Julia constant and render
    this.state.juliaC = [fractalX, fractalY];
    this.render();
  }

  /**
   * Called when Julia picking ends (mouse up)
   * Finalizes the pick and exits picker mode
   */
  private endJuliaPicking(): void {
    if (!this.state.isActivelyPickingJulia) return;

    this.state.isActivelyPickingJulia = false;
    this.state.juliaPickerMode = false;
    this.inputHandler.setJuliaPickerMode(false);
    this.render();
  }

  private exitJuliaMode(): void {
    if (this.state.savedViewState) {
      this.state.view.centerX = this.state.savedViewState.centerX;
      this.state.view.centerY = this.state.savedViewState.centerY;
      this.state.view.zoom = this.state.savedViewState.zoom;
      this.state.savedViewState = null;
    }
    if (this.state.savedFractalType !== null) {
      this.state.fractalType = this.state.savedFractalType;
      this.state.savedFractalType = null;
    } else {
      // Fall back to base fractal type
      this.state.fractalType = getBaseFractalType(this.state.fractalType);
    }
    this.state.juliaPickerMode = false;
    this.inputHandler.setJuliaPickerMode(false);
    this.render();
  }

  // --- Bookmarks ---

  private getBookmarkState(): BookmarkState {
    return this.state.toBookmark();
  }

  private loadBookmark(): void {
    const bookmark = readUrlBookmark();
    if (!bookmark) return;

    // Handle legacy paletteIndex before applying bookmark
    if (bookmark.paletteIndex !== undefined && bookmark.paletteType === undefined) {
      // Old palette indices: 0=Rainbow, 1=Blue, 2=Gold, 3=Grayscale, 4=Fire, 5=Ice,
      // 6=Sepia, 7=Ocean, 8=Purple, 9=Forest, 10=Sunset, 11=Electric
      // Cosine: Rainbow(0), Fire(4), Ice(5), Sunset(10), Electric(11)
      // Gradient: Blue(1), Gold(2), Grayscale(3), Sepia(6), Ocean(7), Purple(8), Forest(9)
      const cosineIndices = [0, 4, 5, 10, 11];
      if (cosineIndices.includes(bookmark.paletteIndex)) {
        bookmark.paletteType = 'cosine';
        bookmark.cosinePaletteIndex = cosineIndices.indexOf(bookmark.paletteIndex);
      } else {
        bookmark.paletteType = 'gradient';
        const gradientIndices = [1, 2, 3, 6, 7, 8, 9];
        bookmark.gradientPaletteIndex = gradientIndices.indexOf(bookmark.paletteIndex);
      }
    }

    this.state.fromBookmark(bookmark);
    this.render();
  }

  private goToLocation(key: string): void {
    const location = getLocationByKey(key, this.state.fractalType);
    if (!location) return;

    this.applyLocationState(location.state);
    this.state.clearInterpolationState();
    this.showLocationNotification(location.name, location.description);
    this.updateUrlBookmark();
    this.render();
  }

  /**
   * Animate smoothly to a location (long-press on number key)
   */
  private animateToLocation(key: string): void {
    const location = getLocationByKey(key, this.state.fractalType);
    if (!location) return;

    // Create tourist mode instance if it doesn't exist
    if (!this.touristMode) {
      this.touristMode = new TouristMode(
        {
          onUpdate: (state, interpolatedPaletteParams, interpolatedBlendParams) =>
            this.applyTouristUpdate(state, interpolatedPaletteParams, interpolatedBlendParams),
          onClearInterpolation: () => this.state.clearInterpolationState(),
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
    this.state.applyBookmark(state);
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
    const fractalTypeName = this.getFractalTypeEnumName(this.state.fractalType);
    const isJulia = isJuliaType(this.state.fractalType);

    // Build options object, only including non-default values
    const options: string[] = [];

    if (this.state.paletteType === 'gradient') {
      options.push(`paletteType: 'gradient'`);
      if (this.state.gradientPaletteIndex !== 0) {
        options.push(`gradientPaletteIndex: ${this.state.gradientPaletteIndex}`);
      }
    } else {
      // Cosine palette (default type)
      if (this.state.cosinePaletteIndex !== 1) {
        options.push(`cosinePaletteIndex: ${this.state.cosinePaletteIndex}`);
      }
    }

    if (Math.abs(this.state.colorOffset) > 0.001) {
      options.push(`colorOffset: ${this.state.colorOffset}`);
    }

    if (isJulia) {
      options.push(`juliaC: [${this.state.juliaC[0]}, ${this.state.juliaC[1]}]`);
    }

    if (this.state.maxIterationsOverride !== null) {
      options.push(`maxIterationsOverride: ${this.state.maxIterationsOverride}`);
    }

    const optionsStr = options.length > 0 ? `,\n    { ${options.join(', ')} }` : '';

    const code = `createLocation(
    'TODO: Name',
    'TODO: Description',
    'TODO: Key (1-9)',
    FractalType.${fractalTypeName},
    ${this.state.view.centerX}, ${this.state.view.centerY}, ${this.state.view.zoom}${optionsStr}
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
          onUpdate: (state, interpolatedPaletteParams, interpolatedBlendParams) =>
            this.applyTouristUpdate(state, interpolatedPaletteParams, interpolatedBlendParams),
          onClearInterpolation: () => this.state.clearInterpolationState(),
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
      this.state.clearInterpolationState();
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
    interpolatedPaletteParams?: PaletteParams,
    interpolatedBlendParams?: FractalBlendParams | null
  ): void {
    this.state.applyPartial(state);
    this.state.interpolatedPaletteParams = interpolatedPaletteParams ?? null;
    this.state.interpolatedBlendParams = interpolatedBlendParams ?? null;
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
