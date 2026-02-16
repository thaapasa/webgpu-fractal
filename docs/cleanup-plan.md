# Code Cleanup Plan

_"Yes, I've analyzed your code. It's... functional. Let me show you how to make it magnificent."_ —
Skippy the Magnificent

---

## Executive Summary

The codebase works, but has accumulated technical debt typical of rapid iteration. The main issues:

1. **`WebGPUFractalEngine.ts` (~~1,128~~ 927 lines)** — Still large but improving
2. **`InputHandler.ts` (717 lines)** — Bloated callback setter pattern with 20+ callbacks
3. **Mixed responsibilities** — UI, state, rendering, and business logic intertwined
4. **Primitive obsession** — Multiple `[number, number]` tuples instead of proper types

This plan proposes a phased refactoring approach, each phase delivering incremental value.

---

## Phase 1: Extract UI Layer ✅ COMPLETE

**Status:** Completed February 2026

### Results

| Metric                   | Before      | After     | Change          |
| ------------------------ | ----------- | --------- | --------------- |
| `WebGPUFractalEngine.ts` | 1,174 lines | 927 lines | **-247 (-21%)** |
| New `src/ui/` module     | —           | 523 lines | 6 files         |

### What Was Extracted

Created `src/ui/` directory with dedicated UI components:

```
src/ui/
├── index.ts                    # Re-exports
├── OverlayManager.ts           # Coordinates all overlays
├── DebugOverlay.ts             # Status bar (zoom, iterations, palette)
├── HelpOverlay.ts              # Keyboard shortcuts overlay
├── NotificationOverlay.ts      # Toast notifications (share, location)
└── FPSOverlay.ts               # FPS display
```

### Benefits Achieved

- UI concerns isolated from rendering logic
- Each overlay is independently testable
- `OverlayManager` provides clean facade for all UI operations
- Engine no longer has HTML generation mixed with GPU code

---

## Phase 2: Extract State Management ✅ COMPLETE

**Status:** Completed February 2026

### Results

| Metric                   | Before    | After     | Change         |
| ------------------------ | --------- | --------- | -------------- |
| `WebGPUFractalEngine.ts` | 927 lines | 836 lines | **-91 (-10%)** |
| New `src/state/` module  | —         | 368 lines | 2 files        |

### What Was Extracted

Created `src/state/` directory with centralized state management:

```
src/state/
├── index.ts                    # Module exports
└── FractalState.ts             # All mutable state + change notifications
```

### `FractalState` Responsibilities

- **View state**: Owns `ViewState` instance for pan/zoom
- **Fractal state**: `fractalType`, `juliaC`, Julia picker mode
- **Palette state**: `paletteType`, palette indices, `colorOffset`
- **Rendering state**: `maxIterationsOverride`, brightness settings
- **Conversion methods**: `toBookmark()`, `fromBookmark()`, `applyBookmark()`, `applyPartial()`
- **Change notification**: Listener pattern for state changes

### Benefits Achieved

- Single source of truth for all fractal state
- State conversion logic centralized (no more duplication)
- Engine methods simplified to delegate to state
- `maxIterationsForZoom()` moved to state module
- Foundation for future reactive updates

### Not Yet Extracted (Future Work)

The `FractalStateController` (action methods) was not created as a separate class. The action
methods remain in `WebGPUFractalEngine` but now delegate to `FractalState`. This keeps the refactor
incremental and avoids over-engineering.

---

## Phase 3: Simplify Input Handler (Medium Impact, Low Effort)

### Problem

`InputHandler.ts` has 20+ callback setters, each with a private field:

```typescript
private onIterationAdjust: IterationAdjustCallback | null = null;
private onIterationReset: IterationResetCallback | null = null;
private onCosinePaletteCycle: CosinePaletteCycleCallback | null = null;
// ... 17 more
```

Then 20+ setter methods:

```typescript
setIterationAdjustCallback(callback) { this.onIterationAdjust = callback; }
setIterationResetCallback(callback) { this.onIterationReset = callback; }
// ... ad infinitum
```

### Solution

Use a single event-based system or a callbacks interface:

**Option A: EventTarget (modern, decoupled)**

```typescript
export class InputHandler extends EventTarget {
  // Dispatch typed events
  private dispatchInput(type: InputEventType, detail: unknown) {
    this.dispatchEvent(new CustomEvent(type, { detail }));
  }

  // In handleKeyDown:
  case '+': this.dispatchInput('iterationAdjust', 1); break;
}
```

**Option B: Single callbacks interface (simpler)**

```typescript
interface InputCallbacks {
  onIterationAdjust?(direction: 1 | -1): void;
  onPaletteCycle?(type: 'cosine' | 'gradient', direction: 1 | -1): void;
  onColorOffset?(delta: number): void;
  // ... group related callbacks
}

class InputHandler {
  constructor(canvas, viewState, callbacks: InputCallbacks) {
    this.callbacks = callbacks;
  }
}
```

**Estimated reduction:** ~150 lines from InputHandler

---

## Phase 4: Create Proper Types (Low Impact, Low Effort)

### Problem

Primitive obsession with tuples:

- `juliaC: [number, number]` throughout
- `Vec3: [number, number, number]` for colors
- Screen coordinates as `[number, number]`

### Solution

Create proper types in `src/types/`:

```typescript
// src/types/Complex.ts
export class Complex {
  constructor(
    public real: number,
    public imag: number
  ) {}

  static from(tuple: [number, number]): Complex {
    return new Complex(tuple[0], tuple[1]);
  }

  toTuple(): [number, number] {
    return [this.real, this.imag];
  }

  toString(): string {
    return `${this.real.toFixed(4)} + ${this.imag.toFixed(4)}i`;
  }
}

// src/types/Color.ts
export class Color {
  constructor(
    public r: number,
    public g: number,
    public b: number
  ) {}

  static fromVec3(v: Vec3): Color {
    return new Color(v[0], v[1], v[2]);
  }

  toVec3(): Vec3 {
    return [this.r, this.g, this.b];
  }
}

// src/types/Point.ts
export interface ScreenPoint {
  x: number;
  y: number;
}
export interface FractalPoint {
  real: number;
  imag: number;
}
```

---

## Phase 5: Split Palettes Module (Low Impact, Low Effort)

### Problem

`Palettes.ts` (384 lines) contains:

- Type definitions
- Cosine palette data
- Gradient palette data
- Helper functions

### Solution

```
src/renderer/palettes/
├── index.ts              # Re-exports
├── types.ts              # PaletteParams, CosinePaletteParams, etc.
├── cosinePalettes.ts     # COSINE_PALETTES array
├── gradientPalettes.ts   # GRADIENT_PALETTES array
└── helpers.ts            # getCosinePalette, interpolatePalette, etc.
```

---

## Phase 6: Isolate Rendering Pipeline (Medium Impact, High Effort)

### Problem

`WebGPUFractalEngine.ts` mixes:

- Pipeline setup
- Uniform buffer management
- Render loop
- State management

### Solution

Create `src/renderer/FractalPipeline.ts`:

```typescript
export class FractalPipeline {
  private pipeline: GPURenderPipeline;
  private uniformBuffer: GPUBuffer;
  private bindGroup: GPUBindGroup;

  static async create(device: GPUDevice, format: GPUTextureFormat): Promise<FractalPipeline>;

  updateUniforms(state: RenderState): void;
  render(encoder: GPUCommandEncoder, textureView: GPUTextureView): void;
}

interface RenderState {
  resolution: [number, number];
  view: ViewState;
  fractal: FractalType;
  juliaC: [number, number];
  maxIterations: number;
  palette: PaletteParams;
  colorOffset: number;
  hdr: { enabled: boolean; bias: number };
}
```

This isolates all the uniform buffer packing logic (lines 357-420) into a dedicated class.

---

## Phase 7: Famous Locations Refactor (Low Impact, Low Effort)

### Problem

`famousLocations.ts` (711 lines) is mostly data, but:

- Mixes type definitions with data
- Has a large helper function inline

### Solution

```
src/bookmark/locations/
├── index.ts              # getLocationByKey, getLocationsForFractal
├── types.ts              # FamousLocation interface
├── helpers.ts            # createLocation helper
├── mandelbrot.ts         # MANDELBROT_LOCATIONS
├── burningShip.ts        # BURNING_SHIP_LOCATIONS
├── tricorn.ts            # etc.
└── ...
```

---

## Priority Matrix

| Phase               | Impact | Effort | Dependencies | Status      |
| ------------------- | ------ | ------ | ------------ | ----------- |
| 1. UI Layer         | High   | Medium | None         | ✅ Complete |
| 2. State Management | High   | Medium | None         | ✅ Complete |
| 3. Input Handler    | Medium | Low    | Phase 2      | 🥇 Next     |
| 4. Proper Types     | Low    | Low    | None         | Anytime     |
| 5. Split Palettes   | Low    | Low    | None         | Anytime     |
| 6. Render Pipeline  | Medium | High   | Phase 2      | Later       |
| 7. Famous Locations | Low    | Low    | None         | Anytime     |

---

## Target Architecture

After cleanup, the dependency graph should look like:

```
main.ts
    └── FractalApp (new orchestrator, ~100 lines)
            ├── FractalState (state management)
            ├── InputHandler (events only)
            ├── WebGPURenderer (context/canvas)
            ├── FractalPipeline (GPU pipeline)
            ├── OverlayManager (all UI)
            ├── BookmarkManager (URL state)
            └── TouristMode (auto-tour)
```

**`WebGPUFractalEngine.ts` becomes `FractalApp.ts`:**

- ~100-150 lines
- Only orchestration, no implementation details
- Easy to understand at a glance

---

## Metrics

### Before (original)

| File                   | Lines     |
| ---------------------- | --------- |
| WebGPUFractalEngine.ts | 1,174     |
| InputHandler.ts        | 717       |
| famousLocations.ts     | 711       |
| TouristMode.ts         | 680       |
| Palettes.ts            | 384       |
| **Total (main files)** | **3,666** |

### Current (after Phase 2)

| File                   | Lines     |
| ---------------------- | --------- |
| WebGPUFractalEngine.ts | 836       |
| InputHandler.ts        | 717       |
| famousLocations.ts     | 711       |
| TouristMode.ts         | 680       |
| Palettes.ts            | 384       |
| ui/ (6 files)          | 523       |
| state/ (2 files)       | 368       |
| **Total**              | **4,219** |

_Note: Total increased because extracted code includes new infrastructure (listeners, methods). The
engine itself has been reduced by 338 lines (29%) from the original._

### Target (after all phases)

| File                         | Lines      |
| ---------------------------- | ---------- |
| FractalApp.ts                | ~150       |
| FractalState.ts              | ~150       |
| FractalStateController.ts    | ~200       |
| FractalPipeline.ts           | ~150       |
| InputHandler.ts              | ~400       |
| OverlayManager.ts + overlays | ~250       |
| TouristMode.ts               | ~500       |
| Palettes (split)             | ~400       |
| locations (split)            | ~700       |
| **Total**                    | **~2,900** |

**Key improvement:** No single file over 500 lines, clear single responsibilities.

---

## Quick Wins

Most quick wins are now complete:

1. ~~**Extract `createHelpContent()`**~~ ✅ Done (now in `HelpOverlay.ts`)
2. ~~**Extract iteration helpers**~~ ✅ Done (`maxIterationsForZoom()` now in
   `state/FractalState.ts`)
3. ~~**Group notification methods**~~ ✅ Done (now in `NotificationOverlay.ts`)
4. **Type alias cleanup** — Replace `[number, number]` with `Complex` or `Point2D` type

---

_"There. A roadmap to redemption. You're welcome."_ — Skippy
