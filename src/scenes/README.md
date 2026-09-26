# Editing and adding scenes

Each `.ts` scenario file owns one complete encounter: staging, dialogue, questions, answers, feedback, and outgoing scene requests. TypeScript provides editor autocomplete and catches mistakes. No React knowledge is needed for ordinary story edits.

## Where to edit

| File | Content |
| --- | --- |
| `welcome.ts` | Facilitator monologue and fade |
| `character_1_sex.ts` | Break-room responses, character selection, feedback |
| `character_2_skin.ts` | Sensitivity dialogue and continuous skin slider |
| `character_3_eyes.ts` | Restroom question, feedback, mirror eye-color question |
| `character_4_name.ts` | Facilities email, nameplate question, confirmation |
| `character_5_hair.ts` | Salon reward, hair choices, natural/bright feedback |
| `hallway.ts` | Broom/mop trip hazard: approach, question, and three action cutaways |
| `mustard.ts` | Kitchen spill, leaving with a stain, four-coworker montage, or shirt removal |
| `cybersecurity.ts` | Main course cybersecurity quiz |
| `romance_notification.ts` | Optional phone encounter |
| `course_complete.ts` | Completion and restart |

`training_intro.ts` and `romance_feedback.ts` retain older prototype content but are not currently queued by the main course. Registration makes a scene available, not automatically playable.

`index.ts` registers scenarios. `shared.ts` contains reusable character placements, not story routing. Hair/eye palettes remain in `src/engine/` because the correction form also uses them. Background and Rive binaries remain in `public/`.

## Scenario versus beat

A **scenario** is a complete encounter. A **beat** is one screen within it. The queue contains scenarios, never feedback beats.

Edit `title`, `body`, `dialogue[].text`, and `choices[].label` for copy. `email` owns Facilities' sender, subject, message, and signoff. Visual fields belong to each beat, so switching to feedback does not accidentally inherit question-specific controls.

Each choice must specify exactly one outcome:

- `nextBeat: 'feedback'`: stay inside this file's scenario.
- `complete: true`: finish this scenario, then ask the engine what comes next.
- `restart: true`: clear the entire game and start again.

Effects apply before the outcome. An `enqueueScene` effect adds an upcoming scenario; it does not immediately interrupt the active beat.

Animation-only beats can specify `autoAdvance: { afterMs, choiceId }`. The renderer hides their choices and invokes the specified unconditional choice after playback. Opening the correction form cancels that timer; returning remounts the visual and restarts playback. Leaving the beat cancels pending advancement. The choice still uses normal engine effects and queue routing. `hallway.ts` uses this to keep each action inside the scenario until the cutaway finishes. Its `hallwayAction` selects app-staged approach/jump/pickup/report visuals; the current Rive export supplies walking/talking but no native jump or pickup clips. Hallway narration and option text are user-supplied verbatim (2026-09-19); do not add outcome prose without the author's wording.

```ts
import type { ScenarioDef } from '../engine/sceneTypes';

const scene: ScenarioDef = {
  id: 'example',
  entryBeat: 'question',
  milestone: true,
  beats: {
    question: {
      id: 'question',
      type: 'trainingSlide',
      title: 'Ready to proceed?',
      choices: [{
        id: 'answer',
        label: 'Yes',
        nextBeat: 'feedback',
        effects: [{ kind: 'addMeter', key: 'compliance', amount: 0.1 }],
      }],
    },
    feedback: {
      id: 'feedback',
      type: 'trainingSlide',
      body: 'Your readiness has been recorded.',
      choices: [{
        id: 'continue',
        label: 'Continue',
        complete: true,
        effects: [{
          kind: 'enqueueScene',
          scene: { sceneId: 'cybersecurity', mode: 'course' },
        }],
      }],
    },
  },
};

export default scene;
```

Add an import and array entry in `index.ts`, then queue `example` from an existing scene's choice to make it reachable. IDs must be unique. Beat IDs only need to be unique inside their scenario. Don't use cross-file `nextBeat` references.

## Upcoming-scene container

`GameState.queue` retains pending scene requests. Each request supports:

| Field | Meaning |
| --- | --- |
| `sceneId` | Registered scenario to play |
| `mode` | `required`, `course`, or `optional` |
| `priority` | Higher runs first; default 0 |
| `weight` | Positive relative likelihood among equal-priority candidates; default 1 |
| `conditions` | Current-state eligibility; ineligible requests stay pending |
| `oneShotKey` | Prevent re-queuing an encounter after it has played |

At scenario completion, the engine selects the first eligible required request. If none exists, it selects the highest-priority eligible requests and uses seeded weighted randomness to break ties. After two optional encounters in a row, an eligible course request takes precedence over optional ones. Only the selected request is removed; terminal scenarios clear the queue.

To introduce variation, a choice can enqueue a course continuation plus one or more optional scenes. Give them equal priorities to mix their order, or give an optional encounter a higher priority to play it first. A deferred optional scene can play at a later boundary; it is not guaranteed to play before a terminal scene. Use `required` when immediacy is essential.

A detour normally ends with `complete: true, effects: []`: the course continuation is already waiting. Never hardcode a detour's return to a particular course scene. Duplicate pending scene IDs and one-shot keys are ignored. Random seed and consecutive-detour count live in game state; `createInitialGameState(42)` gives repeatable tests.

The engine never chooses unqueued scenes from the registry. Current authored course content is mostly linear; adding this system does not invent new encounters or rewrite the plot. An empty or entirely ineligible queue at completion displays a routing error rather than silently replaying a question. Exit course resets it; fix the outgoing requests in the authoring file.

## Protected character creation

The order is welcome → `character_1_sex` → `character_2_skin` → `character_3_eyes` → `character_4_name` → `character_5_hair` → hallway.

Each character scenario has `creation: true`. Its internal answers change traits and advance beats without queuing anything. Each final feedback choice queues **exactly one unconditional `required` successor**, and all completion branches queue the same successor. The validator enforces this. Numbered filenames document the sequence; explicit requests control it.

The final hair choice sets `characterCreationComplete`. Its feedback still finishes before any next scene selection. Optional/course requests are ineligible before creation completes. Corrections through the employee record change appearance/name without resetting the active beat, progress, or queue.

## Progress, endings, and checks

Use `milestone: true` for required course scenarios. Progress counts each completed milestone once, never optional scenes or feedback screens. Adding optional scenes therefore cannot move the progress bar backward. `terminal: true` means remaining pending requests are discarded on entry. Restart resets character, flags, meters, queue, milestones, and random state.

Run `npm run verify` after editing (lint, engine tests, TypeScript, production build). Tests use Node 22.15+ or 24+ with a small source loader and no extra test dependency. The registry also validates destinations, choice outcomes, positive weights, and the protected creation contract at startup. Tests cover all 1,296 creation answer combinations, detour returns, selection, conditions, one-shots, and restart.

Future cooldowns, non-scene events, and genre-specific selection weights are not implemented yet; do not assume those fields work.

## Mustard scene staging

Appearance continuity now uses the shared GameState snapshot described in [the character appearance contract](../../docs/character-appearance.md). Shirt removal previews and commits only the independent top change; the outgoing SVG takes its color from the outgoing appearance instead of a fixed teal fill. Pants remain unchanged.

The course now routes hallway → mustard → cybersecurity. `mustard.ts` owns the user-supplied narration/options, the three action beats, their completion timers, and the `+0.02` romance-drift effect for removing the outer shirt. No other answer changes meters. All three cutaways return to the course; leaving work is represented within the training scenario rather than ending the course.

`MustardStage.tsx` supplies a deliberately rough CSS/vector kitchen with two seated observers. The spill stroke terminates at a stain in the player's coordinate system so the stain travels with the character. The montage starts with an announcement to the seated coworkers and then cuts to four distinct standing coworkers, with no invented conversation text. Removing the outer shirt plays the wrapper's interaction gesture and slides an SVG shirt overlay forward and down, revealing the alternate-color T-shirt outfit. The two observers remain visible. Current export lacks an Interacting animation; the wrapper falls back to the available Arm Wave. Top 2 is the independent T-shirt slot; the current bottom selection and colors are preserved.

Reusable text-free props live in `public/props/`: mustard bottle, hotdog, broom, mop, and shirt. `SceneProp.tsx` handles base-path-safe URLs. The hallway now uses these external broom/mop SVGs rather than inline copies. New prose must still come from the author; all additions here are internal implementation notes.
