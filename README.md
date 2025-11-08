# ![BitLab](public/bitlab-logo-black.svg)

## Generative Pixel Playground

BitLab is a generative art workbench built with React, p5.js, Tailwind, and RetroUI. Mix pixel iconography, palette theory, and motion envelopes to create richly layered sprite compositions in real time. BitLab ships with theme cycling, palette randomisation, blend-mode experiments, and a curated icon library sourced from [pixelarticons](https://github.com/halfmage/pixelarticons).

---

### Table of Contents
- [Features](#features)
- [Experience Overview](#experience-overview)
- [Getting Started](#getting-started)
- [Available Commands](#available-commands)
- [Keyboard & UI Shortcuts](#keyboard--ui-shortcuts)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Generative Sprite Canvas** – Multi-layer sprite engine with p5.js, configurable density, scale, palette variance, and animation speed.
- **Expanded Sprite Modes** – Pixel glass mosaics, geometric motifs (circle, square, triangle, hexagon), and fresh outlines like rings, diamonds, stars, and neon lines.
- **Movement Library** – Ten motion envelopes (spiral, comet, wavefront, etc.) plus a per-project animation speed slider for slow cinematic drifts or rapid energy.
- **Icon Modes** – Toggle to the curated `pixelarticons` library with inline preview and one-click randomisation.
- **Blend Architectures** – Layer-specific blend modes (multiply, screen, hard light, overlay) with optional per-sprite randomisation switch.
- **Theme Designer** – System/light/dark cycling, colour-accent dropdown, and BitLab box chassis styled with RetroUI.
- **Palette Lab** – Synthwave, neon, pastel and bespoke palettes with jitter controls to push hue, saturation, and luminance.
- **Session Metrics** – Live seed, palette, motif, blend mode, motion speed, and FPS readouts for reproducibility.
- **Responsive RetroUI** – RetroUI components reskinned with Tailwind-driven theming across desktop, tablet, and narrow layouts.

---

## Experience Overview

| Area | Highlights |
| ---- | ---------- |
| **Header** | Animated BitLab logomark and a cycling theme toggle (system → light → dark) alongside a GitHub star button. |
| **Controls Panel** | Split into sprite controls and FX tooling. Sliders cover density, scale spread, palette variance, motion intensity, and animation speed. |
| **Icon Selection** | When in **Icon** mode, a dropdown reveals the entire pixel icon catalogue with preview thumbnail. |
| **Utilities** | Full-width buttons for randomising icons, palettes, scale, motion, blend, plus a full reset and “randomise all” macro. |
| **Theme Styling** | Select menu customises colourway (Sunburst, Neon Grid, Nebula, Ember Glow, Lagoon Tide, Rose Quartz) alongside the system/light/dark toggle. |
| **Canvas** | p5.js renders layered sprites, with status chips reporting live seed, palette, motif, blend mode, motion speed, and FPS. |
| **Session Notes** | Quick tips with links to pixelarticons, p5.js, and RetroUI docs for deeper exploration. |

---

## Getting Started

### Prerequisites
- Node.js **18.18+** (Node 20 LTS recommended)
- npm **9+**

### Installation
```bash
# clone the repository
git clone https://github.com/deepdesign/bitlab.git
cd bitlab

# install dependencies
npm install

# start the development server
npm run dev
```
Visit `http://localhost:5173` to explore the canvas.

### Production Build
```bash
npm run build
# optional: preview production output
npm run preview
```
The build artifacts land in `/dist` and are ready for static hosting.

---

## Available Commands
| Command | Description |
| ------- | ----------- |
| `npm run dev` | Launch Vite dev server with fast HMR. |
| `npm run build` | Type-check with `tsc` and emit optimised assets. |
| `npm run preview` | Serve the production build locally. |

---

## Keyboard & UI Shortcuts
- **Theme cycle** – Click the icon button in the header to iterate system → light → dark.
- **Randomise all** – Triggers new seed, palette, blend, and motion envelope with one click.
- **Icon shuffle** – “Icon” randomiser respects current sprite mode (pixel glass vs icon).

---

## Tech Stack
- [React 19](https://react.dev/) with functional components & hooks
- [Vite 7](https://vitejs.dev/) for lightning-fast dev & build tooling
- [TypeScript](https://www.typescriptlang.org/) for type safety
- [p5.js](https://p5js.org/) powering the generative engine
- [pixel-retroui](https://www.npmjs.com/package/pixel-retroui) + [Tailwind CSS](https://tailwindcss.com/) for retro-flavoured UI components
- [pixelarticons](https://github.com/halfmage/pixelarticons) as the icon catalogue

---

## Project Structure
```
├── public/
│   ├── bitlab-logo-black.svg
│   └── bitlab-logo-white.svg
├── src/
│   ├── App.tsx           # Main UI & state wiring
│   ├── generator.ts      # p5.js sprite logic & controller API
│   ├── data/             # palettes & icon metadata
│   └── style.css         # Tailwind + RetroUI overrides
├── index.html            # Entry HTML + favicon
├── package.json
└── README.md
```

---

## Contributing
1. Fork the repository and create a feature branch (`git checkout -b feature/your-idea`).
2. Run `npm run dev` and ensure changes pass `npm run build` before committing.
3. Submit a pull request describing the tweak, referencing any issues.

Bug reports and enhancement ideas are always welcome via [GitHub issues](https://github.com/deepdesign/bitlab/issues).

---

## License
All rights reserved. Please contact the maintainers at [deepdesign](https://github.com/deepdesign) for licensing discussions.
