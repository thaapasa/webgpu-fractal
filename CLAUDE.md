# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start Vite dev server (localhost:5173)
npm run build        # TypeScript check + Vite production build
npm run preview      # Serve production build locally
npm run lint         # Type-check only (tsc --noEmit)
npm run format       # Prettier format all source files
npm run format:check # Check formatting without writing
```

No test framework is configured. There are no unit tests.

## Architecture

WebGPU fractal explorer with HDR support. Zero runtime dependencies — pure browser WebGPU API.

### Rendering Pipeline

Multi-pass GPU pipeline:

1. **Fractal pass** (`mandelbrot.wgsl`) — full-screen triangle, fragment shader computes fractal iterations for each pixel. All 20 fractal types are handled via blend parameters in a single shader, not separate shaders per type.
2. **Post-processing** (`PostProcessingPipeline.ts`) — optional multi-pass: bloom extract -> Gaussian blur (H+V) -> composite. Four presets (Clean/Cinematic/Vivid/Dreamy). Clean = no post-processing, zero overhead.

### Key Components

- **`WebGPUFractalEngine`** — central orchestrator. Owns the render loop (`requestAnimationFrame`), wires together renderer, state, input, overlays, tourist mode. All rendering state is packed into a single 256-byte uniform buffer (16-byte aligned).
- **`FractalState`** — centralized state with typed change listeners (`'view'`, `'fractalType'`, `'julia'`, `'palette'`, `'iterations'`, `'brightness'`, `'all'`). Auto-scales max iterations based on zoom level.
- **`WebGPURenderer`** — WebGPU device/context initialization, HDR mode detection and configuration (`rgba16float` + extended tone mapping).
- **`InputHandler`** — mouse/touch/keyboard. Long-press detection (400ms) on number keys triggers smooth animated transitions vs instant jumps.
- **`ViewState`** — screen-to-complex-plane coordinate transforms, pan/zoom state.

### Fractal System

20 types = 10 base fractals + 10 Julia variants. The `FractalBlend` system interpolates between blendable types using 7 blend parameters (pre/post abs, neg transforms). Phoenix, Multibrot3, Multibrot4 are non-blendable.

### Palette System

Two palette types: **cosine** (`a + b * cos(2pi * (c*t + d))`) and **gradient** (5-color stop interpolation). Each classified as monotonic or cycling, which affects HDR brightness curves in the shader.

### Shader Uniforms

The fractal shader uses a single uniform buffer. When modifying uniforms, maintain 16-byte alignment. The buffer layout is defined in `WebGPUFractalEngine.ts` and must match the WGSL struct in `mandelbrot.wgsl`.

### URL Bookmarks

`BookmarkManager` encodes full state (position, zoom, fractal type, palette, Julia constant, iterations) in the URL hash. Shareable links.

### Tourist Mode

`TouristMode` auto-explores famous locations with smooth palette interpolation and fractal type morphing. Starts after 20s inactivity. Any input stops it.

## Conventions

- Path alias: `@/*` maps to `src/*`
- Barrel exports via `index.ts` in feature directories
- Shaders imported as raw strings via `?raw` suffix
- "Skippy the Magnificent" is the in-universe voice in comments
