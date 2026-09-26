# Character appearance continuity

## Data and rendering contract

1. Keep canonical appearance in GameState. Existing skin, eye, hair, accent and name fields remain compatible with character creation and the correction form. `playerClothing` adds independent top/bottom IDs, garment palettes and an undershirt color. Null clothing uses the selected character's defaults until initialized.
2. Resolve it through `getPlayerAppearance`, returning one visual snapshot for the rig and related props. This selector validates garment indices for the selected artboard without mutating state. Do not guess the player's shirt from sex or set clothing defaults inside individual scene renderers.
3. App supplies that snapshot to SceneRoot. Both ordinary character placements and the hallway/mustard stages consume it. NPC placements can specify independent clothing with `CharacterPlacement.clothing`; unspecified NPCs retain the shared wrapper defaults.
4. Story effects change clothing through `setPlayerClothing` or `revealPlayerUndershirt`. Queue transitions and local beats preserve it. Employee record corrections preserve clothing; a full restart resets it. This is continuity within the current game session, not new local-storage/save-file persistence.

## Mustard removal

- Capture a copy of the resolved outgoing appearance when the action stage mounts.
- `ShirtProp` selects geometry from `public/props/shirt.svg` and colors it from that snapshot. Business shirts/blouses and T-shirts use `outfitPrimaryColor`; suit tops use `suitColor`, with secondary/accent detail. The existing rough SVG remains an approximation of the garment silhouette, not a pixel-perfect extraction of Rive's animated mesh.
- Keep that outgoing prop's palette fixed while it moves toward the hands and falls away. Preview `revealUndershirt` on the live rig at the existing 1.1-second animation cue.
- On action completion, apply the same transformation to GameState before selecting the next scene. It changes only `topId` and `outfitPrimaryColor`. Bottom selection, pants/suit colors, identity and customization remain unchanged. The new shirt therefore survives subsequent scenes.
- Leaving or talking does not change clothing. Romance drift remains the separately authored +0.02 for selecting removal.

## Independent garment controls

Production scene callers use `topId` and `bottomId`; none passes a combined `outfitId`. The shared wrapper's legacy outfit mapping remains for compatibility with external/authoring callers, not scene routing. `src/rive/wardrobe.ts` is the authority for supported IDs. Do not alter the established state-machine playback to implement wardrobe changes.

## Verification

Appearance tests cover both default palettes, suit-specific prop colors, snapshot stability, every supported bottom on both rigs through removal, continuation persistence, other choices, restart and invalid values. Engine routing tests and normal build checks still apply. Visual checks should cover both sexes, every top, custom palettes, the swap cue, and subsequent scenes; automated state tests alone do not verify spatial alignment.

No player-facing copy or new customization controls are introduced by this work.
