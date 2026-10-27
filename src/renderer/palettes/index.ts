/**
 * Palettes Module - Color palette management
 *
 * "All palette exports in one place. Organized magnificence."
 * - Skippy the Magnificent
 */

// Types
export type {
  CosinePalette,
  CosinePaletteParams,
  GradientPalette,
  GradientPaletteParams,
  Palette,
  PaletteParams,
  PaletteType,
  Vec3,
} from './types';

// Palette data
export { COSINE_PALETTE_COUNT, COSINE_PALETTES } from './cosinePalettes';
export { GRADIENT_PALETTE_COUNT, GRADIENT_PALETTES } from './gradientPalettes';

// Helper functions
export {
  getCosinePalette,
  getCosinePaletteName,
  getCosinePaletteParams,
  getGradientPalette,
  getGradientPaletteName,
  getGradientPaletteParams,
} from './helpers';
