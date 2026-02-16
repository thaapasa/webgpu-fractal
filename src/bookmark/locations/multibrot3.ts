/**
 * Multibrot³ Famous Locations (z³ + c)
 *
 * "Three-fold symmetry, thrice the beauty."
 * - Skippy the Magnificent
 */

import { FractalType } from '../../types';
import { FamousLocation } from './types';
import { createLocation } from './helpers';

export const MULTIBROT3_LOCATIONS: FamousLocation[] = [
  createLocation(
    'Multibrot³ Overview',
    'The three-fold symmetric z³ Multibrot',
    '1',
    FractalType.Multibrot3,
    0,
    0,
    0.35,
    { cosinePaletteIndex: 5, colorOffset: 0.35 }
  ),
  createLocation(
    'The Bulb',
    'A bulbous extrusion from the main shape',
    '2',
    FractalType.Multibrot3,
    0.5852686308492299,
    0.27,
    6,
    { colorOffset: 0.1 }
  ),
  createLocation(
    'Three-fold Spirals',
    'Bright pearly spirals with three-fold symmetry',
    '3',
    FractalType.Multibrot3Julia,
    0,
    0,
    0.4,
    { cosinePaletteIndex: 10, colorOffset: 0.15, juliaC: [0.5448826747676219, 0.26362559338015445] }
  ),
  createLocation(
    'Multibrot³ Julia',
    'A Julia set with three-fold symmetry',
    '4',
    FractalType.Multibrot3Julia,
    0,
    0,
    0.434,
    { cosinePaletteIndex: 5, colorOffset: 0.1, juliaC: [-0.45963436785036077, 0.03389484474578987] }
  ),
  createLocation(
    'Double Elephant Valley',
    'Two elephants in each group',
    '5',
    FractalType.Multibrot3,
    0.42814685603247177,
    0.01274807156960129577,
    77,
    { cosinePaletteIndex: 3, colorOffset: 0 }
  ),
  createLocation(
    'Wonky Spiral',
    'Wonky spiral Julia structure from inside the main set',
    '6',
    FractalType.Multibrot3Julia,
    0.3695408370900379,
    0.3371264555793177,
    2.274691481464049,
    {
      cosinePaletteIndex: 0,
      colorOffset: 0,
      juliaC: [0.5277614770068884, 0.15853942850341446],
      maxIterationsOverride: 2124,
    }
  ),
  createLocation(
    'Spiral Galaxies',
    'The wonky spiral Julia structure viewed as galaxies',
    '7',
    FractalType.Multibrot3Julia,
    0,
    0,
    0.4,
    {
      paletteType: 'gradient',
      juliaC: [0.5277614770068884, 0.15853942850341446],
      maxIterationsOverride: 1152,
    }
  ),
];
