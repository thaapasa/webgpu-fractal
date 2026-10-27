/**
 * Famous Locations Module - Curated spots of mathematical beauty
 *
 * "The greatest hits of chaos theory, now properly organized."
 * - Skippy the Magnificent
 */

import { FractalType, getBaseFractalType } from '../../types';
import { BUFFALO_LOCATIONS } from './buffalo';
import { BURNING_SHIP_LOCATIONS } from './burningShip';
import { CELTIC_LOCATIONS } from './celtic';
import { FUNKY_LOCATIONS } from './funky';
// Import all location arrays
import { MANDELBROT_LOCATIONS } from './mandelbrot';
import { MULTIBROT3_LOCATIONS } from './multibrot3';
import { MULTIBROT4_LOCATIONS } from './multibrot4';
import { PERPENDICULAR_LOCATIONS } from './perpendicular';
import { PHOENIX_LOCATIONS } from './phoenix';
import { TRICORN_LOCATIONS } from './tricorn';
import { TRIPLE_DRAGON_LOCATIONS } from './tripleDragon';
import { FamousLocation } from './types';

// Re-export types and helpers
export { createLocation } from './helpers';
export type { FamousLocation } from './types';

/**
 * Map from base fractal type (even numbers) to their famous locations.
 * Both base and Julia variants of a fractal share the same location list.
 */
const LOCATIONS_BY_FRACTAL: Map<FractalType, FamousLocation[]> = new Map([
  [FractalType.Mandelbrot, MANDELBROT_LOCATIONS],
  [FractalType.BurningShip, BURNING_SHIP_LOCATIONS],
  [FractalType.Tricorn, TRICORN_LOCATIONS],
  [FractalType.Celtic, CELTIC_LOCATIONS],
  [FractalType.Buffalo, BUFFALO_LOCATIONS],
  [FractalType.Phoenix, PHOENIX_LOCATIONS],
  [FractalType.Multibrot3, MULTIBROT3_LOCATIONS],
  [FractalType.Multibrot4, MULTIBROT4_LOCATIONS],
  [FractalType.Funky, FUNKY_LOCATIONS],
  [FractalType.Perpendicular, PERPENDICULAR_LOCATIONS],
  [FractalType.TripleDragon, TRIPLE_DRAGON_LOCATIONS],
]);

/**
 * Get a famous location by its keyboard shortcut for the current fractal type.
 * Locations are shared between base and Julia variants of the same fractal.
 *
 * @param key The keyboard key pressed (1-9)
 * @param currentFractalType The currently selected fractal type
 * @returns The matching location, or undefined if not found
 */
export function getLocationByKey(
  key: string,
  currentFractalType: FractalType
): FamousLocation | undefined {
  // Get the base fractal type (clears the Julia bit)
  const baseType = getBaseFractalType(currentFractalType);
  const locations = LOCATIONS_BY_FRACTAL.get(baseType);

  if (!locations) return undefined;

  return locations.find((loc) => loc.key === key);
}

/**
 * Get all famous locations for a fractal type.
 * Useful for displaying available locations in UI.
 */
export function getLocationsForFractal(fractalType: FractalType): FamousLocation[] {
  const baseType = getBaseFractalType(fractalType);
  return LOCATIONS_BY_FRACTAL.get(baseType) ?? [];
}

/**
 * Get the count of locations available for the current fractal type.
 */
export function getLocationCount(fractalType: FractalType): number {
  return getLocationsForFractal(fractalType).length;
}

// Re-export individual location arrays for direct access if needed
export {
  BUFFALO_LOCATIONS,
  BURNING_SHIP_LOCATIONS,
  CELTIC_LOCATIONS,
  FUNKY_LOCATIONS,
  MANDELBROT_LOCATIONS,
  MULTIBROT3_LOCATIONS,
  MULTIBROT4_LOCATIONS,
  PERPENDICULAR_LOCATIONS,
  PHOENIX_LOCATIONS,
  TRICORN_LOCATIONS,
  TRIPLE_DRAGON_LOCATIONS,
};
