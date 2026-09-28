import test from 'node:test';
import assert from 'node:assert/strict';
import { createInitialGameState } from '../src/engine/gameState.ts';
import { applyChoice, getCurrentBeat } from '../src/engine/scheduler.ts';
import { SCENES } from '../src/scenes/index.ts';
import { applyEffects } from '../src/engine/effects.ts';

test('all genre drift choices use the same gradual scaling', () => {
  const driftMeters = ['heistDrift', 'romanceDrift', 'survivalDrift'];
  for (const scene of Object.values(SCENES)) {
    for (const beat of Object.values(scene.beats)) {
      for (const choice of beat.choices ?? []) {
        for (const meter of driftMeters) {
          const gain = choice.effects.reduce((sum, effect) => sum +
            (effect.kind === 'addMeter' && effect.key === meter ? Math.max(0, effect.amount) : 0), 0);
          assert.ok(gain === 0 || gain === 0.05, `${scene.id}/${beat.id}/${choice.id} must use 0.05 for ${meter}`);
        }
      }
    }
  }
  for (const meter of driftMeters) {
    let state = createInitialGameState(42);
    for (let count = 1; count <= 20; count++) {
      state = applyEffects(state, [{ kind: 'addMeter', key: meter, amount: 0.05 }]);
      if (count < 10) assert.ok(state.meters[meter] < 0.8);
      if (count < 20) assert.ok(state.meters[meter] < 1);
    }
    assert.equal(state.meters[meter], 1);
  }
});

test('every USB response animates before completing and plugging in adds a small heist increment', () => {
  for (const playerCharacterId of ['daniel', 'rachel']) {
    for (const action of ['ignore', 'trash', 'plug', 'report']) {
      const initial = { ...createInitialGameState(42), playerCharacterId,
        flags: { characterCreationComplete: true }, currentSceneId: 'cybersecurity', currentBeatId: 'cyber_followup' };
      const acting = applyChoice(initial, action);
      assert.equal(acting.currentSceneId, action === 'plug' ? 'gaston_usb' : 'cybersecurity');
      assert.equal(getCurrentBeat(acting).cyberAction, action);
      assert.equal(getCurrentBeat(acting).stageKey, getCurrentBeat(initial).stageKey);
      assert.deepEqual(acting.queue, initial.queue);
      assert.deepEqual(acting.completedMilestones, action === 'plug' ? ['cybersecurity'] : []);
      const finished = applyChoice(acting, getCurrentBeat(acting).autoAdvance.choiceId);
      assert.equal(finished.currentSceneId, action === 'plug' ? 'gaston_usb' : 'course_complete');
      if (action === 'plug') {
        assert.equal(finished.currentBeatId, 'inspect');
        assert.equal(getCurrentBeat(finished).driveExplorer.name, 'Gaston_portable');
        assert.equal(getCurrentBeat(finished).autoAdvance, undefined);
      }
      assert.equal(finished.meters.heistDrift, action === 'plug' ? 0.05 : 0);
      assert.equal(finished.meters.survivalDrift, initial.meters.survivalDrift);
      assert.equal(finished.playerCharacterId, playerCharacterId);
      assert.deepEqual(finished.completedMilestones, ['cybersecurity']);
    }
  }
});

test('Gaston drive choices apply the requested drift and preserve course completion', () => {
  for (const [choice, meter] of [['photos', 'romanceDrift'], ['desk', 'heistDrift'], ['return', null], ['message', null]]) {
    const initial = { ...createInitialGameState(42), flags: { characterCreationComplete: true },
      currentSceneId: 'gaston_usb', currentBeatId: 'inspect', completedMilestones: ['cybersecurity'] };
    const acting = applyChoice(initial, choice);
    assert.equal(acting.currentSceneId, 'gaston_usb');
    assert.equal(getCurrentBeat(acting).cyberAction, choice);
    assert.deepEqual(acting.queue, initial.queue);
    const result = applyChoice(acting, getCurrentBeat(acting).autoAdvance.choiceId);
    assert.deepEqual(result.meters, acting.meters);
    assert.equal(result.currentSceneId, 'course_complete');
    assert.deepEqual(result.completedMilestones, initial.completedMilestones);
    for (const key of ['romanceDrift', 'heistDrift', 'survivalDrift']) {
      assert.equal(result.meters[key], initial.meters[key] + (key === meter ? 0.05 : 0));
    }
  }
});
