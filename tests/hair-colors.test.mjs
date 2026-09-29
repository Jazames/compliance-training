import test from 'node:test';
import assert from 'node:assert/strict';
import { HAIR_COLORS, getHairAccentColor } from '../src/engine/hairColors.ts';

test('every preset resolves its matching accent when only a base color is supplied', () => {
  for (const pair of HAIR_COLORS) {
    assert.equal(getHairAccentColor(pair.color), pair.accentColor);
    assert.equal(getHairAccentColor(pair.color.toLowerCase()), pair.accentColor);
  }
  assert.equal(getHairAccentColor('#A8A8A8'), '#E1E7F5');
});
test('custom neutral hair receives neutral highlights instead of brown', () => {
  const accent = getHairAccentColor('#808080');
  assert.equal(accent.slice(1, 3), accent.slice(3, 5));
  assert.equal(accent.slice(3, 5), accent.slice(5, 7));
});
