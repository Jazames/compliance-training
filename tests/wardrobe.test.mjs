import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveWardrobe } from '../src/rive/wardrobe.ts';

test('each top combines with every supported bottom independently', () => {
  for (const [artboard, count] of [['generic-man', 3], ['generic-woman', 5]]) {
    for (let topId = 0; topId < 3; topId++) {
      for (let bottomId = 0; bottomId < count; bottomId++) {
        assert.deepEqual(resolveWardrobe(artboard, topId, bottomId), { topId, bottomId });
      }
    }
  }
});

test('invalid selections fall back per slot without resetting the other slot', () => {
  assert.deepEqual(resolveWardrobe('generic-woman', NaN, 4), { topId: 0, bottomId: 4 });
  assert.deepEqual(resolveWardrobe('generic-man', 2, 4), { topId: 2, bottomId: 0 });
  assert.deepEqual(resolveWardrobe('generic-woman', 1, Infinity), { topId: 1, bottomId: 0 });
});

test('legacy outfits map to separate slots and explicit slots take precedence', () => {
  assert.deepEqual(resolveWardrobe('generic-woman', undefined, undefined, 3), { topId: 1, bottomId: 3 });
  assert.deepEqual(resolveWardrobe('generic-woman', undefined, undefined, 4), { topId: 2, bottomId: 4 });
  assert.deepEqual(resolveWardrobe('generic-woman', 0, undefined, 4), { topId: 0, bottomId: 4 });
  assert.deepEqual(resolveWardrobe('generic-man', undefined, undefined, 4), { topId: 0, bottomId: 0 });
});
