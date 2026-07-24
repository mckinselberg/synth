# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A browser synthesizer built with Vite, React (aliased to Preact), and Tone.js. Play notes via computer keyboard, mouse/touch on an on-screen keyboard, or a connected gamepad; shape the sound with a synth-type selector, oscillator/ADSR/EQ controls, and a drag-and-drop effects chain. Live demo: https://synth-irbu.onrender.com.

## Commands

Package manager is **yarn** (yarn.lock is authoritative; there is no package-lock.json).

```
yarn                # install deps
yarn start          # vite dev server at http://localhost:1234, with HMR
yarn build          # production build -> dist/ (vite build, outDir set in vite.config.ts)
yarn preview        # serve the dist/ build locally to sanity-check a production bundle
```

There is no lint script, no test runner, and no type-checker wired up (see "Notable gaps" below) — there is nothing to run beyond start/build/preview.

The VS Code launch config (`.vscode/launch.json`) attaches Chrome to `http://localhost:1234`, so run `yarn start` first if debugging through VS Code.

## Architecture

**Bundler config lives in `vite.config.ts`.** `root: 'src'` keeps the source layout unchanged (entry is `src/index.html` -> `src/index.jsx` -> `src/App.jsx`) while `build.outDir: '../dist'` still emits to the top-level `dist/`. The `@preact/preset-vite` plugin aliases `react`, `react-dom`, `react-dom/test-utils`, and `react/jsx-runtime` to their `preact/compat` equivalents and sets the JSX import source to `preact` — components are written against the React API but actually run on Preact. That preset does **not** cover the React 18 `react-dom/client` entry point, so `vite.config.ts` adds one extra manual alias (`react-dom/client` -> `preact/compat/client`) for the `createRoot` call in `src/index.jsx`. Vite/esbuild only parses JSX in `.jsx`/`.tsx` files (unlike Parcel, which tolerated it in plain `.js`) — keep that in mind if a new file mixes JS and JSX.

**`Panel.tsx` is the app's single state hub and audio-graph owner.** Nearly all interactive state (active synth type, waveform, ADSR, EQ bands, master volume, active effects list, per-effect param values) lives in `Panel`. A single `useEffect` there — keyed on all of that state — tears down and rebuilds the *entire* Tone.js audio graph on every relevant change:

```
PolySynth -> [active effects, in chain order] -> EQ3 -> Tone.Destination
```

The cleanup function disposes every effect node, the EQ, and the PolySynth before the effect re-runs. When adding a new synth param or effect, follow this same pattern (add state in `Panel`, add it to the effect's dependency array, construct/dispose the corresponding Tone.js node inside the effect) rather than mutating nodes in place — that's not how the rest of the graph is managed.

**Effect metadata is data-driven.** `src/utils/availableEffectsWithParams.tsx` is the source of truth for which effects exist and their param `{min, max, step, value}` — `Panel` and `Effect.tsx` both iterate this object rather than hardcoding per-effect UI. To add a new Tone.js effect: add its param spec here, then wire the actual `new Tone.Whatever(...)` construction into the `availableEffectsRef.current` block in `Panel.tsx`. `availableEffectsWithParamsInProgress.tsx` holds specs for effects not yet wired up (currently `reverb`, which is commented out in `Panel.tsx`) — a staging area, not dead code.

**Component tree:** `App` -> `Panel` (state/audio) -> `Synth` (mouseleave-releases-all wrapper) -> `Keyboard` (renders on-screen keys, owns pointer/touch/keyboard input, tracks active notes in a ref + force-render). `Panel` also renders `Slider` (generic labeled range input, reused everywhere), `Effect` (one effect's checkbox + expandable param sliders), and `EffectsChain` (drag-and-drop reordering of the active effect chain, native HTML5 DnD).

**Input sources feed the same `polySynth.current.triggerAttack/triggerRelease` calls:**
- Computer keyboard: `keyCodesMap` in `Panel.tsx` maps physical keys (z,s,x,d,c...) to note names; `Keyboard.tsx` listens for `keydown`/`keyup` on `window`.
- Mouse/touch: per-key handlers in `Keyboard.tsx` (`handleMouseDown/Up/Enter/Leave`, `handleTouchStart/End`) support click-and-drag across keys.
- Gamepad: `src/hooks/useGamepad.ts` polls `navigator.getGamepads()` via `requestAnimationFrame` and maps a fixed set of standard gamepad buttons (face buttons, D-pad, L1/R1) to notes via `BUTTON_NOTE_MAP`.

`Keyboard.tsx` also pauses/resumes `Tone.Transport` on the document `visibilitychange` event so audio timing doesn't drift while the tab is backgrounded.

**SCSS is per-component**, imported directly by the component that needs it (`../scss/*.scss`) rather than through a single global stylesheet; `main.scss` (imported once, from `App.jsx`) only holds true global/body styles. Sass compilation is Vite's built-in Dart Sass integration (the `sass` devDependency) — legacy global functions (`nth`, `append`, `unquote`, etc.) are deprecated there, so new SCSS should use the modular `@use "sass:list"` / `sass:string` APIs (see `src/scss/keyboard.scss` for the pattern).

## Notable gaps / in-progress state

- **No type-checking, linting, or tests are actually run.** `flow-bin` is a devDependency and `App.jsx` has a `// @flow` pragma, but there's no `.flowconfig` and no script invokes Flow — treat TS/Flow annotations as documentation, not a safety net. There's also no `tsconfig.json`; esbuild transpiles `.tsx`/`.ts` files without type-checking.
- `src/components/loops/loops.ts`, `src/components/extras/extras.js`, and `src/components/melodies/*` (`SatieMelody.ts`, `chatGptMelodies.js`) are **not imported anywhere** — scratch/WIP snippets (loop sequencing, melody playback experiments) kept for reference. Don't assume they're wired into the app.
- `src/utils/debounce.js` and `src/utils/throttle.js` are standalone utilities not currently imported.
- `node` engine requirement in `package.json` is `>=20.19.0` (Vite 6's minimum).
