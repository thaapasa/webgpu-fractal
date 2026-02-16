/**
 * Tricorn (Mandelbar) Famous Locations
 *
 * "Three-cornered chaos at its finest."
 * - Skippy the Magnificent
 */

import { FractalType } from '../../types';
import { FamousLocation } from './types';
import { createLocation } from './helpers';

export const TRICORN_LOCATIONS: FamousLocation[] = [
  createLocation(
    'Tricorn',
    'The main tricorn shape with its distinctive three-cornered symmetry',
    '1',
    FractalType.Tricorn,
    -0.1343398614022916,
    -0.07051105375213641,
    0.24,
    { cosinePaletteIndex: 11, colorOffset: -0.45 }
  ),
  createLocation(
    'Skewed Mandelbrot',
    'Skewed Mandelbrot from one of the main bulbs',
    '2',
    FractalType.Tricorn,
    -1.0683098234816064,
    0.13055543771605108,
    722.5553792774821,
    { cosinePaletteIndex: 5, colorOffset: 0.1 }
  ),
  createLocation(
    'Lightning Bolts',
    'Lightning bolt-like patterns near the main cardioid edge',
    '3',
    FractalType.TricornJulia,
    0,
    0,
    0.5,
    { cosinePaletteIndex: 5, colorOffset: 0.2, juliaC: [-0.7092474160797806, -0.113024316756254] }
  ),
  createLocation(
    'Water Lily Leaf',
    'Leaf-like structures from the center of the edge of the main cardioid',
    '4',
    FractalType.TricornJulia,
    0,
    0,
    0.43,
    { colorOffset: -0.7, juliaC: [-0.1254330794660274, 0.2407433439223678] }
  ),
  createLocation(
    'Lightning Brain',
    'Brain-like structures',
    '5',
    FractalType.TricornJulia,
    0,
    0,
    3.15,
    { cosinePaletteIndex: 5, juliaC: [0.8748878776979363, -1.515483485507111] }
  ),
  createLocation(
    'Spiral Mosaic',
    'Mosaic patterns from the base of one of the main bulbs',
    '6',
    FractalType.TricornJulia,
    0,
    0,
    0.5,
    {
      cosinePaletteIndex: 11,
      colorOffset: 0.55,
      juliaC: [-0.5647012802389192, -0.06508603367125808],
    }
  ),
  createLocation(
    'Electric Tendrils',
    'Electric tendril patterns with bright highlights',
    '7',
    FractalType.TricornJulia,
    0,
    0,
    0.5,
    { cosinePaletteIndex: 4, colorOffset: 0.05, juliaC: [-0.511125124692869, 0.0500484416152959] }
  ),
];
