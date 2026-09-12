# Rive character assets

## Hair accent contract

Hair palettes in `src/engine/hairColors.ts` pair each base dye with a curated
`accentColor`. Salon choices store both together, and the character wrapper
sends the player's accent to the optional `CharacterData.hairAccentColor`
Color property independently of the base `hairColor`.

The export exposes both properties. Anime hair texture is bound to
`hairAccentColor`, with default `#94705A`; its visibility follows appearance.

## Runtime integration status (2026-09-12)

The React scene integration is implemented for both character artboards. The complete runtime export is available at **`compliance-characters.riv`** and contains both characters.

Source: [Generic Man - Compliance Training](https://editor.rive.app/file/untitled/2557700).

The shared file contains two independent artboards, not a woman containing an instance of the man. The separate `generic_woman_-_compliance_training.riv` export is retained as an unused woman-only backup.

Vite copies `public/rive/` to `dist/rive/`. Load with:

```ts
const src = `${import.meta.env.BASE_URL}rive/compliance-characters.riv`;
```

Do not use `/public/` in a URL. `BASE_URL` preserves the GitHub Pages `/compliance-training/` prefix.

## Asset contract

Names are case-sensitive, including spaces.

| Item | Man | Woman |
| --- | --- | --- |
| Artboard | `generic-man` | `generic-woman` |
| State machine | `State Machine 1` | `State Machine 1` |
| View model | `CharacterData` | `CharacterData` |
| Named instance template | `Instance` | `Instance 1` |
| Upper-garment default | Teal button-up, `#438F98` | Plum pocketless blouse, `#86658F` |
| Lower garment | Trousers | A-line skirt |

Create a separate Rive canvas and view-model instance for each on-screen character. Choose the named template explicitly to retain the woman's defaults.

| View-model property | Type | Meaning / default |
| --- | --- | --- |
| `numberProperty` | Number | Corporate → anime blend, 0..1; default 0 |
| `eyeColor` | Color | Both irises; `#58616A` (pupils and glints remain separate) |
| `skinColor` | Color | Skin fills; `#CFA17E` |
| `hairColor` | Color | Hair fills, including woman's bob; `#3D302C` |
| `hairAccentColor` | Color | Hair highlights and anime texture; `#94705A` |
| `outfitPrimaryColor` | Color | Business shirt/blouse and casual T-shirt; defaults above |
| `pantsColor` | Color | Business bottoms, casual shorts and jeans; `#344454` |
| `outfitId` | Number | Discrete outfit selection; default 0; table below |
| `suitColor` | Color | Matching jacket and suit trousers/skirt; man `#344454`, woman `#495169` |
| `outfitSecondaryColor` | Color | Inner suit shirt/blouse; man `#E9ECE9`, woman `#E9E4E7` |
| `outfitAccentColor` | Color | Man's tie; `#94705A` |

`numberProperty` is the actual saved name. Map an app-side `romanceDrift` or `attractiveness` value to it; those aliases are not properties in this file. There are no `isTalking`, `speed`, or prop-slot inputs yet. Ignore the unused empty `ViewModel1`.

## Wardrobe controls

| outfitId | Man | Woman |
| --- | --- | --- |
| 0 | Button-up and trousers | Pocketless blouse and skirt |
| 1 | Suit with tie and trousers | Suit with blouse and trousers |
| 2 | T-shirt and shorts | T-shirt and jeans |
| 3 | Unsupported | Suit with blouse and skirt |
| 4 | Unsupported | T-shirt and shorts |

```ts
// After bindViewModelInstance:
r.viewModelInstance.number('outfitId').value = 1;
r.viewModelInstance.color('suitColor').rgb(52, 68, 84);
r.viewModelInstance.color('outfitSecondaryColor').rgb(233, 236, 233);
r.viewModelInstance.color('outfitAccentColor').rgb(148, 112, 90);
```

Use integer IDs. Formula converters round the value and select whole garments;
unsupported values hide outfit pieces in raw Rive. The React wrapper validates
IDs and falls back to business casual. Garment visibility binds directly to
`outfitId`, independently of the appearance state machine. Existing animated
clothes have outer visibility groups so their appearance keys remain intact.

Upper sleeves, forearm sleeves, trousers and exposed legs follow the existing
limb groups. The suit skirt has a sway track in Timeline 4. New shirt/jacket
vertices morph in Timelines 6 and 7, with the preview mirrored in Timeline 5.
Colors stay bound while appearance changes. Suits use `suitColor` for both
halves; `outfitPrimaryColor` applies to business/casual tops.

`RiveCharacter` accepts `outfitId`, `outfitPrimaryColor`, `pantsColor`, `suitColor`,
`outfitSecondaryColor`, and `outfitAccentColor`, alongside the four existing
character colors and `appearanceBlend`. Color props use `#RRGGBB` strings.
The default scene remains outfit 0 until a caller supplies another selection.

Editable backup: `art/rive-revisions/wardrobe-colors-final/generic_man_-_compliance_training.rev`.
Local visual verifier: `art/outfits/preview.html`, served through Vite; this page
is an authoring aid and is not part of the production story interface.

## Load and control appearance

This example targets the installed `@rive-app/canvas` 2.35.0 API (used by `@rive-app/react-canvas` 4.27.0). The current app's `src/rive/RiveCharacter.tsx` implements this binding for both characters.

```ts
import { Rive, Layout, Fit, Alignment } from '@rive-app/canvas';

// canvas: an HTMLCanvasElement with a nonzero CSS width and height.
const character: 'generic-man' | 'generic-woman' = 'generic-woman';
const r = new Rive({
  src: `${import.meta.env.BASE_URL}rive/compliance-characters.riv`,
  canvas,
  artboard: character,
  stateMachines: 'State Machine 1',
  autoBind: false,
  autoplay: true,
  layout: new Layout({ fit: Fit.Contain, alignment: Alignment.BottomCenter }),
  onLoad: () => {
    const vm = r.viewModelByName('CharacterData');
    const instance = vm?.instanceByName(
      character === 'generic-woman' ? 'Instance 1' : 'Instance',
    );
    if (!instance) throw new Error('Missing CharacterData instance');
    r.bindViewModelInstance(instance);
    r.resizeDrawingSurfaceToCanvas();
    setAppearance(0);
  },
  onLoadError: (event) => console.error('Character asset failed to load', event),
});

function setAppearance(value: number) {
  const property = r.viewModelInstance?.number('numberProperty');
  if (!property || !Number.isFinite(value)) return;
  property.value = Math.max(0, Math.min(1, value));
}

function setColor(
  name: 'eyeColor' | 'skinColor' | 'hairColor' | 'hairAccentColor' | 'outfitPrimaryColor' | 'pantsColor',
  hex: string,
) {
  if (!/^#[0-9a-f]{6}$/i.test(hex)) throw new Error('Expected #RRGGBB');
  const property = r.viewModelInstance?.color(name);
  if (!property) return; // Call after onLoad.
  property.rgb(
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  );
}

// After loading, slider/input handlers can call:
// setAppearance(0.5);
// setColor('outfitPrimaryColor', '#86658F');
// Read: r.viewModelInstance?.number('numberProperty')?.value
// Read: r.viewModelInstance?.color('skinColor')?.value (packed ARGB number)

// Call r.resizeDrawingSurfaceToCanvas() after canvas/container resizes.
// On component disposal: r.cleanup();
```

Use `rgb()` with 0..255 channels to avoid packed-color ambiguity. Bind once, then update the instance's properties. Changes apply as the artboard/state machine advances. For a gradual genre drift, update the number over time from the app; setting it directly changes the blend target directly.

In React, `useRive` takes the same `src`, `artboard`, `stateMachines`, `autoBind`, and `autoplay` options. Bind and update properties in an effect once its returned `rive` object is available, and render its `RiveComponent` inside a sized container. Keep separate hook instances for separate characters; let the hook manage its Rive lifecycle.

## Animations and current control limits

Both artboards use the following names:

| Name | Purpose | Playback |
| --- | --- | --- |
| `Timeline 1` | Idle / blink | Loop |
| `Timeline 2` | Mouth movement / talking | Loop |
| `Timeline 3` | Arm wave | One shot |
| `Timeline 4` | In-place walk | Loop |
| `Timeline 5` | Corporate-to-anime morph preview | One-second preview |
| `Timeline 6` | Corporate endpoint | Appearance blend dependency |
| `Timeline 7` | Anime endpoint | Appearance blend dependency |

`State Machine 1` currently runs idle on Layer 1 and `Anime Appearance` on Layer 2. The latter blends Timeline 6 at 0 and Timeline 7 at 1 using `numberProperty`. Those two timelines are stable, authoritative runtime endpoints. Their keyed properties hold constant over time, so numberProperty controls appearance without a second timed morph. Timeline 5 has been synchronized to interpolate between the current endpoints over one second. Future edits must keep all three timelines in sync.

### Preview individual actions with the installed runtime

For an isolated timeline preview, construct a separate preview Rive instance with `animations: 'Timeline 4'` and **omit `stateMachines`**. Bind colors in `onLoad` as above. To switch its action after loading:

```ts
// preview is a Rive instance configured for linear animation playback.
preview.stop();
preview.play('Timeline 2'); // talk
// Other choices: Timeline 1 idle, Timeline 3 wave, Timeline 4 walk.
```

This previews the action, but does not run the continuous appearance blend. Stopping a timeline is not a general pose reset. Do not assume that playing action timelines beside the current idle state machine will produce correct layering; that combination has not been runtime-tested.

### Remaining production wiring

For simultaneous walk/talk/genre control, finish the state machine on **each** artboard:

1. Add locomotion selection driven by a `speed` number: idle at 0 and walking above 0, with appropriate transitions. Move the canvas across the scene with CSS; the walk is in place.
2. Add an independent mouth layer driven by `isTalking`, with a neutral mouth state on false and Timeline 2 on true. Keep appearance animation off the mouth's talking scale axis.
3. Add a gesture trigger/state using Timeline 3, returning to neutral after completion. Resolve its arm ownership against the walk layer so two layers do not unintentionally overwrite the same rotation.
4. Keep the existing appearance layer and color bindings active. Add a wrapper mapping the story meters to the saved property names.

These are proposed controls, **not available inputs in the current editor file**. The existing rig uses articulated nested vector groups rather than a skinned bone mesh. The man's far-arm draw rule keeps it behind the legs.

## Validation after export

- Load both artboards independently; inspect `r.contents`, `r.animationNames`, and `r.stateMachineNames` for the names above.
- Confirm `CharacterData` exposes all seven properties and both named templates.
- Test blend values 0, 0.5, and 1; change each color on one character and verify the other stays unchanged.
- Preview walk, talk, and wave individually. Once action layers are wired, test their combinations at both appearance endpoints and halfway.
- Verify the exported asset loads from the production base path and is included in `dist/rive/`.

Editor visual checks are recorded in [man notes](../../art/rive-man-notes.md) and [woman notes](../../art/rive-woman-notes.md). The latest exported binary's embedded names have been checked against the asset contract above. The editor was also checked at appearance values 0, 0.5, and 1 after the woman's blouse, skirt, and feminine anime endpoint were revised.

API references: [Rive data binding](https://rive.app/docs/runtimes/web/data-binding), [Rive parameters and playback](https://rive.app/docs/runtimes/web/rive-parameters). The installed package declarations are authoritative for this project's version; newer documentation can include methods absent from 2.35.0.


## September 8 export verification

Exported both artboards through Rive MCP after the proportion, hair/chest detail, upper-arm contour, pelvis, and skirt revisions. The final editable revision is art/rive-revisions/2026-09-08/generic_man_-_compliance_training.rev; art/generic_man_-_compliance_training.rev is the pre-MCP-edit safety backup. That export was superseded by the color-property revision described below.

Visual validation used Rive artboard captures of the revised endpoint geometry and sampled walking poses. This pass did not re-test combined runtime action playback. npm was unavailable on PATH; the equivalent ESLint, TypeScript build, and Vite production build passed using bundled Node (Vite --configLoader runner).


## Four character color controls

Both independent character instances expose eyeColor, skinColor, hairColor, and hairAccentColor as Color properties. Existing outfitPrimaryColor, pantsColor, and numberProperty remain available. Four iris fills bind to eyeColor; pupils, whites, and glints retain their own colors. Five hair accent paints bind to hairAccentColor, including the anime texture overlays. The appearance animations reveal those overlays without keying their colors, so selected colors persist through genre drift.

Use setColor('eyeColor', '#397BE0') or setColor('hairAccentColor', '#91DFFF') with the helper above. RiveCharacter accepts eyeColor, skinColor, hairColor, and hairAccentColor props as #RRGGBB strings. The default accent matches DEFAULT_HAIR.accentColor. Each Rive canvas binds its own named CharacterData instance; do not share a mutable view-model instance between characters.

Latest editable backup: art/rive-revisions/final-color-export/generic_man_-_compliance_training.rev. Latest runtime export is copied to public/rive/compliance-characters.riv.


