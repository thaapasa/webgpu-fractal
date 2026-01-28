/**
 * Type Definitions for Fractal Explorer
 *
 * "Type safety. Because apparently you monkeys can't be trusted."
 * - Skippy the Magnificent
 */

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
