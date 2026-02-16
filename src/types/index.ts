/**
 * Types Module - Common type definitions
 *
 * "Types: The foundation of any respectable codebase."
 * - Skippy the Magnificent
 */

// Complex numbers
export {
  type Complex,
  complex,
  complexFromTuple,
  complexToTuple,
  complexToString,
  complexAdd,
  complexSub,
  complexMul,
  complexMag,
  complexMagSq,
  COMPLEX_ZERO,
} from './Complex';

// Points and coordinates
export {
  type ScreenPoint,
  type FractalPoint,
  type ScreenSize,
  screenPoint,
  fractalPoint,
  screenSize,
} from './Point';

// Colors
export {
  type Vec3,
  type Vec4,
  type RGBColor,
  type RGBAColor,
  rgb,
  rgba,
  rgbFromVec3,
  rgbToVec3,
  lerpColor,
  lerpVec3,
} from './Color';
