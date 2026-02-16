/**
 * Gradient Palettes - Monotonic color palettes with 5 stops
 *
 * Linear interpolation between color stops, with optional HDR variants.
 *
 * "Gradients done right, with HDR support."
 * - Skippy the Magnificent
 */

import { GradientPalette } from './types';

export const GRADIENT_PALETTES: GradientPalette[] = [
  {
    name: 'Blue',
    isMonotonic: true,
    params: {
      type: 'gradient',
      c1: [0.02, 0.01, 0.08],
      c2: [0.05, 0.15, 0.25],
      c3: [0.1, 0.4, 0.5],
      c4: [0.3, 0.6, 0.8],
      c5: [0.7, 0.9, 1.0],
    },
    hdrParams: {
      type: 'gradient',
      c1: [0.2, 0.4, 1.0],
      c2: [0.3, 0.6, 1.0],
      c3: [0.4, 0.8, 1.0],
      c4: [0.6, 0.9, 1.0],
      c5: [0.85, 1.0, 1.0],
    },
  },
  {
    name: 'Gold',
    isMonotonic: true,
    params: {
      type: 'gradient',
      c1: [0.04, 0.02, 0.01],
      c2: [0.2, 0.08, 0.02],
      c3: [0.5, 0.25, 0.05],
      c4: [0.85, 0.6, 0.2],
      c5: [1.0, 0.95, 0.7],
    },
    hdrParams: {
      type: 'gradient',
      c1: [1.0, 0.5, 0.1],
      c2: [1.0, 0.65, 0.2],
      c3: [1.0, 0.8, 0.3],
      c4: [1.0, 0.9, 0.5],
      c5: [1.0, 1.0, 0.8],
    },
  },
  {
    name: 'Grayscale',
    isMonotonic: true,
    params: {
      type: 'gradient',
      c1: [0.01, 0.01, 0.03],
      c2: [0.15, 0.15, 0.17],
      c3: [0.45, 0.45, 0.45],
      c4: [0.75, 0.74, 0.72],
      c5: [1.0, 0.98, 0.95],
    },
    hdrParams: {
      type: 'gradient',
      c1: [1.0, 1.0, 1.0],
      c2: [1.0, 1.0, 1.0],
      c3: [1.0, 1.0, 1.0],
      c4: [1.0, 1.0, 1.0],
      c5: [1.0, 1.0, 1.0],
    },
  },
  {
    name: 'Sepia',
    isMonotonic: true,
    params: {
      type: 'gradient',
      c1: [0.03, 0.02, 0.01],
      c2: [0.15, 0.08, 0.03],
      c3: [0.4, 0.25, 0.12],
      c4: [0.7, 0.55, 0.35],
      c5: [1.0, 0.95, 0.85],
    },
    hdrParams: {
      type: 'gradient',
      c1: [1.0, 0.7, 0.4],
      c2: [1.0, 0.8, 0.55],
      c3: [1.0, 0.88, 0.7],
      c4: [1.0, 0.95, 0.85],
      c5: [1.0, 1.0, 0.95],
    },
  },
  {
    name: 'Ocean',
    isMonotonic: true,
    params: {
      type: 'gradient',
      c1: [0.0, 0.02, 0.05],
      c2: [0.02, 0.08, 0.2],
      c3: [0.05, 0.3, 0.4],
      c4: [0.2, 0.6, 0.6],
      c5: [0.6, 0.95, 0.9],
    },
    hdrParams: {
      type: 'gradient',
      c1: [0.1, 0.8, 0.8],
      c2: [0.2, 0.9, 0.85],
      c3: [0.4, 0.95, 0.9],
      c4: [0.65, 1.0, 0.95],
      c5: [0.85, 1.0, 1.0],
    },
  },
  {
    name: 'Purple',
    isMonotonic: true,
    params: {
      type: 'gradient',
      c1: [0.03, 0.01, 0.06],
      c2: [0.15, 0.05, 0.25],
      c3: [0.4, 0.15, 0.5],
      c4: [0.7, 0.4, 0.75],
      c5: [0.95, 0.8, 1.0],
    },
    hdrParams: {
      type: 'gradient',
      c1: [0.8, 0.2, 1.0],
      c2: [0.85, 0.4, 1.0],
      c3: [0.9, 0.6, 1.0],
      c4: [0.95, 0.8, 1.0],
      c5: [1.0, 0.95, 1.0],
    },
  },
  {
    name: 'Forest',
    isMonotonic: true,
    params: {
      type: 'gradient',
      c1: [0.02, 0.03, 0.01],
      c2: [0.05, 0.12, 0.04],
      c3: [0.1, 0.35, 0.15],
      c4: [0.3, 0.65, 0.3],
      c5: [0.7, 0.95, 0.6],
    },
    hdrParams: {
      type: 'gradient',
      c1: [0.3, 1.0, 0.2],
      c2: [0.5, 1.0, 0.4],
      c3: [0.7, 1.0, 0.55],
      c4: [0.85, 1.0, 0.75],
      c5: [0.95, 1.0, 0.9],
    },
  },
];

export const GRADIENT_PALETTE_COUNT = GRADIENT_PALETTES.length;
