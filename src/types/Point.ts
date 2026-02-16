/**
 * Point Types - Screen and fractal coordinate points
 *
 * "Coordinates deserve their own types. Obviously."
 * - Skippy the Magnificent
 */

/**
 * A point in screen coordinates (pixels)
 */
export interface ScreenPoint {
  readonly x: number;
  readonly y: number;
}

/**
 * Create a screen point
 */
export function screenPoint(x: number, y: number): ScreenPoint {
  return { x, y };
}

/**
 * A point in fractal coordinate space (complex plane)
 */
export interface FractalPoint {
  readonly real: number;
  readonly imag: number;
}

/**
 * Create a fractal point
 */
export function fractalPoint(real: number, imag: number): FractalPoint {
  return { real, imag };
}

/**
 * Screen dimensions
 */
export interface ScreenSize {
  readonly width: number;
  readonly height: number;
}

/**
 * Create screen size
 */
export function screenSize(width: number, height: number): ScreenSize {
  return { width, height };
}
