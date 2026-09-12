# Rive wardrobe

Implemented in the Rive source document and exported on 2026-09-12.

| outfitId | Man | Woman |
| --- | --- | --- |
| 0 | Button-up / trousers | Pocketless blouse / skirt |
| 1 | Suit / trousers | Suit / trousers |
| 2 | T-shirt / shorts | T-shirt / jeans |
| 3 | Unsupported | Suit / skirt |
| 4 | Unsupported | T-shirt / shorts |

Runtime: `public/rive/compliance-characters.riv`. Editable source backup:
`art/rive-revisions/wardrobe-colors-final/generic_man_-_compliance_training.rev`.
The complete property contract and examples are in `public/rive/README.md`.

Native Rive paths and primitives follow the existing limb groups. Formula
converters select garment opacity from `CharacterData.outfitId` using rounded
integer equality. Existing clothes have outer visibility groups to preserve
their appearance animation. No additional state machine is required.

New properties: `outfitId`, `suitColor`, `outfitSecondaryColor`, and
`outfitAccentColor`. Existing `outfitPrimaryColor` and `pantsColor` recolor
business/casual garments. All four character color properties remain exposed.

New shirt/jacket vertices follow the corporate/anime appearance timelines.
The woman's shoulders remain fixed while her waist narrows and hips widen.
Pelvis joins extend lower; the suit skirt has a wider hem and walk sway.

Authoring files:

- `outfit-designs.svg`: original six-outfit vector design sheet.
- `garment-drafts.json`, `build-rive-wardrobe.mjs`, `rive-wardrobe-plan.json`:
  initial construction data before interactive placement and animation fixes.
  These are not an importer or a replacement for the editable Rive backup.
- `preview.html`: interactive paired preview served through Vite.
- `contact-sheet.html`: all eight outfits at corporate, half and anime levels,
  with motion and palette checks; outside the production story interface.

The React wrapper falls back to outfit 0 for unsupported IDs. Raw Rive users
must validate IDs themselves: unmatched IDs hide the garment pieces.

Validation: all 24 outfit/appearance combinations loaded in the installed web
runtime; idle, walk, talk, wave and alternate palettes were exercised. ESLint,
TypeScript build checks and the Vite production build passed. Export hashes
match the runtime asset and its copy in `dist/rive/`.
