# Feature Backlog

_Last updated: 2025-11-10_

## 1. FX Tab Expansion

### 1.1 Shader Effects

- **Goal:** Optional WebGL post-processing layer (CRT bloom, scanlines, chromatic aberration).
- **Technical Guidance:**
  - Evaluate [pixi.js filters](https://pixijs.io/pixi-filters/) or [`@react-three/postprocessing`](https://github.com/pmndrs/react-postprocessing) if we lean on `three.js`/react-three-fiber.
  - For lightweight custom passes, consider [`regl`](https://github.com/regl-project/regl) or GLSL modules via [`glslify`](https://github.com/glslify/glslify).
  - Ensure graceful fallback when WebGL is unavailable (toggle off FX tab features).

### 1.2 Noise & Dither Overlays

- **Goal:** Layer grain, CRT noise, or Bayer dithering on top of the sprite canvas.
- **Technical Guidance:**
  - Implement as p5 shader overlay or secondary canvas blended with CSS mix-blend modes.
  - Libraries: [`simplex-noise`](https://github.com/jwagner/simplex-noise), [`glsl-noise`](https://github.com/stegu/webgl-noise).
  - Expose controls for noise strength, pattern selection, animation speed.

### 1.3 Interactive Modes (Gravity / Cursor Forces)

- **Goal:** Cursor-driven attract/repulse behaviours and gravity wells.
- **Technical Guidance:**
  - Extend `generator.ts` movement updates with pointer events (track cursor in React state).
  - Use p5 vectors or integrate a lightweight physics helper such as [`planck.js`](https://piqnt.com/planck.js/).
  - Preserve deterministic behaviour by seeding force randomisation.

### 1.4 Physics-Augmented Animations

- **Goal:** Incorporate velocity, acceleration, damping, and collisions into sprite movement.
- **Technical Guidance:**
  - Depending on complexity, either roll custom Euler integration or adopt [`matter-js`](https://brm.io/matter-js/).
  - Budget for performance: provide max sprite counts and disable collisions when excessive.

### 1.5 Particle Effects

- **Goal:** Emit spark, trail, or glow particles around sprites.
- **Technical Guidance:**
  - Potential options: native p5 particle system, [`tsparticles`](https://particles.js.org/), `three.js` `Points`.
  - Sync particle palettes with active theme colours; allow toggles for lifetime, spawn rate, dispersion.

## 2. Export Enhancements

### 2.1 Arbitrary Output Dimensions

- **Goal:** Export to any user-specified pixel dimensions while preserving input aspect ratio via cropping.
- **Technical Guidance:**
  - Render to an off-screen p5 graphics buffer sized to the requested output, then crop/scale as needed.
  - Use `graphics.drawingContext.getImageData` or `canvas.toBlob()` for efficient downloads.
  - Validate huge export sizes (warn about >8K) and surface progress indicators for large renders.

## 3. Fullscreen Presentation Mode

### 3.1 Fullscreen Toggle with Minimal HUD

- **Goal:** Fullscreen canvas with Randomise/Close controls appearing on mouse movement.
- **Technical Guidance:**
  - Use the [Fullscreen API](https://developer.mozilla.org/docs/Web/API/Fullscreen_API) on the canvas wrapper.
  - Overlay a small HUD animated via Tailwind/Framer Motion; auto-hide after inactivity.
  - Ensure ESC and the Close button exit fullscreen cleanly.

## 4. Preset Management

### 4.1 Local Preset Storage (Cookies/LocalStorage)

- **Goal:** Save, name, load, and delete presets locally.
- **Technical Guidance:**
  - Prefer `localStorage` or IndexedDB via [`idb-keyval`](https://github.com/jakearchibald/idb-keyval) over cookies (larger quota, not sent with requests).
  - Preset schema should capture seed, palette, sliders, toggles, icon selection, and timestamp.
  - Provide UI for naming, overwriting, deleting, and optionally exporting/importing presets as JSON.

## 5. Technology Summary

| Feature Area       | Suggested Libraries / Tools                                                                      |
| ------------------ | ------------------------------------------------------------------------------------------------ |
| Shader FX          | `pixi.js` filters, `three.js` + `@react-three/postprocessing`, `regl`, custom GLSL via `glslify` |
| Noise Overlays     | p5 shaders, CSS blend modes, `simplex-noise`, `glsl-noise`                                       |
| Interactive Modes  | Pointer events, p5 vectors, `planck.js` or custom physics integrators                            |
| Physics Animations | `matter-js`, `planck.js`, custom Euler/Verlet integration                                        |
| Particle Effects   | p5 particle patterns, `tsparticles`, `three.js` point materials                                  |
| Arbitrary Exports  | Off-screen p5 buffers, `canvas.toBlob`, progress indicators                                      |
| Fullscreen Mode    | Fullscreen API, Tailwind overlays, optional Framer Motion for HUD transitions                    |
| Preset Storage     | `localStorage`, `idb-keyval`, optional `zustand`/`redux-persist` for state serialisation         |

## 6. Next Steps

1. Prioritise FX Tab rollout (shader pipeline typically highest engineering effort).
2. Draft lo-fi mockups for the new FX tab and export modal.
3. Prototype rotation animation independence (in-progress) and gather performance metrics.
4. Scope persistence layer for presets (decide between cookie fallback vs. localStorage primary).
5. Schedule technical spikes for WebGL performance testing and physics integration.
