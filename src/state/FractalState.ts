/**
 * Fractal State - Central state management for the fractal explorer
 *
 * "State management done right. No more hunting through 1000 lines of code."
 * - Skippy the Magnificent
 */

import { FractalType, isJuliaType } from '../types';
import { ViewState } from '../controls/ViewState';
import { BookmarkState } from '../bookmark/BookmarkManager';
import {
  PaletteType,
  PaletteParams,
  COSINE_PALETTE_COUNT,
  GRADIENT_PALETTE_COUNT,
} from '../renderer/Palette';
import { FractalBlendParams } from '../fractal/FractalBlend';

/** Base iterations at zoom 1 */
const MAX_ITERATIONS_BASE = 256;
const MAX_ITERATIONS_BASE_JULIA = 512;
const MAX_ITERATIONS_AUTO_CAP = 4096;
const MAX_ITERATIONS_LOG_SCALE = 640;
const MAX_ITERATIONS_LOG_POWER = 1.65;

/**
 * Calculate appropriate max iterations for a given zoom level
 */
export function maxIterationsForZoom(zoom: number, isJulia: boolean = false): number {
  const z = Math.max(1, zoom);
  const L = Math.log10(z);
  const base = isJulia ? MAX_ITERATIONS_BASE_JULIA : MAX_ITERATIONS_BASE;
  const n = base + MAX_ITERATIONS_LOG_SCALE * Math.pow(L, MAX_ITERATIONS_LOG_POWER);
  return Math.round(Math.max(base, Math.min(MAX_ITERATIONS_AUTO_CAP, n)));
}

/**
 * Snapshot of view state for saving/restoring
 */
export interface ViewSnapshot {
  centerX: number;
  centerY: number;
  zoom: number;
}

/**
 * State change event types
 */
export type FractalStateChangeType =
  | 'view'
  | 'fractalType'
  | 'julia'
  | 'palette'
  | 'iterations'
  | 'brightness'
  | 'all';

/**
 * Listener for state changes
 */
export type FractalStateListener = (changeType: FractalStateChangeType) => void;

/**
 * Central state container for all fractal-related state
 */
export class FractalState {
  // View state (pan/zoom)
  readonly view: ViewState;

  // Fractal type
  private _fractalType: FractalType = FractalType.Mandelbrot;

  // Julia mode
  private _juliaC: [number, number] = [-0.7, 0.27015];
  private _juliaPickerMode = false;
  private _isActivelyPickingJulia = false;
  private _savedViewState: ViewSnapshot | null = null;
  private _savedFractalType: FractalType | null = null;

  // Palette
  private _paletteType: PaletteType = 'cosine';
  private _cosinePaletteIndex = 1; // Fire
  private _gradientPaletteIndex = 0; // Blue
  private _colorOffset = 0.0;

  // Iterations
  private _maxIterationsOverride: number | null = null;

  // Brightness
  private _hdrBrightnessBias = 0.0;
  private _sdrGradientBrightness = 1.0;

  // Tourist mode palette interpolation
  private _interpolatedPaletteParams: PaletteParams | null = null;

  // Tourist mode fractal type interpolation
  private _interpolatedBlendParams: FractalBlendParams | null = null;

  // Change listeners
  private listeners: Set<FractalStateListener> = new Set();

  constructor() {
    this.view = new ViewState();
  }

  // --- Getters ---

  get fractalType(): FractalType {
    return this._fractalType;
  }

  get juliaC(): [number, number] {
    return this._juliaC;
  }

  get juliaPickerMode(): boolean {
    return this._juliaPickerMode;
  }

  get isActivelyPickingJulia(): boolean {
    return this._isActivelyPickingJulia;
  }

  get savedViewState(): ViewSnapshot | null {
    return this._savedViewState;
  }

  get savedFractalType(): FractalType | null {
    return this._savedFractalType;
  }

  get paletteType(): PaletteType {
    return this._paletteType;
  }

  get cosinePaletteIndex(): number {
    return this._cosinePaletteIndex;
  }

  get gradientPaletteIndex(): number {
    return this._gradientPaletteIndex;
  }

  get colorOffset(): number {
    return this._colorOffset;
  }

  get maxIterationsOverride(): number | null {
    return this._maxIterationsOverride;
  }

  get hdrBrightnessBias(): number {
    return this._hdrBrightnessBias;
  }

  get sdrGradientBrightness(): number {
    return this._sdrGradientBrightness;
  }

  get interpolatedPaletteParams(): PaletteParams | null {
    return this._interpolatedPaletteParams;
  }

  get interpolatedBlendParams(): FractalBlendParams | null {
    return this._interpolatedBlendParams;
  }

  get isJulia(): boolean {
    return isJuliaType(this._fractalType);
  }

  /**
   * Get the current max iterations (auto-calculated or manual override)
   */
  get maxIterations(): number {
    return this._maxIterationsOverride ?? maxIterationsForZoom(this.view.zoom, this.isJulia);
  }

  // --- Setters with change notification ---

  set fractalType(value: FractalType) {
    if (this._fractalType !== value) {
      this._fractalType = value;
      this.emit('fractalType');
    }
  }

  set juliaC(value: [number, number]) {
    this._juliaC = value;
    this.emit('julia');
  }

  set juliaPickerMode(value: boolean) {
    this._juliaPickerMode = value;
    this.emit('julia');
  }

  set isActivelyPickingJulia(value: boolean) {
    this._isActivelyPickingJulia = value;
  }

  set savedViewState(value: ViewSnapshot | null) {
    this._savedViewState = value;
  }

  set savedFractalType(value: FractalType | null) {
    this._savedFractalType = value;
  }

  set paletteType(value: PaletteType) {
    if (this._paletteType !== value) {
      this._paletteType = value;
      this.emit('palette');
    }
  }

  set cosinePaletteIndex(value: number) {
    const clamped = ((value % COSINE_PALETTE_COUNT) + COSINE_PALETTE_COUNT) % COSINE_PALETTE_COUNT;
    if (this._cosinePaletteIndex !== clamped) {
      this._cosinePaletteIndex = clamped;
      this.emit('palette');
    }
  }

  set gradientPaletteIndex(value: number) {
    const clamped =
      ((value % GRADIENT_PALETTE_COUNT) + GRADIENT_PALETTE_COUNT) % GRADIENT_PALETTE_COUNT;
    if (this._gradientPaletteIndex !== clamped) {
      this._gradientPaletteIndex = clamped;
      this.emit('palette');
    }
  }

  set colorOffset(value: number) {
    this._colorOffset = value;
    this.emit('palette');
  }

  set maxIterationsOverride(value: number | null) {
    this._maxIterationsOverride = value;
    this.emit('iterations');
  }

  set hdrBrightnessBias(value: number) {
    this._hdrBrightnessBias = Math.max(-1, Math.min(1, value));
    this.emit('brightness');
  }

  set sdrGradientBrightness(value: number) {
    this._sdrGradientBrightness = Math.max(0.1, Math.min(10.0, value));
    this.emit('brightness');
  }

  set interpolatedPaletteParams(value: PaletteParams | null) {
    this._interpolatedPaletteParams = value;
    // No emit - this is for smooth animation, render loop handles it
  }

  set interpolatedBlendParams(value: FractalBlendParams | null) {
    this._interpolatedBlendParams = value;
    // No emit - this is for smooth animation, render loop handles it
  }

  /**
   * Clear all interpolation state (palette and blend params).
   * Call this when making a "hard" state change (not an animated transition).
   */
  clearInterpolationState(): void {
    this._interpolatedPaletteParams = null;
    this._interpolatedBlendParams = null;
  }

  // --- State conversion ---

  /**
   * Convert current state to a BookmarkState for URL sharing
   */
  toBookmark(): BookmarkState {
    return {
      fractalType: this._fractalType,
      centerX: this.view.centerX,
      centerY: this.view.centerY,
      zoom: this.view.zoom,
      paletteType: this._paletteType,
      cosinePaletteIndex: this._cosinePaletteIndex,
      gradientPaletteIndex: this._gradientPaletteIndex,
      colorOffset: this._colorOffset,
      juliaC: this._juliaC,
      maxIterationsOverride: this._maxIterationsOverride,
      aaEnabled: false, // Not used in WebGPU version
    };
  }

  /**
   * Load state from a partial BookmarkState (e.g., from URL)
   */
  fromBookmark(bookmark: Partial<BookmarkState>): void {
    if (bookmark.centerX !== undefined) this.view.centerX = bookmark.centerX;
    if (bookmark.centerY !== undefined) this.view.centerY = bookmark.centerY;
    if (bookmark.zoom !== undefined) this.view.zoom = bookmark.zoom;
    if (bookmark.fractalType !== undefined) this._fractalType = bookmark.fractalType;
    if (bookmark.paletteType !== undefined) this._paletteType = bookmark.paletteType;
    if (bookmark.cosinePaletteIndex !== undefined)
      this._cosinePaletteIndex = bookmark.cosinePaletteIndex % COSINE_PALETTE_COUNT;
    if (bookmark.gradientPaletteIndex !== undefined)
      this._gradientPaletteIndex = bookmark.gradientPaletteIndex % GRADIENT_PALETTE_COUNT;
    if (bookmark.colorOffset !== undefined) this._colorOffset = bookmark.colorOffset;
    if (bookmark.juliaC !== undefined) this._juliaC = bookmark.juliaC;
    if (bookmark.maxIterationsOverride !== undefined)
      this._maxIterationsOverride = bookmark.maxIterationsOverride;

    this.emit('all');
  }

  /**
   * Apply a full BookmarkState (e.g., from a famous location)
   */
  applyBookmark(state: BookmarkState): void {
    this.view.centerX = state.centerX;
    this.view.centerY = state.centerY;
    this.view.zoom = state.zoom;
    this._fractalType = state.fractalType;
    this._paletteType = state.paletteType;
    this._cosinePaletteIndex = state.cosinePaletteIndex;
    this._gradientPaletteIndex = state.gradientPaletteIndex;
    this._colorOffset = state.colorOffset;
    this._juliaC = state.juliaC;
    this._maxIterationsOverride = state.maxIterationsOverride;

    this.emit('all');
  }

  /**
   * Apply a partial state update (e.g., from tourist mode animation)
   */
  applyPartial(state: Partial<BookmarkState>): void {
    if (state.centerX !== undefined) this.view.centerX = state.centerX;
    if (state.centerY !== undefined) this.view.centerY = state.centerY;
    if (state.zoom !== undefined) this.view.zoom = state.zoom;
    if (state.fractalType !== undefined) this._fractalType = state.fractalType;
    if (state.paletteType !== undefined) this._paletteType = state.paletteType;
    if (state.cosinePaletteIndex !== undefined) this._cosinePaletteIndex = state.cosinePaletteIndex;
    if (state.gradientPaletteIndex !== undefined)
      this._gradientPaletteIndex = state.gradientPaletteIndex;
    if (state.colorOffset !== undefined) this._colorOffset = state.colorOffset;
    if (state.juliaC !== undefined) this._juliaC = state.juliaC;
    // Note: no emit here - caller should trigger render
  }

  // --- Change notification ---

  /**
   * Subscribe to state changes
   */
  addListener(listener: FractalStateListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Emit a state change event
   */
  private emit(changeType: FractalStateChangeType): void {
    for (const listener of this.listeners) {
      listener(changeType);
    }
  }

  /**
   * Notify listeners of a view change (called by external code after panning/zooming)
   */
  notifyViewChange(): void {
    this.emit('view');
  }
}
