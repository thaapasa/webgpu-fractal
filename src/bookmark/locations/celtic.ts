/**
 * Celtic Famous Locations
 *
 * "Celtic knotwork, mathematically generated."
 * - Skippy the Magnificent
 */

import { FractalType } from '../../types';
import { FamousLocation } from './types';
import { createLocation } from './helpers';

export const CELTIC_LOCATIONS: FamousLocation[] = [
  createLocation(
    'Celtic Knot',
    'The main Celtic fractal shape',
    '1',
    FractalType.Celtic,
    -0.5,
    0,
    0.25,
    { cosinePaletteIndex: 10, colorOffset: 0.05 }
  ),
  createLocation(
    'Celtic Detail',
    'Intricate knotwork patterns',
    '2',
    FractalType.Celtic,
    -0.7803221774980102,
    0.1635662989215261,
    120,
    { cosinePaletteIndex: 10, colorOffset: 0.25, maxIterationsOverride: 10000 }
  ),
  createLocation(
    'Leafy Spirals',
    'Symmetric shapes from the tip of the celtic shape',
    '3',
    FractalType.CelticJulia,
    0,
    0,
    0.55,
    {
      cosinePaletteIndex: 7,
      colorOffset: 0.1,
      juliaC: [0.25345198072532704, 0.0001580704105713714],
    }
  ),
  createLocation(
    'Tendrils',
    'Tendrils emerging from fog',
    '4',
    FractalType.CelticJulia,
    -0.1649932591722856,
    -0.033582161161888655,
    0.28,
    { cosinePaletteIndex: 5, juliaC: [-0.4530201342281876, -0.8993288590604025] }
  ),
  createLocation(
    'Electric Buzz',
    'Electric patterns with uniform patterned regions',
    '5',
    FractalType.CelticJulia,
    0.2,
    -0.3,
    0.55,
    { colorOffset: 0.2, juliaC: [-0.6378073937333775, 1.2082886796996293] }
  ),
  createLocation(
    'Intricate Patterns',
    'Knotwork patterns with intricate details',
    '6',
    FractalType.CelticJulia,
    0,
    0,
    0.52,
    { cosinePaletteIndex: 10, colorOffset: 0.3, juliaC: [-0.7610237673309276, 0.12050023730653406] }
  ),
  createLocation(
    'Petri Dish',
    'Bacteria-like patterns that spread outwards',
    '7',
    FractalType.CelticJulia,
    0,
    0,
    0.55,
    {
      cosinePaletteIndex: 10,
      colorOffset: 0.45,
      juliaC: [-1.056655765809614, -0.16855216053399263],
    }
  ),
];
