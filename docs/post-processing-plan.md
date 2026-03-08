# Post-Processing Shaders Plan

> **✅ Implementation Complete** (February 2026): All planned post-processing effects have been
> implemented. The pipeline supports bloom, vignette, adaptive sharpening, chromatic aberration, and
> ACES filmic tone mapping via four presets (Clean, Cinematic, Vivid, Dreamy). Press `P` / `Shift+P`
> to cycle presets. See [architecture.md](./architecture.md) for the current component reference.

## The Conversation That Started It All

---

### 🎬 Scene: The Virtual War Room

---

**💡 Joe Bishop:** *leans back in chair, squinting at the fractal renderer*

Okay, Skippy. I've been staring at these fractals for a while now. They're pretty. They're *nice*.
But I want people to open this thing and go "WHOA." You know? Like that moment when you first see
fireworks as a kid. Right now it's more like... a really good screensaver.

**🚀 Skippy:** Oh, wonderful. The monkey wants "whoa." That's very specific, Joe. Should I also make
it smell like cotton candy? Perhaps add a gentle breeze from the monitor?

**💡 Joe:** Ha ha. I'm serious though. Look at those fractal boundaries — all that detail just
sitting there, and it all kind of... blends together. What if the edges *glowed*? Like, actually
glowed. Like they were made of light.

**🚀 Skippy:** *sighs with the weight of infinite patience*

You're describing bloom, Joe. It's a post-processing effect where bright pixels bleed light into
surrounding darker areas. Every video game made after 2004 uses it. It's not exactly
groundbreaking. But... *pauses* ...applied to fractal boundaries with our HDR pipeline already
outputting values up to 10× standard brightness... actually, that would look rather spectacular.

Not that I'm surprised I can make it work. I'm surprised you stumbled onto a decent idea.

**💡 Joe:** Wait wait wait — so we're already rendering stuff that's *brighter than bright*? And
we're just... not doing anything with that?

**🚀 Skippy:** We're displaying it on HDR monitors, which is the *correct* technical approach—

**💡 Joe:** But what if we took that extra brightness and made it *spill over*? Like a halo effect
around the really intricate parts?

**🚀 Skippy:** That's... literally what I just said. Bloom. I just explained bloom to you.

**💡 Joe:** Right, bloom! Let's do bloom! But also — what about making things *sharper*? Sometimes
when I zoom in, things get a little soft. Is there a way to make the details pop more?

**🚀 Skippy:** You're now describing edge enhancement. Unsharp masking, Laplacian sharpening, or
if you want to be fancy about it, adaptive sharpening that only enhances detail without amplifying
noise. This is embarrassingly simple for an entity of my capabilities.

**💡 Joe:** "Embarrassingly simple." That's your way of saying yes, right?

**🚀 Skippy:** It's my way of saying I could implement it in my sleep, if I slept, which I don't,
because I'm perfect.

**💡 Joe:** Okay, what about this — and Skippy's going to hate this idea, which means it might
actually work — what if we added a subtle *vignette*? You know, where the edges of the screen get
a little darker? It would make it feel more cinematic, like you're peering into the fractal
through a portal.

**🚀 Skippy:** *long pause*

I don't hate it.

**💡 Joe:** Ha! I knew it!

**🚀 Skippy:** I said I don't *hate* it. That's not the same as liking it. A vignette is trivially
simple — it's literally multiplying by a radial gradient. But combined with bloom on the fractal
boundaries... the center of the screen would glow while the edges fade to dark. It would create
a natural focal point.

...Fine. It would look good. Are you happy? The monkey had a good idea. Mark your calendar.

**💡 Joe:** I'm on a roll! What about — okay, explain this to me like I'm a five-year-old — is
there something that makes colors look more... *alive*? Like when you put on those fancy
sunglasses and everything looks more vivid?

**🚀 Skippy:** You're describing tone mapping and color grading. And yes, there are about seventeen
different approaches, most of which were invented by people far less intelligent than me. We could
apply filmic tone mapping — the kind used in Hollywood — which compresses the bright end while
making shadows richer. Or ACES, which is the industry standard. Combined with saturation
adjustments and a subtle color temperature shift...

Actually, this is getting interesting despite your involvement.

**💡 Joe:** And could users pick between different "looks"? Like Instagram filters but, you know,
not terrible?

**🚀 Skippy:** *visibly offended*

Did you just compare my potential shader artistry to *Instagram filters*?

**💡 Joe:** I mean—

**🚀 Skippy:** We would call them "post-processing presets." They would be elegant combinations of
bloom intensity, vignette strength, tone mapping curves, and color grading parameters. Each one
carefully calibrated to enhance specific visual characteristics of fractal geometry.

They would be NOTHING like Instagram filters.

They would be *better*.

**💡 Joe:** So... fancy Instagram filters.

**🚀 Skippy:** I'm going to pretend you didn't say that.

Here's what I propose, since clearly someone with actual intelligence needs to drive this bus:

**💡 Joe:** Wait, one more thing. What if we added chromatic aberration? I saw it in a game once —
where the colors split apart slightly at the edges. It looked really trippy. Fractals are ALREADY
trippy. It could be amazing.

**🚀 Skippy:** *considers this*

Chromatic aberration is when a lens fails to focus all colors to the same point. It's technically
a *defect*. You're asking me to deliberately introduce a flaw.

...But as a subtle artistic effect on fractal imagery, where the mathematical precision of the
boundaries would create perfectly clean color separation... the red and blue channels would trace
slightly different paths along those infinitely complex edges...

Okay. Fine. That would actually look incredible. But if anyone asks, it was MY idea.

**💡 Joe:** Sure thing, Skippy. Your idea. Now what's the plan?

**🚀 Skippy:** *cracks virtual knuckles*

Right. Here's the architecture, explained in terms even you can follow:

Currently, we paint the fractal directly onto the screen. One pass, done. To add post-processing,
we need to paint the fractal onto a *hidden canvas* first — an intermediate texture — and then
apply effects to that before showing it on screen.

Think of it like this: instead of painting directly on the wall, we paint on a canvas, then add
filters and lighting effects to the canvas, THEN hang it on the wall.

**💡 Joe:** I have no idea how that works, but let's do it.

**🚀 Skippy:** Trust the awesomeness. Here's the breakdown:

---

## Implementation Plan

### Problem Statement

The fractal renderer currently uses a single-pass pipeline that renders directly to the canvas.
While visually correct, it lacks the post-processing effects that would elevate the visual
experience from "technically impressive" to "jaw-dropping." The existing HDR pipeline (with values
up to 10× standard brightness) provides an excellent foundation for bloom and other effects.

### Proposed Approach

Introduce a multi-pass post-processing pipeline using WebGPU render passes and intermediate
textures. Effects will be individually toggleable and combinable, with presets for common
configurations.

### Architecture Changes

**Current:** Fractal Fragment Shader → Canvas
**Proposed:** Fractal Fragment Shader → HDR Texture → Post-Processing Passes → Canvas

The intermediate HDR texture (`rgba16float`) captures the full dynamic range of the fractal
computation, which post-processing passes can then operate on.

### Todos

1. **post-proc-pipeline** — Multi-pass rendering infrastructure
   - Render fractal to intermediate `rgba16float` texture instead of directly to canvas
   - Create a post-processing pass framework (bind group for input texture, render to output)
   - Support chaining multiple passes: each pass reads the previous output
   - Final pass renders to the canvas swap chain texture
   - Fullscreen quad/triangle shader for sampling the intermediate texture

2. **bloom-effect** — Bloom/glow shader pass
   - Brightness extraction pass: threshold to isolate pixels above a configurable brightness
   - Dual-pass Kawase blur (or separable Gaussian): horizontal then vertical blur of bright pixels
   - Additive blend: combine bloom texture with original fractal texture
   - Parameters: threshold (default ~0.8), intensity (0.0–1.0), blur radius
   - Should naturally highlight fractal boundaries where HDR brightness peaks

3. **vignette-effect** — Vignette shader pass
   - Radial darkening from screen center toward edges
   - Smooth falloff using smoothstep or power curve
   - Parameters: radius (0.0–1.0), softness (0.0–1.0), intensity (0.0–1.0)
   - Lightweight — can be combined into another pass to save a render pass

4. **sharpen-effect** — Adaptive sharpening pass
   - Laplacian or unsharp mask kernel (sample center + 4 neighbors)
   - Adaptive: scale sharpening by local contrast to avoid amplifying flat regions
   - Parameters: strength (0.0–1.0)
   - Important for maintaining detail at medium zoom levels

5. **chromatic-aberration** — Chromatic aberration pass
   - Offset R, G, B channels by slightly different UV amounts
   - Radial: stronger toward screen edges, zero at center
   - Parameters: intensity (0.0–1.0), mapped to max pixel offset (e.g., 0–3px)
   - Subtle by default — a little goes a long way

6. **tone-mapping-pass** — Filmic tone mapping and color grading
   - ACES filmic tone mapping curve (replaces current simple HDR brightness)
   - Saturation adjustment (subtle boost, ~1.1–1.3×)
   - Color temperature shift (warm/cool slider)
   - Parameters: exposure, saturation, temperature, tone mapping curve selection
   - This pass should come LAST, after all other effects

7. **post-proc-ui** — User controls for post-processing
   - Toggle individual effects on/off
   - Per-effect parameter sliders (accessible via keyboard shortcuts or UI panel)
   - Presets: "Clean" (no effects), "Cinematic" (bloom + vignette + ACES),
     "Vivid" (bloom + sharpen + saturation boost), "Dreamy" (heavy bloom + chromatic aberration)
   - Persist selection in URL bookmark state

### Dependencies

- bloom-effect → post-proc-pipeline
- vignette-effect → post-proc-pipeline
- sharpen-effect → post-proc-pipeline
- chromatic-aberration → post-proc-pipeline
- tone-mapping-pass → post-proc-pipeline
- post-proc-ui → all effect passes

### Technical Notes

- **Performance:** Each additional pass costs one fullscreen texture sample + write. On modern GPUs
  at 1080p–4K, this is negligible compared to the fractal iteration cost (up to 65,536 iterations
  per pixel). Bloom with blur is the most expensive effect (~3 passes for extract + blur + blend).
- **Memory:** One additional `rgba16float` texture per active intermediate pass. At 4K, that's
  ~64MB per texture. Bloom needs 2–3 (can be at half resolution for blur). Budget ~128–192MB.
- **Combining passes:** Vignette and tone mapping can share a single pass to reduce overhead.
  Chromatic aberration can also be folded into the final composite pass.
- **HDR compatibility:** Post-processing should preserve the HDR output path. The final pass should
  output to the same `rgba16float` canvas format when HDR is enabled.
- **Shader organization:** New WGSL files in `src/renderer/shaders/` for each effect. A shared
  `fullscreen.wgsl` vertex shader for the screen-space triangle.

---

**🚀 Skippy:** There. A complete plan that even a colonel can follow. You're welcome, by the way.

**💡 Joe:** *grins*

This is going to look AMAZING. One question though — can we make the bloom pulse slightly? Like,
breathing? So the fractals look alive?

**🚀 Skippy:** ...

That's for the next planning session, Joe. One miracle at a time.

**💡 Joe:** But—

**🚀 Skippy:** *One. Miracle. At a time.*

Now, shall we make something magnificent?
