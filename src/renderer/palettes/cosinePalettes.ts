/**
 * Cosine Palettes - Cycling color palettes using cosine formula
 *
 * color = a + b * cos(2π * (c * t + d))
 *
 * "Mathematical beauty expressed in colors."
 * - Skippy the Magnificent
 */

import { CosinePalette } from './types';

export const COSINE_PALETTES: CosinePalette[] = [
  {
    name: 'Rainbow',
    isMonotonic: false,
    params: {
      type: 'cosine',
      a: [0.5, 0.5, 0.5],
      b: [0.5, 0.5, 0.5],
      c: [1.0, 1.0, 1.0],
      d: [0.0, 0.33, 0.67],
    },
  },
  {
    name: 'Fire',
    isMonotonic: false,
    params: {
      type: 'cosine',
      a: [0.5, 0.5, 0.5],
      b: [0.5, 0.5, 0.5],
      c: [1.0, 1.0, 0.5],
      d: [0.0, 0.1, 0.2],
    },
  },
  {
    name: 'Ice',
    isMonotonic: false,
    params: {
      type: 'cosine',
      a: [0.5, 0.5, 0.5],
      b: [0.5, 0.5, 0.5],
      c: [1.0, 0.7, 0.4],
      d: [0.0, 0.15, 0.2],
    },
  },
  {
    name: 'Sunset',
    isMonotonic: false,
    params: {
      type: 'cosine',
      a: [0.5, 0.3, 0.2],
      b: [0.5, 0.4, 0.3],
      c: [1.0, 1.0, 0.5],
      d: [0.0, 0.1, 0.2],
    },
  },
  {
    name: 'Electric',
    isMonotonic: false,
    params: {
      type: 'cosine',
      a: [0.5, 0.5, 0.5],
      b: [0.6, 0.6, 0.6],
      c: [1.0, 1.0, 1.0],
      d: [0.3, 0.2, 0.2],
    },
  },
  {
    name: 'Neon',
    isMonotonic: false,
    params: {
      type: 'cosine',
      a: [0.5, 0.5, 0.5],
      b: [0.5, 0.5, 0.5],
      c: [1.0, 1.0, 1.0],
      d: [0.0, 0.1, 0.2],
    },
  },
  {
    name: 'Emerald',
    isMonotonic: false,
    params: {
      type: 'cosine',
      a: [0.2, 0.5, 0.3],
      b: [0.3, 0.5, 0.3],
      c: [1.0, 1.0, 1.0],
      d: [0.0, 0.25, 0.5],
    },
  },
  {
    name: 'Candy',
    isMonotonic: false,
    params: {
      type: 'cosine',
      a: [0.8, 0.5, 0.5],
      b: [0.2, 0.4, 0.4],
      c: [1.0, 1.0, 2.0],
      d: [0.0, 0.25, 0.25],
    },
  },
  {
    name: 'Plasma',
    isMonotonic: false,
    params: {
      type: 'cosine',
      a: [0.5, 0.5, 0.5],
      b: [0.5, 0.5, 0.5],
      c: [2.0, 1.0, 0.0],
      d: [0.5, 0.2, 0.25],
    },
  },
  {
    name: 'Peacock',
    isMonotonic: false,
    params: {
      type: 'cosine',
      a: [0.3, 0.5, 0.5],
      b: [0.4, 0.4, 0.3],
      c: [1.0, 1.0, 1.0],
      d: [0.0, 0.1, 0.35],
    },
  },
  {
    name: 'Autumn',
    isMonotonic: false,
    params: {
      type: 'cosine',
      a: [0.6, 0.4, 0.2],
      b: [0.4, 0.3, 0.2],
      c: [1.0, 1.0, 1.0],
      d: [0.0, 0.05, 0.1],
    },
  },
  {
    name: 'Aurora',
    isMonotonic: false,
    params: {
      type: 'cosine',
      a: [0.3, 0.5, 0.5],
      b: [0.5, 0.5, 0.5],
      c: [1.0, 1.0, 0.5],
      d: [0.8, 0.9, 0.3],
    },
  },
];

export const COSINE_PALETTE_COUNT = COSINE_PALETTES.length;
