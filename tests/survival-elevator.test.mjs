import test from 'node:test';
import assert from 'node:assert/strict';
import { createInitialGameState } from '../src/engine/gameState.ts';
import { applyChoice, getCurrentBeat, selectNextScene } from '../src/engine/scheduler.ts';

function finishHallway(survivalDrift) {
  const initial = createInitialGameState(42);
  return applyChoice({ ...initial, flags: { characterCreationComplete: true },
    meters: { ...initial.meters, survivalDrift }, currentSceneId: 'hallway', currentBeatId: 'pickup' }, 'finish_action');
}
test('marmot encounter requires at least 0.3 survival drift and retains the course continuation', () => {
  for (const score of [0, 0.05, 0.299999]) {
    const next = finishHallway(score);
    assert.equal(next.currentSceneId, 'mustard');
    assert.ok(next.queue.some(request => request.sceneId === 'survival_elevator'));
  }
  for (const score of [0.3, 0.6, 1]) {
    const next = finishHallway(score);
    assert.equal(next.currentSceneId, 'survival_elevator');
    assert.equal(getCurrentBeat(next).entryDelayMs, 6000);
    assert.deepEqual(next.queue.map(request => request.sceneId), ['mustard']);
    for (const choice of getCurrentBeat(next).choices) {
      const acting = applyChoice(next, choice.id);
      assert.equal(acting.currentSceneId, 'survival_elevator');
      assert.equal(getCurrentBeat(acting).elevatorAction, choice.id);
      assert.deepEqual(acting.queue, next.queue);
      const continued = applyChoice(acting, getCurrentBeat(acting).autoAdvance.choiceId);
      assert.equal(continued.currentSceneId, 'mustard');
      assert.deepEqual(continued.meters, next.meters);
      assert.deepEqual(continued.completedMilestones, next.completedMilestones);
      assert.ok(continued.playedOneShots.includes('survival_elevator'));
    }
  }
});
test('deferred marmot encounter becomes eligible later and does not repeat', () => {
  const deferred = finishHallway(0.25);
  const eligible = selectNextScene({ ...deferred, meters: { ...deferred.meters, survivalDrift: 0.3 },
    queue: [...deferred.queue, { sceneId: 'cybersecurity', mode: 'course' }] });
  assert.equal(eligible.currentSceneId, 'survival_elevator');
  const again = applyChoice({ ...eligible, currentSceneId: 'hallway', currentBeatId: 'pickup' }, 'finish_action');
  assert.notEqual(again.currentSceneId, 'survival_elevator');
  assert.ok(!again.queue.some(request => request.sceneId === 'survival_elevator'));
});
