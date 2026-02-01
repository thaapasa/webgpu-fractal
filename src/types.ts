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
  MandelbrotJulia = 1,
  BurningShip = 2,
  BurningShipJulia = 3,
  Tricorn = 4,
  TricornJulia = 5,
  Celtic = 6,
  CelticJulia = 7,
  Buffalo = 8,
  BuffaloJulia = 9,
  Phoenix = 10,
  PhoenixJulia = 11,
  Multibrot3 = 12,
  Multibrot3Julia = 13,
  Multibrot4 = 14,
  Multibrot4Julia = 15,
  Funky = 16,
  FunkyJulia = 17,
  Perpendicular = 18,
  PerpendicularJulia = 19,
}

export const FRACTAL_TYPE_NAMES: Record<FractalType, string> = {
  [FractalType.Mandelbrot]: 'Mandelbrot',
  [FractalType.MandelbrotJulia]: 'Mandelbrot Julia',
  [FractalType.BurningShip]: 'Burning Ship',
  [FractalType.BurningShipJulia]: 'Burning Ship Julia',
  [FractalType.Tricorn]: 'Tricorn',
  [FractalType.TricornJulia]: 'Tricorn Julia',
  [FractalType.Celtic]: 'Celtic',
  [FractalType.CelticJulia]: 'Celtic Julia',
  [FractalType.Buffalo]: 'Buffalo',
  [FractalType.BuffaloJulia]: 'Buffalo Julia',
  [FractalType.Phoenix]: 'Phoenix',
  [FractalType.PhoenixJulia]: 'Phoenix Julia',
  [FractalType.Multibrot3]: 'Multibrot (z³)',
  [FractalType.Multibrot3Julia]: 'Multibrot³ Julia',
  [FractalType.Multibrot4]: 'Multibrot (z⁴)',
  [FractalType.Multibrot4Julia]: 'Multibrot⁴ Julia',
  [FractalType.Funky]: 'Funky',
  [FractalType.FunkyJulia]: 'Funky Julia',
  [FractalType.Perpendicular]: 'Perpendicular',
  [FractalType.PerpendicularJulia]: 'Perpendicular Julia',
};

/** Number of base (non-Julia) fractal types */
export const BASE_FRACTAL_COUNT = 10;

/**
 * Check if a fractal type is a Julia variant.
 * Julia types are odd numbers (base type + 1).
 */
export function isJuliaType(type: FractalType): boolean {
  return (type & 1) === 1;
}

/**
 * Get the base (non-Julia) fractal type.
 * Simply clears the lowest bit.
 */
export function getBaseFractalType(type: FractalType): FractalType {
  return (type & ~1) as FractalType;
}

/**
 * Get the Julia variant of a fractal type.
 * Simply sets the lowest bit.
 */
export function getJuliaVariant(type: FractalType): FractalType {
  return (type | 1) as FractalType;
}

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
