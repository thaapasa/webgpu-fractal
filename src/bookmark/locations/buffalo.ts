/**
 * Buffalo Famous Locations
 *
 * "The Buffalo fractal, majestic and wild."
 * - Skippy the Magnificent
 */

import { FractalType } from '../../types';
import { FamousLocation } from './types';
import { createLocation } from './helpers';

export const BUFFALO_LOCATIONS: FamousLocation[] = [
  createLocation(
    'Buffalo Overview',
    'The distinctive Buffalo fractal shape',
    '1',
    FractalType.Buffalo,
    -0.7,
    0.6,
    0.4,
    { cosinePaletteIndex: 2, colorOffset: 0.45 }
  ),
  createLocation(
    'Overgrown Cities',
    'Tree or cathedral-like structures emerging from real axis',
    '2',
    FractalType.Buffalo,
    -1.75,
    0.13,
    2.4,
    { colorOffset: 0 }
  ),
  createLocation(
    'Industrial Snowflake',
    'Snowflake-like patterns with industrial structures woven in',
    '3',
    FractalType.BuffaloJulia,
    0.45,
    0,
    0.85,
    { cosinePaletteIndex: 4, colorOffset: -0.1, juliaC: [-1.62727125821226, 0.00873720402364775] }
  ),
  createLocation(
    'Plasma Bursts',
    'Plasma-like bursts of color',
    '4',
    FractalType.BuffaloJulia,
    0,
    0,
    0.5,
    { cosinePaletteIndex: 8, colorOffset: -0.75, juliaC: [0.2745030250648227, 0.1797320656871218] }
  ),
  createLocation(
    'Intricate Patterns',
    'Intricate patterns near the bottom of the main shape',
    '5',
    FractalType.BuffaloJulia,
    0,
    0,
    0.5,
    { cosinePaletteIndex: 4, colorOffset: 0.25, juliaC: [-0.5828307625231954, -0.3049842077590671] }
  ),
  createLocation(
    'Seed Pods',
    'Spirals bursting with seeds',
    '6',
    FractalType.BuffaloJulia,
    0,
    0,
    0.6,
    {
      cosinePaletteIndex: 3,
      colorOffset: -0.75,
      juliaC: [0.3056228373702423, -0.007698961937716242],
    }
  ),
];
