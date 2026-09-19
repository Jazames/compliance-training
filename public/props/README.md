# Programmatically animated scene props

Reusable, text-free SVGs: mustard bottle, hotdog, broom, mop, and a rough removable shirt. Serve with `${import.meta.env.BASE_URL}props/<name>.svg` for GitHub Pages compatibility.

HallwayStage positions the broom and mop in the original shared 220×150 coordinate system; their individual transforms lift them against the wall. MustardStage places the bottle at the player's hand, animates a yellow SVG stroke to a separate shirt stain, and keeps that stain in the player's moving coordinate space. The removable shirt is an intentionally approximate overlay, not a new Rive garment.

The current Rive export has Arm Wave, Walking and Talking, but no Interacting timeline. The wrapper's interact action uses Interacting if supplied in a future export, otherwise Arm Wave. Scene timers and CSS transforms control props and cutaways. No source Rive assets are modified by this implementation.
