# Internal drift artwork and implementation handoff

These files are authoring and engineering artifacts, outside the production
Vite entry. They introduce no game copy. Existing scene wording and legacy
accessibility strings remain unchanged; no copy is newly designated human-authored.

## Artwork

`endpoints.svg`: columns are romance, heist, survival; man above woman.
The six `<sex>-<genre>.svg` files are full-body vector references. Each has
`-face.svg` and `-steps.svg` companions. Steps run from 0 through 1 in quarters.
They are conceptual reference drawings based loosely on the existing characters,
not pixel-identical exports of the animated rig. `designs.mjs` regenerates them
and the native detail-path manifest without touching production assets.

The production rig uses the same detail paths: facial contour/highlight accents,
lashes, hair highlights, focused eyes, asymmetric heist expression, fatigue,
flyaway hair, dirt, scars, creases, scuffs and garment tears. The old masculine
shirt taper is moderated, lower jaw contours are softened, and forearms broaden
slightly in romance. The old skin-colored biceps overlays are hidden because
they punched apparent holes through the sleeves. Feminine waist/hip changes,
eye enlargement and curled hair remain, with additional lashes and shading.

## Native Rive contract

Source file: https://editor.rive.app/file/generic-man---compliance-training/2617294

### Complete endpoint audit, 2026-09-29

Current runtime/editable export: `../rive-revisions/seated-redraw-verified/`.
See `seated-redraw-progress.md` for the subsequent seated contour repair.
Earlier endpoint audit export: `../rive-revisions/endpoint-audit-final/`.
Pre-edit backup: `../rive-revisions/three-quarter-before/`.
See `endpoint-audit.md` for coverage and remaining scope boundaries.

### Seated seam review, 2026-09-29

Latest runtime/editable exports: `../rive-revisions/seated-seams-profile/`.
The production `.riv` matches that runtime export. The pre-edit backup is in
`../rive-revisions/seated-seams-before/`.

- The male business pelvis offset now binds to its unkeyed wardrobe parent.
  Appearance timelines were overwriting the shape's seated position, leaving
  a detached strip below the shirt. Its local baseline remains 80.
- Both skirt lap edges slope toward the knees and have softer corners.
- Head-local face overlays fade out as the head turns into full profile;
  eye-attached lids, hair, and clothing details retain their existing bindings.
  This avoids front-view scratches and highlights floating outside the profile.
- The contact sheet accepts `posture=0..1` for intermediate seated poses.

Visually checked all 24 outfit combinations in standing wave, three-quarter
seating, and profile seating, plus a halfway profile pose. These are sampled
poses, not an exhaustive frame-by-frame proof. No player-facing copy changed.

- `CharacterData.numberProperty`: existing romance blend, 0..1.
- `CharacterData.heistDrift`: new number, 0..1, default 0.
- `CharacterData.survivalDrift`: new number, 0..1, default 0.
- Original artboard names, named instances, wardrobe slots, color properties,
  state machine, sitting controls and action timelines are preserved.
- Details reveal in phases via three shared formula converters. Early details
  reach full visibility at .625; middle details start at .2; scars/scuffs at .45.
- Eye details are children of individual eyes, so they inherit blink and
  appearance transforms. Mouth details inherit talking. Head and torso details
  inherit their existing movement. New expression groups own only their own
  offset/rotation/scale, not action timeline properties.
- Existing appearance endpoints and the romance preview timeline were updated
  together. There are no app-side timeline scrubs or replacement idle scheduler.
- `rig-manifest.json` records added IDs, bindings and endpoint key revisions.
  `detail-manifest.json` contains creation geometry; final parent overrides are
  recorded in the rig manifest because eye/mouth details were attached after creation.

Backups: `../rive-revisions/drift-before/` is the original editable source;
`../rive-revisions/drift-final/` holds the final editable and runtime exports.
`../../public/rive/compliance-characters.riv` is the production runtime copy.

## Runtime behavior

`resolveDriftAppearance` selects the locked genre, otherwise the largest clamped
meter. Exact ties use romance, heist, survival order. Story meters are never
changed by appearance resolution. This is a deterministic dominance rule;
there is no persistent visual hysteresis state.

`getPlayerAppearance` carries the resolved values through player scenes and
cutaways. `DriftContext` supplies the same genre to background actors. Explicit
snapshots override stage context. Skin, eyes, hair, highlights and clothing
remain independently bound. A scar is reversible visual stylization, not a
new persistent injury flag or story effect.

`useDriftAppearance` eases only the three bound inputs over 800ms. Retargets
start at the displayed values. Cross-genre transitions use convex weights,
so total drift weight never exceeds one. Pauses freeze an existing character;
resume continues from its displayed appearance. New instances bind their
complete appearance behind black before readiness is released. Reduced motion
settles immediately after playback is allowed. Unmount cancels pending frames.

## Local visual verification

### Joint cleanup, September 29

Subsequent outfit seam pass: casual sleeve openings are centered over the
upper arms on both rigs, and the female sleeve shoulder curves widen to meet
those openings. All four casual upper-arm rectangles end four units below the
elbow instead of sixteen, preventing a square protrusion during bends.
Female trouser/jeans/shorts pelvis tops and thigh-top corners are rounded to
remove rectangular corners showing beside fitted shirt hems. No action
keyframes, palette bindings, wardrobe selections, or game text were changed.
The latest editable/runtime exports are now `../rive-revisions/outfit-seams-pivots/`.
The far forearm pivots on both rigs were also moved from y=141.666656 to
y=81.999969, matching the elbow. Child artwork was offset by the inverse
59.666687-unit change, preserving standing geometry while fixing seated bends.
`outfit-seams-review.png` shows all 24 clothing combinations at full romance
drift in a bent-arm pose. Additional checks use neutral walking, intermediate
drift, contrasting palettes, and seated reaching.

The recovered editable file is https://editor.rive.app/file/generic_man_-_compliance_training/2617294.
Select `generic-man` or `generic-woman`, not the wrapper `Artboard`, to see each
character's 15 timelines. The wrapper has only `Timeline 1`.

Corrected 26 position keys in the man's `Anime Transformation` preview which
still used artboard coordinates after wardrobe shapes had been reparented.
Sleeves, cuffs, upper/lower trousers, and pelvis details now use their local
coordinates. Added skin/suit elbow joins on both near forearms, with wardrobe
visibility and palette bindings, to cover seams during sharp bends. Existing
actions, far-arm pivots, and posture bindings are preserved.

Latest editable/runtime exports: `../rive-revisions/joint-cleanup-final/`.
The production runtime copy matches this export. Earlier revisions are retained.
`contact-sheet.html?mode=romance&steps&timeline=Anime%20Transformation` freezes
the transformation at quarter-second intervals. `action=Arm%20Wave&time=0.42`
freezes a live action pose; combine with `wardrobe` to inspect all combinations.
`steps` also accepts `sex=man|woman` and `top=0|1|2`.

Run the Vite server, then open `/art/drift/contact-sheet.html` for live endpoints.
Default order matches the SVG reference sheet. The page is text-free; diagnostic
counts are in `main.dataset.ready` and `main.dataset.expected`.

- `?mode=romance&steps&action=Walking`: both rigs at 0, .25, .5, .75, 1.
- `?mode=heist&wardrobe&sit&palette=dark&action=Talking`: all 24 wardrobe combinations.
- `?mode=survival&wardrobe&palette=light&action=Walking`: all combinations, light skin.
- `?mode=romance&wardrobe&front&action=Talking`: front seated, all outfits.
- `profile` selects side seating; `sit` selects three-quarter seating.
- `action` accepts saved timeline names; the React preview uses app action names.

`/art/drift/preview.html?mode=survival&blend=1&cycle` uses the actual React wrapper
to repeatedly transition between corporate and survival. It also accepts
`action=walk|talk|interact|grab`, `sit`, `front`, `profile`, `skin`, `hair`, `top`, `bottom`.

`/art/drift/runtime-probe.html` runs the production hook with a mock bound instance.
Eight checks cover hidden initial appearance, paused updates, easing, pause,
retargeting, resume, reduced motion, and disposal. Results are in body dataset.
This complements visual Rive checks; it does not substitute for them.

Validation: all 36 Node tests passed, including new appearance selection,
lock precedence, invalid input, cross-genre bounds, interruption and snapshot
continuity tests. ESLint, TypeScript and the Vite production build passed.
`npm run verify` was attempted but npm is absent from PATH; its lint, test and
build stages were run directly with the bundled Node executable.
