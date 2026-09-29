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

Source file: https://editor.rive.app/file/generic-man---compliance-training/2557700

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
