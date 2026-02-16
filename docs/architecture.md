# Fractal Explorer - Architecture Overview

_"Sir, this document provides a technical overview of the system architecture for anyone joining the
project. I've organized it by component responsibility."_ _— Jennifer Simms_

---

## Document Info

| Field        | Value                  |
| ------------ | ---------------------- |
| Last Updated | February 2026          |
| Status       | Current implementation |
| Maintainer   | Simms (documentation)  |

> **📋 Refactoring Complete**: All planned cleanup phases (1-5, 7) complete. Only Phase 6 (render
> pipeline isolation) remains as optional future work. See [cleanup-plan.md](./cleanup-plan.md).

---

## System Overview

Fractal Explorer is a GPU-accelerated fractal renderer built with TypeScript and WebGPU. The
application supports 10 base fractal types (Mandelbrot, Burning Ship, Tricorn, Celtic, Buffalo,
Phoenix, Multibrot³, Multibrot⁴, Funky, Perpendicular) each with a Julia variant (20 total), runs
entirely in the browser, and features HDR (High Dynamic Range) rendering on compatible displays.

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                             │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐    ┌───────────────────┐  ┌───────────-──┐ │
│  │   main.ts   │───▶│WebGPUFractalEngine│─▶│WebGPURenderer│ │
│  │  (entry)    │    │  (orchestrator)   │  │  (context)   │ │
│  └─────────────┘    └─────────┬─────────┘  └──────┬─────-─┘ │
│                               │                   │         │
│                        ┌──────┴──────┐      ┌─────┴─────┐   │
│                        │             │      │           │   │
│                 ┌──────▼─────┐ ┌─────▼────┐ │ Palettes  │   │
│                 │InputHandler│ │ViewState │ │ (colors)  │   │
│                 │  (events)  │ │(viewport)│ └───────────┘   │
│                 └────────────┘ └──────────┘                 │
│                                                             │
│  GPU ═══════════════════════════════════════════════════    │
│  ║ mandelbrot.wgsl (WGSL)                               ║   │
│  ║ - Vertex shader (fullscreen triangle)                ║   │
│  ║ - Fragment shader (fractal computation + HDR)        ║   │
│  ═══════════════════════════════════════════════════════    │
└─────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

| Layer      | Technology                          | Version |
| ---------- | ----------------------------------- | ------- |
| Language   | TypeScript                          | ^5.3    |
| Build Tool | Vite                                | ^5.0    |
| Rendering  | WebGPU                              | —       |
| Shaders    | WGSL                                | —       |
| HDR        | rgba16float + extended tone mapping | —       |

---

## Module Organization

The codebase follows a modular architecture where each directory has a single responsibility:

```
src/
├── bookmark/      → URL sharing and famous locations
├── controls/      → User input handling
├── fractal/       → Core engine orchestration
├── renderer/      → WebGPU rendering and palettes
├── state/         → Centralized state management
├── tourist/       → Automated exploration mode
├── types/         → Shared type definitions
└── ui/            → Overlay components
```

**Design Principles:**

1. **Facade Pattern**: Large modules (`palettes/`, `locations/`) use a facade file that re-exports
   from sub-modules, allowing internal restructuring without breaking imports.

2. **Single Responsibility**: Each module handles one concern:
   - `state/` — What the app state is
   - `controls/` — How user input changes state
   - `renderer/` — How state becomes pixels
   - `ui/` — How state is displayed as overlays

3. **Dependency Direction**: Dependencies flow inward toward core types:

   ```
   ui/ → state/ → types/
   controls/ → state/ → types/
   fractal/ → renderer/, state/, controls/, ui/
   ```

4. **Data Separation**: Configuration data (palettes, locations) is separated from logic:
   - `palettes/cosinePalettes.ts` — Just palette data
   - `palettes/helpers.ts` — Just accessor functions
   - `locations/mandelbrot.ts` — Just Mandelbrot locations | Build Tool | Vite | ^5.0 | | Rendering
     | WebGPU | — | | Shaders | WGSL | — | | HDR | rgba16float + extended tone mapping | — |

---

## Core Components

### 1. Entry Point (`src/main.ts`)

Initializes the application:

- Checks WebGPU support (shows error message if unavailable)
- Creates the canvas element
- Instantiates `WebGPUFractalEngine`
- Handles initialization errors with user-friendly messages
- Cleans up on page unload

### 2. Fractal Engine (`src/fractal/WebGPUFractalEngine.ts`)

The central orchestrator that ties all components together.

**Responsibilities:**

- Initializes and owns all other components
- Creates WebGPU render pipeline and uniform buffers
- Manages the render loop
- Coordinates shader uniform updates
- Handles window resize and HDR display changes

**Key Features:**

- **Multiple fractal types**: 10 base types (Mandelbrot, Burning Ship, Tricorn, Celtic, Buffalo,
  Phoenix, Multibrot³, Multibrot⁴, Funky, Perpendicular), each with Julia variant — 20 total (cycle
  with `f`/`F` keys)
- **Julia picker mode**: Select Julia constant by clicking on any base fractal (`j` key)
- **Auto-scaling iterations**: Automatically increases `maxIterations` as zoom deepens (configurable
  with `+`/`-` keys)
- **Two palette types**: 12 cosine palettes (cycle with `c`/`C`) and 7 gradient palettes (cycle with
  `g`/`G`), with separate SDR and HDR variants for gradients
- **Color offset**: Shift the color cycle with `,`/`.` keys
- **HDR rendering**: Auto-detected, with adjustable brightness bias (`b`/`B`/`d` keys)
- **Famous locations**: Context-sensitive curated spots accessible via number keys `1`–`9`; each
  fractal family has its own location collection
- **URL bookmarking**: Share views via URL hash parameters (`s` to copy link)
- **Help overlay**: In-app keyboard shortcut reference (`h` to toggle)
- **Screenshot mode**: Hide all UI for clean screenshots (`Space` to toggle)
- **Debug overlay**: Shows current fractal type, zoom level, iteration count, palette name, HDR
  status, and Julia constant (when applicable)

**Render Pipeline:**

1. Update uniform buffer with current state and palette parameters
2. Execute render pass with fullscreen triangle
3. Fragment shader computes fractal + applies HDR brightness curve

### 3. WebGPU Renderer (`src/renderer/WebGPURenderer.ts`)

Manages the WebGPU context and canvas lifecycle.

**Responsibilities:**

- Acquires WebGPU adapter and device
- Configures canvas context for HDR when supported
- Handles high-DPI displays via `devicePixelRatio`
- Manages canvas resize
- Runs the animation frame loop
- Monitors HDR display changes via media queries

**HDR Configuration:**

```typescript
context.configure({
  device: this.device,
  format: 'rgba16float', // 16-bit float per channel
  alphaMode: 'opaque',
  toneMapping: { mode: 'extended' }, // Enables HDR output
});
```

**HDR Detection:**

The renderer uses `matchMedia('(dynamic-range: high)')` to detect HDR displays and listens for
changes when the user modifies display settings.

### 4. Palettes (`src/renderer/palettes/`)

Color palette definitions, organized into separate modules:

```
palettes/
├── types.ts           # PaletteParams, CosinePaletteParams, etc.
├── cosinePalettes.ts  # 12 cycling palettes (Rainbow, Fire, Ice, etc.)
├── gradientPalettes.ts # 7 monotonic palettes with HDR variants
├── helpers.ts         # getCosinePalette, getGradientPaletteParams, etc.
└── index.ts           # Re-exports everything
```

**Palette Types:**

- **Cosine palettes**: `color = a + b * cos(2π * (c * t + d))` — used for cycling palettes
- **Gradient palettes**: 5-stop linear gradients — used for monotonic palettes

**HDR Variants:**

Monotonic palettes have optional HDR-specific color stops (brighter, more saturated) because HDR
uses a brightness curve rather than color darkness to show iteration depth.

**Cosine Palettes (12):**

| Index | Name     |
| ----- | -------- |
| 0     | Rainbow  |
| 1     | Fire     |
| 2     | Ice      |
| 3     | Sunset   |
| 4     | Electric |
| 5     | Neon     |
| 6     | Emerald  |
| 7     | Candy    |
| 8     | Plasma   |
| 9     | Peacock  |
| 10    | Autumn   |
| 11    | Aurora   |

**Gradient Palettes (7):**

| Index | Name      |
| ----- | --------- |
| 0     | Blue      |
| 1     | Gold      |
| 2     | Grayscale |
| 3     | Sepia     |
| 4     | Ocean     |
| 5     | Purple    |
| 6     | Forest    |

### 5. View State (`src/controls/ViewState.ts`)

Manages the current viewport in fractal coordinate space.

**State:**

| Property  | Type   | Description                          |
| --------- | ------ | ------------------------------------ |
| `centerX` | number | Real component of view center        |
| `centerY` | number | Imaginary component of view center   |
| `zoom`    | number | Zoom factor (1.0 = full set visible) |

**Methods:**

- `pan(deltaX, deltaY, screenW, screenH)` — Move view by screen pixels
- `zoomAt(screenX, screenY, factor, screenW, screenH)` — Zoom centered on cursor
- `toFractalCoords(screenX, screenY, screenW, screenH)` — Screen → fractal
- `toScreenCoords(fractalX, fractalY, screenW, screenH)` — Fractal → screen
- `reset()` — Return to initial view

**Initial View:**

- Center: `(-0.5, 0.0)` — Shows the full Mandelbrot set nicely centered
- Zoom: `1.0`

**Zoom Limits:**

- Minimum: `0.1` (zoom out)
- Maximum: `1e15` (limited by float32 precision)

### 6. Input Handler (`src/controls/InputHandler.ts`)

Translates browser events into application actions via the `InputCallbacks` interface.

**Architecture:**

```typescript
// InputCallbacks.ts - Single interface for all input events
interface InputCallbacks {
  onIterationAdjust?(direction: 1 | -1): void;
  onCosinePaletteCycle?(direction: 1 | -1): void;
  onColorOffsetAdjust?(delta: number): void;
  onFractalCycle?(direction: 1 | -1): void;
  onLocationSelect?(key: string): void;
  // ... etc
}

// Callbacks passed to constructor
new InputHandler(canvas, viewState, onChange, callbacks);
```

**Supported Interactions:**

| Input        | Action                                   |
| ------------ | ---------------------------------------- |
| Mouse drag   | Pan                                      |
| Scroll wheel | Zoom at cursor                           |
| Double-click | Zoom in 2× at cursor                     |
| Touch drag   | Pan (mobile)                             |
| Pinch        | Zoom at midpoint (mobile)                |
| `z` / `Z`    | Keyboard zoom in/out (hold key)          |
| `f` / `F`    | Cycle fractal type forward/backward      |
| `j`          | Toggle Julia picker mode                 |
| `+` / `-`    | Increase/decrease iterations             |
| `0`          | Reset to auto-scaling iterations         |
| `c` / `C`    | Cycle cosine palettes forward/backward   |
| `g` / `G`    | Cycle gradient palettes forward/backward |
| `,` / `.`    | Shift color offset fine                  |
| `<` / `>`    | Shift color offset coarse                |
| `r`          | Reset color offset                       |
| `b`          | Extend HDR bright region                 |
| `B`          | Contract HDR bright region               |
| `d`          | Reset HDR brightness                     |
| `1`–`9`      | Jump to famous locations (tap or hold)   |
| `t`          | Toggle tourist mode (auto-exploration)   |
| `s`          | Copy shareable URL to clipboard          |
| `h`          | Toggle help overlay                      |
| `Space`      | Toggle screenshot mode                   |

### 7. Bookmark Manager (`src/bookmark/BookmarkManager.ts`)

Handles URL-based state persistence and sharing.

**Responsibilities:**

- Encodes application state into compact URL hash parameters
- Decodes state from URL hash on page load
- Updates browser URL without triggering navigation
- Copies shareable URLs to clipboard

**URL Parameters:**

| Param | Full Name       | Description                                 |
| ----- | --------------- | ------------------------------------------- |
| `t`   | type            | Fractal type (0–19)                         |
| `x`   | centerX         | View center X coordinate                    |
| `y`   | centerY         | View center Y coordinate                    |
| `z`   | zoom            | Zoom level                                  |
| `pt`  | paletteType     | Palette type ('c' = cosine, 'g' = gradient) |
| `cp`  | cosinePalette   | Cosine palette index (0–11)                 |
| `gp`  | gradientPalette | Gradient palette index (0–6)                |
| `o`   | colorOffset     | Color cycle offset                          |
| `jr`  | juliaReal       | Julia constant real component               |
| `ji`  | juliaImag       | Julia constant imaginary component          |
| `i`   | iterations      | Max iterations override                     |
| `aa`  | antialiasing    | Antialiasing enabled                        |

### 8. Famous Locations (`src/bookmark/locations/`)

Curated collection of interesting fractal coordinates, organized by fractal family:

```
locations/
├── types.ts         # FamousLocation interface
├── helpers.ts       # createLocation factory function
├── mandelbrot.ts    # 9 Mandelbrot/Julia locations
├── burningShip.ts   # 8 Burning Ship locations
├── tricorn.ts       # 7 Tricorn locations
├── celtic.ts        # 7 Celtic locations
├── buffalo.ts       # 6 Buffalo locations
├── phoenix.ts       # 5 Phoenix locations
├── multibrot3.ts    # 7 Multibrot³ locations
├── multibrot4.ts    # 5 Multibrot⁴ locations
├── funky.ts         # 7 Funky locations
├── perpendicular.ts # 6 Perpendicular locations
└── index.ts         # Re-exports and accessor functions
```

**Context-Sensitive Locations:**

Locations are organized by base fractal type. When you press a number key `1`–`9`, you visit a
location from the current fractal's family. Both base and Julia variants of a fractal share the same
location collection.

| Fractal Family | # Locations | Example Locations                          |
| -------------- | ----------- | ------------------------------------------ |
| Mandelbrot     | 9           | Seahorse Valley, Douady Rabbit Julia       |
| Burning Ship   | 8           | Main Ship, The Armada, Space Brain Julia   |
| Tricorn        | 7           | Lightning Bolts Julia, Spiral Mosaic Julia |
| Celtic         | 7           | Celtic Knot, Tendrils Julia, Petri Dish    |
| Buffalo        | 6           | Overgrown Cities, Industrial Snowflake     |
| Phoenix        | 5           | Classic Phoenix Julia, Fiery Phoenix       |
| Multibrot³     | 7           | Three-fold Spirals, Spiral Galaxies Julia  |
| Multibrot⁴     | 5           | Atomic Spirals Julia, Triple Elephant      |
| Funky          | 7           | Tulip Bulb, Battleship Julia               |
| Perpendicular  | 6           | Seed Pod, Peacock Eyes Julia               |

Each location stores complete `BookmarkState` including position, zoom, fractal type, palette, color
offset, and iteration settings.

### 9. UI Overlays (`src/ui/`)

The UI module provides all on-screen overlays, coordinated by the `OverlayManager`.

**Components:**

| Component             | Responsibility                                         |
| --------------------- | ------------------------------------------------------ |
| `OverlayManager`      | Coordinates all overlays, manages screenshot mode      |
| `DebugOverlay`        | Status bar showing zoom, iterations, palette, HDR info |
| `FPSOverlay`          | Frames per second counter (bottom-right)               |
| `HelpOverlay`         | Keyboard shortcuts reference (toggle with `h`)         |
| `NotificationOverlay` | Toast notifications for actions (share, location, etc) |

**Screenshot Mode:**

When enabled (`Space` key), hides debug and FPS overlays while keeping notifications visible. The
`OverlayManager` coordinates this state across all overlay components.

### 10. Tourist Mode (`src/tourist/TouristMode.ts`)

Automated fractal exploration that navigates between famous locations.

**Features:**

- Smooth animated transitions between locations
- Automatic palette interpolation during transitions
- Random selection of next destination (avoids immediate repeats)
- Can switch between fractal types during the tour
- User interaction immediately stops the tour

### 11. State Management (`src/state/`)

Centralized state management for all fractal-related state.

**`FractalState` Class:**

| Property                | Type                   | Description                         |
| ----------------------- | ---------------------- | ----------------------------------- |
| `view`                  | `ViewState`            | Pan/zoom state (owned)              |
| `fractalType`           | `FractalType`          | Current fractal type (0-19)         |
| `juliaC`                | `[number, number]`     | Julia set constant                  |
| `juliaPickerMode`       | `boolean`              | Whether Julia picker is active      |
| `paletteType`           | `'cosine'\|'gradient'` | Current palette type                |
| `cosinePaletteIndex`    | `number`               | Selected cosine palette (0-11)      |
| `gradientPaletteIndex`  | `number`               | Selected gradient palette (0-6)     |
| `colorOffset`           | `number`               | Color cycle offset                  |
| `maxIterationsOverride` | `number \| null`       | Manual iteration override           |
| `hdrBrightnessBias`     | `number`               | HDR brightness adjustment (-1 to 1) |
| `sdrGradientBrightness` | `number`               | SDR gradient brightness (0.1 to 10) |

**Key Methods:**

- `toBookmark()` — Convert state to `BookmarkState` for URL sharing
- `fromBookmark(partial)` — Load state from partial bookmark (URL params)
- `applyBookmark(full)` — Apply complete bookmark (famous location)
- `applyPartial(partial)` — Apply partial update (tourist mode animation)
- `addListener(callback)` — Subscribe to state changes

**Utility Functions:**

- `maxIterationsForZoom(zoom, isJulia)` — Calculate auto-scaled iteration count

### 12. Types Module (`src/types/`)

Shared type definitions used throughout the codebase:

```
types/
├── Complex.ts   # Complex number type and operations
├── Point.ts     # ScreenPoint, FractalPoint, ScreenSize
├── Color.ts     # Vec3, Vec4, RGBColor, color utilities
└── index.ts     # Re-exports everything
```

**Key Types:**

| Type            | Description                           |
| --------------- | ------------------------------------- |
| `Complex`       | Complex number with `real` and `imag` |
| `ScreenPoint`   | Pixel coordinates with `x` and `y`    |
| `FractalPoint`  | Complex plane coordinates             |
| `Vec3` / `Vec4` | Tuple types for shader compatibility  |
| `RGBColor`      | Structured color with `r`, `g`, `b`   |

**Helper Functions:**

- `complex(real, imag)` — Create complex number
- `complexToString(c)` — Format for display
- `lerpVec3(a, b, t)` — Linear interpolation

---

## Shader (`src/renderer/shaders/mandelbrot.wgsl`)

A single WGSL shader file containing both vertex and fragment stages.

### Vertex Stage

A minimal fullscreen triangle shader (more efficient than a quad):

- Uses 3 vertices to cover the entire screen
- No vertex buffer needed — positions computed from vertex index
- Passes UV coordinates to fragment stage

### Fragment Stage

The core fractal computation with HDR support:

**Uniforms (passed via uniform buffer):**

| Uniform             | Type  | Description                            |
| ------------------- | ----- | -------------------------------------- |
| `resolution`        | vec2f | Canvas size in pixels                  |
| `center`            | vec2f | View center in fractal coords          |
| `zoom`              | f32   | Current zoom level                     |
| `maxIterations`     | i32   | Iteration limit                        |
| `time`              | f32   | Time in seconds (for animations)       |
| `colorOffset`       | f32   | Color cycle offset                     |
| `fractalType`       | i32   | Fractal type (0–19)                    |
| `juliaC`            | vec2f | Julia set constant (for Julia types)   |
| `hdrEnabled`        | i32   | Whether HDR output is active           |
| `hdrBrightnessBias` | f32   | Brightness curve adjustment (-1 to +1) |
| `paletteType`       | i32   | 0 = cosine, 1 = gradient               |
| `isMonotonic`       | i32   | Whether palette is monotonic           |
| `paletteA/B/C/D`    | vec3f | Cosine palette parameters              |
| `gradientC1–C5`     | vec3f | Gradient color stops                   |

**Fractal Types:**

| Value | Name                | Formula                                 |
| ----- | ------------------- | --------------------------------------- |
| 0     | Mandelbrot          | z = z² + c                              |
| 1     | Mandelbrot Julia    | z = z² + c (z starts at pixel, c fixed) |
| 2     | Burning Ship        | z = (\|Re(z)\| + i\|Im(z)\|)² + c       |
| 3     | Burning Ship Julia  | Burning Ship with fixed c               |
| 4     | Tricorn             | z = conj(z)² + c                        |
| 5     | Tricorn Julia       | Tricorn with fixed c                    |
| 6     | Celtic              | z = (\|Re(z²)\| + i·Im(z²)) + c         |
| 7     | Celtic Julia        | Celtic with fixed c                     |
| 8     | Buffalo             | z = \|z²\| + c                          |
| 9     | Buffalo Julia       | Buffalo with fixed c                    |
| 10    | Phoenix             | z = z² + c + p·z_prev                   |
| 11    | Phoenix Julia       | Phoenix with fixed c                    |
| 12    | Multibrot³          | z = z³ + c                              |
| 13    | Multibrot³ Julia    | Multibrot³ with fixed c                 |
| 14    | Multibrot⁴          | z = z⁴ + c                              |
| 15    | Multibrot⁴ Julia    | Multibrot⁴ with fixed c                 |
| 16    | Funky               | z = \|Re(z)\| + i·Im(z²) + c            |
| 17    | Funky Julia         | Funky with fixed c                      |
| 18    | Perpendicular       | z = Re(z)·\|Im(z)\| (perpendicular) + c |
| 19    | Perpendicular Julia | Perpendicular with fixed c              |

**Algorithm:**

1. Map pixel UV to complex coordinate
2. For Mandelbrot/Burning Ship: z starts at 0, c is pixel position
3. For Julia variants: z starts at pixel position, c is fixed constant
4. Iterate z = z² + c (with absolute value step for Burning Ship variants) until |z| > 2 or max
   iterations reached
5. If max iterations reached: pixel is black (in set)
6. Otherwise: compute smooth iteration count for anti-banding
7. Get color from palette (cosine or gradient)
8. Apply HDR brightness curve if HDR enabled
9. Output color (values > 1.0 allowed for HDR)

**HDR Brightness Curves:**

Two separate curves are used based on palette type:

- **Monotonic palettes**: Dark-to-bright journey controlled by HDR brightness
  - Low iterations: very dim (3% → 15%)
  - Mid iterations: moderate (15% → 100%)
  - High iterations: HDR boost (100% → 1000% peak)

- **Cycling palettes**: Stay bright throughout, HDR highlights near boundary
  - Most of image: 85% → 100%
  - Near boundary: HDR boost to peak

The `hdrBrightnessBias` uniform shifts where bright regions appear:

- Positive values: more of image becomes bright
- Negative values: only near-boundary is bright

---

## Data Flow

### User Interaction Flow

```
User Input → InputHandler → ViewState → WebGPUFractalEngine.render()
                                              ↓
                                        Update uniform buffer
                                              ↓
                                        Draw fullscreen triangle
                                              ↓
                                        Fragment shader computes
                                        each pixel in parallel
```

### Render Loop

```
requestAnimationFrame loop
       ↓
WebGPUFractalEngine.render()
       ↓
┌────────────────────────────────┐
│ Update uniform buffer          │
│ - View state (center, zoom)    │
│ - Fractal params               │
│ - Palette params               │
│ - HDR settings                 │
└────────────────────────────────┘
       ↓
┌────────────────────────────────┐
│ Execute render pass            │
│ - Draw fullscreen triangle     │
│ - Fragment shader computes     │
│   fractal + color + HDR        │
└────────────────────────────────┘
```

---

## Performance Considerations

### Implemented Optimizations

- **GPU computation**: All fractal math runs in parallel on GPU
- **No branching in shader**: Palette parameters passed as uniforms instead of palette index
- **Fullscreen triangle**: More efficient than fullscreen quad (3 vertices vs 6)
- **High-DPI support**: Canvas resolution matches device pixel ratio
- **Discrete GPU preference**: Requests high-performance GPU when available
- **HDR via extended tone mapping**: No post-process pass needed for HDR

### Auto-Scaling Iterations

The iteration count scales with zoom depth to balance quality and performance:

```
maxIter = BASE + SCALE × log₁₀(zoom)^POWER
```

- Base: 256 iterations at zoom 1
- Auto cap: 4096 iterations (can be bypassed manually)
- User can override with `+`/`-` keys for extreme zooms

---

## File Structure

```
src/
├── main.ts                        # Application entry point
├── types.ts                       # Re-exports all types
├── bookmark/
│   ├── BookmarkManager.ts         # URL-based state sharing
│   ├── famousLocations.ts         # Facade (re-exports from locations/)
│   └── locations/
│       ├── index.ts               # Re-exports and accessor functions
│       ├── types.ts               # FamousLocation interface
│       ├── helpers.ts             # createLocation factory
│       ├── mandelbrot.ts          # Mandelbrot locations
│       ├── burningShip.ts         # Burning Ship locations
│       ├── tricorn.ts             # Tricorn locations
│       ├── celtic.ts              # Celtic locations
│       ├── buffalo.ts             # Buffalo locations
│       ├── phoenix.ts             # Phoenix locations
│       ├── multibrot3.ts          # Multibrot³ locations
│       ├── multibrot4.ts          # Multibrot⁴ locations
│       ├── funky.ts               # Funky locations
│       └── perpendicular.ts       # Perpendicular locations
├── controls/
│   ├── InputCallbacks.ts          # Input callback interface
│   ├── InputHandler.ts            # Mouse, touch, keyboard events
│   └── ViewState.ts               # Pan/zoom state management
├── fractal/
│   └── WebGPUFractalEngine.ts     # Central orchestrator
├── renderer/
│   ├── WebGPURenderer.ts          # WebGPU context and HDR config
│   ├── Palette.ts                 # Facade (re-exports from palettes/)
│   ├── palettes/
│   │   ├── index.ts               # Module exports
│   │   ├── types.ts               # Palette type definitions
│   │   ├── cosinePalettes.ts      # Cosine palette data (12 palettes)
│   │   ├── gradientPalettes.ts    # Gradient palette data (7 + HDR)
│   │   └── helpers.ts             # Accessor functions
│   └── shaders/
│       └── mandelbrot.wgsl        # WGSL shader (fractal + HDR)
├── state/
│   ├── index.ts                   # Module exports
│   └── FractalState.ts            # Centralized state management
├── tourist/
│   └── TouristMode.ts             # Automated fractal exploration
├── types/
│   ├── index.ts                   # Re-exports all types
│   ├── Complex.ts                 # Complex number type and operations
│   ├── Point.ts                   # Screen and fractal coordinate points
│   └── Color.ts                   # RGB colors and Vec3/Vec4 types
└── ui/
    ├── index.ts                   # Module exports
    ├── OverlayManager.ts          # Coordinates all UI overlays
    ├── DebugOverlay.ts            # Status bar (zoom, iterations, etc.)
    ├── FPSOverlay.ts              # Frames per second counter
    ├── HelpOverlay.ts             # Keyboard shortcuts overlay
    └── NotificationOverlay.ts     # Toast notifications
```

---

## Related Documents

| Document                                                           | Purpose                         |
| ------------------------------------------------------------------ | ------------------------------- |
| [README.md](../README.md)                                          | Quick start and user guide      |
| [fractal-webapp-spec.md](./fractal-webapp-spec.md)                 | Product vision and requirements |
| [phase-1-implementation-plan.md](./phase-1-implementation-plan.md) | Phase 1 technical plan          |
| [deep-zoom-precision-plan.md](./deep-zoom-precision-plan.md)       | Future precision improvements   |
| [cleanup-plan.md](./cleanup-plan.md)                               | Code structure refactoring plan |

---

## Browser Support

| Browser | Minimum Version | Notes                        |
| ------- | --------------- | ---------------------------- |
| Chrome  | 113+            | Full support                 |
| Edge    | 113+            | Full support                 |
| Firefox | Nightly         | Requires WebGPU flag enabled |
| Safari  | —               | WebGPU in development        |

**HDR Support:**

HDR rendering requires both WebGPU support and an HDR-capable display. The app detects HDR via
`matchMedia('(dynamic-range: high)')` and auto-enables extended tone mapping when available.

---

_"Documentation complete. I'll update this when the implementation changes."_ _— Jennifer Simms_
