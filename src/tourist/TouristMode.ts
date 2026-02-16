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

/** Probability of switching to a different fractal type (0-1) */
const FRACTAL_SWITCH_PROBABILITY = 0.25;

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
 * Logarithmic interpolation for zoom (feels natural for fractal navigation)
 */
function lerpLog(a: number, b: number, t: number): number {
  const logA = Math.log(a);
  const logB = Math.log(b);
  return Math.exp(lerp(logA, logB, t));
}

/**
 * Current state of the tourist mode animation
 */
type TouristState =
  | { type: 'idle' }
  | { type: 'transitioning'; startTime: number; duration: number; from: AnimationTarget; to: AnimationTarget }
  | { type: 'paused'; startTime: number; duration: number }
  | { type: 'zoomingOut'; startTime: number; duration: number; from: AnimationTarget; targetZoom: number; nextFractalType: FractalType };

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
  colorOffset: number;
  juliaC: [number, number];
}

/**
 * Callbacks for tourist mode to communicate with the engine
 */
export interface TouristModeCallbacks {
  /** Called when the view state should be updated */
  onUpdate: (state: Partial<BookmarkState>) => void;
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
      colorOffset: state.colorOffset,
      juliaC: state.juliaC,
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

        // Interpolate position (logarithmic for zoom)
        const newState: Partial<BookmarkState> = {
          centerX: lerp(this.state.from.centerX, this.state.to.centerX, eased),
          centerY: lerp(this.state.from.centerY, this.state.to.centerY, eased),
          zoom: lerpLog(this.state.from.zoom, this.state.to.zoom, eased),
          fractalType: this.state.to.fractalType,
          paletteType: this.state.to.paletteType,
          cosinePaletteIndex: this.state.to.cosinePaletteIndex,
          gradientPaletteIndex: this.state.to.gradientPaletteIndex,
          colorOffset: lerp(this.state.from.colorOffset, this.state.to.colorOffset, eased),
          juliaC: this.state.to.juliaC,
        };

        // Update current target for next animation
        this.currentTarget = {
          ...this.state.to,
          centerX: newState.centerX!,
          centerY: newState.centerY!,
          zoom: newState.zoom!,
          colorOffset: newState.colorOffset!,
        };

        this.callbacks.onUpdate(newState);
        this.callbacks.onRender();

        // Check if transition is complete
        if (t >= 1) {
          this.state = { type: 'paused', startTime: timestamp, duration: PAUSE_DURATION };
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
        this.callbacks.onRender();

        // When zoom out is complete, switch fractal and pick destination
        if (t >= 1) {
          // Switch to the new fractal type
          this.currentTarget.fractalType = this.state.nextFractalType;
          this.callbacks.onUpdate({ fractalType: this.state.nextFractalType });

          // Clear visited locations for the new fractal type
          this.visitedLocations.clear();

          // Pick a destination in the new fractal type
          this.pickDestinationForCurrentFractal();
        }
        break;
      }
    }
  }

  /**
   * Pick the next destination
   */
  private pickNextDestination(): void {
    // Decide whether to switch fractal types
    if (Math.random() < FRACTAL_SWITCH_PROBABILITY) {
      this.initiateFractalSwitch();
    } else {
      this.pickDestinationForCurrentFractal();
    }
  }

  /**
   * Initiate a fractal type switch (zoom out first)
   */
  private initiateFractalSwitch(): void {
    // Pick a random different fractal type
    const currentBase = getBaseFractalType(this.currentTarget.fractalType);
    const currentIndex = currentBase >> 1;

    // Pick a random index that's different from the current one
    let newIndex = Math.floor(Math.random() * BASE_FRACTAL_COUNT);
    if (newIndex === currentIndex) {
      newIndex = (newIndex + 1) % BASE_FRACTAL_COUNT;
    }

    const newFractalType = (newIndex << 1) as FractalType;

    // If we're already zoomed out, just switch directly
    if (this.currentTarget.zoom <= FRACTAL_SWITCH_ZOOM_LEVEL * 1.5) {
      this.currentTarget.fractalType = newFractalType;
      this.callbacks.onUpdate({ fractalType: newFractalType });
      this.visitedLocations.clear();
      this.pickDestinationForCurrentFractal();
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
   * Pick a destination within the current fractal type
   */
  private pickDestinationForCurrentFractal(): void {
    const locations = getLocationsForFractal(this.currentTarget.fractalType);

    if (locations.length === 0) {
      // No locations defined for this fractal type, switch to Mandelbrot
      this.currentTarget.fractalType = FractalType.Mandelbrot;
      this.callbacks.onUpdate({ fractalType: FractalType.Mandelbrot });
      this.pickDestinationForCurrentFractal();
      return;
    }

    // Filter out recently visited locations (unless we've visited them all)
    let availableLocations = locations.filter(
      loc => !this.visitedLocations.has(this.getLocationKey(loc))
    );

    if (availableLocations.length === 0) {
      // All locations visited, reset and pick any
      this.visitedLocations.clear();
      availableLocations = locations;
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
   */
  private transitionTo(location: FamousLocation): void {
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
      Math.max(MIN_TRANSITION_DURATION, MIN_TRANSITION_DURATION + zoomRatio * 500 + positionDistance * 2000)
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
    };
  }
}



