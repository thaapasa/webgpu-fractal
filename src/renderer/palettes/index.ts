/**
 * Palettes Module - Color palette management
 *
 * "All palette exports in one place. Organized magnificence."
 * - Skippy the Magnificent
 */

// Types
export type {
  Vec3,
  CosinePaletteParams,
  GradientPaletteParams,
  PaletteParams,
  Palette,
  CosinePalette,
  GradientPalette,
  PaletteType,
} from './types';

// Palette data
export { COSINE_PALETTES, COSINE_PALETTE_COUNT } from './cosinePalettes';
export { GRADIENT_PALETTES, GRADIENT_PALETTE_COUNT } from './gradientPalettes';

// Helper functions
export {
  getCosinePaletteParams,
  getGradientPaletteParams,
  getCosinePalette,
  getGradientPalette,
  getCosinePaletteName,
  getGradientPaletteName,
} from './helpers';
