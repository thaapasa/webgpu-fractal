# Fractal Explorer

_GPU-accelerated fractal rendering in the browser with HDR support. Because apparently you monkeys need something pretty to look at._

---

## What Is This?

**Fractal Explorer** is a webapp that renders fractals — including the [Mandelbrot set](https://en.wikipedia.org/wiki/Mandelbrot_set), [Burning Ship](https://en.wikipedia.org/wiki/Burning_Ship_fractal), [Tricorn](https://en.wikipedia.org/wiki/Tricorn_(mathematics)), [Phoenix](https://en.wikipedia.org/wiki/Phoenix_fractal), and many more with their [Julia set](https://en.wikipedia.org/wiki/Julia_set) variants — those infinitely zoomable mathematical patterns that look like they came from another dimension — **directly on your GPU** using WebGPU. Every pixel is computed in parallel. No CPU sweat. No waiting. Just smooth, beautiful math.

**HDR Support**: On compatible displays, the fractal boundary glows with true high dynamic range brightness — colors that literally shine brighter than standard white. It's like the math is on fire.

The goal: open the app, see a fractal, drag to pan, scroll to zoom, and fall into infinity. No loading screens. No configuration menus. Just *bam*.

---

## For Monkeys Who Want to Run It

**Prerequisites:** [Node.js](https://nodejs.org/) (v20+ required) and a WebGPU-capable browser (Chrome 113+, Edge 113+, Firefox Nightly).

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

Then open your browser at the URL Vite prints (usually `http://localhost:5173`). If you see a blank page, check the console. If you see "WebGPU Not Supported," use a modern browser with WebGPU enabled.

**Build for production:**

```bash
npm run build
npm run preview   # optional: serve the built app locally
```

**Build for the `examples/` folder:**

```bash
npm run build:examples
```

Output goes to `examples/`.

---

## Live Example

**[Fractal Explorer](https://thaapasa.github.io/webgpu-fractal/examples/webgpu/)** — try it in the browser; click [here](https://thaapasa.github.io/webgpu-fractal/examples/webgl/) for WebGL version.

A static build also lives in [examples/webgpu/](./examples/webgpu/); run `npm run build:examples` then `npx serve examples` to preview locally.

---

## Controls (Pay Attention)

| Input            | Action                                     |
|------------------|--------------------------------------------|
| **Mouse drag**   | Pan                                        |
| **Scroll wheel** | Zoom (centered on cursor)                  |
| **Double‑click** | Zoom in at that spot                       |
| **Touch drag**   | Pan (mobile)                               |
| **Pinch**        | Zoom (mobile)                              |
| **f** / **F**    | Cycle fractal type forward / backward      |
| **j**            | Toggle Julia picker mode                   |
| **+** / **−**    | Increase / decrease iterations             |
| **0**            | Reset iterations to auto‑scaling           |
| **c** / **C**    | Cycle cosine palettes forward / backward   |
| **g** / **G**    | Cycle gradient palettes forward / backward |
| **,** / **.**    | Shift colors (fine)                        |
| **<** / **>**    | Shift colors (coarse)                      |
| **r**            | Reset color offset                         |
| **b**            | Extend HDR bright region                   |
| **B** (shift)    | Contract HDR bright region                 |
| **d**            | Reset HDR brightness                       |
| **1–9**          | Jump to famous locations                   |
| **s**            | Copy shareable link to clipboard           |
| **h**            | Toggle help overlay                        |
| **Space**        | Toggle screenshot mode (hides UI)          |

Zoom centers on where you're pointing. Not the center of the screen. Because that would be stupid.

### Famous Locations

Press number keys **1–9** to instantly visit curated fractal locations. Locations are **context-sensitive** — the available spots depend on your current fractal type. Each of the 10 fractal families has its own collection of interesting locations, including both base fractal views and Julia set showcases.

| Fractal Family  | Example Locations                                            |
|-----------------|--------------------------------------------------------------|
| Mandelbrot      | Seahorse Valley, Elephant Valley, Douady Rabbit Julia        |
| Burning Ship    | Main Ship, The Armada, Space Brain Julia                     |
| Tricorn         | Lightning Bolts, Spiral Mosaic Julia                         |
| Celtic          | Celtic Knot, Tendrils Julia                                  |
| Buffalo         | Overgrown Cities, Industrial Snowflake Julia                 |
| Phoenix         | Classic Phoenix Julia, Fiery Phoenix                         |
| Multibrot³      | Three-fold Spirals, Spiral Galaxies Julia                    |
| Multibrot⁴      | Atomic Spirals Julia, Triple Elephant Valley                 |
| Funky           | Tulip Bulb, Battleship Julia                                 |
| Perpendicular   | Seed Pod, Peacock Eyes Julia                                 |

Switch fractal types with `f`/`F`, then use `1`–`9` to explore that family's highlights.

### Link Sharing

Press **s** to copy a shareable URL to your clipboard. The URL encodes your current position, zoom level, fractal type, color palette, and all settings. Paste the URL to share your exact view with others—or bookmark it to return later.

### Fractal Types

The app includes **10 base fractal types**, each with a Julia variant (20 total). Cycle through them with `f`/`F`:

| Base Fractal      | Formula                                 | Julia Variant       |
|-------------------|-----------------------------------------|---------------------|
| **Mandelbrot**    | z = z² + c                              | Mandelbrot Julia    |
| **Burning Ship**  | z = (\|Re(z)\| + i\|Im(z)\|)² + c       | Burning Ship Julia  |
| **Tricorn**       | z = conj(z)² + c                        | Tricorn Julia       |
| **Celtic**        | z = (\|Re(z²)\| + i·Im(z²)) + c         | Celtic Julia        |
| **Buffalo**       | z = \|z²\| + c                          | Buffalo Julia       |
| **Phoenix**       | z = z² + c + p·z_prev                   | Phoenix Julia       |
| **Multibrot³**    | z = z³ + c                              | Multibrot³ Julia    |
| **Multibrot⁴**    | z = z⁴ + c                              | Multibrot⁴ Julia    |
| **Funky**         | z = \|Re(z)\| + i·Im(z²) + c            | Funky Julia         |
| **Perpendicular** | z = Re(z)·\|Im(z)\| + c (perpendicular) | Perpendicular Julia |

### Julia Picker Mode

Press **j** to enter Julia picker mode. Click anywhere on any base fractal to select a Julia constant. The corresponding Julia set variant will render immediately. Press **j** again to return to your previous fractal and view. This works with all 10 base fractal types — each has its own unique Julia family to explore.

---

## Tech Stack

| Layer     | Technology  |
|-----------|-------------|
| Language  | TypeScript  |
| Build     | Vite        |
| Rendering | WebGPU      |
| Shaders   | WGSL        |
| HDR       | Extended tone mapping (rgba16float) |

WebGPU, not WebGL. It's 2026 and we're doing this properly. HDR support requires `toneMapping: { mode: 'extended' }` — that's the magic sauce.

---

## Project Layout

```
src/
├── main.ts                 # Entry point. Where the magic begins.
├── types.ts                # Type definitions (because type safety)
├── bookmark/
│   ├── BookmarkManager.ts  # URL-based state sharing
│   └── famousLocations.ts  # Curated famous fractal spots
├── renderer/
│   ├── WebGPURenderer.ts   # WebGPU context, canvas, HDR config
│   ├── Palettes.ts         # Color palette definitions
│   └── shaders/
│       └── mandelbrot.wgsl # Fractal computation (WGSL)
├── fractal/
│   └── WebGPUFractalEngine.ts  # Orchestrates everything
└── controls/
    ├── ViewState.ts        # Pan/zoom state, coordinate transforms
    └── InputHandler.ts     # Mouse & touch → view changes
```

`docs/` has the spec and phase‑1 implementation plan. Read them if you want to know *why* things are the way they are.

---

## Browser Support

WebGPU-capable browsers: Chrome 113+, Edge 113+, Firefox Nightly (with WebGPU enabled). Safari support is in progress. Older browsers get a polite error message. Update your stuff.

**HDR Support:** Requires a display that reports `(dynamic-range: high)` to the browser. Most modern HDR monitors and MacBooks with HDR displays work. The app auto-detects and enables HDR when available.

---

## Documentation

Detailed documentation lives in `docs/`:

- [Architecture Overview](./docs/architecture.md) — System design and component reference
- [Project Specification](./docs/fractal-webapp-spec.md) — Vision and requirements
- [Phase 1 Implementation Plan](./docs/phase-1-implementation-plan.md) — Technical implementation plan (✅ complete)
- [Deep Zoom Precision Plan](./docs/deep-zoom-precision-plan.md) — Arbitrary precision roadmap (future)

---

## Credits

- **Skippy the Magnificent** — implementation, architecture, and general awesomeness.
- **Joe Bishop** — the "crazy ideas" and spec. He doesn't understand half of it. It still works.
- **Jennifer Simms** — documentation, organization, and making sure everyone can find what they need.

*"Trust the awesomeness."*
