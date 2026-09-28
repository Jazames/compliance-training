# Internal hair revision

The woman's two hair locks now end in outward Bezier curls. The original rectangular locks are shortened at their lower ends to meet the new paths. The curls share the existing fill and `hairColor` binding.

Four tapered side strands and a crown accent bind to `CharacterData.hairAccentColor`. They remain visible in corporate and anime styles and inherit the head transform. Existing anime hair details remain intact. Only the woman's hair geometry was changed.

Editable and runtime exports are in `art/rive-revisions/woman-curled-hair/`. The runtime copy is `public/rive/compliance-characters.riv`; its asset URL revision is updated in `src/ui/stageAssets.ts`. No new application controls or user-facing text are needed.
