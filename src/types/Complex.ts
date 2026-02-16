/**
 * Complex Number Type - For fractal coordinates and Julia constants
 *
 * "Finally, proper math types. Even monkeys should appreciate this."
 * - Skippy the Magnificent
 */

/**
 * A complex number with real and imaginary components.
 * Used for fractal coordinates, Julia constants, etc.
 */
export interface Complex {
  readonly real: number;
  readonly imag: number;
}

/**
 * Create a complex number from real and imaginary parts
 */
export function complex(real: number, imag: number): Complex {
  return { real, imag };
}

/**
 * Create a complex number from a tuple [real, imag]
 */
export function complexFromTuple(tuple: [number, number]): Complex {
  return { real: tuple[0], imag: tuple[1] };
}

/**
 * Convert a complex number to a tuple [real, imag]
 */
export function complexToTuple(c: Complex): [number, number] {
  return [c.real, c.imag];
}

/**
 * Format a complex number as a string
 */
export function complexToString(c: Complex, precision = 4): string {
  const sign = c.imag >= 0 ? '+' : '';
  return `${c.real.toFixed(precision)} ${sign} ${c.imag.toFixed(precision)}i`;
}

/**
 * Add two complex numbers
 */
export function complexAdd(a: Complex, b: Complex): Complex {
  return { real: a.real + b.real, imag: a.imag + b.imag };
}

/**
 * Subtract two complex numbers
 */
export function complexSub(a: Complex, b: Complex): Complex {
  return { real: a.real - b.real, imag: a.imag - b.imag };
}

/**
 * Multiply two complex numbers
 */
export function complexMul(a: Complex, b: Complex): Complex {
  return {
    real: a.real * b.real - a.imag * b.imag,
    imag: a.real * b.imag + a.imag * b.real,
  };
}

/**
 * Get the squared magnitude of a complex number (avoids sqrt)
 */
export function complexMagSq(c: Complex): number {
  return c.real * c.real + c.imag * c.imag;
}

/**
 * Get the magnitude of a complex number
 */
export function complexMag(c: Complex): number {
  return Math.sqrt(complexMagSq(c));
}

/** Origin complex number */
export const COMPLEX_ZERO: Complex = { real: 0, imag: 0 };
