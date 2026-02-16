/**
 * Multibrot⁴ Famous Locations (z⁴ + c)
 *
 * "Four-fold symmetry, four times the fun."
 * - Skippy the Magnificent
 */

import { FractalType } from '../../types';
import { FamousLocation } from './types';
import { createLocation } from './helpers';

export const MULTIBROT4_LOCATIONS: FamousLocation[] = [
  createLocation(
    'Multibrot⁴ Overview',
    'The four-fold symmetric z⁴ Multibrot',
    '1',
    FractalType.Multibrot4,
    0,
    0,
    0.4,
    { cosinePaletteIndex: 5, colorOffset: 0 }
  ),
  createLocation(
    'Atomic Spirals',
    'Structures resembling atomic orbitals with spiral patterns',
    '2',
    FractalType.Multibrot4Julia,
    0,
    -0,
    0.35,
    { cosinePaletteIndex: 5, colorOffset: 0.4, juliaC: [-0.7878865573262246, 0.02073442187254452] }
  ),
  createLocation(
    'Triple Elephant Valley',
    "Now there's three elephants in each group!",
    '3',
    FractalType.Multibrot4,
    -0.2726362830546699,
    0.44295218397589975,
    42,
    { cosinePaletteIndex: 3 }
  ),
  createLocation(
    'Starscape',
    'Spiraling galaxies surrounding a black hole',
    '4',
    FractalType.Multibrot4Julia,
    0,
    0,
    0.5,
    {
      paletteType: 'gradient',
      juliaC: [0.634977850702787, 0.194816172925824],
      maxIterationsOverride: 1152,
    }
  ),
  createLocation(
    'Static Burst',
    'Burst of electricity',
    '5',
    FractalType.Multibrot4Julia,
    0,
    0,
    0.4,
    { colorOffset: -0.75, juliaC: [-0.6179887054490777, 0.487166930716755] }
  ),
];
