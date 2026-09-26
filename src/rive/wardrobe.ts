export function resolveWardrobe(
  artboard: 'generic-man' | 'generic-woman',
  topId?: number,
  bottomId?: number,
  outfitId = 0,
) {
  const maximumBottom = artboard === 'generic-woman' ? 4 : 2;
  const valid = (value: number, max: number) => {
    const rounded = Math.round(value);
    return Number.isFinite(rounded) && rounded >= 0 && rounded <= max ? rounded : 0;
  };
  // Compatibility for callers that still supply a complete outfit.
  const legacy = valid(outfitId, maximumBottom);
  const legacyTop = legacy === 3 ? 1 : legacy === 4 ? 2 : legacy;
  return {
    topId: valid(topId ?? legacyTop, 2),
    bottomId: valid(bottomId ?? legacy, maximumBottom),
  };
}
