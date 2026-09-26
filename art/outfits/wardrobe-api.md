# Internal integration handoff — independent wardrobe slots

2026-09-23. This contract supersedes the historical whole-outfit notes.
No game dialogue, labels, accessibility text, or scene copy changed.

Both artboards expose CharacterData.topId and CharacterData.bottomId, Number
properties defaulting to 0. All 82 garment visibility bindings now use one of
these slots (44 top, 38 bottom); no garment reads the old outfitId property.

| ID | Top (both) | Man bottom | Woman bottom |
| --- | --- | --- | --- |
| 0 | Business shirt / blouse | Business trousers | Business skirt |
| 1 | Suit jacket with inner shirt / blouse | Suit trousers | Suit trousers |
| 2 | T-shirt | Shorts | Jeans |
| 3 | Unsupported | Unsupported | Suit skirt |
| 4 | Unsupported | Unsupported | Shorts |

All 9 male and 15 female combinations are available. Bottoms include their
pelvis and exposed-leg pieces; tops include sleeves, cuffs and torso details.
Appearance, motion, sitting and transparency retain their existing controls.

```tsx
<RiveCharacter {...characterProps} topId={2} bottomId={1}
  outfitPrimaryColor="#D27B59" pantsColor="#344454" />
```

```ts
const instance = rive.viewModelInstance;
instance.number('topId').value = 2;
instance.number('bottomId').value = 1;
```

The React effect validates each slot independently, rounding finite inputs and
falling back to 0 for unsupported values. Raw Rive callers must validate IDs.
React's deprecated outfitId prop remains a compatibility preset: 0 -> (0,0),
1 -> (1,1), 2 -> (2,2), woman-only 3 -> (1,3), 4 -> (2,4). An explicitly
supplied topId or bottomId overrides that slot alone. The old raw Rive outfitId
property is retained but has no effect; migrate raw callers to both new slots.

Colors: outfitPrimaryColor controls business/casual tops; suitColor controls
the suit jacket; outfitSecondaryColor controls its inner shirt/blouse;
outfitAccentColor controls the tie. pantsColor now controls ALL bottoms,
including suit trousers and suit skirt. It no longer inherits suitColor, so
match the two colors explicitly when a coordinated suit is wanted.

The mustard wardrobe change now changes topId only and preserves bottomId=0.
No rendered strings were added or changed in production source. Existing
authoring preview strings remain legacy copy; their control logic now uses
the new API. The contact sheet displays all 24 combinations at a single
appearance value specified with ?blend=0, ?blend=0.5 or ?blend=1. Within each
sex, groups of bottoms repeat for top IDs 0, 1, 2 in order.

Runtime: public/rive/compliance-characters.riv.
Editable backup: art/rive-revisions/mix-match-clothing/generic_man_-_compliance_training.rev.

Validation: inspected all 24 combinations at corporate and anime endpoints,
walking at the halfway appearance, and seated anime poses with separate test
colors. Export, public runtime and built runtime have identical SHA-256 hashes.
ESLint, all 14 tests, TypeScript and the Vite production build passed. npm was
unavailable in this shell, so the verify script's constituent checks were run
directly with the bundled Node runtime.
