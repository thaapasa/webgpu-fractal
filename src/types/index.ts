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
  COMPLEX_ZERO,
  complexAdd,
  complexFromTuple,
  complexMag,
  complexMagSq,
  complexMul,
  complexSub,
  complexToString,
  complexToTuple,
} from './Complex';

// Points and coordinates
export {
  type FractalPoint,
  fractalPoint,
  type ScreenPoint,
  screenPoint,
  type ScreenSize,
  screenSize,
} from './Point';

// Colors
export {
  lerpColor,
  lerpVec3,
  rgb,
  rgba,
  type RGBAColor,
  type RGBColor,
  rgbFromVec3,
  rgbToVec3,
  type Vec3,
  type Vec4,
} from './Color';
