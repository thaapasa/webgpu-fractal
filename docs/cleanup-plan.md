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

## Phase 3: Simplify Input Handler ✅ COMPLETE

**Status:** Completed February 2026

### Results

| File                     | Before    | After     | Change          |
| ------------------------ | --------- | --------- | --------------- |
| `InputHandler.ts`        | 722 lines | 552 lines | **-170 (-24%)** |
| New `InputCallbacks.ts`  | —         | 49 lines  | Interface file  |
| `WebGPUFractalEngine.ts` | 836 lines | 770 lines | **-66 (-8%)**   |

### What Was Changed

**Created `InputCallbacks.ts`:**

Single interface defining all input callbacks:

```typescript
export interface InputCallbacks {
  onIterationAdjust?(direction: 1 | -1): void;
  onCosinePaletteCycle?(direction: 1 | -1): void;
  onColorOffsetAdjust?(delta: number): void;
  // ... all 18 callbacks in one place
}
```

**Simplified `InputHandler.ts`:**

- Removed 20 private callback fields
- Removed 20 setter methods
- Single `callbacks: InputCallbacks` field
- Constructor accepts callbacks directly
- Optional `setCallbacks()` method for updates

**Simplified `WebGPUFractalEngine.ts`:**

- Replaced 60-line `setupInputCallbacks()` with 25-line `createInputCallbacks()`
- Callbacks passed directly to InputHandler constructor
- Cleaner, more declarative setup

### Benefits Achieved

- 87% reduction in callback boilerplate (20 fields + 20 setters → 1 interface)
- Single source of truth for callback types
- Easier to add new callbacks (just add to interface)
- Engine setup is now declarative object literal

---

## Phase 4: Create Proper Types ✅ COMPLETE

**Status:** Completed February 2026

### Results

Created `src/types/` directory with dedicated type modules:

```
src/types/
├── index.ts      # Re-exports all types
├── Complex.ts    # Complex number type and operations
├── Point.ts      # Screen and fractal coordinate points
└── Color.ts      # RGB colors and Vec3/Vec4 types
```

### What Was Created

**`Complex.ts` (82 lines):**

- `Complex` interface with `real` and `imag` fields
- Factory functions: `complex()`, `complexFromTuple()`, `complexToTuple()`
- Operations: `complexAdd()`, `complexSub()`, `complexMul()`, `complexMag()`, `complexMagSq()`
- Formatting: `complexToString()`

**`Point.ts` (50 lines):**

- `ScreenPoint` — pixel coordinates with `x`, `y`
- `FractalPoint` — complex plane coordinates with `real`, `imag`
- `ScreenSize` — dimensions with `width`, `height`

**`Color.ts` (72 lines):**

- `Vec3`, `Vec4` — tuple types for shader compatibility
- `RGBColor`, `RGBAColor` — structured color types
- `rgb()`, `rgba()`, `rgbFromVec3()`, `rgbToVec3()`
- `lerpColor()`, `lerpVec3()` — interpolation helpers

### Integration

The main `src/types.ts` now re-exports all types from the new module:

```typescript
export * from './types/index';
```

This allows gradual migration — existing code continues to work while new code can use the proper
types.

### Benefits

- Type-safe complex number operations
- Self-documenting coordinate types
- Reusable interpolation helpers
- Foundation for future refactoring (replace tuples incrementally)

---

## Phase 5: Split Palettes Module ✅ COMPLETE

**Status:** Completed February 2026

### Results

| File                  | Lines | Purpose                              |
| --------------------- | ----- | ------------------------------------ |
| `types.ts`            | 48    | Type definitions                     |
| `cosinePalettes.ts`   | 148   | Cosine palette data                  |
| `gradientPalettes.ts` | 155   | Gradient palette data + HDR          |
| `helpers.ts`          | 62    | Accessor functions                   |
| `index.ts`            | 32    | Re-exports                           |
| `Palettes.ts`         | 9     | Facade (re-exports from module)      |
| **Total**             | 454   | (vs 383 original, +71 for structure) |

### Structure Created

```
src/renderer/palettes/
├── index.ts              # Re-exports
├── types.ts              # PaletteParams, CosinePaletteParams, etc.
├── cosinePalettes.ts     # COSINE_PALETTES array (12 palettes)
├── gradientPalettes.ts   # GRADIENT_PALETTES array (7 palettes + HDR)
└── helpers.ts            # getCosinePalette, getGradientPaletteParams, etc.
```

### Benefits Achieved

- Clear separation: types, data, and helpers in separate files
- Easier to add new palettes (just edit the appropriate data file)
- Types are reusable across the codebase
- Original `Palettes.ts` remains as facade for backward compatibility

---

## Phase 6: Isolate Rendering Pipeline (Low Impact, High Effort)

> **Status:** Optional / Low Priority
>
> _"Technically valid, but the juice isn't worth the squeeze anymore."_ — Skippy, February 2026

### Original Problem

`WebGPUFractalEngine.ts` mixes:

- Pipeline setup
- Uniform buffer management
- Render loop
- State management

### Current Assessment (February 2026)

After completing Phases 1-5, 7 and adding Tourist Mode + Fractal Interpolation:

| Metric                   | Before Cleanup | After Cleanup | Current    |
| ------------------------ | -------------- | ------------- | ---------- |
| `WebGPUFractalEngine.ts` | 1,174 lines    | 788 lines     | ~950 lines |

The engine grew back due to:

- Tourist mode integration (~100 lines)
- Fractal interpolation blend params (~30 lines)
- Auto-tourist timer logic (~50 lines)
- Animation helpers (`animateToLocation`, `animateFractalCycle`)

**However**, the growth is in _business logic_, not GPU pipeline code. The actual pipeline code is:

- Pipeline initialization: ~75 lines (stable, rarely changes)
- Uniform packing: ~100 lines (tightly coupled to state)
- Render execution: ~25 lines (trivial)

### Why Low Priority

1. **Tight coupling**: Uniform packing reads `state.interpolatedBlendParams`,
   `state.interpolatedPaletteParams`, etc. Extracting it requires passing significant context.

2. **Stable code**: The pipeline structure hasn't changed since initial implementation. No
   maintenance pain.

3. **Better alternatives**: If we want to reduce engine size, consider:
   - `BookmarkController` — URL handling, share functionality (~100 lines)
   - `JuliaPickerController` — Julia picker state machine (~80 lines)
   - `TouristModeController` — Auto-tourist timer, start/stop logic (~100 lines)

### Original Solution (Still Valid If Needed)

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
  blendParams: FractalBlendParams | null;
}
```

This would extract ~200 lines, dropping the engine to ~750 lines.

### Recommendation

**Skip this phase** unless:

- We add a second render pipeline (e.g., WebGL fallback)
- We need to support multiple shader variants
- The uniform packing logic becomes significantly more complex

The current 950-line engine is acceptable. The code is organized, the responsibilities are clear,
and the size is manageable.

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

| Phase               | Impact | Effort | Dependencies | Status             |
| ------------------- | ------ | ------ | ------------ | ------------------ |
| 1. UI Layer         | High   | Medium | None         | ✅ Complete        |
| 2. State Management | High   | Medium | None         | ✅ Complete        |
| 3. Input Handler    | Medium | Low    | Phase 2      | ✅ Complete        |
| 4. Proper Types     | Low    | Low    | None         | ✅ Complete        |
| 5. Split Palettes   | Low    | Low    | None         | ✅ Complete        |
| 6. Render Pipeline  | Low    | High   | Phase 2      | ⏭️ Skip (optional) |
| 7. Famous Locations | Low    | Low    | None         | ✅ Complete        |

---

## Current Architecture

After completing phases 1-5, 7, the dependency graph looks like:

```
main.ts
    └── WebGPUFractalEngine (orchestrator, ~950 lines)
            ├── FractalState (state management)
            ├── InputHandler (events only)
            ├── WebGPURenderer (context/canvas)
            ├── OverlayManager (all UI)
            ├── BookmarkManager (URL state)
            ├── TouristMode (auto-tour + interpolation)
            └── FractalBlend (type interpolation params)
```

**`WebGPUFractalEngine.ts` responsibilities:**

- Pipeline initialization (~75 lines)
- Uniform buffer packing (~100 lines)
- Input callback setup (~40 lines)
- Control methods (iterations, palettes, fractals) (~150 lines)
- Julia picker state machine (~80 lines)
- Location/bookmark handling (~100 lines)
- Tourist mode integration (~100 lines)
- Auto-tourist timer (~50 lines)

The engine is larger than ideal but each section is cohesive. Further extraction is possible but not
urgent.

---

## Metrics

### Before (original, January 2026)

| File                   | Lines     |
| ---------------------- | --------- |
| WebGPUFractalEngine.ts | 1,174     |
| InputHandler.ts        | 722       |
| famousLocations.ts     | 711       |
| Palettes.ts            | 384       |
| **Total (main files)** | **2,991** |

### Current (February 2026, after all phases + new features)

| File                   | Lines  |
| ---------------------- | ------ |
| WebGPUFractalEngine.ts | 953    |
| InputHandler.ts        | 587    |
| InputCallbacks.ts      | 50     |
| TouristMode.ts         | 722    |
| FractalBlend.ts        | 193    |
| ui/ (6 files)          | 530    |
| state/ (2 files)       | 389    |
| locations/ (split)     | ~700   |
| palettes/ (split)      | ~450   |
| **Total**              | ~4,574 |

**Analysis:**

- Engine: 1,174 → 953 lines (**-221 lines, -19%**) despite adding tourist mode integration
- InputHandler: 722 → 587 lines (**-135 lines, -19%**)
- Total codebase grew due to new features (TouristMode, FractalBlend), but each file has clearer
  responsibility
- No single file over 1000 lines
- The "growth" is healthy — new capabilities, not complexity

### Target (if Phase 6 were implemented)

| File                   | Lines |
| ---------------------- | ----- |
| WebGPUFractalEngine.ts | ~750  |
| FractalPipeline.ts     | ~200  |

**Not recommended** — the 200-line reduction isn't worth the abstraction overhead given current
stability.

---

## Quick Wins

All quick wins are now complete:

1. ~~**Extract `createHelpContent()`**~~ ✅ Done (now in `HelpOverlay.ts`)
2. ~~**Extract iteration helpers**~~ ✅ Done (`maxIterationsForZoom()` now in
   `state/FractalState.ts`)
3. ~~**Group notification methods**~~ ✅ Done (now in `NotificationOverlay.ts`)
4. ~~**Type alias cleanup**~~ ✅ Done (`Complex`, `ScreenPoint`, `FractalPoint` in `src/types/`)

---

_"There. A roadmap to redemption. You're welcome."_ — Skippy
