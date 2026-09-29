import test from 'node:test';
import assert from 'node:assert/strict';
import { createInitialGameState } from '../src/engine/gameState.ts';
import { getPlayerAppearance, revealUndershirt } from '../src/engine/playerAppearance.ts';
import { resolveDriftAppearance, interpolateDrift, clampDrift } from '../src/rive/driftAppearance.ts';

test('dominant appearance is deterministic, lock-aware, and leaves story state intact', () => {
  const state = createInitialGameState(42);
  state.meters = { compliance: .5, romanceDrift: .65, heistDrift: .65, survivalDrift: .2 };
  const before = structuredClone(state);
  assert.deepEqual(resolveDriftAppearance(state.meters, state.locks), { romance: .65, heist: 0, survival: 0 });
  assert.deepEqual(state, before);
  state.locks.survivalLocked = true;
  assert.deepEqual(resolveDriftAppearance(state.meters, state.locks), { romance: 0, heist: 0, survival: .2 });
});

test('invalid values cannot poison the native animation inputs', () => {
  const state = createInitialGameState(42);
  state.meters.romanceDrift = NaN;
  state.meters.heistDrift = Infinity;
  state.meters.survivalDrift = 5;
  assert.deepEqual(resolveDriftAppearance(state.meters, state.locks), { romance: 0, heist: 0, survival: 1 });
  assert.equal(clampDrift(-1), 0);
});

test('genre handoffs and interrupted reversals remain continuous and bounded', () => {
  const from = { romance: 1, heist: 0, survival: 0 };
  const to = { romance: 0, heist: 0, survival: .9 };
  assert.deepEqual(interpolateDrift(from, to, 0), from);
  assert.deepEqual(interpolateDrift(from, to, 1), to);
  for (let i = 0; i <= 100; i++) {
    const frame = interpolateDrift(from, to, i / 100);
    assert.ok(Object.values(frame).every(value => value >= 0 && value <= 1));
    assert.ok(Object.values(frame).reduce((a, b) => a + b, 0) <= 1.0000001);
  }
  const midway = interpolateDrift(from, to, .37);
  assert.deepEqual(interpolateDrift(midway, from, 0), midway);
  assert.deepEqual(interpolateDrift(midway, from, 1), from);
});

test('player snapshots carry all genres through clothing changes and reset', () => {
  for (const character of ['daniel', 'rachel']) {
    const state = createInitialGameState(42);
    state.playerCharacterId = character;
    state.meters.heistDrift = .8;
    const before = getPlayerAppearance(state);
    const after = revealUndershirt(before);
    assert.deepEqual(after.driftAppearance, { romance: 0, heist: .8, survival: 0 });
    assert.equal(after.skinColor, before.skinColor);
    assert.equal(after.bottomId, before.bottomId);
    assert.deepEqual(getPlayerAppearance(createInitialGameState(42)).driftAppearance, { romance: 0, heist: 0, survival: 0 });
  }
});
