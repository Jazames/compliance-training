# Internal sideways sitting handoff

Both artboards include `Sitting Sideways` and `Standing From Sideways`, each
a one-second, 60 fps, one-shot timeline. The pose turns the existing flat rig
toward screen right: thighs horizontal, knees bent, torso narrowed, far facial
features hidden, visible facial features shifted toward the profile. Skirt
vertices spread over the lap; pelvis pieces shorten to meet the thighs.
This uses the existing vector artwork and wardrobe, not separate characters.

```tsx
<RiveCharacter {...characterProps} seated sittingStyle="sideways"
  facing="right" action="talk" />
```

Set `seated={false}` to stand. `sittingStyle="sideways"` is now the default.
`facing="left"` mirrors the canvas only; the caption stays unmirrored. Facing
is independent of `side`, which still controls placement. Existing callers
use sideways sitting when seated. Both mustard-scene observers explicitly use
sideways sitting and face left toward the player. Front sitting remains an
explicit option for authoring/regression previews.

Raw Rive: animate `CharacterData.sideSitAmount` from 0 to 1 for sitting and
back to 0 for standing. Keep `sitAmount=0` for a purely sideways pose; use
`sitAmount=1, sideSitAmount=0` for the existing front pose. Both values are
clamped by their converters. The React wrapper eases both values together
over one second, including interrupted transitions and changes of sitting
style. Use the property for held poses with the state machine running; the
timelines also provide editor animation previews. Raw callers must suspend
Walking while seated or changing posture, as the React wrapper does.

Talking and appearance playback remain active. Independent garment and color
properties are unchanged. Chair placement remains the scene's responsibility.
The rig has no baked-in chair or opaque background.

Runtime: `public/rive/compliance-characters.riv`.
Matching export and editable backup:
`art/rive-revisions/sideways-sitting/release/`.
Earlier exports in the parent folder are intermediate visual revisions.

Text-free internal harness: `art/outfits/side-sit-preview.html`.
Query options: `blend`, `top`, `bottom`, `left=1`, `front=1`, `stand=1`,
`cycle=1` (stand after three seconds), `walk=1` (resume walking afterward).
Checked both rigs in business outfits and mirrored anime suits, talking while
seated, original front sitting, and side sitting followed by standing/walking.
All 19 tests, ESLint, TypeScript and Vite build passed. npm is absent from this
shell, so the constituent verify commands ran directly through Node.
No new or rewritten production user-facing copy.
