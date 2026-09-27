# Internal reach-and-grab integration handoff

Both artboards now contain `Reach and Grab`: a three-second, 60 fps, one-shot
timeline (180 frames). It keys ArmNear and ForearmNear rotation plus HandNear
scale, so sleeves and all independent wardrobe variants follow the gesture.
The simplified hand closes by shortening and widening its silhouette.

- 0–0.2 s: anticipation.
- 0.2–0.7 s: extend toward the object.
- 0.7–0.9 s: close the hand.
- 1–1.5 s: pull the object back.
- 1.5–2.2 s: hold.
- 2.2–2.7 s: release and return to the original arm/hand pose.
- 2.7–3 s: neutral ending, without looping.

React callers use `action="grab"`. The optional stable `onGrabStart` callback
fires when the loaded Rive instance starts this timeline. The mustard spill
and hallway pickup use it to release their paused CSS prop animation. The
existing `interact` action remains unchanged for shirt removal. State Machine 1
continues playing; the new action does not replace appearance/idle playback or
modify the view model, identity, clothing, palette, posture, or story state.

The mustard bottle pulls back with the hand and squirts during the hold. The
hallway combines the arm animation with the existing body bend and moves both
cleaning tools after closure, leaving them upright on the floor. These are
staged CSS props, not runtime attachments to a Rive hand bone. Existing scene
completion timers remain 3.2 s for the spill and 4.8 s for the hallway action.
Very slow initial asset loads can still consume those scene timers; the prop
start callback only synchronizes CSS playback to the loaded character.

Runtime export: `public/rive/compliance-characters.riv`.
Editable backup and matching export: `art/rive-revisions/reach-grab/`.
Internal text-free scene harness: `art/outfits/reach-preview.html`; query
parameters `blend`, `top`, and `bottom` set appearance and clothing.

Validation: visually checked both scenes with both characters in corporate
business outfits and anime suits, including contact, hold and resting poses.
No browser errors were logged. All 19 tests, ESLint, TypeScript and production
build passed. `npm run verify` was unavailable because npm is absent from the
shell; its constituent checks ran directly with Node. No story copy, choices,
labels or accessibility strings were added or rewritten.
