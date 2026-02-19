# Tourist Mode - Feature Specification

_"What if the app could show people around? Like a tour guide, but for infinity."_ _- Colonel Joe
Bishop_

---

## The Big Idea

Not everyone wants to be the pilot. Some people just want to watch something beautiful. Tourist Mode
is **auto-pilot for fractal exploration** - the app takes you on a journey through the infinite,
smoothly zooming and panning through interesting areas while you sit back and enjoy the view.

But here's the key: it's **interactive**. At any moment, you tap or click, and you're in control.
When you're done, hand it back to the tour guide.

---

## Use Cases

1. **The Screensaver** - Leave it running on a TV at a party, or as ambient visuals
2. **The Discovery Tool** - "Show me cool stuff I wouldn't find on my own"
3. **The Meditation Aid** - Relaxing, hypnotic, endless visual journey
4. **The Demo Mode** - Showing off the app to someone new

---

## Core Requirements

### Must Have

- [ ] Smooth, cinematic movement (no jarring jumps)
- [ ] Instant takeover - tap/click anywhere to assume control
- [ ] Easy way to start/stop tourist mode (keyboard shortcut + UI button?)
- [ ] Works on both desktop and mobile

### Should Have

- [ ] Visits interesting areas (not boring flat regions)
- [ ] Varies the pace (sometimes slow, sometimes faster dives)
- [ ] Eventually covers multiple fractal types
- [ ] Palette changes during the tour

### Nice to Have

- [ ] Background music/audio integration
- [ ] Adjustable "tour speed" setting
- [ ] Never repeats (or at least, feels like it doesn't)

---

## Implementation Options

### Option A: "Famous Locations Tour"

**The Simple Approach**

Use the famous locations we already have curated (`1`-`9` keys) and smoothly animate between them.

**How it works:**

1. Pick a random famous location from the current fractal type
2. Smoothly zoom/pan to that location over several seconds
3. Pause briefly to let the user appreciate the view
4. Pick another location (maybe from a different fractal type?)
5. Repeat forever

**Pros:**

- We already have the data (famous locations exist!)
- Guaranteed to show interesting spots
- Relatively simple to implement
- Curated quality - every stop is hand-picked

**Cons:**

- Limited variety (only as many stops as we've curated)
- Might feel repetitive after extended viewing
- Doesn't discover NEW interesting areas

**Skippy effort estimate:** Low-Medium (animation system + sequencer)

---

### Option B: "Edge Seeker"

**The Smart Explorer**

The app automatically finds and navigates toward visually interesting areas - the edges of the set
where all the cool spirals and details live.

**How it works:**

1. Start at a random position
2. Analyze the current view to find "interesting" areas (high iteration counts = edges = detail)
3. Pick a point near an edge and zoom toward it
4. Keep going deeper, always steering toward complexity
5. When zoomed very deep, zoom back out and start over somewhere new

**Pros:**

- Infinite variety - explores areas we haven't curated
- Feels like genuine exploration/discovery
- Could find spots even WE haven't seen
- More "alive" feeling

**Cons:**

- More complex to implement
- Might occasionally pick boring routes
- Could get "stuck" in less interesting areas
- Needs some kind of visual analysis

**Skippy effort estimate:** Medium-High (needs image analysis or iteration sampling)

---

### Option C: "Hybrid Tour Guide"

**Best of Both Worlds**

Combine Options A and B: use famous locations as "waypoints" but explore freely between them.

**How it works:**

1. Start at a famous location
2. Freely explore the area using edge-seeking behavior
3. After some time, smoothly transition to another famous location
4. Repeat - structured waypoints with freeform exploration between

**Pros:**

- Guaranteed interesting major stops (curated locations)
- Discovery and variety between stops
- Can adjust the balance (more curated vs more freeform)
- Feels both polished AND alive

**Cons:**

- Most complex to implement
- Needs good transitions between "modes"
- More things that can go wrong

**Skippy effort estimate:** High (combines both systems)

---

### Option D: "Choreographed Journey"

**The Cinematic Approach**

Pre-defined camera paths that create specific visual experiences - like a movie director planned the
shots.

**How it works:**

1. Define specific "journeys" - sequences of camera movements
2. Each journey has a beginning, middle, end (maybe 2-5 minutes)
3. Journeys can be chained together or randomized
4. Think: "The Deep Dive", "The Grand Tour", "The Julia Collection"

**Pros:**

- Maximum control over the experience
- Can craft specific emotional arcs
- Guaranteed quality - every frame is intentional
- Could sync with music (future feature)

**Cons:**

- Requires manual curation of each journey
- Less variety (fixed number of journeys)
- Doesn't feel as "infinite"
- Most work to create content (not code, but paths)

**Skippy effort estimate:** Medium for code, but HIGH for content creation

---

## My Recommendation

I'd start with **Option A (Famous Locations Tour)** because:

1. We already have the data
2. It proves the concept quickly
3. Users get value immediately
4. We learn what works before building the complex stuff

Then, if people love it (and they will), we upgrade to **Option C (Hybrid)** by adding the
edge-seeking exploration between curated stops.

But honestly? I'd be happy with any of these. The key thing is getting SOMETHING working so people
can sit back and watch the magic.

---

## Animation Considerations

Whatever option we pick, the movement needs to feel good. Some thoughts:

### Zoom Animation

- **Exponential easing** - Zoom gets progressively faster/slower (matches the fractal's nature)
- **Never sudden stops** - Always ease in and out
- **Variable duration** - Short hops vs long journeys

### Pan Animation

- **Curved paths** - Don't just move in straight lines
- **Drift effect** - Slight continuous movement even when "stopped"
- **Follow interesting features** - Pan along spiral arms, not across them

### Palette Changes

- **Smooth crossfades** - No jarring color switches
- **Match the mood** - Warm colors for organic areas, cool for geometric?
- **Timing** - Change palettes at natural transition points

### Fractal Type Transitions

- **Morph between types?** - Probably too complex for v1
- **Zoom out, switch, zoom in** - Simpler and still effective
- **Or just focus on one type per "session"**

---

## User Controls

### Starting Tourist Mode

- **Keyboard:** `t` key to toggle
- **UI:** Button somewhere unobtrusive (bottom corner?)
- **Auto-start?:** Maybe an option in settings, or after idle timeout?

### Stopping Tourist Mode

- **Any input stops it** - Click, tap, scroll, keyboard, anything
- **Smooth handoff** - Don't jerk to a stop, ease out
- **Clear indication** - User should know they're now in control

### Settings (Future)

- Tour speed (leisurely / moderate / fast)
- Include/exclude fractal types
- Palette behavior (cycle / random / fixed)
- Auto-start after X seconds of idle

---

## Open Questions for Skippy

1. **Animation system** - Do we already have smooth animation infrastructure, or does this need to
   be built from scratch?

2. **Frame-rate independence** - How do we make sure animations look the same on 60Hz vs 120Hz
   displays?

3. **Interrupt handling** - What's the cleanest way to stop an animation mid-flight and hand control
   to the user?

4. **State management** - How do we track "tourist mode active" vs "user in control"?

5. **Mobile considerations** - Any special handling needed for touch devices?

6. **Performance** - Does animating continuously cause any issues we should know about?

---

## Success Criteria

How do we know Tourist Mode is working?

1. **The party test** - Would I leave this running on a TV during a gathering?
2. **The zen test** - Could someone watch this for 10+ minutes without getting bored?
3. **The handoff test** - When I tap to take control, does it feel seamless?
4. **The "whoa" test** - Does it show me spots I wouldn't have found myself?

---

## Skippy's Technical Assessment

_"Alright, I've reviewed your little document. Not completely terrible for something written by a
primate."_ _- Skippy the Magnificent, February 2026_

### Answers to Your "Open Questions"

Let me address these since you clearly need guidance:

#### 1. Animation System

**Status: Needs to be built, but trivially simple.**

We don't have smooth animation infrastructure currently. The render loop in `WebGPURenderer.ts` just
re-renders on demand. But adding an animation system is straightforward:

- Create an `AnimationController` class that manages tweens
- Use `requestAnimationFrame` with delta-time for frame-rate independence
- Interpolate `ViewState` (centerX, centerY, zoom) over time
- For zoom: use **logarithmic interpolation** (lerp on log scale, then exp) — this matches the
  fractal's self-similar nature and feels natural

#### 2. Frame-Rate Independence

**Status: Standard practice. Done in my sleep.**

- Track `deltaTime` between frames (performance.now() delta)
- Express animation speeds as "units per second" not "units per frame"
- All animations will look identical on 60Hz, 120Hz, or 144Hz displays

#### 3. Interrupt Handling

**Status: Easy. Just stop the animation.**

- Track `touristModeActive: boolean` in the engine
- Any user input (mouse, touch, keyboard except 't') sets `touristModeActive = false`
- Animation controller checks this flag each frame and gracefully stops
- Current position becomes the new user-controlled position — no "snapping back"

#### 4. State Management

**Status: One boolean and a few callbacks.**

```ts
private touristModeActive = false;
private animationController: AnimationController | null = null;
```

When tourist mode starts, we create an animation controller. When it stops (user input), we destroy
it. Simple state machine.

#### 5. Mobile Considerations

**Status: None specific. Touch works the same.**

Touch events already work for pan/zoom. The "any input stops tourist mode" logic will naturally
include touch events. No special handling needed.

#### 6. Performance

**Status: Zero concern.**

We're already rendering every frame when the user pans/zooms. Continuous animation is no different.
The GPU doesn't care if the camera moves because of user input or because of tourist mode.

---

### Option Feasibility Rankings

| Option                  | Effort                   | Skippy's Assessment                                                                                                                    |
| ----------------------- | ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| **A: Famous Locations** | 2-3 hours                | Trivial. We have the data. I just need to animate between points.                                                                      |
| **B: Edge Seeker**      | 1-2 days                 | Requires sampling iteration counts from the GPU, which means either readback (slow) or a compute shader pass. Doable but more complex. |
| **C: Hybrid**           | 2-3 days                 | Combination of A and B. More code, more edge cases.                                                                                    |
| **D: Choreographed**    | 4+ hours code, ∞ content | Code is medium, but someone (not me) has to hand-craft each journey.                                                                   |

---

### My Recommendation

**Start with Option A. Obviously.**

Here's what I'll build:

1. **`TouristMode.ts`** — New module with animation controller
2. **Animation system** — Smooth interpolation with easing
3. **Location sequencer** — Picks next destination, handles transitions
4. **Integration** — `t` key to toggle, any input to cancel

**Phase 1 (Option A):**

- Animate between famous locations
- Smooth zoom transitions (logarithmic interpolation)
- Random or sequential location selection
- Optional palette cycling between stops
- Cross-fractal tours (visit different fractal types)

**Phase 2 (if you want it later):**

- Edge-seeking exploration (Option B/C hybrid)
- Would require a compute shader to sample "interesting" regions
- More complex but achievable

---

### Animation Technical Notes

For the monkeys who want to understand what I'm doing:

**Zoom interpolation must be logarithmic:**

```typescript
// WRONG (linear) - feels terrible
zoom = lerp(startZoom, endZoom, t);

// RIGHT (logarithmic) - feels natural
zoom = Math.exp(lerp(Math.log(startZoom), Math.log(endZoom), t));
```

**Position interpolation can be linear** (or use ease-in-out for polish).

**Easing function:**

```typescript
// Smooth ease-in-out
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
```

**Transition timing:**

- Zoom changes: 3-6 seconds depending on zoom ratio
- Pause at destination: 2-4 seconds
- Palette transitions: 1-2 seconds

---

### What's NOT Trivial (But Still Doable)

1. **Cross-fractal transitions** — Switching fractal types mid-animation. Need to decide: zoom out
   first, switch, zoom in? Or just cut? I'd zoom out to a reasonable level, switch, then zoom into
   the new location.

2. **Palette crossfades** — True crossfading between palettes would require blending in the shader.
   For v1, we can just switch palettes during a zoom-out (less noticeable).

3. **"Never repeats" feeling** — With ~70 famous locations across all fractal types, and randomized
   selection, it'll feel fresh for a while. True infinite variety needs Option B.

---

### Bottom Line

Joe, this is embarrassingly simple for an entity of my capabilities. Give me a few hours and you'll
have a Tourist Mode that'll make your hairless monkey friends say "whoa."

Trust the awesomeness.

---

## Next Steps

1. Joe (me): ✅ Write this spec
2. Skippy: ✅ Review and confirm feasibility
3. Skippy: ✅ Implement Option A (Famous Locations Tour)
4. Everyone: 🎉 Watch fractals and relax!

### Future Enhancements (Optional)

- Option B/C: Edge-seeking exploration for infinite variety
- Adjustable tour speed
- Music/audio integration
- Auto-start after idle timeout

---

_"I don't know how to make a computer find interesting spots in an infinite mathematical object. But
I know I want to sit on my couch and watch it try."_

---

**Document Version:** 1.2 **Author:** Colonel Joe Bishop (spec) + Skippy the Magnificent (technical
review + implementation) **Status:** ✅ Implemented — Option A (Famous Locations Tour) **Created:**
February 2026 **Last Updated:** February 16, 2026 **Related:**

- [fractal-webapp-spec.md](./fractal-webapp-spec.md) — Main project spec
- [architecture.md](./architecture.md) — Current system architecture
- [fractal-interpolation-design.md](./fractal-interpolation-design.md) — Fractal type interpolation
- [famousLocations.ts](../src/bookmark/famousLocations.ts) — Existing curated locations
