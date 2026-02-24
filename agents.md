# agents.md - Corporate Compliance Training Parody VN (GitHub Pages)

This repo is a web-hosted, single-page visual novel / choose-your-own-adventure parody of corporate compliance training.

It must support:
- A straight-faced compliance course path (player can finish like a normal training quiz and click `Exit course`).
- A "genre drift" system where obviously wrong choices gradually morph presentation/genre (dating sim, heist/rogue, survival).
- Rive-animated 2D characters (skeletal rig + outfits/props) rendered in the browser.
- A plot engine based on scenes + choices, later extensible to minigames.
- Deployment to GitHub Pages under user `Jazames`.

Project spirit and creative direction lives in `scratchpad.md` (treat as canon).

---

## Tech stack

- Vite (render/build engine) + React + TypeScript
- Static build output for GitHub Pages (`dist/`)
- Rive runtime for character animation:
  - `@rive-app/react-canvas`

---

## High-level architecture

### 1) Story layer (data)
Story is defined as data (TS objects or JSON). Each scene:
- describes what to render (background, characters, UI mode)
- contains text/dialogue
- offers choices
- applies effects (meters/flags/events)
- transitions to next scene (mainline or conditional)

### 2) State layer (simulation)
Single source of truth for:
- `flags: Record<string, boolean>`
- `meters: { compliance, romanceDrift, heistDrift, survivalDrift, ... }`
- `npcState` (optional): relationship/affinity, plus outputs from the user's social engine
- `inventory` / `equipped` (props/outfits)
- `queue: Event[]` (event queue / deferred consequences)
- `locks`: per-genre commitment/lock tracking

### 3) Runtime layer (renderer + scheduler)
- Renders the current scene in a Vite/React SPA.
- Applies choice effects to state.
- Schedules the next scene using:
  - deterministic mainline progression plus
  - an event queue and optional interrupt scenes
- Drives Rive inputs (talking, walk, outfitId, propId, attractivenessDrift, etc.)
- Maintains training chrome (header/progress/Exit course) even during drift.

---

## Scene model

### Scene types
Minimum set:
- `trainingSlide` - straight compliance slide + quiz choices.
- `dialogueScene` - VN textbox + characters + choices.
- `phoneScene` - interactive phone UI overlay (HTML-based).
- (Later) `minigameScene` - launches a minigame component and returns a result.

### Scene interface (suggested)
Keep it simple and serializable.

```ts
export type SceneType = 'trainingSlide' | 'dialogueScene' | 'phoneScene' | 'minigameScene';

export interface SceneDef {
  id: string;
  type: SceneType;

  /** Optional: used for progress display in "training mode". */
  trainingStep?: number;

  /** Visuals */
  backgroundKey?: string;
  characters?: CharacterPlacement[];

  /** Text */
  title?: string;
  body?: string;
  dialogue?: DialogueLine[];

  /** Player options */
  choices?: ChoiceDef[];

  /** Default continuation (mainline) */
  nextSceneId?: string;

  /** Optional gating */
  conditions?: ConditionExpr[];
}

export interface ChoiceDef {
  id: string;
  label: string;
  effects: EffectDef[];
  goto?: string; // optional direct goto
  conditions?: ConditionExpr[];
}
```

### Effects
Effects are data-driven (avoid hardcoding story logic in components).

Common effect types:
- `setFlag`
- `clearFlag`
- `addMeter` / `setMeter`
- `enqueueEvent`
- `equipOutfit` / `equipProp`
- `emitMoralVector` (feeds social engine + NPC reaction)
- `cooldown` / `oneShot` bookkeeping

---

## Event queue + scheduling

### Event queue
Choices enqueue events instead of always branching immediately (supports delayed consequences).

Event example fields:
- `id`
- `kind` (e.g. `textMessage`, `hrFollowUp`, `interruptScene`, `endingCheck`)
- `priority`
- `cooldownKey` / `oneShotKey`
- `payload`

### Scheduler loop (recommended)
After a choice:
1. Apply effects to state.
2. Enqueue any events.
3. Determine next scene:
   - If a high-priority queued event should fire now, handle it (often by jumping to an interrupt scene).
   - Else continue the mainline `nextSceneId`.

Guardrails:
- priority ordering
- cooldowns (do not repeat beats)
- one-shots (single-use events)
- per-category caps (optional)

---

## Genre drift + commitment lock-in

### Recoverable drift (pre-commit)
Meters can rise/fall. Player can recover via compliance-correct choices.

### Tipping point (irreversible action)
A genre becomes locked only when:
- drift is high and
- the player takes an explicit irreversible commit action (a flag)

Example:
- `romanceCommit = true` triggered by a clearly risky "corporate phrased" choice.

Lock condition:
- `romanceLocked = romanceDrift >= 0.8 && romanceCommit`

Once locked:
- stop decay for that genre
- bias scene selection strongly toward that genre
- dampen other genres to prevent multi-lock chaos (one locked genre at a time)

### Endings
Endings are terminal interrupt scenes, typically fired via an `endingCheck` queued event.

Endings to support (per scratchpad spirit):
- Complete the course (normal)
- Married (romance good/bad)
- Heist success/failure
- Survival escape/failure
- Additional satirical "arrested" variant (keep names fictionalized)

---

## Rive integration

### Rendering approach
VN-style: one Rive canvas per character, positioned with CSS on a shared scene root.

- Background is HTML/CSS layers.
- Characters are absolutely positioned canvases.
- Dialogue UI overlays on top.

This is simple and deploys cleanly to GitHub Pages with Vite static assets.

### Rive inputs convention
Each character `.riv` should expose a consistent set of inputs so animations are reusable:

Core:
- `isTalking: boolean`
- `speed: number` (0 = idle, >0 = walk cycle)
- `danceLevel: number` (optional)
- `attractiveness: number` (0..1)
- `romanceDrift/heistDrift/survivalDrift: number` (optional)

Outfits/props:
- `outfitId: number`
- `propRightId: number`
- `propLeftId: number`
- `propHeadId: number`
- `propBackId: number`
(or similar slots; keep it <=4 active per character)

Colors (flat fill):
- `outfitPrimaryColor`, `outfitSecondaryColor`, `accentColor`, `hairColor`, etc.

### Walking
Use in-place walk cycle in Rive.
Move character across screen in app by updating CSS `left`/`bottom` (or transforms).
When moving: set `speed > 0`. When stopped: `speed = 0`.

### Backgrounds
Use static images/vectors + overlay layers, crossfaded by drift meters:
- corporate -> bland office
- romance -> bokeh/sparkle overlay
- heist -> scanlines/darkness
- survival -> vignette/grain/desaturation

---

## Repo layout (suggested)

```text
/index.html
/vite.config.ts
/src
  /main.tsx                # Vite entry
  /App.tsx                 # main game shell
  /engine
    gameState.ts           # state model + reducer
    sceneTypes.ts          # TS types
    sceneDb.ts             # story data
    scheduler.ts           # event queue + next-scene selection
    effects.ts             # apply effects
    conditions.ts          # evaluate conditions
  /ui
    SceneRoot.tsx          # background layers + character layer
    TrainingChrome.tsx     # header/progress/Exit course
    DialogueBox.tsx
    ChoiceList.tsx
    PhoneOverlay.tsx       # later (optional)
  /rive
    RiveCharacter.tsx      # wrapper for loading + setting inputs
/public
  /rive
    *.riv
  /bg
    *.webp
/.github/workflows
  deploy-pages.yml
```

---

## Deployment (GitHub Pages)

### Repo + Pages
- GitHub user: `Jazames`
- Repo: `compliance-training`
- URL: `https://jazames.github.io/compliance-training/`
- Configure GitHub Pages to publish from GitHub Actions (recommended).

### Vite static build for Pages
Use Vite's `base` config for the repo path:
- Set `base: '/compliance-training/'` in `vite.config.ts`
- Put static assets in `public/`
- Reference public assets with root-relative paths (Vite rewrites for `base`)

Example `vite.config.ts`:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/compliance-training/',
});
```

Build output:
- `npm run build`
- Publish `dist/`

### GitHub Actions
- On push to `main`, install deps, build Vite app, and deploy `dist/` to Pages.
- Ensure `.riv` files remain under `public/` so they are copied into the static build.

---

## Content authoring workflow (pragmatic)

1. Keep the compliance course mainline short and complete.
2. Add drift detours as interrupt scenes, controlled by queue/scheduler.
3. Add irreversible commit actions that lock a genre.
4. Add good/bad endings per genre as terminal scenes.

---

## Coding guardrails for agents

- Keep story data separate from rendering.
- Keep deterministic mainline; use queue/interrupts for chaos.
- Avoid "AI soup" plot routing: social engine influences reactions/unlocks, not core spine routing (at least initially).
- Reuse Rive rigs via consistent inputs and bone naming.
- Prefer Vite-friendly browser APIs and static assets that work under a non-root base path (`/compliance-training/`).

---

## Source of truth

- `scratchpad.md` is the project's tone, purpose, and creative constraints. Use it as direction for writing scenes, UI humor, and genre drift beats.
