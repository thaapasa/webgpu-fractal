/**
 * Burning Ship Famous Locations
 *
 * "Ships ablaze on the fractal seas."
 * - Skippy the Magnificent
 */

import { FractalType } from '../../types';
import { FamousLocation } from './types';
import { createLocation } from './helpers';

export const BURNING_SHIP_LOCATIONS: FamousLocation[] = [
  createLocation(
    'Main Ship',
    'The iconic burning ship silhouette',
    '1',
    FractalType.BurningShip,
    -0.6819541375872399,
    0.5906040268456356,
    0.4,
    { cosinePaletteIndex: 4, colorOffset: 0.3 }
  ),
  createLocation(
    'The Armada',
    'Mini ships along the antenna',
    '2',
    FractalType.BurningShip,
    -1.80173025652805,
    0.0153452534367207,
    9,
    { cosinePaletteIndex: 4, colorOffset: 0.2 }
  ),
  createLocation(
    'Bow Detail',
    "Intricate patterns at the ship's bow",
    '3',
    FractalType.BurningShip,
    -1.7500929615866607,
    0.0368035491770765,
    10,
    { cosinePaletteIndex: 10, colorOffset: 0.1 }
  ),
  createLocation(
    'Bacteria Worm',
    'Worm-like structures with mosaic patterns',
    '4',
    FractalType.BurningShipJulia,
    0,
    0,
    0.3,
    { cosinePaletteIndex: 10, colorOffset: -0.55, juliaC: [0.5179709888623353, 0.8057669844188748] }
  ),
  createLocation(
    'Wispy Coils',
    'Wispy coils near the bulbous extrusion from the ship',
    '5',
    FractalType.BurningShipJulia,
    0,
    0,
    0.4,
    {
      cosinePaletteIndex: 4,
      colorOffset: 0.35,
      juliaC: [0.2525994076160102, 0.0006358222328731386],
    }
  ),
  createLocation(
    'Space Brain',
    'Brain-like structures from the bottom of the ship',
    '6',
    FractalType.BurningShipJulia,
    0,
    0,
    0.7,
    { cosinePaletteIndex: 5, colorOffset: 0.3, juliaC: [-1.059944784917394, -0.033218825489255054] }
  ),
  createLocation(
    'Spiral Patterns',
    'Spiral patterns near the bulbous extrusion',
    '7',
    FractalType.BurningShipJulia,
    0,
    0,
    0.41,
    {
      cosinePaletteIndex: 11,
      colorOffset: 0.55,
      juliaC: [0.28292507376881926, -0.007597008191683113],
    }
  ),
  createLocation(
    'Detailed Patterns',
    'Beautiful detailed patterns near the bottom of the ship',
    '8',
    FractalType.BurningShipJulia,
    0,
    0,
    0.5,
    { cosinePaletteIndex: 2, colorOffset: 0.6, juliaC: [-0.3967192382583807, -0.09102348993288789] }
  ),
];
