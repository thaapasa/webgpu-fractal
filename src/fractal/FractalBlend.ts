/**
 * Fractal Blend Parameters - Enables smooth interpolation between fractal types
 *
 * "Type safety AND mathematical elegance? You're welcome."
 * - Skippy the Magnificent
 */

import { FractalType, isJuliaType } from '../types';

/**
 * Parameters for blending between fractal types.
 * All values range from 0 to 1.
 */
export interface FractalBlendParams {
  /** Julia blend: 0 = Mandelbrot-style (z=0, c=pos), 1 = Julia-style (z=pos, c=juliaC) */
  juliaBlend: number;
  /** Apply abs to Re(z) before squaring (Burning Ship, Perpendicular) */
  preAbsRe: number;
  /** Apply abs to Im(z) before squaring (Burning Ship, Funky) */
  preAbsIm: number;
  /** Negate Im(z) after abs (Burning Ship orientation) */
  preNegIm: number;
  /** Apply abs to Re(z²) after squaring (Celtic, Buffalo) */
  postAbsRe: number;
  /** Apply abs to Im(z²) after squaring (Buffalo) */
  postAbsIm: number;
  /** Negate Im(z²) (Tricorn, Buffalo, Perpendicular) */
  postNegIm: number;
}

/**
 * Base fractal types that can be blended (z² family).
 * Phoenix, Multibrot3, Multibrot4 are NOT blendable.
 */
const BLENDABLE_BASE_TYPES = new Set([0, 1, 2, 3, 4, 8, 9]); // Mandelbrot, BurningShip, Tricorn, Celtic, Buffalo, Funky, Perpendicular

/**
 * Check if a fractal type supports smooth blending.
 */
export function isBlendable(fractalType: FractalType): boolean {
  const baseType = fractalType >> 1;
  return BLENDABLE_BASE_TYPES.has(baseType);
}

/**
 * Get the blend parameters for a specific fractal type.
 * Returns null for non-blendable types (Phoenix, Multibrot3/4).
 */
export function getFractalBlendParams(fractalType: FractalType): FractalBlendParams | null {
  const isJulia = isJuliaType(fractalType);
  const baseType = fractalType >> 1;

  // Base formula params (same for Mandelbrot and Julia variants)
  let params: FractalBlendParams;

  switch (baseType) {
    case 0: // Mandelbrot
      params = {
        juliaBlend: 0,
        preAbsRe: 0,
        preAbsIm: 0,
        preNegIm: 0,
        postAbsRe: 0,
        postAbsIm: 0,
        postNegIm: 0,
      };
      break;
    case 1: // Burning Ship
      params = {
        juliaBlend: 0,
        preAbsRe: 1,
        preAbsIm: 1,
        preNegIm: 1,
        postAbsRe: 0,
        postAbsIm: 0,
        postNegIm: 0,
      };
      break;
    case 2: // Tricorn
      params = {
        juliaBlend: 0,
        preAbsRe: 0,
        preAbsIm: 0,
        preNegIm: 0,
        postAbsRe: 0,
        postAbsIm: 0,
        postNegIm: 1,
      };
      break;
    case 3: // Celtic
      params = {
        juliaBlend: 0,
        preAbsRe: 0,
        preAbsIm: 0,
        preNegIm: 0,
        postAbsRe: 1,
        postAbsIm: 0,
        postNegIm: 0,
      };
      break;
    case 4: // Buffalo
      params = {
        juliaBlend: 0,
        preAbsRe: 0,
        preAbsIm: 0,
        preNegIm: 0,
        postAbsRe: 1,
        postAbsIm: 1,
        postNegIm: 1,
      };
      break;
    case 5: // Phoenix - NOT BLENDABLE (has memory term)
      return null;
    case 6: // Multibrot3 - NOT BLENDABLE (z³)
      return null;
    case 7: // Multibrot4 - NOT BLENDABLE (z⁴)
      return null;
    case 8: // Funky
      params = {
        juliaBlend: 0,
        preAbsRe: 0,
        preAbsIm: 1,
        preNegIm: 0,
        postAbsRe: 0,
        postAbsIm: 0,
        postNegIm: 0,
      };
      break;
    case 9: // Perpendicular
      params = {
        juliaBlend: 0,
        preAbsRe: 1,
        preAbsIm: 0,
        preNegIm: 0,
        postAbsRe: 0,
        postAbsIm: 0,
        postNegIm: 1,
      };
      break;
    default:
      return null;
  }

  // Set juliaBlend based on whether this is a Julia variant
  params.juliaBlend = isJulia ? 1 : 0;
  return params;
}

/**
 * Linear interpolation
 */
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Interpolate between two blend parameter sets.
 */
export function interpolateBlendParams(
  from: FractalBlendParams,
  to: FractalBlendParams,
  t: number
): FractalBlendParams {
  return {
    juliaBlend: lerp(from.juliaBlend, to.juliaBlend, t),
    preAbsRe: lerp(from.preAbsRe, to.preAbsRe, t),
    preAbsIm: lerp(from.preAbsIm, to.preAbsIm, t),
    preNegIm: lerp(from.preNegIm, to.preNegIm, t),
    postAbsRe: lerp(from.postAbsRe, to.postAbsRe, t),
    postAbsIm: lerp(from.postAbsIm, to.postAbsIm, t),
    postNegIm: lerp(from.postNegIm, to.postNegIm, t),
  };
}

/**
 * Default blend params (Mandelbrot, no blending)
 */
export const DEFAULT_BLEND_PARAMS: FractalBlendParams = {
  juliaBlend: 0,
  preAbsRe: 0,
  preAbsIm: 0,
  preNegIm: 0,
  postAbsRe: 0,
  postAbsIm: 0,
  postNegIm: 0,
};

/**
 * Check if two fractal types can be smoothly blended between.
 */
export function canBlendBetween(from: FractalType, to: FractalType): boolean {
  return isBlendable(from) && isBlendable(to);
}
