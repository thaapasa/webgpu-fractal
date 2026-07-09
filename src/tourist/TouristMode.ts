/**
 * Tourist Mode - Automated fractal exploration
 *
 * "Sit back and let the magnificence wash over you. I'll drive."
 * - Skippy the Magnificent
 *
 * Tourist Mode automatically navigates between famous locations,
 * providing a screensaver-like experience. The user can take over
 * at any time by interacting with the canvas.
 */

import { FractalType, getBaseFractalType, BASE_FRACTAL_COUNT } from '../types';
import { BookmarkState } from '../bookmark/BookmarkManager';
import { FamousLocation, getLocationsForFractal } from '../bookmark/famousLocations';
import {
  Vec3,
  PaletteParams,
  getCosinePaletteParams,
  getGradientPaletteParams,
} from '../renderer/Palette';
import {
  FractalBlendParams,
  getFractalBlendParams,
  interpolateBlendParams,
} from '../fractal/FractalBlend';

/** Duration of the pause at each destination (ms) */
const PAUSE_DURATION = 3000;

/** Minimum transition duration (ms) */
const MIN_TRANSITION_DURATION = 3000;

/** Maximum transition duration (ms) */
const MAX_TRANSITION_DURATION = 8000;

/** Duration for zooming out before switching fractal types (ms) */
const FRACTAL_SWITCH_ZOOM_OUT_DURATION = 2000;

/** Zoom level to reach before switching fractal types */
const FRACTAL_SWITCH_ZOOM_LEVEL = 0.5;

/** Base probability of switching fractals after the first location (0-1) */
const FRACTAL_SWITCH_PROBABILITY = 0.25;

/** How many recently-visited base fractals to avoid re-selecting */
const RECENT_FRACTAL_MEMORY = 3;

/** Zoom threshold for "zoomed in" - triggers zoom-out-travel-zoom-in behavior */
const ZOOMED_IN_THRESHOLD = 2.0;

/** How much to pull back relative to the endpoints (0 = no pullback, 1 = full pullback to TRANSITION_PULLBACK_ZOOM) */
const PULLBACK_STRENGTH = 0.6;

/** Minimum zoom level to pull back to during transitions */
const TRANSITION_PULLBACK_ZOOM = 0.5;

/**
 * Compute smooth zoom with a gentle "dip" in the middle.
 *
 * Uses a quadratic Bezier-like curve:
 * - Start: fromZoom
 * - Middle control point: pulled back zoom (lower than both endpoints)
 * - End: toZoom
 *
 * This creates a smooth parabolic path through zoom space.
 */
function computeSmoothZoomDip(fromZoom: number, toZoom: number, t: number): number {
  // If neither endpoint is zoomed in much, just do normal log interpolation
  if (fromZoom < ZOOMED_IN_THRESHOLD && toZoom < ZOOMED_IN_THRESHOLD) {
    return lerpLog(fromZoom, toZoom, t);
  }

  // Calculate the "dip" target - where we want to be at t=0.5
  const minEndpointZoom = Math.min(fromZoom, toZoom);
  const dipTarget = Math.max(
    TRANSITION_PULLBACK_ZOOM,
    minEndpointZoom * (1 - PULLBACK_STRENGTH) + TRANSITION_PULLBACK_ZOOM * PULLBACK_STRENGTH
  );

  // Only dip if it would actually zoom out
  if (dipTarget >= minEndpointZoom) {
    return lerpLog(fromZoom, toZoom, t);
  }

  // Use quadratic Bezier interpolation in log space for smooth curve
  // B(t) = (1-t)²·P0 + 2(1-t)t·P1 + t²·P2
  const logFrom = Math.log(fromZoom);
  const logTo = Math.log(toZoom);
  const logDip = Math.log(dipTarget);

  const oneMinusT = 1 - t;
  const logZoom = oneMinusT * oneMinusT * logFrom + 2 * oneMinusT * t * logDip + t * t * logTo;

  return Math.exp(logZoom);
}

/**
 * Easing function: smooth ease-in-out cubic
 */
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Linearly interpolate between two values
 */
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Linearly interpolate between two Vec3 values
 */
function lerpVec3(a: Vec3, b: Vec3, t: number): Vec3 {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

/**
 * Get palette parameters from a bookmark state.
 * Converts palette type + index to actual params.
 */
function getPaletteParamsFromState(state: {
  paletteType: 'cosine' | 'gradient';
  cosinePaletteIndex: number;
  gradientPaletteIndex: number;
}): PaletteParams {
  if (state.paletteType === 'cosine') {
    return getCosinePaletteParams(state.cosinePaletteIndex);
  } else {
    // Use SDR params for interpolation (HDR is handled in renderer)
    return getGradientPaletteParams(state.gradientPaletteIndex, false);
  }
}

/**
 * Interpolate between two palette parameter sets.
 * Works for both cosine and gradient palettes by treating them uniformly.
 */
function interpolatePaletteParams(
  from: PaletteParams,
  to: PaletteParams,
  t: number
): PaletteParams {
  // If both are the same type, interpolate directly
  if (from.type === 'cosine' && to.type === 'cosine') {
    return {
      type: 'cosine',
      a: lerpVec3(from.a, to.a, t),
      b: lerpVec3(from.b, to.b, t),
      c: lerpVec3(from.c, to.c, t),
      d: lerpVec3(from.d, to.d, t),
    };
  }

  if (from.type === 'gradient' && to.type === 'gradient') {
    return {
      type: 'gradient',
      c1: lerpVec3(from.c1, to.c1, t),
      c2: lerpVec3(from.c2, to.c2, t),
      c3: lerpVec3(from.c3, to.c3, t),
      c4: lerpVec3(from.c4, to.c4, t),
      c5: lerpVec3(from.c5, to.c5, t),
    };
  }

  // Mixed types: cross-fade by using the target type
  // At t < 0.5, favor 'from'; at t >= 0.5, switch to 'to' type
  // This creates a smooth-ish transition even between different palette types
  if (t < 0.5) {
    // Keep 'from' type, but blend toward neutral
    if (from.type === 'cosine') {
      // Fade cosine toward a neutral state
      const fadeT = t * 2; // 0 to 1 over first half
      return {
        type: 'cosine',
        a: lerpVec3(from.a, [0.5, 0.5, 0.5], fadeT * 0.3),
        b: lerpVec3(from.b, [0.3, 0.3, 0.3], fadeT * 0.3),
        c: from.c,
        d: from.d,
      };
    } else {
      return from; // Keep gradient as-is in first half
    }
  } else {
    // Use 'to' type
    if (to.type === 'cosine') {
      const fadeT = (t - 0.5) * 2; // 0 to 1 over second half
      return {
        type: 'cosine',
        a: lerpVec3([0.5, 0.5, 0.5], to.a, fadeT),
        b: lerpVec3([0.3, 0.3, 0.3], to.b, fadeT),
        c: to.c,
        d: to.d,
      };
    } else {
      return to; // Use gradient as-is in second half
    }
  }
}

/**
 * Logarithmic interpolation for zoom (feels natural for fractal navigation)
 */
function lerpLog(a: number, b: number, t: number): number {
  const logA = Math.log(a);
  const logB = Math.log(b);
  return Math.exp(lerp(logA, logB, t));
}

/**
 * Circular/arc interpolation for 2D coordinates.
 * Instead of going straight from A to B (which passes through the center),
 * this takes a curved path that arcs around the origin.
 *
 * Uses polar coordinates: interpolates angle and radius separately,
 * choosing the shorter angular direction.
 */
function lerpCircular(ax: number, ay: number, bx: number, by: number, t: number): [number, number] {
  // Convert to polar coordinates
  const aRadius = Math.sqrt(ax * ax + ay * ay);
  const bRadius = Math.sqrt(bx * bx + by * by);
  let aAngle = Math.atan2(ay, ax);
  let bAngle = Math.atan2(by, bx);

  // Handle edge cases where points are very close to origin
  const minRadius = 0.01;
  if (aRadius < minRadius && bRadius < minRadius) {
    // Both near origin, just lerp linearly
    return [lerp(ax, bx, t), lerp(ay, by, t)];
  }
  if (aRadius < minRadius) {
    // Start near origin, lerp from origin toward B
    return [lerp(0, bx, t), lerp(0, by, t)];
  }
  if (bRadius < minRadius) {
    // End near origin, lerp from A toward origin
    return [lerp(ax, 0, t), lerp(ay, 0, t)];
  }

  // Choose the shorter angular direction
  let angleDiff = bAngle - aAngle;
  if (angleDiff > Math.PI) {
    angleDiff -= 2 * Math.PI;
  } else if (angleDiff < -Math.PI) {
    angleDiff += 2 * Math.PI;
  }

  // Interpolate angle (shorter direction) and radius
  const angle = aAngle + angleDiff * t;
  const radius = lerp(aRadius, bRadius, t);

  // Convert back to Cartesian
  return [radius * Math.cos(angle), radius * Math.sin(angle)];
}

/**
 * Current state of the tourist mode animation
 */
type TouristState =
  | { type: 'idle' }
  | {
      type: 'transitioning';
      startTime: number;
      duration: number;
      from: AnimationTarget;
      to: AnimationTarget;
      singleTransition?: boolean;
    }
  | { type: 'paused'; startTime: number; duration: number }
  | {
      type: 'zoomingOut';
      startTime: number;
      duration: number;
      from: AnimationTarget;
      targetZoom: number;
      nextFractalType: FractalType;
    };

/**
 * Target state for animation (position + palette info)
 */
interface AnimationTarget {
  centerX: number;
  centerY: number;
  zoom: number;
  fractalType: FractalType;
  paletteType: 'cosine' | 'gradient';
  cosinePaletteIndex: number;
  gradientPaletteIndex: number;
  paletteParams: PaletteParams;
  colorOffset: number;
  juliaC: [number, number];
  blendParams: FractalBlendParams | null;
}

/**
 * Callbacks for tourist mode to communicate with the engine
 */
export interface TouristModeCallbacks {
  /** Called when the view state should be updated during animation */
  onUpdate: (
    state: Partial<BookmarkState>,
    interpolatedPaletteParams?: PaletteParams,
    interpolatedBlendParams?: FractalBlendParams | null
  ) => void;
  /** Called to clear interpolation state when a transition completes */
  onClearInterpolation: () => void;
  /** Called to trigger a render */
  onRender: () => void;
  /** Called to show a location notification */
  onLocationNotification?: (name: string, description: string) => void;
}

/**
 * Tourist Mode controller
 */
export class TouristMode {
  private active = false;
  private state: TouristState = { type: 'idle' };
  private animationFrameId: number | null = null;

  private callbacks: TouristModeCallbacks;

  // Current position (needed for smooth animation)
  private currentTarget: AnimationTarget;

  // Track visited locations to avoid immediate repeats
  private visitedLocations: Set<string> = new Set();

  // Base-fractal indices (baseType >> 1) of the most recently entered fractals
  private recentBaseFractals: number[] = [];

  constructor(callbacks: TouristModeCallbacks, initialState: BookmarkState) {
    this.callbacks = callbacks;
    this.currentTarget = this.bookmarkToTarget(initialState);
  }

  /**
   * Convert a BookmarkState to an AnimationTarget
   */
  private bookmarkToTarget(state: BookmarkState): AnimationTarget {
    return {
      centerX: state.centerX,
      centerY: state.centerY,
      zoom: state.zoom,
      fractalType: state.fractalType,
      paletteType: state.paletteType,
      cosinePaletteIndex: state.cosinePaletteIndex,
      gradientPaletteIndex: state.gradientPaletteIndex,
      paletteParams: getPaletteParamsFromState(state),
      colorOffset: state.colorOffset,
      juliaC: state.juliaC,
      blendParams: getFractalBlendParams(state.fractalType),
    };
  }

  /**
   * Start tourist mode
   */
  start(currentState: BookmarkState): void {
    if (this.active) return;

    this.active = true;
    this.currentTarget = this.bookmarkToTarget(currentState);
    this.visitedLocations.clear();

    // Seed fractal history so the first switch won't return to where we started
    this.recentBaseFractals = [getBaseFractalType(this.currentTarget.fractalType) >> 1];

    // Start with a pause, then pick the first destination
    this.state = { type: 'paused', startTime: performance.now(), duration: 1000 };
    this.animationFrameId = requestAnimationFrame(this.tick);

    console.log('🚀 Tourist mode started');
  }

  /**
   * Stop tourist mode
   */
  stop(): void {
    if (!this.active) return;

    this.active = false;
    this.state = { type: 'idle' };

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    console.log('🛑 Tourist mode stopped');
  }

  /**
   * Check if tourist mode is active
   */
  isActive(): boolean {
    return this.active;
  }

  /**
   * Update the current state (call when user changes something externally)
   */
  updateCurrentState(state: BookmarkState): void {
    this.currentTarget = this.bookmarkToTarget(state);
  }

  /**
   * Animate to a specific location (single transition, then stop)
   * Used for long-press location selection.
   */
  animateToLocation(location: FamousLocation, currentState: BookmarkState): void {
    // Stop any existing animation
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    this.active = true;
    this.currentTarget = this.bookmarkToTarget(currentState);

    // Start transition to the location, but set state to stop after
    this.transitionTo(location, true); // true = single transition mode

    this.animationFrameId = requestAnimationFrame(this.tick);

    console.log(`🎯 Animating to: ${location.name}`);
  }

  /**
   * Main animation tick
   */
  private tick = (timestamp: number): void => {
    if (!this.active) return;

    this.updateAnimation(timestamp);

    // Schedule next frame
    this.animationFrameId = requestAnimationFrame(this.tick);
  };

  /**
   * Update the animation state
   */
  private updateAnimation(timestamp: number): void {
    switch (this.state.type) {
      case 'idle':
        // Shouldn't happen when active, but just in case
        this.pickNextDestination();
        break;

      case 'paused':
        if (timestamp - this.state.startTime >= this.state.duration) {
          this.pickNextDestination();
        }
        break;

      case 'transitioning': {
        const elapsed = timestamp - this.state.startTime;
        const t = Math.min(1, elapsed / this.state.duration);
        const eased = easeInOutCubic(t);

        // Interpolate Julia coordinates using circular path (avoids boring center)
        // Julia lerping stays the same - smooth throughout
        const juliaC = lerpCircular(
          this.state.from.juliaC[0],
          this.state.from.juliaC[1],
          this.state.to.juliaC[0],
          this.state.to.juliaC[1],
          eased
        );

        const fromZoom = this.state.from.zoom;
        const toZoom = this.state.to.zoom;

        // Compute zoom with smooth "dip" curve (zooms out in middle, back in at end)
        // The dip uses the raw t value for a quadratic Bezier curve
        const zoom = computeSmoothZoomDip(fromZoom, toZoom, t);

        // Interpolate center position using circular path with standard easing
        // The zoom dip already creates the "pull back and travel" effect visually
        const [centerX, centerY] = lerpCircular(
          this.state.from.centerX,
          this.state.from.centerY,
          this.state.to.centerX,
          this.state.to.centerY,
          eased
        );

        // Interpolate palette parameters for smooth color transitions
        const interpolatedPaletteParams = interpolatePaletteParams(
          this.state.from.paletteParams,
          this.state.to.paletteParams,
          eased
        );

        // Interpolate fractal blend parameters for smooth fractal type transitions
        let interpolatedBlendParams: FractalBlendParams | null = null;
        const fromBlend = this.state.from.blendParams;
        const toBlend = this.state.to.blendParams;

        if (fromBlend && toBlend) {
          // Both types are blendable - smooth interpolation!
          interpolatedBlendParams = interpolateBlendParams(fromBlend, toBlend, eased);
        } else if (t >= 0.5 && toBlend) {
          // Transitioning TO a blendable type - use target params in second half
          interpolatedBlendParams = toBlend;
        } else if (t < 0.5 && fromBlend) {
          // Transitioning FROM a blendable type - use source params in first half
          interpolatedBlendParams = fromBlend;
        }
        // else: both non-blendable, leave as null (legacy path)

        // Build the new state
        const newState: Partial<BookmarkState> = {
          centerX,
          centerY,
          zoom,
          fractalType: this.state.to.fractalType,
          paletteType: this.state.to.paletteType,
          cosinePaletteIndex: this.state.to.cosinePaletteIndex,
          gradientPaletteIndex: this.state.to.gradientPaletteIndex,
          colorOffset: lerp(this.state.from.colorOffset, this.state.to.colorOffset, eased),
          juliaC: juliaC,
        };

        // Update current target for next animation
        this.currentTarget = {
          ...this.state.to,
          centerX,
          centerY,
          zoom,
          paletteParams: interpolatedPaletteParams,
          colorOffset: newState.colorOffset!,
          juliaC: juliaC,
          blendParams: interpolatedBlendParams,
        };

        this.callbacks.onUpdate(newState, interpolatedPaletteParams, interpolatedBlendParams);
        this.callbacks.onRender();

        // Check if transition is complete
        if (t >= 1) {
          // Clear interpolation state - transition is done, use actual fractal type
          this.callbacks.onClearInterpolation();

          if (this.state.singleTransition) {
            // Single transition mode - stop here
            this.active = false;
            this.state = { type: 'idle' };
            if (this.animationFrameId !== null) {
              cancelAnimationFrame(this.animationFrameId);
              this.animationFrameId = null;
            }
            console.log('🎯 Single transition complete');
          } else {
            // Continue touring - pause before next destination
            this.state = { type: 'paused', startTime: timestamp, duration: PAUSE_DURATION };
          }
        }
        break;
      }

      case 'zoomingOut': {
        const elapsed = timestamp - this.state.startTime;
        const t = Math.min(1, elapsed / this.state.duration);
        const eased = easeInOutCubic(t);

        // Zoom out to the target level
        const newZoom = lerpLog(this.state.from.zoom, this.state.targetZoom, eased);

        const newState: Partial<BookmarkState> = {
          centerX: this.state.from.centerX,
          centerY: this.state.from.centerY,
          zoom: newZoom,
        };

        this.currentTarget = {
          ...this.currentTarget,
          zoom: newZoom,
        };

        this.callbacks.onUpdate(newState);
        this.callbacks.onClearInterpolation();
        this.callbacks.onRender();

        // When zoom out is complete, switch fractal and pick destination
        if (t >= 1) {
          // Switch to the new fractal type
          this.currentTarget.fractalType = this.state.nextFractalType;
          this.currentTarget.blendParams = getFractalBlendParams(this.state.nextFractalType);
          this.callbacks.onUpdate({ fractalType: this.state.nextFractalType });
          this.callbacks.onClearInterpolation();

          // Clear visited locations for the new fractal type
          this.visitedLocations.clear();

          // Pick a destination in the new fractal type (skip the overview)
          this.pickDestinationForCurrentFractal(true);
        }
        break;
      }
    }
  }

  /**
   * Pick the next destination
   */
  private pickNextDestination(): void {
    const total = getLocationsForFractal(this.currentTarget.fractalType).length;
    const visited = this.visitedLocations.size;

    // Multiplicative ramp: each location seen multiplies the "keep exploring"
    // chance by (1 - base). p(1)=0.25, p(2)=0.4375, p(3)=0.578, ... never reaching
    // 1 on its own, so visiting every location of a big fractal stays possible
    // (just improbable). Force a switch only once we've genuinely seen them all.
    let switchProb = 1 - Math.pow(1 - FRACTAL_SWITCH_PROBABILITY, Math.max(1, visited));
    if (total > 0 && visited >= total) switchProb = 1;

    if (Math.random() < switchProb) {
      this.initiateFractalSwitch();
    } else {
      this.pickDestinationForCurrentFractal();
    }
  }

  /**
   * Initiate a fractal type switch (zoom out first)
   */
  private initiateFractalSwitch(): void {
    // Pick a fractal we haven't visited recently, and remember it
    const newIndex = this.pickNewFractalBaseIndex();
    this.recordBaseFractal(newIndex);

    const newFractalType = (newIndex << 1) as FractalType;

    // If we're already zoomed out, just switch directly
    if (this.currentTarget.zoom <= FRACTAL_SWITCH_ZOOM_LEVEL * 1.5) {
      this.currentTarget.fractalType = newFractalType;
      this.callbacks.onUpdate({ fractalType: newFractalType });
      this.visitedLocations.clear();
      this.pickDestinationForCurrentFractal(true);
      return;
    }

    // Otherwise, zoom out first
    this.state = {
      type: 'zoomingOut',
      startTime: performance.now(),
      duration: FRACTAL_SWITCH_ZOOM_OUT_DURATION,
      from: { ...this.currentTarget },
      targetZoom: FRACTAL_SWITCH_ZOOM_LEVEL,
      nextFractalType: newFractalType,
    };
  }

  /**
   * Pick a base-fractal index to switch to, avoiding the most recently visited
   * ones (and, when possible, fractals that have no defined locations).
   */
  private pickNewFractalBaseIndex(): number {
    const excluded = new Set(this.recentBaseFractals);

    // Prefer bases we haven't seen recently AND that actually have locations
    let candidates: number[] = [];
    for (let i = 0; i < BASE_FRACTAL_COUNT; i++) {
      if (excluded.has(i)) continue;
      if (getLocationsForFractal((i << 1) as FractalType).length > 0) candidates.push(i);
    }

    // Fallbacks: ignore the "has locations" filter, then ignore history entirely
    if (candidates.length === 0) {
      candidates = [...Array(BASE_FRACTAL_COUNT).keys()].filter((i) => !excluded.has(i));
    }
    if (candidates.length === 0) {
      const current = getBaseFractalType(this.currentTarget.fractalType) >> 1;
      candidates = [...Array(BASE_FRACTAL_COUNT).keys()].filter((i) => i !== current);
    }

    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  /**
   * Record a base-fractal index as recently visited, keeping the last N.
   */
  private recordBaseFractal(baseIndex: number): void {
    this.recentBaseFractals.push(baseIndex);
    if (this.recentBaseFractals.length > RECENT_FRACTAL_MEMORY) {
      this.recentBaseFractals.shift();
    }
  }

  /**
   * Pick a destination within the current fractal type.
   * @param isEntry If true, this is the first location of a freshly switched
   *   fractal - skip the zoomed-out overview (index 0) as a dull entry point.
   */
  private pickDestinationForCurrentFractal(isEntry: boolean = false): void {
    const locations = getLocationsForFractal(this.currentTarget.fractalType);

    if (locations.length === 0) {
      // No locations defined for this fractal type, switch to Mandelbrot
      this.currentTarget.fractalType = FractalType.Mandelbrot;
      this.callbacks.onUpdate({ fractalType: FractalType.Mandelbrot });
      this.pickDestinationForCurrentFractal(isEntry);
      return;
    }

    // On a fresh fractal, skip the overview (index 0) as the entry point
    const pool = isEntry && locations.length > 1 ? locations.slice(1) : locations;

    // Filter out recently visited locations (unless we've visited them all)
    let availableLocations = pool.filter(
      (loc) => !this.visitedLocations.has(this.getLocationKey(loc))
    );

    if (availableLocations.length === 0) {
      // All locations visited, reset and pick any
      this.visitedLocations.clear();
      availableLocations = pool;
    }

    // Pick a random location from the available ones
    const location = availableLocations[Math.floor(Math.random() * availableLocations.length)];
    this.transitionTo(location);
  }

  /**
   * Get a unique key for a location (for tracking visited locations)
   */
  private getLocationKey(location: FamousLocation): string {
    return `${location.state.fractalType}-${location.key}`;
  }

  /**
   * Start a transition to a new location
   * @param singleTransition If true, stop after this transition (don't continue touring)
   */
  private transitionTo(location: FamousLocation, singleTransition: boolean = false): void {
    const target = this.bookmarkToTarget(location.state);

    // Calculate transition duration based on zoom distance
    const zoomRatio = Math.abs(Math.log(target.zoom) - Math.log(this.currentTarget.zoom));
    const positionDistance = Math.sqrt(
      Math.pow(target.centerX - this.currentTarget.centerX, 2) +
        Math.pow(target.centerY - this.currentTarget.centerY, 2)
    );

    // Duration scales with the "visual distance" of the transition
    const duration = Math.min(
      MAX_TRANSITION_DURATION,
      Math.max(
        MIN_TRANSITION_DURATION,
        MIN_TRANSITION_DURATION + zoomRatio * 500 + positionDistance * 2000
      )
    );

    // Mark this location as visited
    const locationKey = this.getLocationKey(location);
    this.visitedLocations.add(locationKey);

    // Show notification
    this.callbacks.onLocationNotification?.(location.name, location.description);

    // Start the transition
    this.state = {
      type: 'transitioning',
      startTime: performance.now(),
      duration,
      from: { ...this.currentTarget },
      to: target,
      singleTransition,
    };
  }
}
