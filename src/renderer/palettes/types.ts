/**
 * Palette Types - Type definitions for color palettes
 *
 * "Types first. Always."
 * - Skippy the Magnificent
 */

export type Vec3 = [number, number, number];

export interface CosinePaletteParams {
  type: 'cosine';
  // color = a + b * cos(2π * (c * t + d))
  a: Vec3;
  b: Vec3;
  c: Vec3;
  d: Vec3;
}

export interface GradientPaletteParams {
  type: 'gradient';
  // 5 color stops
  c1: Vec3;
  c2: Vec3;
  c3: Vec3;
  c4: Vec3;
  c5: Vec3;
}

export type PaletteParams = CosinePaletteParams | GradientPaletteParams;

export interface Palette {
  name: string;
  isMonotonic: boolean;
  params: PaletteParams;
  // Optional HDR-specific params (for monotonic palettes that need brighter colors)
  hdrParams?: GradientPaletteParams;
}

export interface CosinePalette extends Palette {
  params: CosinePaletteParams;
}

export interface GradientPalette extends Palette {
  params: GradientPaletteParams;
  hdrParams?: GradientPaletteParams;
}

export type PaletteType = 'cosine' | 'gradient';
