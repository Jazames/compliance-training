# Generic woman: Rive editor handoff

Editor: https://editor.rive.app/file/untitled/2557700

The current file was exported on 2026-09-08. The shared asset at `public/rive/compliance-characters.riv` contains both character artboards and is wired into the React scene. The earlier woman-only export is retained as a backup. See [shared runtime implementation notes](../public/rive/README.md) for loading, independent instances, property access, animation control limits, and validation.

`generic-woman` is a separate artboard beside the original `generic-man`. It was duplicated from the completed man's artboard to reuse the articulated rig, animations, and color bindings. Its internal copied group is named `WomanRig`. The two artboards remain independent; each has its own shape and animation keys.

## Appearance and controls

The woman has a native vector bob (`HairBobBack`, `HairLockNear`, `HairLockFar`), finer brows, a smaller nose, a rose smile, and slimmer torso/shoulder proportions. All added hair pieces belong to her Head group and bind to `hairColor`.

Her corporate outfit is now visually distinct from the man's: an almost rectangular, pocketless V-neck blouse with short sleeves and an A-line skirt. The inherited collar, placket, buttons, pocket, belt, buckle, cuffs, trousers, and anime biceps overlays were removed. `BlouseBody`, `SleeveNear`, and `SleeveFar` all bind to the woman's `outfitPrimaryColor`. `Skirt` binds to `pantsColor` for schema compatibility, and the visible legs bind to `skinColor`.

Play her `State Machine 1`, then adjust `CharacterData.numberProperty`:

- 0: corporate appearance.
- 0.5: blended appearance.
- 1: anime dating-sim appearance with larger eyes, a tapered jaw with unchanged chin height, unchanged shoulder width, a modestly narrower waist, slightly fuller hips, hair texture, subtle bust accents, and a fuller skirt.

The artboard uses CharacterData **Instance 1**; the man uses **Instance**. They share the property schema but have separate editor defaults. The woman's shirt default is `86658F`; the man's remains `438F98`. Both appearance defaults are 0.

Editable properties: `skinColor`, `hairColor`, `outfitPrimaryColor`, `pantsColor`, and `numberProperty` (the current generated name for the genre blend). For this artboard, `outfitPrimaryColor` controls the complete blouse and `pantsColor` controls the skirt.

## Animations

Timeline names are scoped to each artboard:

| Woman timeline | Purpose |
| --- | --- |
| Timeline 1 | Idle / blink |
| Timeline 2 | Talking |
| Timeline 3 | Arm wave |
| Timeline 4 | In-place walk |
| Timeline 5 | Synchronized corporate-to-anime morph preview |
| Timeline 6 | Corporate blend endpoint |
| Timeline 7 | Anime blend endpoint |

`State Machine 1` has idle on Layer 1 and `Anime Appearance` on Layer 2. Timeline 6 and Timeline 7 are the authoritative runtime endpoints for the revised woman. Timeline 5 now previews the same revised endpoints. Timeline 6 and Timeline 7 hold their keyed appearance properties constant.

## Validation and integration status

- Confirmed `generic-man` and `generic-woman` remain separate top-level component artboards.
- Checked appearance values 0, 0.5, and 1 in `State Machine 1` after the outfit and feminine-proportion revisions.
- Changed the woman's blouse color through `CharacterData.Instance 1.outfitPrimaryColor` and confirmed the body and both sleeves update together; restored the plum default afterward.
- Played Timeline 2 (talk), Timeline 3 (arm gesture), and Timeline 4 (walk) after the skirt revision. The skirt stays centered over the walking legs and the hands remain in front.
- Exported the updated complete file to `public/rive/compliance-characters.riv` and confirmed the binary contains both artboards, both named instances, all seven timelines, and `State Machine 1`.

As with the man, this is a nested vector-group rig rather than a skinned bone mesh. Dedicated runtime action inputs/transitions remain future state-machine work; the current action timelines can be previewed or played individually as documented in the shared notes.

## September 8 refinements

Upper-leg shapes are retained with opacity zero to prevent protrusion through the skirt. The A-line hem is wider to cover the stride. Timeline 4 keys skirt rotation at -2, +2, -2 degrees over frames 0, 30, 60. AnimeHairTexture, AnimeHairStrand02, and AnimeBustAccents fade with the appearance blend; their low-alpha paints remain subtle and color-independent.


Color-property update: eyeColor and hairAccentColor are now exposed alongside skinColor and hairColor. Both irises and all hair accents are bound. See public/rive/README.md for defaults and runtime calls; latest backup is art/rive-revisions/color-properties/.

