# Internal animation endpoint audit — 2026-09-29

Coverage: 15 saved timelines plus 3 drift previews, each with all 9 male and
15 female top/bottom combinations (432 endpoint combinations). Default palette.
This is a visual endpoint audit with selected transition checks, not a claim
that every frame and every custom palette has been exhaustively inspected.

| Preview | Endpoint reviewed | Outcome |
| --- | --- | --- |
| Idle | 1 s | Shared shoulder and female trouser-waist repairs |
| Talking | 1 s | Same standing repairs; mouth returns correctly |
| Arm Wave | 1 s | Arm returns; raised-arm sample also inspected |
| Walking | 1 s | Stride silhouette and ankle joins inspected |
| Reach and Grab | 3 s | Returns to standing with attached arms |
| Blink | 0.15 s | Eyes reopen |
| Corporate Appearance | 1/60 s | Wardrobe and standing silhouette inspected |
| Anime Appearance | 1 s | Broader/narrower silhouette and outfit joins inspected |
| Anime Transformation | 1 s | Matches transformed endpoint |
| Sitting Down | 1 s | Reduced excessive front skirt flare |
| Standing Up | 1 s | Restores standing proportions |
| Sitting Sideways | 1 s | Covered exposed knee blocks; synced skirt keys |
| Standing From Sideways | 1 s | Restores standing pose; synced pelvis keys |
| Sitting Three Quarter | 1 s | Rebuilt lap, leg spacing, hands, facial offset and depth |
| Standing From Three Quarter | 1 s | Reversed revised pose consistently |
| numberProperty | 1 | Full romance inspected |
| heistDrift | 1 | Full heist inspected |
| survivalDrift | 1 | Full survival inspected |

Repairs apply in the editable Rive file and production runtime export:

- Three-quarter thighs now rotate 75 degrees, with wider knee/foot separation,
  compensating root height, relaxed hands, and a small facial turn.
- Far-leg depth uses an extra translucent fill on the existing paths. Its alpha
  follows three-quarter seating, leaving standing palettes unchanged.
- Both business-shirt sleeve caps have softer shoulder contours.
- Both skirts cover the revised three-quarter knees; profile skirts no longer
  expose the rectangular top of the shin. Front seated hems taper inward.
- Female trouser/shorts pelvis paths extend upward under the shirt, closing the
  center waist pinhole without extending the crotch downward.
- Eight profile/three-quarter sit and stand timelines were aligned with live
  posture bindings. Gallery posture interpolation now matches their easing.

Reproduction: run Vite and open `contact-sheet.html` with `mode=romance`,
`wardrobe`, `blend=0`, `action=<native animation name>`, and `endpoint=<seconds>`.
Add `front`, `profile`, or `sit` for the corresponding final seated input.
For drift endpoints, omit `action`, set the requested `mode`, and use `blend=1`.
For a close-up omit `wardrobe`, add `sex=man|woman`, `top`, `bottom`, and `large`.

The endpoint harness prepares the bound appearance, removes the paused state
machine, and uses the public `scrub` API just before the timeline boundary.
This avoids a runtime behavior where paused state machines suppress geometry
updates during scrubbing. Each canvas marks its endpoint; `main.dataset.frozen`
must equal `main.dataset.expected` before capturing. Runtime playback was also
checked in the actual animation gallery. Intermediate three-quarter poses were
sampled at half transition with full romance, plus enlarged seated silhouettes.

No story/UI copy changed. Labels remain existing native animation identifiers.
