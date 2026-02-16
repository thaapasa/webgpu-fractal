/**
 * Location Helper - Factory function for creating famous locations
 *
 * "Boilerplate reduction at its finest."
 * - Skippy the Magnificent
 */

import { FractalType } from '../../types';
import { FamousLocation } from './types';

/**
 * Create a famous location with sensible defaults
 */
export function createLocation(
  name: string,
  description: string,
  key: string,
  fractalType: FractalType,
  centerX: number,
  centerY: number,
  zoom: number,
  options: Partial<{
    paletteType: 'cosine' | 'gradient';
    cosinePaletteIndex: number;
    gradientPaletteIndex: number;
    colorOffset: number;
    juliaC: [number, number];
    maxIterationsOverride: number | null;
  }> = {}
): FamousLocation {
  return {
    name,
    description,
    key,
    state: {
      fractalType,
      centerX,
      centerY,
      zoom,
      paletteType: options.paletteType ?? 'cosine',
      cosinePaletteIndex: options.cosinePaletteIndex ?? 1,
      gradientPaletteIndex: options.gradientPaletteIndex ?? 0,
      colorOffset: options.colorOffset ?? 0,
      juliaC: options.juliaC ?? [-0.7, 0.27015],
      maxIterationsOverride: options.maxIterationsOverride ?? null,
      aaEnabled: false,
    },
  };
}
