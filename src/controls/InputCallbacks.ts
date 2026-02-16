/**
 * Input Callbacks - Interface for all input event handlers
 *
 * "One interface to rule them all. Much better than 20 setters."
 * - Skippy the Magnificent
 */

/**
 * All callbacks that can be triggered by user input.
 * All methods are optional - only implement what you need.
 */
export interface InputCallbacks {
  // View changes (pan/zoom) are handled via onChange in constructor

  // Iteration controls
  onIterationAdjust?(direction: 1 | -1): void;
  onIterationReset?(): void;

  // Palette controls
  onCosinePaletteCycle?(direction: 1 | -1): void;
  onGradientPaletteCycle?(direction: 1 | -1): void;
  onColorOffsetAdjust?(delta: number): void;
  onColorOffsetReset?(): void;

  // Brightness controls
  onBrightnessAdjust?(direction: 1 | -1): void;
  onBrightnessReset?(): void;

  // Fractal type controls
  onFractalCycle?(direction: 1 | -1): void;
  onToggleJuliaMode?(): void;
  onJuliaPick?(fractalX: number, fractalY: number): void;
  onJuliaPickEnd?(): void;

  // Navigation
  onLocationSelect?(key: string): void;
  onLocationAnimate?(key: string): void;

  // Sharing
  onShare?(): void;

  // UI toggles
  onToggleHelp?(): void;
  onToggleScreenshotMode?(): void;
  onToggleTouristMode?(): void;

  // User interaction (used to cancel tourist mode)
  onUserInput?(): void;
}
