/**
 * Mandelbrot Famous Locations
 *
 * "The original, the classic, the Mandelbrot."
 * - Skippy the Magnificent
 */

import { FractalType } from '../../types';
import { FamousLocation } from './types';
import { createLocation } from './helpers';

export const MANDELBROT_LOCATIONS: FamousLocation[] = [
  createLocation(
    'Mandelbrot',
    'The famous Mandelbrot set',
    '1',
    FractalType.Mandelbrot,
    -0.5,
    0,
    0.4
  ),
  createLocation(
    'Seahorse Valley',
    'The iconic seahorse-shaped spirals',
    '2',
    FractalType.Mandelbrot,
    -0.7581249305506096,
    0.11244273987387937,
    36.41989684959737,
    { cosinePaletteIndex: 5, colorOffset: 0.05 }
  ),
  createLocation(
    'Elephant Valley',
    'Elephant trunk-like spirals on the positive real side',
    '3',
    FractalType.Mandelbrot,
    0.2746341335933571,
    0.0066936145282295205,
    212.15493874953236,
    { cosinePaletteIndex: 3, colorOffset: -0.1 }
  ),
  createLocation(
    'Double Spiral Valley',
    'Beautiful double spirals deep in the set',
    '4',
    FractalType.Mandelbrot,
    -0.743733589978665,
    0.130905227502858,
    350,
    { cosinePaletteIndex: 5, colorOffset: 0.15 }
  ),
  createLocation(
    'Spiral Galaxy',
    'Galactic spiral arms emerging from chaos',
    '5',
    FractalType.Mandelbrot,
    -0.7615484049386866,
    -0.08478444765887823,
    1506.4927460380957,
    { cosinePaletteIndex: 4, colorOffset: 0.05 }
  ),
  createLocation(
    'Douady Rabbit',
    'The famous rabbit-eared Julia set',
    '6',
    FractalType.MandelbrotJulia,
    0,
    0,
    0.6,
    { cosinePaletteIndex: 4, colorOffset: 0.2, juliaC: [-0.123, 0.745] }
  ),
  createLocation(
    'Dragon Julia',
    'Fierce dragon-like Julia set',
    '7',
    FractalType.MandelbrotJulia,
    0,
    0,
    0.45,
    { cosinePaletteIndex: 3, colorOffset: -0.5, juliaC: [-0.8, 0.156] }
  ),
  createLocation(
    'Spiral Julia',
    'Delicate spiral arms from the main cardioid edge',
    '8',
    FractalType.MandelbrotJulia,
    0,
    0,
    0.5,
    { cosinePaletteIndex: 8, colorOffset: 0.65, juliaC: [-0.75, 0.11] }
  ),
  createLocation(
    'Dendrite Julia',
    'Tree-like branching structure on the real axis',
    '9',
    FractalType.MandelbrotJulia,
    0,
    0,
    0.41791083585808675,
    { cosinePaletteIndex: 5, colorOffset: 0.1, juliaC: [0.285, 0.01] }
  ),
];
