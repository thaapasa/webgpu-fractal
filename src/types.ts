/**
 * Type Definitions for Fractal Explorer
 *
 * "Type safety. Because apparently you monkeys can't be trusted."
 * - Skippy the Magnificent
 */

/**
 * Available fractal types.
 * Mandelbrot: z = z² + c
 * Burning Ship: z = (|Re(z)| + i|Im(z)|)² + c
 */
export enum FractalType {
  Mandelbrot = 0,
  BurningShip = 1,
}

export const FRACTAL_TYPE_NAMES: Record<FractalType, string> = {
  [FractalType.Mandelbrot]: 'Mandelbrot',
  [FractalType.BurningShip]: 'Burning Ship',
};

export type UniformValue =
  | number
  | [number, number]
  | [number, number, number]
  | [number, number, number, number];

export interface UniformMap {
  [name: string]: UniformValue;
}

export interface ViewState {
  centerX: number; // Real component of center (-2.5 to 1.0 typical)
  centerY: number; // Imaginary component of center (-1.5 to 1.5 typical)
  zoom: number; // Zoom factor (1.0 = full set visible)
}
