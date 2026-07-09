/**
 * Triple Dragon Famous Locations
 *
 * z_{n+1} = z³ / (z³ + 1) + c  — Paul Bourke's rational-map dragon.
 *
 * Rendered Julia-style (z₀ = pixel). The Julia set is 3-fold symmetric for any
 * c (since f(ωz) = f(z)). The base type is the canonical c = 0 view: 3-fold
 * Fatou dust. The connected dragons live in the Julia variant, which sweeps c.
 *
 * "A dragon that folds in on itself three times. I approve of the drama."
 * - Skippy the Magnificent
 */

import { FractalType } from '../../types';
import { FamousLocation } from './types';
import { createLocation } from './helpers';

export const TRIPLE_DRAGON_LOCATIONS: FamousLocation[] = [
  createLocation(
    'Triple Dragon Parameter Space',
    'The canonical c = 0 view — three-fold symmetric Fatou dust',
    '1',
    FractalType.TripleDragon,
    0,
    0,
    0.5,
    { colorOffset: 0.15, maxIterationsOverride: 850 }
  ),
  createLocation(
    'Dragon Overview',
    'The three-fold symmetric connected dragon',
    '2',
    FractalType.TripleDragonJulia,
    0,
    0,
    0.5,
    {
      cosinePaletteIndex: 5,
      colorOffset: 0,
      juliaC: [0.47596153846153855, -0.21538461538461529],
      maxIterationsOverride: 850,
    }
  ),
  createLocation(
    'Spiraly Dragon',
    'Thin spiral patterns',
    '3',
    FractalType.TripleDragonJulia,
    0,
    0,
    0.5,
    {
      cosinePaletteIndex: 4,
      colorOffset: 0.6,
      juliaC: [0.3956524214054766, -0.4780295616453324],
      maxIterationsOverride: 1100,
    }
  ),
  createLocation(
    'Bacteria Blot',
    'Connected area with bright edges',
    '4',
    FractalType.TripleDragonJulia,
    0,
    0,
    0.5,
    {
      cosinePaletteIndex: 2,
      colorOffset: -0.1,
      juliaC: [0.407784986098239, -0.408711770157553],
      maxIterationsOverride: 768,
    }
  ),
];
