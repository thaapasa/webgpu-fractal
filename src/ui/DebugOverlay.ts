/**
 * Debug Overlay - Status bar showing current fractal state
 *
 * "Status information for the visually inclined."
 * - Skippy the Magnificent
 */

export interface DebugOverlayState {
  fractalName: string;
  zoom: number;
  maxIterations: number;
  isManualIterations: boolean;
  paletteName: string;
  colorOffset: number;
  isJulia: boolean;
  juliaC: [number, number];
  hdrEnabled: boolean;
  hdrBrightnessBias: number;
  displaySupportsHDR: boolean;
  sdrGradientBrightness: number;
  paletteType: 'cosine' | 'gradient';
  juliaPickerMode: boolean;
  postProcessPreset: string | null;
}

export class DebugOverlay {
  private element: HTMLElement;
  private visible = true;

  constructor(parent: HTMLElement) {
    this.element = document.createElement('div');
    this.element.id = 'zoom-debug';
    parent.appendChild(this.element);
  }

  update(state: DebugOverlayState): void {
    if (!this.visible) return;

    const z = state.zoom;
    const zoomStr =
      z >= 1e6 ? z.toExponential(2) : z < 1 ? z.toPrecision(4) : String(Math.round(z));
    const iterSuffix = state.isManualIterations ? ' (manual)' : '';

    const hdrStatus = state.hdrEnabled
      ? Math.abs(state.hdrBrightnessBias) > 0.01
        ? `HDR (${state.hdrBrightnessBias > 0 ? '+' : ''}${state.hdrBrightnessBias.toFixed(2)})`
        : 'HDR'
      : state.displaySupportsHDR
        ? 'HDR available'
        : 'SDR';

    // Show SDR gradient brightness if adjusted (only relevant for SDR + gradient)
    const sdrBrightnessStr =
      !state.hdrEnabled &&
      state.paletteType === 'gradient' &&
      Math.abs(state.sdrGradientBrightness - 1.0) > 0.01
        ? `brightness ${state.sdrGradientBrightness.toFixed(1)}`
        : '';

    const juliaStatus = state.juliaPickerMode ? '🎯 Pick Julia point' : '';
    const juliaCoords = state.isJulia
      ? `c=(${state.juliaC[0].toFixed(4)}, ${state.juliaC[1].toFixed(4)})`
      : '';
    const colorOffsetStr =
      Math.abs(state.colorOffset) > 0.001 ? `offset ${state.colorOffset.toFixed(1)}` : '';

    const statusParts = [
      state.fractalName,
      `zoom ${zoomStr}`,
      `iterations ${state.maxIterations}${iterSuffix}`,
      state.paletteName,
    ];
    if (colorOffsetStr) statusParts.push(colorOffsetStr);
    if (sdrBrightnessStr) statusParts.push(sdrBrightnessStr);
    if (juliaCoords) statusParts.push(juliaCoords);
    statusParts.push(hdrStatus);
    if (juliaStatus) statusParts.push(juliaStatus);
    if (state.postProcessPreset) statusParts.push(`FX: ${state.postProcessPreset}`);
    statusParts.push('H = help');

    this.element.textContent = statusParts.join('  ·  ');
  }

  show(): void {
    this.visible = true;
    this.element.style.display = 'block';
  }

  hide(): void {
    this.visible = false;
    this.element.style.display = 'none';
  }

  destroy(): void {
    this.element.remove();
  }
}
