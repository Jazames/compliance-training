# Internal pose and hand-layering pass — 2026-09-30

Source: Rive file 2617294, generic_man_-_compliance_training.
Editable pre-pass backup: ../rive-revisions/pose-perspective-before/.
Current runtime and editable backup: ../rive-revisions/pose-perspective-polish/.
Runtime: 194112 bytes; editable revision: 510079 bytes.
Runtime SHA256: 8F3D1F67EF5624EE09CB474E78D2EAB00E56E2ADD6D6D9909AF018367CEFBD4B.
The production asset is byte-identical to that runtime export.

## Native changes

- Removed DrawRules 0-889 and 0-2117 ("Behind legs"). The nodes named
  ArmFar (0-629 / 0-2055) are the screen-left, visually closer arms in these
  seated poses. Their names had encouraged the wrong layering assumption.
  They now draw ahead of torso siblings. Both hands remain visible in profile.
- Reposed both seated arms, with the closer hand in front of the lap. Added
  inward forearm bends to the front-facing sit and its standing return.
- Narrowed turned torsos separately from head proportions, reducing the
  previous whole-character squash. Offset male shirt details for quarter view.
- Replaced early translucent far-eye/brow fading with horizontal foreshortening
  and a later occlusion interval; delayed the far-ear fade as well.
- Narrowed and sloped both seated skirts around the knees. Smoothed the female
  trouser seat, tapered thigh roots, and matched skin/clothing root rounding.
- Narrowed profile hip connectors, softened pelvis corners, and narrowed male
  pelvis rectangles so they no longer make as large a square step during walking.
- Added skin/suit elbow joins under the closer forearms, with independent skin,
  suit-color and top-visibility bindings. New shape IDs: 7-12512 / 7-12516 (man),
  7-12525 / 7-12529 (woman).
- Rive reparenting inserted two unintended x=116 keys on the woman's Blink
  timeline. These were discovered in the real gallery and deleted. All 30
  timelines were queried for keys on the four new elbow shapes; only those two
  accidental keys existed. Do not restore them from the trial exports.
- Posture data bindings and eight side/quarter sit/stand timelines were changed
  together. The four front sit/stand timelines also contain the new arm bends.
  The production state machine and five-second drift preview timing are retained.

## Visual review and limits

Review used full-size browser renders, outfit contact sheets, and the actual
animation-test gallery. The enlarged revisions caught the hand crossing the
stomach, oversized skirt hem, exposed hip skin, and floating elbow patch; these
were iterated rather than accepted based on build/test results.

Inspected all 24 outfits at side-view endpoints and full-romance quarter-view
endpoints, plus neutral quarter-view outfit sheets. Inspected both characters'
standing returns, standing action endpoints, appearance endpoints, and selected
midpoints in sitting, turning, waving, reaching and walking. Full-size checks
included the woman's blouse/shorts combination from the user's screenshot and
the front-hand/skirt overlap. This is sampled visual coverage, not an assertion
that every frame, palette and pose combination has been exhaustively reviewed.

The internal contact sheet now supports `actions=Name|Name` to compare native
animation identifiers, and `isolated` to omit state-machine preparation and
match the gallery's named-animation playback. Use `isolated` for regression
checks such as Blink: preparation can conceal bad base values or unwanted keys.
`large` now uses 500px columns, avoiding overlapping 500px canvases.

No player-facing strings were added or rewritten. The helper is internal and
renders no new text. Production code changes only the Rive asset cache version.

Validation: ESLint, all 36 existing tests, TypeScript project checks, and the
Vite production build passed. npm was unavailable on PATH, so these were run
through the installed Node entry points (the same steps as npm run verify).
The build was repeated after copying the final polished runtime asset.
