/**
 * Color Types - RGB colors and vectors
 *
 * "Colors are important. Even I appreciate a good palette."
 * - Skippy the Magnificent
 */

/**
 * A 3-component vector (used for colors, positions, etc.)
 */
export type Vec3 = [number, number, number];

/**
 * A 4-component vector (used for colors with alpha, etc.)
 */
export type Vec4 = [number, number, number, number];

/**
 * RGB color with components in 0-1 range
 */
export interface RGBColor {
  readonly r: number;
  readonly g: number;
  readonly b: number;
}

/**
 * Create an RGB color
 */
export function rgb(r: number, g: number, b: number): RGBColor {
  return { r, g, b };
}

/**
 * Create an RGB color from a Vec3
 */
export function rgbFromVec3(v: Vec3): RGBColor {
  return { r: v[0], g: v[1], b: v[2] };
}

/**
 * Convert an RGB color to a Vec3
 */
export function rgbToVec3(c: RGBColor): Vec3 {
  return [c.r, c.g, c.b];
}

/**
 * RGBA color with components in 0-1 range
 */
export interface RGBAColor extends RGBColor {
  readonly a: number;
}

/**
 * Create an RGBA color
 */
export function rgba(r: number, g: number, b: number, a: number): RGBAColor {
  return { r, g, b, a };
}

/**
 * Linearly interpolate between two colors
 */
export function lerpColor(a: RGBColor, b: RGBColor, t: number): RGBColor {
  return {
    r: a.r + (b.r - a.r) * t,
    g: a.g + (b.g - a.g) * t,
    b: a.b + (b.b - a.b) * t,
  };
}

/**
 * Linearly interpolate between two Vec3s
 */
export function lerpVec3(a: Vec3, b: Vec3, t: number): Vec3 {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}
