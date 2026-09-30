# Internal Rive redraw handoff — 2026-09-30

Runtime and editable exports completed after restarting Rive and reinitializing
its local connector. The production runtime matches `seated-redraw-verified`.
This pass corrects three-quarter seated clothing contours and arm visibility;
it is not an exhaustive audit of every animation frame.

Active source: file 2617294, `generic_man_-_compliance_training`.
Pre-edit native backup: `../rive-revisions/seated-redraw-before/`.
Trial exports: `../rive-revisions/seated-redraw-trial{,2,3}/`.
The trial4 export stalled. The recovered final exports are in
`../rive-revisions/seated-redraw-verified/` (.riv and .rev).

Edits currently present in the editor:

- Woman business blouse waist/hem vertices have three-quarter contour bindings
  and matching keys in Sitting/Standing From Three Quarter. Neckline vertices
  0-3202/0-3204 move from y=-14 to -4, and 0-3203 from y=12 to 4.
- Both far upper arms finish three-quarter sitting at +10 degrees; standing
  stays at zero and profile stays at -8. Bindings and four sit/stand timelines
  were updated together.
- Female pants/jeans/shorts pelvis bindings now finish at y=48 and scaleY=.85.
  Their old rectangles fade out during three-quarter sitting.
- New curved seat shape 7-9976, QuarterTrouserSeat, uses pantsColor and appears
  only for bottomId 1, 2, or 4 in three-quarter sitting. Color object 7-9984.
  Visibility converter 7-9985. Old pelvis visibility converters are 7-10079,
  7-10118, 7-10157. The shape's top-right vertex 7-9979 is x=42,y=35.
- Shorts hem vertices 6-430/431 and 6-422/423 are tapered to x=+/-20 with
  corner radius 7.
- Latest correction moves QuarterTrouserSeat above both thigh nodes, below
  the torso and skirts. This fixes thigh skin drawing over the new connector.
  Verified hierarchy order after the stalled export:
  Torso, existing pelvis shapes, skirts, QuarterTrouserSeat, LegNear, LegFar.

Visual checks: all 24 three-quarter outfits in the final export; standing
returns and halfway poses at full romance on the preceding geometry revision.
The final layering change was checked at full size and in the actual gallery
using woman/topId=0/bottomId=4: the exposed thigh patch on the lap is covered.

The runtime cache version is `20260930-seated-contour`. Named-animation gallery
isolation introduced in 06ac986 remains in place. No player-facing copy changed.
