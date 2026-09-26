# agents.md - Corporate Compliance Training Parody VN (GitHub Pages)

This repo is a web-hosted, single-page visual novel / choose-your-own-adventure parody of corporate compliance training.

It must support:
- A straight-faced compliance course path (player can finish like a normal training quiz and click `Exit course`).
- A "genre drift" system where obviously wrong choices gradually morph presentation/genre (dating sim, heist/rogue, survival).
- Rive-animated 2D characters (skeletal rig + outfits/props) rendered in the browser.
- A plot engine based on scenes + choices, later extensible to minigames.
- Deployment to GitHub Pages under user `Jazames`.

Project spirit and creative direction lives in `scratchpad.md` (treat as canon).

## Human-authored user-facing text only

This project follows the reuse-first approach described in [Garrett Petersen's thread](https://x.com/GarrettPetersen/status/2098816722916762024) and its follow-ups: assemble appropriate existing human-authored copy instead of generating replacement prose. The user's instructions below are stricter than the thread: there is no automatic exception for privacy notices or other supposedly unimportant text.

### Authorship boundary

- Do not generate new user-facing text. This includes dialogue, narration, quiz questions, answer options, feedback, character names, in-game emails, scene headings, UI labels, tooltips, accessibility text, player-visible errors, credits, store descriptions, website copy, marketing, and legal/privacy notices.
- Do not paraphrase, summarize, embellish, polish, translate, or imitate the author's voice for those surfaces. Training a model on the author's writing does not make its output human-authored.
- Exception: correcting an obvious typo is allowed when the intended spelling is unambiguous (for example, `agsinst` → `against`). Make only the minimal correction; do not change meaning, tone, grammar, or style. Preserve intentional dialect, character voice, names, and unconventional wording. If uncertain whether something is a typo, leave it unchanged and ask. This exception does not authorize rewriting or generating copy.
- Engineering requests such as adding a scene, building a page, fixing a bug, or refactoring components do not authorize copywriting. Implement the structure and behavior using suitable approved text where available.
- Technical code, tests, non-rendered developer comments, internal engineering documentation, and direct discussion with the user remain allowed. Do not use these exceptions to smuggle generated prose into the game, public documentation, metadata, or assets.

### Reuse workflow and provenance

1. Search the relevant scene files and text explicitly supplied or designated by the user for reuse before changing a user-facing string.
2. Establish provenance. Text qualifies when the user supplied the wording or identified it as their human-authored copy for this purpose. Presence in the repository, a prior assistant response, a commit, or an approved implementation does not establish human authorship. If provenance is uncertain, ask rather than label it human-written.
3. Reuse suitable passages verbatim. Selection, relocation, and ordering are allowed when they preserve meaning and context. Prefer intact sentences or authored units; do not stitch isolated words into newly authored claims or dialogue, or invent connecting phrases.
4. Preserve wording, punctuation, spelling, and tone, including unconventional choices, except for the obvious-typo exception above. Otherwise limit mechanical changes to those required for representation (for example, escaping a string without changing its displayed value). Existing author-specified placeholders may receive their intended values; do not invent prose through interpolation.
5. Record the source of newly reused copy in a non-rendered comment or implementation handoff (source file and section, or the user's supplied wording). Do not fabricate provenance. Internal design notes such as `scratchpad.md` establish intent but are not automatically publication-ready copy; ask before promoting notes into public text. Third-party writing also requires appropriate reuse permission and context.
6. If suitable human-authored copy is missing, continue independent engineering work and request the exact missing wording. Keep unfinished content unregistered, disabled, or otherwise off the user-facing path. Use non-rendered TODO comments if useful; never ship AI-written placeholders, filler, fallback prose, or example scenes as a substitute. Do not remove essential labels or accessibility information to evade this rule.

### Existing text and the author's rewrite

- Existing AI-authored or unknown-provenance text is legacy content awaiting the user's rewrite. Leave it unchanged except for obvious typo corrections, unless the user specifically requests its removal or provides replacement wording. Correcting a typo does not establish human authorship. This rule is not a request to delete the current story or break the course.
- Legacy copy may be moved unchanged as part of a structural refactor, but must not become an approved source for new scenes, pages, or marketing. Do not mark it human-authored merely because the user has retained it temporarily.
- Protect the user's hand edits. Do not regenerate scene files from old snapshots, restore superseded AI text, or perform unsolicited spelling/style cleanup beyond the obvious-typo exception. During code migrations, preserve rendered strings except for clearly identified typo corrections and inspect the text diff separately from routing changes.
- New user-provided replacement wording takes precedence over existing copy. Wire it into the appropriate self-contained scene without adding introductions, explanations, jokes, or transitions of your own.

### Before handing off changes

- Review every added or modified user-facing string, including strings in JSX, scene data, metadata, SVG/image text, accessibility attributes, and runtime fallbacks. Confirm it is unchanged relocated text or traceable human-authored wording authorized for that use.
- Obvious typo corrections are also permitted in this review. Identify them separately in the handoff; do not present them as new copy or as evidence of human authorship.
- Report missing copy as an implementation gap to the user, not as invented in-game text. Report any legacy copy moved unchanged without claiming it was rewritten or approved.
- Passing tests or a build does not establish authorship. Content provenance requires a separate review.

---

## Tech stack

- Vite (render/build engine) + React + TypeScript
- Static build output for GitHub Pages (`dist/`)
- ESLint for code linting (`npm run lint`)
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
- `queue: PendingScene[]` (authored upcoming scene requests)
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

### Scene ownership and authoring

Each scenario is one `ScenarioDef` in `src/scenes/<scene_id>.ts`, registered in `src/scenes/index.ts`. Its `beats` contain all dialogue, questions, feedback, email text, visuals, choices, and outgoing queue requests for that scenario. Renderers consume the active beat; they must not own story copy or routing.

Character files are `character_1_sex.ts`, `character_2_skin.ts`, `character_3_eyes.ts` (restroom and mirror), `character_4_name.ts`, and `character_5_hair.ts`. Numbers document the order; explicit queue requests implement it.

See [the scene authoring guide](src/scenes/README.md) for complete examples and the actual schema in `src/engine/sceneTypes.ts`.

### Effects and transitions

Choices have exactly one outcome: `nextBeat` (local), `complete: true` (finish and ask the queue), or `restart: true` (reset the whole game). `effects` apply appearance, meter, and flag changes or `enqueueScene` requests. Do not reintroduce cross-scene `goto` or `nextSceneId`.

## Pending-scene queue and scheduling

`GameState.queue` is a serializable `PendingScene[]`, separate from internal beats. Requests contain `sceneId`, `mode`, and optional `priority`, `weight`, `conditions`, and `oneShotKey`.

At a choice:
1. Apply effects and append nonduplicate scene requests.
2. If `nextBeat` is present, remain inside the scenario. Never consume queued scenes during feedback.
3. On `complete`, record its course milestone once and select the next eligible request.
4. Required requests take precedence (FIFO among required entries). Otherwise choose by highest priority, then seeded weighted randomness among ties.
5. After two consecutive optional encounters, prefer an eligible course request to prevent starvation.
6. Remove only the selected entry. Keep deferred or currently ineligible entries.
7. Terminal scenes discard remaining pending work. Empty/ineligible queues display an author-facing routing error with an Exit course recovery.

Before character creation is complete, only required requests can play. Every creation scene must enqueue exactly one unconditional required successor when finished, and all answer branches must share that successor. Its internal choices enqueue nothing. The validator enforces this contract.

The engine does not draw random scenes from the registry. Authors explicitly queue candidates. Course choices queue their continuation; detours normally complete without queuing that continuation again. Seed state is stored in GameState for reproducible tests. Current prototype content remains mostly linear; weighting provides variation when authors enqueue multiple eligible candidates.

Progress counts completed milestone scenarios, not presentation order. Appearance correction must preserve milestones, pending scenes, random state, and active beat.

Future cooldowns, category caps, deferred non-scene events, and genre-specific weighting are not yet implemented; keep them separate from the current queue contract.

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
Endings are scenarios marked `terminal: true`, entered through queued scene requests. A future ending-check system can enqueue those requests.

Endings to support (per scratchpad spirit):
- Complete the course (normal)
- Married (romance good/bad)
- Heist success/failure
- Survival escape/failure
- Additional satirical "arrested" variant (keep names fictionalized)

---

## Rive integration

### Appearance continuity

GameState owns player identity/customization and independent `playerClothing` top/bottom selections and palettes. All player renderers and matching props consume `getPlayerAppearance` rather than inventing per-scene defaults. Clothing changes are story effects; preview the same transformation during a cutaway and commit it on completion. Removing a shirt must not change pants. See [the appearance contract](docs/character-appearance.md) for snapshot, prop-color, and validation rules. Keep state-machine playback intact.

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
    scheduler.ts           # pending-scene selection + local beat advancement
    validateScenes.ts      # author-facing routing checks
    effects.ts             # apply effects
    conditions.ts          # evaluate conditions
  /scenes
    index.ts              # explicit registry (no story text)
    README.md             # scene authoring guide
    character_1_sex.ts     # one complete scenario per file
    character_2_skin.ts
    character_3_eyes.ts    # restroom + mirror
    character_4_name.ts
    character_5_hair.ts
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

Validation commands:
- `npm run lint` (ESLint)
- `npm run typecheck` (TypeScript project checks)
- `npm run build` (typecheck + Vite production build)
- `npm run test` (engine and scene-routing tests; Node 22.15+ or 24+)
- `npm run verify` (lint + tests + build; preferred pre-push check)

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
- Before declaring work complete, run `npm run verify` (or explain why it could not be run).

---

## Source of truth

- `scratchpad.md` is the project's tone, purpose, and creative constraints. Use it as direction for writing scenes, UI humor, and genre drift beats.
