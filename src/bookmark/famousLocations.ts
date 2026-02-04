/**
 * Famous Fractal Locations - Curated spots of mathematical beauty
 *
 * "The greatest hits of chaos theory, now organized by fractal type. You're welcome."
 * - Skippy the Magnificent
 *
 * Locations are organized by fractal family (base type).
 * Each family shares locations between its base and Julia variants.
 * Navigate using number keys 1-9 (context-sensitive to current fractal).
 */

import { FractalType, getBaseFractalType } from '../types';
import { BookmarkState } from './BookmarkManager';

export interface FamousLocation {
  name: string;
  description: string;
  key: string; // Keyboard shortcut (1-9)
  state: BookmarkState;
}

/**
 * Default bookmark state template - reduces repetition
 */
function createLocation(
  name: string,
  description: string,
  key: string,
  fractalType: FractalType,
  centerX: number,
  centerY: number,
  zoom: number,
  options: Partial<{
    paletteType: 'cosine' | 'gradient';
    cosinePaletteIndex: number;
    gradientPaletteIndex: number;
    colorOffset: number;
    juliaC: [number, number];
    maxIterationsOverride: number | null;
  }> = {}
): FamousLocation {
  return {
    name,
    description,
    key,
    state: {
      fractalType,
      centerX,
      centerY,
      zoom,
      paletteType: options.paletteType ?? 'cosine',
      cosinePaletteIndex: options.cosinePaletteIndex ?? 1,
      gradientPaletteIndex: options.gradientPaletteIndex ?? 0,
      colorOffset: options.colorOffset ?? 0,
      juliaC: options.juliaC ?? [-0.7, 0.27015],
      maxIterationsOverride: options.maxIterationsOverride ?? null,
      aaEnabled: false,
    },
  };
}

// ============================================================================
// MANDELBROT & MANDELBROT JULIA
// ============================================================================
const MANDELBROT_LOCATIONS: FamousLocation[] = [
  createLocation(
    'Seahorse Valley',
    'The iconic seahorse-shaped spirals',
    '1',
    FractalType.Mandelbrot,
    -0.7581249305506096, 0.11244273987387937, 36.41989684959737,
    { cosinePaletteIndex: 5, colorOffset: 0.05 }
  ),
  createLocation(
    'Elephant Valley',
    'Elephant trunk-like spirals on the positive real side',
    '2',
    FractalType.Mandelbrot,
    0.2746341335933571, 0.0066936145282295205, 212.15493874953236,
    { cosinePaletteIndex: 3, colorOffset: -0.1 }
  ),
  createLocation(
    'Double Spiral Valley',
    'Beautiful double spirals deep in the set',
    '3',
    FractalType.Mandelbrot,
    -0.743733589978665, 0.130905227502858, 350,
    { cosinePaletteIndex: 5, colorOffset: 0.15000000000000002 }
  ),
  createLocation(
    'Spiral Galaxy',
    'Galactic spiral arms emerging from chaos',
    '4',
    FractalType.Mandelbrot,
    -0.7615484049386866, -0.08478444765887823, 1506.4927460380957,
    { cosinePaletteIndex: 4, colorOffset: 0.04999999999999999 }
  ),
  createLocation(
    'Douady Rabbit',
    'The famous rabbit-eared Julia set',
    '5',
    FractalType.MandelbrotJulia,
    0, 0, 0.6,
    { cosinePaletteIndex: 4, colorOffset: 0.2, juliaC: [-0.123, 0.745] }
  ),
  createLocation(
    'Dragon Julia',
    'Fierce dragon-like Julia set',
    '6',
    FractalType.MandelbrotJulia,
    0, 0, 0.45,
    { cosinePaletteIndex: 3, colorOffset: -0.49999999999999994, juliaC: [-0.8, 0.156] }
  ),
  createLocation(
    'Lightning Julia',
    'Electric, lightning-like patterns',
    '7',
    FractalType.MandelbrotJulia,
    0, 0, 0.45,
    { cosinePaletteIndex: 4, colorOffset: 0.2, juliaC: [-0.7269, 0.1889], maxIterationsOverride: 1000 }
  ),
  createLocation(
    'Spiral Julia',
    'Delicate spiral arms from the main cardioid edge',
    '8',
    FractalType.MandelbrotJulia,
    0, 0, 0.5,
    { cosinePaletteIndex: 8, colorOffset: 0.65, juliaC: [-0.75, 0.11] }
  ),
  createLocation(
    'Dendrite Julia',
    'Tree-like branching structure on the real axis',
    '9',
    FractalType.MandelbrotJulia,
    0, 0, 0.41791083585808675,
    { cosinePaletteIndex: 5, colorOffset: 0.1, juliaC: [0.285, 0.01] }
  ),
];

// ============================================================================
// BURNING SHIP & BURNING SHIP JULIA
// ============================================================================
const BURNING_SHIP_LOCATIONS: FamousLocation[] = [
  createLocation(
    'The Armada',
    'Mini ships along the antenna',
    '1',
    FractalType.BurningShip,
    -1.80173025652805, 0.0153452534367207, 9,
    { cosinePaletteIndex: 4, colorOffset: 0.2 }
  ),
  createLocation(
    'Main Ship',
    'The iconic burning ship silhouette',
    '2',
    FractalType.BurningShip,
    -0.6819541375872399, 0.5906040268456356, 0.4,
    { cosinePaletteIndex: 4, colorOffset: 0.3 }
  ),
  createLocation(
    'Bow Detail',
    'Intricate patterns at the ship\'s bow',
    '3',
    FractalType.BurningShip,
    -1.7500929615866607, 0.0368035491770765, 10,
    { cosinePaletteIndex: 10, colorOffset: 0.1 }
  ),
  createLocation(
      'Bacteria Worm',
      'Worm-like structures with mosaic patterns',
      '4',
      FractalType.BurningShipJulia,
      0, 0, 0.3,
      { cosinePaletteIndex: 10, colorOffset: -0.5499999999999998, juliaC: [0.5179709888623353, 0.8057669844188748] }
  ),
  createLocation(
    'Wispy Coils',
    'Wispy coils near the bulbous extrusion from the ship',
    '5',
    FractalType.BurningShipJulia,
    0, 0, 0.4,
    { cosinePaletteIndex: 4, colorOffset: 0.35, juliaC: [0.2525994076160102, 0.0006358222328731386] }
  ),
  createLocation(
    'Space Brain',
    'Brain-like structures from the bottom of the ship',
    '6',
    FractalType.BurningShipJulia,
    0, 0, 0.7,
    { cosinePaletteIndex: 5, colorOffset: 0.3, juliaC: [-1.059944784917394, -0.033218825489255054] }
  ),
  createLocation(
    'Spiral Patterns',
    'Spiral patterns near the bulbous extrusion',
    '7',
    FractalType.BurningShipJulia,
    0, 0, 0.41,
    { cosinePaletteIndex: 11, colorOffset: 0.55, juliaC: [0.28292507376881926, -0.007597008191683113] }
  ),
];

// ============================================================================
// TRICORN (MANDELBAR)
// ============================================================================
const TRICORN_LOCATIONS: FamousLocation[] = [
  createLocation(
    'Tricorn Overview',
    'The three-cornered Mandelbar fractal',
    '1',
    FractalType.Tricorn,
    -0.3, 0, 0.4,
    { cosinePaletteIndex: 5, colorOffset: 0 }
  ),
  createLocation(
    'Tricorn Cusp',
    'Intricate detail at one of the three cusps',
    '2',
    FractalType.Tricorn,
    -1.0, 0, 2,
    { cosinePaletteIndex: 4, colorOffset: 0.1 }
  ),
  // Tricorn Julia
  createLocation(
    'Tricorn Julia',
    'A Julia set from the Tricorn',
    '3',
    FractalType.TricornJulia,
    0, 0, 0.5,
    { cosinePaletteIndex: 6, colorOffset: 0, juliaC: [-0.3, 0.5] }
  ),
];

// ============================================================================
// CELTIC
// ============================================================================
const CELTIC_LOCATIONS: FamousLocation[] = [
  createLocation(
    'Celtic Knot',
    'The main Celtic fractal shape',
    '1',
    FractalType.Celtic,
    -0.5, 0, 0.4,
    { cosinePaletteIndex: 6, colorOffset: 0 }
  ),
  createLocation(
    'Celtic Detail',
    'Intricate knotwork patterns',
    '2',
    FractalType.Celtic,
    -0.75, 0.1, 5,
    { cosinePaletteIndex: 4, colorOffset: 0.15 }
  ),
  createLocation(
    'Celtic Julia',
    'A Julia set from the Celtic fractal',
    '3',
    FractalType.CelticJulia,
    0, 0, 0.5,
    { cosinePaletteIndex: 0, colorOffset: 0, juliaC: [-0.7, 0.27] }
  ),
];

// ============================================================================
// BUFFALO
// ============================================================================
const BUFFALO_LOCATIONS: FamousLocation[] = [
  createLocation(
    'Buffalo Overview',
    'The distinctive Buffalo fractal shape',
    '1',
    FractalType.Buffalo,
    -0.5, 0, 0.4,
    { cosinePaletteIndex: 3, colorOffset: 0 }
  ),
  createLocation(
    'Buffalo Horns',
    'Curved horn-like structures',
    '2',
    FractalType.Buffalo,
    -1.0, 0.5, 3,
    { cosinePaletteIndex: 1, colorOffset: 0.2 }
  ),
  createLocation(
    'Buffalo Julia',
    'A Julia set from the Buffalo fractal',
    '3',
    FractalType.BuffaloJulia,
    0, 0, 0.5,
    { cosinePaletteIndex: 4, colorOffset: 0, juliaC: [-0.5, 0.5] }
  ),
];

// ============================================================================
// PHOENIX
// ============================================================================
const PHOENIX_LOCATIONS: FamousLocation[] = [
  createLocation(
    'Phoenix Overview',
    'The Phoenix parameter space',
    '1',
    FractalType.Phoenix,
    0, 0, 0.4,
    { cosinePaletteIndex: 1, colorOffset: 0 }
  ),
  createLocation(
    'Classic Phoenix Julia',
    'The iconic feathery Phoenix fractal',
    '2',
    FractalType.PhoenixJulia,
    0, 0, 0.5,
    { cosinePaletteIndex: 1, colorOffset: 0.2, juliaC: [0.5667, -0.5] }
  ),
  createLocation(
    'Phoenix Feathers',
    'Detailed feather-like structures',
    '3',
    FractalType.PhoenixJulia,
    0.2, 0.3, 2,
    { cosinePaletteIndex: 3, colorOffset: 0.1, juliaC: [0.5667, -0.5] }
  ),
];

// ============================================================================
// MULTIBROT3 (z³ + c)
// ============================================================================
const MULTIBROT3_LOCATIONS: FamousLocation[] = [
  createLocation(
    'Multibrot³ Overview',
    'The three-fold symmetric z³ Multibrot',
    '1',
    FractalType.Multibrot3,
    0, 0, 0.4,
    { cosinePaletteIndex: 4, colorOffset: 0 }
  ),
  createLocation(
    'Triple Spiral',
    'Three-way symmetry in the boundary',
    '2',
    FractalType.Multibrot3,
    0.5, 0.3, 5,
    { cosinePaletteIndex: 0, colorOffset: 0.1 }
  ),
  createLocation(
    'Multibrot³ Julia',
    'A Julia set with three-fold symmetry',
    '3',
    FractalType.Multibrot3Julia,
    0, 0, 0.5,
    { cosinePaletteIndex: 2, colorOffset: 0, juliaC: [0.4, 0.2] }
  ),
];

// ============================================================================
// MULTIBROT4 (z⁴ + c)
// ============================================================================
const MULTIBROT4_LOCATIONS: FamousLocation[] = [
  createLocation(
    'Multibrot⁴ Overview',
    'The four-fold symmetric z⁴ Multibrot',
    '1',
    FractalType.Multibrot4,
    0, 0, 0.4,
    { cosinePaletteIndex: 5, colorOffset: 0 }
  ),
  createLocation(
    'Quad Symmetry',
    'Four-way symmetric boundary details',
    '2',
    FractalType.Multibrot4,
    0.4, 0.4, 8,
    { cosinePaletteIndex: 4, colorOffset: 0.15 }
  ),
  createLocation(
    'Multibrot⁴ Julia',
    'A Julia set with four-fold symmetry',
    '3',
    FractalType.Multibrot4Julia,
    0, 0, 0.5,
    { cosinePaletteIndex: 0, colorOffset: 0, juliaC: [0.5, 0] }
  ),
];

// ============================================================================
// FUNKY (your happy accident!)
// ============================================================================
const FUNKY_LOCATIONS: FamousLocation[] = [
  createLocation(
    'Funky Overview',
    'The wonderfully weird Funky fractal',
    '1',
    FractalType.Funky,
    -0.5, 0, 0.4,
    { cosinePaletteIndex: 0, colorOffset: 0 }
  ),
  createLocation(
    'Funky Detail',
    'Asymmetric chaos patterns',
    '2',
    FractalType.Funky,
    -0.75, 0.15, 10,
    { cosinePaletteIndex: 4, colorOffset: 0.2 }
  ),
  createLocation(
    'Funky Julia',
    'A Julia set from the Funky fractal',
    '3',
    FractalType.FunkyJulia,
    0, 0, 0.5,
    { cosinePaletteIndex: 3, colorOffset: 0, juliaC: [-0.7, 0.27] }
  ),
];

// ============================================================================
// PERPENDICULAR
// ============================================================================
const PERPENDICULAR_LOCATIONS: FamousLocation[] = [
  createLocation(
    'Perpendicular Overview',
    'The Perpendicular Mandelbrot variant',
    '1',
    FractalType.Perpendicular,
    -0.5, 0, 0.4,
    { cosinePaletteIndex: 2, colorOffset: 0 }
  ),
  createLocation(
    'Perpendicular Spirals',
    'Unique spiral formations',
    '2',
    FractalType.Perpendicular,
    -0.75, 0.1, 8,
    { cosinePaletteIndex: 4, colorOffset: 0.1 }
  ),
  createLocation(
    'Perpendicular Julia',
    'A Julia set from the Perpendicular fractal',
    '3',
    FractalType.PerpendicularJulia,
    0, 0, 0.5,
    { cosinePaletteIndex: 0, colorOffset: 0, juliaC: [-0.5, 0.5] }
  ),
];

// ============================================================================
// LOCATION MAP BY BASE FRACTAL TYPE
// ============================================================================

/**
 * Map from base fractal type (even numbers) to their famous locations.
 * Both base and Julia variants of a fractal share the same location list.
 */
const LOCATIONS_BY_FRACTAL: Map<FractalType, FamousLocation[]> = new Map([
  [FractalType.Mandelbrot, MANDELBROT_LOCATIONS],
  [FractalType.BurningShip, BURNING_SHIP_LOCATIONS],
  [FractalType.Tricorn, TRICORN_LOCATIONS],
  [FractalType.Celtic, CELTIC_LOCATIONS],
  [FractalType.Buffalo, BUFFALO_LOCATIONS],
  [FractalType.Phoenix, PHOENIX_LOCATIONS],
  [FractalType.Multibrot3, MULTIBROT3_LOCATIONS],
  [FractalType.Multibrot4, MULTIBROT4_LOCATIONS],
  [FractalType.Funky, FUNKY_LOCATIONS],
  [FractalType.Perpendicular, PERPENDICULAR_LOCATIONS],
]);

/**
 * Get a famous location by its keyboard shortcut for the current fractal type.
 * Locations are shared between base and Julia variants of the same fractal.
 *
 * @param key The keyboard key pressed (1-9)
 * @param currentFractalType The currently selected fractal type
 * @returns The matching location, or undefined if not found
 */
export function getLocationByKey(key: string, currentFractalType: FractalType): FamousLocation | undefined {
  // Get the base fractal type (clears the Julia bit)
  const baseType = getBaseFractalType(currentFractalType);
  const locations = LOCATIONS_BY_FRACTAL.get(baseType);

  if (!locations) return undefined;

  return locations.find(loc => loc.key === key);
}

/**
 * Get all famous locations for a fractal type.
 * Useful for displaying available locations in UI.
 */
export function getLocationsForFractal(fractalType: FractalType): FamousLocation[] {
  const baseType = getBaseFractalType(fractalType);
  return LOCATIONS_BY_FRACTAL.get(baseType) ?? [];
}

/**
 * Get the count of locations available for the current fractal type.
 */
export function getLocationCount(fractalType: FractalType): number {
  return getLocationsForFractal(fractalType).length;
}
