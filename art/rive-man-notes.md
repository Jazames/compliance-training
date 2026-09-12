# Generic man: Rive editor handoff

Editor: https://editor.rive.app/file/untitled/2557700

File: Generic Man - Compliance Training. Artboard: `generic-man`.
The editor document is the authoring source of truth; the shared runtime export is available at `public/rive/compliance-characters.riv`.

The file was exported on 2026-09-08 and is wired into the React scene. See [shared runtime implementation notes](../public/rive/README.md) for exact names, property access, code examples, animation control limits, and export validation.

## Corporate-to-anime blend

Play `State Machine 1`. Under `CharacterData`, change `numberProperty` from 0 (corporate) to 1 (anime). Fractional values blend the appearance continuously. This property still has its generated name; an eventual app wrapper can map `romanceDrift` to it.

Layer 2 contains the `Anime Appearance` 1D blend state. Timeline 6 is its corporate endpoint (0), and Timeline 7 its anime endpoint (1). Timeline 5 contains the editable full morph. The endpoint timelines hold constant poses. Timeline 5 is synchronized to interpolate between them over one second; future edits must update all three timelines.

Native vertex animation sharpens the jaw and changes the shirt silhouette. Transform animation widens and slightly tilts the eyes, refines brows/nose/mouth, and moves the shoulders outward. Skin-colored upper-arm shapes fade in as cuffs fade out; these shapes use the shared `skinColor` binding.

## Existing animation mapping

| Timeline | Purpose |
| --- | --- |
| Timeline 1 | Idle and blink |
| Timeline 2 | Talking |
| Timeline 3 | Arm wave |
| Timeline 4 | In-place walk |
| Timeline 5 | Corporate-to-anime authoring morph |
| Timeline 6 | Corporate blend endpoint |
| Timeline 7 | Anime blend endpoint |

Layer 1 defaults to Timeline 1. Walk, talk and wave were temporarily selected there to check composition with the anime layer, then idle was restored. Dedicated runtime action inputs/transitions have not been wired in this pass.

The rig uses articulated nested vector groups, not a skinned bone mesh. The far arm's `Behind legs` draw rule is intentional.

## Validation and remaining integration

- Visually checked appearance values 0, 0.5 and 1 and return to corporate.
- Visually checked full anime with walking, talking and the arm wave; checked the halfway blend during walking.
- The shared runtime export contains both artboards and is included in the production build.
- Repository ESLint and TypeScript checks passed using the bundled Node executable. `npm` was unavailable on PATH, so the verify stages were invoked directly. Vite's default config bundler hit a filesystem access error; the production build passed with `--configLoader runner`.
- `anime-bicep.svg` is an unused draft: the editor's upper-arm shapes were constructed natively instead.

Keep runtime color changes on the existing CharacterData properties: `skinColor`, `hairColor`, `outfitPrimaryColor`, and `pantsColor`.

## September 8 refinements

PantsPelvis is a 98 by 30 rectangle below the belt, bound to pantsColor and placed behind the torso but ahead of the legs. Both upper-arm overlays now use matching eight-vertex contours with modest biceps definition rather than enlarged blocks. Timeline 5 interpolates from rectangular vertices to the octagonal contour. AnimeChestAccents and AnimeHairTexture fade in through the appearance blend. Hair texture stays parented to Head; chest accents follow Torso.


Color-property update: eyeColor and hairAccentColor are now exposed alongside skinColor and hairColor. Both irises and all hair accents are bound. See public/rive/README.md for defaults and runtime calls; latest backup is art/rive-revisions/color-properties/.

