/**
 * Perpendicular Famous Locations
 *
 * "Perpendicular to reality."
 * - Skippy the Magnificent
 */

import { FractalType } from '../../types';
import { FamousLocation } from './types';
import { createLocation } from './helpers';

export const PERPENDICULAR_LOCATIONS: FamousLocation[] = [
  createLocation(
    'Perpendicular Overview',
    'The Perpendicular Mandelbrot variant',
    '1',
    FractalType.Perpendicular,
    -0.5,
    0,
    0.32,
    { cosinePaletteIndex: 2, colorOffset: 0 }
  ),
  createLocation(
    'Seed Pod',
    'A pod-like structure near the head of the main shape',
    '2',
    FractalType.Perpendicular,
    -0.7734996631118647,
    0.12393043736115505,
    250,
    { cosinePaletteIndex: 5 }
  ),
  createLocation(
    'Bird of Prey',
    'Waveform bird flying out to get you',
    '3',
    FractalType.PerpendicularJulia,
    0,
    0,
    0.35,
    {
      cosinePaletteIndex: 4,
      colorOffset: 0.15,
      juliaC: [-1.2870593206662457, 0.022288689289989876],
    }
  ),
  createLocation(
    'Old Dragon',
    'Bird-like shape with leathery frayed wings',
    '4',
    FractalType.PerpendicularJulia,
    0,
    0,
    0.3913248754208607,
    {
      cosinePaletteIndex: 5,
      colorOffset: 0.45,
      juliaC: [-1.0197782349577895, -0.13982096184940793],
    }
  ),
  createLocation(
    'Peacock Eyes',
    'Glowing eyes of a brightly coloured peacock',
    '5',
    FractalType.PerpendicularJulia,
    0,
    -0.8821542839734092,
    2.8,
    { cosinePaletteIndex: 11, juliaC: [0.25987719401314263, -0.17615047146201984] }
  ),
  createLocation(
    'Mask of the Ancients',
    'A detailed mask with intricate patterns',
    '6',
    FractalType.PerpendicularJulia,
    0,
    0,
    0.42,
    { cosinePaletteIndex: 2, colorOffset: -0.1, juliaC: [0.3021983882651174, 0.4025604479726435] }
  ),
];
