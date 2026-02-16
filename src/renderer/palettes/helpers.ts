/**
 * Palette Helpers - Functions for accessing and manipulating palettes
 *
 * "Helper functions. Even I need them sometimes."
 * - Skippy the Magnificent
 */

import {
  CosinePaletteParams,
  GradientPaletteParams,
  CosinePalette,
  GradientPalette,
} from './types';
import { COSINE_PALETTES, COSINE_PALETTE_COUNT } from './cosinePalettes';
import { GRADIENT_PALETTES, GRADIENT_PALETTE_COUNT } from './gradientPalettes';

/**
 * Get cosine palette parameters for rendering
 */
export function getCosinePaletteParams(index: number): CosinePaletteParams {
  return COSINE_PALETTES[index % COSINE_PALETTE_COUNT].params;
}

/**
 * Get gradient palette parameters for rendering
 * @param hdr Whether to use HDR-specific params (if available)
 */
export function getGradientPaletteParams(index: number, hdr: boolean): GradientPaletteParams {
  const palette = GRADIENT_PALETTES[index % GRADIENT_PALETTE_COUNT];
  if (hdr && palette.hdrParams) {
    return palette.hdrParams;
  }
  return palette.params;
}

/**
 * Get full cosine palette info
 */
export function getCosinePalette(index: number): CosinePalette {
  return COSINE_PALETTES[index % COSINE_PALETTE_COUNT];
}

/**
 * Get full gradient palette info
 */
export function getGradientPalette(index: number): GradientPalette {
  return GRADIENT_PALETTES[index % GRADIENT_PALETTE_COUNT];
}

/**
 * Get cosine palette name
 */
export function getCosinePaletteName(index: number): string {
  return COSINE_PALETTES[index % COSINE_PALETTE_COUNT].name;
}

/**
 * Get gradient palette name
 */
export function getGradientPaletteName(index: number): string {
  return GRADIENT_PALETTES[index % GRADIENT_PALETTE_COUNT].name;
}
