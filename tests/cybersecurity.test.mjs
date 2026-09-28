import test from 'node:test';
import assert from 'node:assert/strict';
import { createInitialGameState } from '../src/engine/gameState.ts';
import { applyChoice, getCurrentBeat } from '../src/engine/scheduler.ts';

test('every USB response animates before completing and plugging in adds one heist point', () => {
  for (const playerCharacterId of ['daniel', 'rachel']) {
    for (const action of ['ignore', 'trash', 'plug', 'report']) {
      const initial = { ...createInitialGameState(42), playerCharacterId,
        flags: { characterCreationComplete: true }, currentSceneId: 'cybersecurity', currentBeatId: 'cyber_followup' };
      const acting = applyChoice(initial, action);
      assert.equal(acting.currentSceneId, 'cybersecurity');
      assert.equal(getCurrentBeat(acting).cyberAction, action);
      assert.equal(getCurrentBeat(acting).stageKey, getCurrentBeat(initial).stageKey);
      assert.deepEqual(acting.queue, initial.queue);
      assert.deepEqual(acting.completedMilestones, []);
      const finished = applyChoice(acting, getCurrentBeat(acting).autoAdvance.choiceId);
      assert.equal(finished.currentSceneId, 'course_complete');
      assert.equal(finished.meters.heistDrift, action === 'plug' ? 1 : 0);
      assert.equal(finished.meters.survivalDrift, initial.meters.survivalDrift);
      assert.equal(finished.playerCharacterId, playerCharacterId);
      assert.deepEqual(finished.completedMilestones, ['cybersecurity']);
    }
  }
});
