/**
 * Funky Famous Locations
 *
 * "The happy accident that became a feature."
 * - Skippy the Magnificent
 */

import { FractalType } from '../../types';
import { FamousLocation } from './types';
import { createLocation } from './helpers';

export const FUNKY_LOCATIONS: FamousLocation[] = [
  createLocation(
    'Funky Overview',
    'The wonderfully weird Funky fractal',
    '1',
    FractalType.Funky,
    -0.5,
    0,
    0.35,
    { cosinePaletteIndex: 4, colorOffset: 0.25 }
  ),
  createLocation(
    'Tulip Bulb',
    'Extrusions resembling tulips near the top of the main shape',
    '2',
    FractalType.Funky,
    0.303,
    0.534,
    6.3,
    { cosinePaletteIndex: 10 }
  ),
  createLocation(
    'Battleship',
    'Spaceship-like structure with double turrets all around',
    '3',
    FractalType.FunkyJulia,
    0,
    0,
    0.45,
    { cosinePaletteIndex: 4, colorOffset: -0.7, juliaC: [-1.02568231965141, 0.128286053018475] }
  ),
  createLocation(
    'Frog Crab',
    'Crablike structure with brain-like spiral patterns within it',
    '4',
    FractalType.FunkyJulia,
    0,
    0,
    0.37,
    { colorOffset: 0.1, juliaC: [0.30191025227457674, 0.5253550579235958] }
  ),
  createLocation(
    'Spiral Details',
    'Beautiful spiral details without too much clutter',
    '5',
    FractalType.FunkyJulia,
    -0.2,
    0,
    0.4,
    { cosinePaletteIndex: 5, colorOffset: 0.6, juliaC: [-0.06404194046216194, 0.662960137583706] }
  ),
  createLocation(
    'Migrating Birds',
    'Bird-like shapes flying in formation',
    '6',
    FractalType.FunkyJulia,
    0.34,
    0,
    0.35,
    { cosinePaletteIndex: 5, colorOffset: 0.4, juliaC: [0.5804003550040334, -0.9094296635818582] }
  ),
  createLocation(
    'Glittering Coral',
    'Brightly gleaming coral-like structures',
    '7',
    FractalType.FunkyJulia,
    0,
    0,
    0.5,
    {
      cosinePaletteIndex: 11,
      colorOffset: -0.4,
      juliaC: [-0.45427582797825017, -0.06920415224913506],
    }
  ),
];
