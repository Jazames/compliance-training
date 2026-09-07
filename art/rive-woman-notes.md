# Generic woman: Rive editor handoff

Editor: https://editor.rive.app/file/untitled/2557700

The file was exported on 2026-09-07. The shared asset at `public/rive/compliance-characters.riv` is wired into the React scene; the woman-only export is retained as a backup. See [shared runtime implementation notes](../public/rive/README.md) for loading, independent instances, property access, animation control limits, and validation.

`generic-woman` is a separate artboard beside the original `generic-man`. It was duplicated from the completed man's artboard to reuse the articulated rig, animations, and color bindings. Its internal copied group is named `WomanRig`. The original man's geometry and animations were not edited in this pass.

## Appearance and controls

The woman has a native vector bob (`HairBobBack`, `HairLockNear`, `HairLockFar`), finer brows, a smaller nose, a rose smile, and slimmer torso/shoulder proportions. All added hair pieces belong to her Head group and bind to `hairColor`.

Play her `State Machine 1`, then adjust `CharacterData.numberProperty`:

- 0: corporate appearance.
- 0.5: blended appearance.
- 1: anime appearance with larger eyes, a more angular/tapered face, a defined waist, subtly wider hips/legs, and exposed upper-arm shapes.

The artboard uses CharacterData **Instance 1**; the man uses **Instance**. They share the property schema but have separate editor defaults. The woman's shirt default is `86658F`; the man's remains `438F98`. Both appearance defaults are 0.

Editable properties: `skinColor`, `hairColor`, `outfitPrimaryColor`, `pantsColor`, and `numberProperty` (the current generated name for the genre blend).

## Animations

Timeline names are scoped to each artboard:

| Woman timeline | Purpose |
| --- | --- |
| Timeline 1 | Idle / blink |
| Timeline 2 | Talking |
| Timeline 3 | Arm wave |
| Timeline 4 | In-place walk |
| Timeline 5 | Editable corporate-to-anime morph |
| Timeline 6 | Corporate blend endpoint |
| Timeline 7 | Anime blend endpoint |

`State Machine 1` has idle on Layer 1 and `Anime Appearance` on Layer 2. The hip/leg widening is keyed in the authoring morph and both endpoint copies. Keep those copies synchronized when editing appearance animation keys.

## Validation and integration status

- Inspected the two separate artboards together after renaming the copied internal group.
- Checked appearance values 0, 0.5, and 1, plus return to corporate during walking.
- Checked corporate and anime walking, anime talking, and the anime arm wave in the state machine. Restored idle afterward.
- Changed skin and hair colors in live preview and confirmed the face, arms, and new bob recolored; temporary test colors were reset by restarting the preview.
- Confirmed her independent plum shirt default renders while the man retains teal.
- Repository lint, TypeScript checks, and the production build pass with the exported Rive assets included.

As with the man, this is a nested vector-group rig, not a skinned bone mesh. Dedicated runtime action inputs/transitions and the `.riv` export/web-app integration remain separate work. No exported woman asset has been added to `public/` yet.
