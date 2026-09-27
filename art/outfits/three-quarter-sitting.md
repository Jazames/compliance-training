# Internal three-quarter sitting handoff

The default seated style is now `three-quarter`: an approximate 45-degree
view using the existing flat artwork. Both eyes remain visible, the torso is
wider than the full-profile pose, and thighs project diagonally toward the
viewer with vertical shins. This is a stylized 2D projection, not a 3D rotation.
Both artboards have separate one-second `Sitting Three Quarter` and
`Standing From Three Quarter` timelines. Existing front and full-profile
timelines remain available.

```tsx
<RiveCharacter {...characterProps} seated sittingStyle="three-quarter"
  facing="left" action="talk" />
```

`seated={false}` retains the ordinary standing/walking behavior. The component
defaults to three-quarter only when seated. Scene character placements now
accept `seated` and `sittingStyle`; SceneRoot forwards both. The welcome
facilitator is explicitly seated, and both mustard observers use three-quarter
sitting facing the player. No story strings changed.

Raw runtime contract: `CharacterData.sideSitAmount` is now signed:
- -1: three-quarter seated.
- 0: neutral/standing.
- +1: original full-profile sideways seated.

Keep `sitAmount=0` for either angled pose. Front sitting still uses
`sitAmount=1, sideSitAmount=0`. Interpolate over one second for transitions;
the wrapper handles easing, interruptions and walking suspension. The existing
sideways-sitting document describes the +1 profile; its default-style statement
is superseded by this handoff. Colors, wardrobe and random blink controls are
unchanged.

Latest editable backup and runtime export:
`art/rive-revisions/three-quarter-viewer-facing/`.
The exported runtime is copied to `public/rive/compliance-characters.riv`.
`side-sit-preview.html` now defaults to three-quarter; `profile=1` selects the
old side-on pose, `front=1` selects front sitting, and `cycle=1&walk=1` checks
standing and resuming walking.

Checked both characters, corporate/business and mirrored anime/suit variants,
skirt coverage and the facilitator's chair placement. All 19 tests, lint,
TypeScript and production build passed. npm is absent from the shell, so the
verify checks ran directly through Node.

2026-09-27 correction: the far arm stays fully opaque throughout the 45-degree
pose and both transitions on both rigs. Its upper arm stays at neutral rotation
and forearm bends outward 15 degrees, keeping its hand visible beside the hip.
The old 90-degree profile is unchanged. Verified both arms in the rendered suit
poses; all 20 current tests, lint, TypeScript and build checks passed.

Further 2026-09-27 correction: the 45-degree pose now retains the standing
mouth position/width, nose position and ear position, so the face looks at the
viewer. Both eyes remain visible. The far upper arm angles outward 15 degrees
in addition to its forearm bend, keeping the entire arm clear of the torso.
Both sitting/standing timelines and the held-pose bindings have these changes.
The runtime URL includes a new revision query to invalidate older cached assets.
Verified corporate suits and mirrored anime business clothes on both rigs.
All 21 current tests, lint, TypeScript and build checks passed using Node
directly because npm remains unavailable.
