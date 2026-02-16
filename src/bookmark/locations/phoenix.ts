/**
 * Phoenix Famous Locations
 *
 * "Rising from the ashes of iteration."
 * - Skippy the Magnificent
 */

import { FractalType } from '../../types';
import { FamousLocation } from './types';
import { createLocation } from './helpers';

export const PHOENIX_LOCATIONS: FamousLocation[] = [
  createLocation(
    'Phoenix Overview',
    'The Phoenix parameter space',
    '1',
    FractalType.Phoenix,
    -0.15,
    -0.7,
    0.25, // Parameter space center (p,q swapped in shader)
    { cosinePaletteIndex: 5, colorOffset: -0.65 }
  ),
  createLocation(
    'Classic Phoenix Julia',
    'The iconic feathery Phoenix fractal',
    '2',
    FractalType.PhoenixJulia,
    0,
    0,
    0.5,
    {
      cosinePaletteIndex: 2,
      colorOffset: 0.45,
      juliaC: [-0.5, 0.5667],
      maxIterationsOverride: 1152,
    }
  ),
  createLocation(
    'Phoenix Feathers',
    'Detailed feather-like structures',
    '3',
    FractalType.PhoenixJulia,
    0.38,
    0.07,
    3.4,
    { cosinePaletteIndex: 5, juliaC: [-0.5, 0.5667] }
  ),
  createLocation(
    'Golden Weaves',
    'Bright golden patterns with intricate weaves',
    '4',
    FractalType.PhoenixJulia,
    0,
    0.08,
    0.4,
    { cosinePaletteIndex: 2, colorOffset: 0.35, juliaC: [0.656142759731905, 0.0353380147311402] }
  ),
  createLocation(
    'Fiery Phoenix',
    'Fiery wings spreading outwards',
    '5',
    FractalType.PhoenixJulia,
    0,
    -0.03,
    0.6,
    { cosinePaletteIndex: 4, colorOffset: -0.7, juliaC: [-0.272349453272398, 0.4059142585519806] }
  ),
];
