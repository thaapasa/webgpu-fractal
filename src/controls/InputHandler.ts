/**
 * Input Handler - Translates browser events into view state changes
 *
 * "Event handling. Because apparently you monkeys can't click things properly."
 * - Skippy the Magnificent
 */

import { ViewState } from './ViewState';

export type ViewStateChangeCallback = (viewState: ViewState) => void;
export type IterationAdjustCallback = (direction: 1 | -1) => void;
export type IterationResetCallback = () => void;
export type CosinePaletteCycleCallback = (direction: 1 | -1) => void;
export type GradientPaletteCycleCallback = (direction: 1 | -1) => void;
export type ColorOffsetCallback = (delta: number) => void;
export type ToggleCallback = () => void;
export type FractalCycleCallback = (direction: 1 | -1) => void;
export type JuliaPickCallback = (fractalX: number, fractalY: number) => void;
export type JuliaPickEndCallback = () => void;
export type ShareCallback = () => void;
export type LocationCallback = (key: string) => void;
export type HelpToggleCallback = () => void;
export type ScreenshotModeCallback = () => void;

/** Zoom sensitivity: 1 = full speed, 0.6 = 60% of current zoom deltas */
const ZOOM_SENSITIVITY = 0.6;

function scaleZoomFactor(factor: number): number {
  return 1 + (factor - 1) * ZOOM_SENSITIVITY;
}

export class InputHandler {
  private canvas: HTMLCanvasElement;
  private viewState: ViewState;
  private onChange: ViewStateChangeCallback;
  private onIterationAdjust: IterationAdjustCallback | null = null;
  private onIterationReset: IterationResetCallback | null = null;
  private onCosinePaletteCycle: CosinePaletteCycleCallback | null = null;
  private onGradientPaletteCycle: GradientPaletteCycleCallback | null = null;
  private onColorOffset: ColorOffsetCallback | null = null;
  private onColorOffsetReset: ToggleCallback | null = null;
  private onToggleAA: ToggleCallback | null = null;
  private onAdjustHdrBrightness: IterationAdjustCallback | null = null;
  private onResetHdrBrightness: ToggleCallback | null = null;
  private onFractalCycle: FractalCycleCallback | null = null;
  private onToggleJuliaMode: ToggleCallback | null = null;
  private onJuliaPick: JuliaPickCallback | null = null;
  private onJuliaPickEnd: JuliaPickEndCallback | null = null;
  private onShare: ShareCallback | null = null;
  private onLocationSelect: LocationCallback | null = null;
  private onToggleHelp: HelpToggleCallback | null = null;
  private onToggleScreenshotMode: ScreenshotModeCallback | null = null;

  // Mouse/touch state
  private isDragging = false;
  private lastX = 0;
  private lastY = 0;
  private lastTouchDistance = 0;

  // Julia picker mode state
  private juliaPickerMode = false;
  private isPickingJulia = false; // True when mouse is down in picker mode
  private juliaPickViewState: { centerX: number; centerY: number; zoom: number } | null = null;

  // Keyboard zoom state
  private keyboardZoomDirection: 1 | -1 | null = null;
  private keyboardZoomStartTime: number = 0;
  private keyboardZoomAnimationId: number | null = null;

  constructor(
    canvas: HTMLCanvasElement,
    viewState: ViewState,
    onChange: ViewStateChangeCallback
  ) {
    this.canvas = canvas;
    this.viewState = viewState;
    this.onChange = onChange;

    this.setupEventListeners();
  }

  /**
   * Set callback for iteration adjustment (+/- keys)
   */
  setIterationAdjustCallback(callback: IterationAdjustCallback): void {
    this.onIterationAdjust = callback;
  }

  /**
   * Set callback for iteration reset (0 key)
   */
  setIterationResetCallback(callback: IterationResetCallback): void {
    this.onIterationReset = callback;
  }

  /**
   * Set callback for cosine palette cycling (c/C keys)
   */
  setCosinePaletteCycleCallback(callback: CosinePaletteCycleCallback): void {
    this.onCosinePaletteCycle = callback;
  }

  /**
   * Set callback for gradient palette cycling (g/G keys)
   */
  setGradientPaletteCycleCallback(callback: GradientPaletteCycleCallback): void {
    this.onGradientPaletteCycle = callback;
  }

  /**
   * Set callback for color offset adjustment ([/] keys)
   */
  setColorOffsetCallback(callback: ColorOffsetCallback): void {
    this.onColorOffset = callback;
  }

  /**
   * Set callback for color offset reset (r key)
   */
  setColorOffsetResetCallback(callback: ToggleCallback): void {
    this.onColorOffsetReset = callback;
  }

  /**
   * Set callback for AA toggle (a key)
   */
  setToggleAACallback(callback: ToggleCallback): void {
    this.onToggleAA = callback;
  }

  /**
   * Set callback for HDR toggle (no-op, HDR is auto-detected)
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setToggleHDRCallback(_callback: ToggleCallback): void {
    // HDR is now auto-detected based on display capabilities
  }

  /**
   * Set callback for HDR brightness adjustment (b/B keys)
   */
  setAdjustHdrBrightnessCallback(callback: IterationAdjustCallback): void {
    this.onAdjustHdrBrightness = callback;
  }

  /**
   * Set callback for HDR brightness reset (Shift+R key)
   */
  setResetHdrBrightnessCallback(callback: ToggleCallback): void {
    this.onResetHdrBrightness = callback;
  }

  /**
   * Set callback for fractal type cycling (f/F keys)
   */
  setFractalCycleCallback(callback: FractalCycleCallback): void {
    this.onFractalCycle = callback;
  }

  /**
   * Set callback for Julia mode toggle (j key)
   */
  setToggleJuliaModeCallback(callback: ToggleCallback): void {
    this.onToggleJuliaMode = callback;
  }

  /**
   * Set callback for Julia constant selection (click in picker mode)
   */
  setJuliaPickCallback(callback: JuliaPickCallback): void {
    this.onJuliaPick = callback;
  }

  /**
   * Set callback for when Julia picking ends (mouse up in picker mode)
   */
  setJuliaPickEndCallback(callback: JuliaPickEndCallback): void {
    this.onJuliaPickEnd = callback;
  }

  /**
   * Set callback for share/bookmark (s key)
   */
  setShareCallback(callback: ShareCallback): void {
    this.onShare = callback;
  }

  /**
   * Set callback for famous location selection (1-9 keys)
   */
  setLocationSelectCallback(callback: LocationCallback): void {
    this.onLocationSelect = callback;
  }

  /**
   * Set callback for help overlay toggle (h key)
   */
  setToggleHelpCallback(callback: HelpToggleCallback): void {
    this.onToggleHelp = callback;
  }

  /**
   * Set callback for screenshot mode toggle (space key)
   */
  setToggleScreenshotModeCallback(callback: ScreenshotModeCallback): void {
    this.onToggleScreenshotMode = callback;
  }

  /**
   * Enable or disable Julia picker mode
   */
  setJuliaPickerMode(enabled: boolean): void {
    this.juliaPickerMode = enabled;
    this.canvas.style.cursor = enabled ? 'crosshair' : 'grab';
  }

  /**
   * Check if Julia picker mode is active
   */
  isJuliaPickerModeActive(): boolean {
    return this.juliaPickerMode;
  }

  private setupEventListeners(): void {
    // Mouse events
    this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
    this.canvas.addEventListener('mouseleave', this.handleMouseUp.bind(this));
    this.canvas.addEventListener('wheel', this.handleWheel.bind(this), { passive: false });
    this.canvas.addEventListener('dblclick', this.handleDoubleClick.bind(this));

    // Touch events
    this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
    this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
    this.canvas.addEventListener('touchcancel', this.handleTouchEnd.bind(this));


    // Keyboard events (on window for global capture)
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));
  }

  private getCanvasRect(): DOMRect {
    return this.canvas.getBoundingClientRect();
  }

  private getScreenCoords(clientX: number, clientY: number): [number, number] {
    const rect = this.getCanvasRect();
    return [clientX - rect.left, clientY - rect.top];
  }

  private getCanvasSize(): [number, number] {
    // Use CSS dimensions, not pixel dimensions (which include devicePixelRatio)
    const rect = this.getCanvasRect();
    return [rect.width, rect.height];
  }

  /**
   * Convert screen coordinates to fractal coordinates using a specific view state.
   * Used during Julia picking to maintain consistent coordinate space.
   */
  private toFractalCoordsWithView(
    screenX: number,
    screenY: number,
    screenWidth: number,
    screenHeight: number,
    view: { centerX: number; centerY: number; zoom: number }
  ): [number, number] {
    const aspect = screenWidth / screenHeight;
    const uvX = (screenX / screenWidth - 0.5) * aspect;
    const uvY = screenY / screenHeight - 0.5;
    const fractalX = view.centerX + uvX / view.zoom;
    const fractalY = view.centerY - uvY / view.zoom;
    return [fractalX, fractalY];
  }

  private notifyChange(): void {
    this.onChange(this.viewState);
  }

  // Mouse handlers
  private handleMouseDown(e: MouseEvent): void {
    if (e.button !== 0) return; // Only left button

    const [x, y] = this.getScreenCoords(e.clientX, e.clientY);

    // Julia picker mode: start continuous picking while mouse is held
    if (this.juliaPickerMode && this.onJuliaPick) {
      const [width, height] = this.getCanvasSize();
      // Save view state at pick start - we'll use this for ALL coordinate conversions
      // during this pick session, even after the view switches to Julia mode
      this.juliaPickViewState = {
        centerX: this.viewState.centerX,
        centerY: this.viewState.centerY,
        zoom: this.viewState.zoom,
      };
      const [fractalX, fractalY] = this.toFractalCoordsWithView(
        x, y, width, height, this.juliaPickViewState
      );
      this.isPickingJulia = true;
      this.lastX = x;
      this.lastY = y;
      this.onJuliaPick(fractalX, fractalY);
      return;
    }

    this.isDragging = true;
    this.lastX = x;
    this.lastY = y;
    this.canvas.style.cursor = 'grabbing';
  }

  private handleMouseMove(e: MouseEvent): void {
    const [x, y] = this.getScreenCoords(e.clientX, e.clientY);

    // Julia picking mode: continuously update Julia constant while mouse is held
    if (this.isPickingJulia && this.onJuliaPick && this.juliaPickViewState) {
      const [width, height] = this.getCanvasSize();
      // Use saved view state for conversion - keeps us in Mandelbrot coordinate space
      const [fractalX, fractalY] = this.toFractalCoordsWithView(
        x, y, width, height, this.juliaPickViewState
      );
      this.onJuliaPick(fractalX, fractalY);
      this.lastX = x;
      this.lastY = y;
      return;
    }

    if (!this.isDragging) return;

    const deltaX = x - this.lastX;
    const deltaY = y - this.lastY;

    const [width, height] = this.getCanvasSize();
    this.viewState.pan(deltaX, deltaY, width, height);
    this.notifyChange();

    this.lastX = x;
    this.lastY = y;
  }

  private handleMouseUp(): void {
    if (this.isPickingJulia) {
      this.isPickingJulia = false;
      this.juliaPickViewState = null;
      this.onJuliaPickEnd?.();
      return;
    }
    if (this.isDragging) {
      this.isDragging = false;
      this.canvas.style.cursor = 'grab';
    }
  }

  private handleWheel(e: WheelEvent): void {
    e.preventDefault();

    const [x, y] = this.getScreenCoords(e.clientX, e.clientY);
    const raw = e.deltaY > 0 ? 0.9 : 1.1;
    const zoomFactor = scaleZoomFactor(raw);

    const [width, height] = this.getCanvasSize();
    this.viewState.zoomAt(x, y, zoomFactor, width, height);
    this.notifyChange();
  }

  private handleDoubleClick(e: MouseEvent): void {
    const [x, y] = this.getScreenCoords(e.clientX, e.clientY);
    const [width, height] = this.getCanvasSize();
    this.viewState.zoomToPoint(x, y, scaleZoomFactor(2.0), width, height);
    this.notifyChange();
  }

  // Touch handlers
  private getTouchDistance(touches: TouchList): number {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  private getTouchCenter(touches: TouchList): [number, number] {
    if (touches.length === 0) return [0, 0];
    if (touches.length === 1) {
      return this.getScreenCoords(touches[0].clientX, touches[0].clientY);
    }
    const x = (touches[0].clientX + touches[1].clientX) / 2;
    const y = (touches[0].clientY + touches[1].clientY) / 2;
    return this.getScreenCoords(x, y);
  }

  private handleTouchStart(e: TouchEvent): void {
    if (e.touches.length === 1) {
      // Single touch - start pan
      this.isDragging = true;
      const [x, y] = this.getScreenCoords(e.touches[0].clientX, e.touches[0].clientY);
      this.lastX = x;
      this.lastY = y;
    } else if (e.touches.length === 2) {
      // Two touches - prepare for pinch zoom
      this.isDragging = false;
      this.lastTouchDistance = this.getTouchDistance(e.touches);
    }
  }

  private handleTouchMove(e: TouchEvent): void {
    e.preventDefault();

    if (e.touches.length === 1 && this.isDragging) {
      // Single touch pan
      const [x, y] = this.getScreenCoords(e.touches[0].clientX, e.touches[0].clientY);
      const deltaX = x - this.lastX;
      const deltaY = y - this.lastY;

      const [width, height] = this.getCanvasSize();
    this.viewState.pan(deltaX, deltaY, width, height);
      this.notifyChange();

      this.lastX = x;
      this.lastY = y;
    } else if (e.touches.length === 2) {
      // Pinch zoom
      const distance = this.getTouchDistance(e.touches);
      const center = this.getTouchCenter(e.touches);

      if (this.lastTouchDistance > 0) {
        const raw = distance / this.lastTouchDistance;
        const zoomFactor = scaleZoomFactor(raw);
        const [width, height] = this.getCanvasSize();
        this.viewState.zoomAt(center[0], center[1], zoomFactor, width, height);
        this.notifyChange();
      }

      this.lastTouchDistance = distance;
    }
  }

  private handleTouchEnd(): void {
    this.isDragging = false;
    this.lastTouchDistance = 0;
  }

  // Keyboard handlers
  private handleKeyDown(e: KeyboardEvent): void {
    // Ignore if typing in an input field
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return;
    }

    switch (e.key) {
      case '+':
      case '=': // Allow unshifted + key
        e.preventDefault();
        this.onIterationAdjust?.(1);
        break;
      case '-':
      case '_': // Allow shifted - key
        e.preventDefault();
        this.onIterationAdjust?.(-1);
        break;
      case '0':
        e.preventDefault();
        this.onIterationReset?.();
        break;
      case 'c':
        e.preventDefault();
        this.onCosinePaletteCycle?.(1);
        break;
      case 'C':
        e.preventDefault();
        this.onCosinePaletteCycle?.(-1);
        break;
      case 'g':
        e.preventDefault();
        this.onGradientPaletteCycle?.(1);
        break;
      case 'G':
        e.preventDefault();
        this.onGradientPaletteCycle?.(-1);
        break;
      case '[':
      case ',':
        e.preventDefault();
        this.onColorOffset?.(-0.05);
        break;
      case ']':
      case '.':
        e.preventDefault();
        this.onColorOffset?.(0.05);
        break;
      case '{':
      case '<':
        e.preventDefault();
        this.onColorOffset?.(-0.15);
        break;
      case '}':
      case '>':
        e.preventDefault();
        this.onColorOffset?.(0.15);
        break;
      case 'r':
      case 'R':
        e.preventDefault();
        this.onColorOffsetReset?.();
        break;
      case 'a':
      case 'A':
        e.preventDefault();
        this.onToggleAA?.();
        break;
      case 'b':
        // b: extend bright region (make more of image bright)
        e.preventDefault();
        this.onAdjustHdrBrightness?.(1);
        break;
      case 'B':
        // Shift+B: contract bright region (make less of image bright)
        e.preventDefault();
        this.onAdjustHdrBrightness?.(-1);
        break;
      case 'd':
        // d: reset HDR brightness bias
        e.preventDefault();
        this.onResetHdrBrightness?.();
        break;
      case 'f':
        e.preventDefault();
        this.onFractalCycle?.(1);
        break;
      case 'F':
        e.preventDefault();
        this.onFractalCycle?.(-1);
        break;
      case 'j':
      case 'J':
        e.preventDefault();
        this.onToggleJuliaMode?.();
        break;
      case 's':
      case 'S':
        e.preventDefault();
        this.onShare?.();
        break;
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        e.preventDefault();
        this.onLocationSelect?.(e.key);
        break;
      case 'h':
      case 'H':
        e.preventDefault();
        this.onToggleHelp?.();
        break;
      case ' ':
        e.preventDefault();
        this.onToggleScreenshotMode?.();
        break;
      case 'z':
        e.preventDefault();
        if (!e.repeat) {
          this.startKeyboardZoom(1); // Zoom in
        }
        break;
      case 'Z':
        e.preventDefault();
        if (!e.repeat) {
          this.startKeyboardZoom(-1); // Zoom out
        }
        break;
    }
  }

  // Keyboard zoom handlers
  private handleKeyUp(e: KeyboardEvent): void {
    // Stop keyboard zoom when z or Z is released
    if (e.key === 'z' || e.key === 'Z') {
      this.stopKeyboardZoom();
    }
  }

  /**
   * Start continuous keyboard zoom
   * @param direction 1 for zoom in, -1 for zoom out
   */
  private startKeyboardZoom(direction: 1 | -1): void {
    // If already zooming in a different direction, stop first
    if (this.keyboardZoomAnimationId !== null) {
      this.stopKeyboardZoom();
    }

    this.keyboardZoomDirection = direction;
    this.keyboardZoomStartTime = performance.now();
    this.keyboardZoomAnimationId = requestAnimationFrame(this.keyboardZoomLoop.bind(this));
  }

  /**
   * Stop continuous keyboard zoom
   */
  private stopKeyboardZoom(): void {
    if (this.keyboardZoomAnimationId !== null) {
      cancelAnimationFrame(this.keyboardZoomAnimationId);
      this.keyboardZoomAnimationId = null;
    }
    this.keyboardZoomDirection = null;
  }

  /**
   * Animation loop for continuous keyboard zoom
   * Zoom rate is proportional to elapsed time, allowing fine control with quick taps
   */
  private keyboardZoomLoop(currentTime: number): void {
    if (this.keyboardZoomDirection === null) return;

    const elapsed = currentTime - this.keyboardZoomStartTime;
    this.keyboardZoomStartTime = currentTime;

    // Zoom rate: ~2x per second when holding key
    // This means quick taps (< 50ms) result in very small zoom changes
    const zoomSpeed = 0.7; // ln(2) ≈ 0.693, so ~2x/second
    const zoomExponent = this.keyboardZoomDirection * zoomSpeed * (elapsed / 1000);
    const zoomFactor = Math.exp(zoomExponent);

    // Apply zoom centered on screen center
    const [width, height] = this.getCanvasSize();
    this.viewState.zoomAt(width / 2, height / 2, zoomFactor, width, height);
    this.notifyChange();

    // Continue animation
    this.keyboardZoomAnimationId = requestAnimationFrame(this.keyboardZoomLoop.bind(this));
  }

  /**
   * Clean up event listeners
   */
  destroy(): void {
    // Event listeners will be cleaned up when canvas is removed
    // But we could explicitly remove them if needed
  }
}
