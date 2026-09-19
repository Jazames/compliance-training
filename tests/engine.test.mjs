import test from 'node:test';
import assert from 'node:assert/strict';
import { SCENES, TOTAL_MILESTONES } from '../src/scenes/index.ts';
import { createInitialGameState } from '../src/engine/gameState.ts';
import { applyChoice, getCurrentBeat, selectNextScene } from '../src/engine/scheduler.ts';
import { applyEffects } from '../src/engine/effects.ts';
import { validateScenes } from '../src/engine/validateScenes.ts';

const order = ['welcome', 'character_1_sex', 'character_2_skin', 'character_3_eyes',
  'character_4_name', 'character_5_hair', 'hallway', 'mustard', 'cybersecurity', 'course_complete'];
const ready = () => ({ ...createInitialGameState(42), flags: { characterCreationComplete: true } });

test('hallway choices cut to distinct action beats before scheduling the next scene', () => {
  for (const character of ['daniel', 'rachel']) {
    for (const action of ['jump', 'pickup', 'report']) {
      const state = { ...ready(), playerCharacterId: character,
        currentSceneId: 'hallway', currentBeatId: 'hallway_question' };
      assert.equal(getCurrentBeat(state).entryDelayMs, 2200);
      const acting = applyChoice(state, action);
      assert.equal(acting.currentBeatId, action);
      assert.equal(getCurrentBeat(acting).hallwayAction, action);
      assert.equal(acting.queue.length, 0);
      assert.deepEqual(acting.meters, state.meters);
      const finished = applyChoice(acting, getCurrentBeat(acting).autoAdvance.choiceId);
      assert.equal(finished.currentSceneId, 'mustard');
      assert.deepEqual(finished.completedMilestones, ['hallway']);
      assert.equal(finished.playerCharacterId, character);
    }
  }
});

test('mustard branches preserve the player and add only a small romance effect for removal', () => {
  for (const character of ['daniel', 'rachel']) {
    for (const action of ['leave', 'montage', 'remove']) {
      const state = { ...ready(), playerCharacterId: character, currentSceneId: 'mustard', currentBeatId: 'mustard_question' };
      assert.equal(getCurrentBeat(state).entryDelayMs, 3200);
      const acting = applyChoice(state, action);
      assert.equal(getCurrentBeat(acting).mustardAction, action);
      assert.equal(acting.meters.romanceDrift, action === 'remove' ? 0.02 : 0);
      assert.equal(acting.meters.compliance, state.meters.compliance);
      assert.equal(acting.meters.heistDrift, state.meters.heistDrift);
      assert.equal(acting.meters.survivalDrift, state.meters.survivalDrift);
      assert.equal(acting.queue.length, 0);
      const finished = applyChoice(acting, getCurrentBeat(acting).autoAdvance.choiceId);
      assert.equal(finished.currentSceneId, 'cybersecurity');
      assert.equal(finished.playerCharacterId, character);
      assert.deepEqual(finished.completedMilestones, ['mustard']);
      assert.equal(finished.meters.romanceDrift, acting.meters.romanceDrift);
    }
  }
});

test('all 1,296 creation answer combinations preserve order and finish the course', () => {
  let endings = 0;
  function visit(state, visited, depth = 0) {
    assert.ok(depth < 25);
    assert.equal(state.routingError, undefined);
    if (state.currentSceneId === 'course_complete') {
      assert.deepEqual(visited, order);
      assert.equal(state.completedMilestones.length, TOTAL_MILESTONES);
      assert.equal(state.flags.characterCreationComplete, true);
      assert.equal(state.queue.length, 0);
      endings++;
      return;
    }
    const choices = getCurrentBeat(state).choices;
    for (const choice of SCENES[state.currentSceneId].creation ? choices : choices.slice(0, 1)) {
      const next = applyChoice(state, choice.id);
      visit(next, state.currentSceneId === next.currentSceneId ? visited : [...visited, next.currentSceneId], depth + 1);
    }
  }
  visit(createInitialGameState(42), ['welcome']);
  assert.equal(endings, 6 * 3 * 6 * 12);
});

test('feedback beats do not consume pending scenes; creation takes its required successor', () => {
  let state = applyChoice(createInitialGameState(42), 'begin_scenarios');
  state.queue = [{ sceneId: 'romance_notification', mode: 'optional', priority: 999 }];
  state = applyChoice(state, 'daniel_offer_beer');
  assert.equal(state.currentSceneId, 'character_1_sex');
  assert.equal(state.currentBeatId, 'drink_feedback_pressure');
  assert.equal(state.queue.length, 1);
  state = applyChoice(state, 'continue_after_pressure_feedback');
  assert.equal(state.currentSceneId, 'character_2_skin');
  assert.equal(state.queue.length, 1);
});

test('detours retain and resume the queued course continuation', () => {
  const state = { ...ready(), queue: [
    { sceneId: 'cybersecurity', mode: 'course' },
    { sceneId: 'romance_notification', mode: 'optional', priority: 10 },
  ] };
  const detour = selectNextScene(state);
  assert.equal(detour.currentSceneId, 'romance_notification');
  assert.deepEqual(detour.queue, [state.queue[0]]);
  const resumed = applyChoice(detour, 'ignore_ping');
  assert.equal(resumed.currentSceneId, 'cybersecurity');
});

test('seeded weighted selection is repeatable and can choose different scenes', () => {
  const state = { ...ready(), queue: [
    { sceneId: 'hallway', mode: 'course', weight: 1 },
    { sceneId: 'romance_notification', mode: 'optional', weight: 3 },
  ] };
  assert.deepEqual(selectNextScene(state), selectNextScene(state));
  const results = new Set([1, 1000, 2000, 3000].map(randomSeed =>
    selectNextScene({ ...state, randomSeed }).currentSceneId));
  assert.equal(results.size, 2);
});

test('conditions retain ineligible requests and course cannot be starved by detours', () => {
  const queue = [
    { sceneId: 'hallway', mode: 'course' },
    { sceneId: 'romance_notification', mode: 'optional', priority: 99,
      conditions: [{ kind: 'flagIs', key: 'invited', value: true }] },
  ];
  assert.equal(selectNextScene({ ...ready(), queue }).currentSceneId, 'hallway');
  assert.equal(selectNextScene({ ...ready(), queue }).queue.length, 1);
  assert.equal(selectNextScene({ ...ready(), flags: { characterCreationComplete: true, invited: true },
    queue, consecutiveOptional: 2 }).currentSceneId, 'hallway');
});

test('pending deduplication and played one-shots prevent duplicate encounters', () => {
  const effect = { kind: 'enqueueScene', scene: { sceneId: 'romance_notification', mode: 'optional', oneShotKey: 'ping' } };
  const state = applyEffects(ready(), [effect, effect]);
  assert.equal(state.queue.length, 1);
  assert.equal(applyEffects(selectNextScene(state), [effect]).queue.length, 0);
});

test('empty queue errors are explicit, terminal scenes clear pending work, restart resets', () => {
  assert.match(selectNextScene(ready()).routingError, /No eligible/);
  const end = selectNextScene({ ...ready(), queue: [
    { sceneId: 'course_complete', mode: 'required' }, { sceneId: 'hallway', mode: 'course' },
  ] });
  assert.equal(end.queue.length, 0);
  const reset = applyChoice(end, 'restart');
  assert.equal(reset.currentSceneId, 'welcome');
  assert.equal(reset.playerCharacterId, null);
  assert.deepEqual(reset.completedMilestones, []);
});

test('appearance edits preserve routing state, including hair accents', () => {
  const state = { ...ready(), currentSceneId: 'hallway', currentBeatId: 'hallway_question',
    completedMilestones: ['welcome'], queue: [{ sceneId: 'cybersecurity', mode: 'course' }] };
  const edited = applyEffects(state, [
    { kind: 'setPlayerCharacter', characterId: 'rachel' },
    { kind: 'setPlayerSkinColor', color: '#BBAA99' },
    { kind: 'setPlayerEyeColor', color: '#334455' },
    { kind: 'setPlayerHairColor', color: '#AA2299', accentColor: '#FFBBEE' },
  ]);
  assert.equal(edited.currentSceneId, state.currentSceneId);
  assert.deepEqual(edited.queue, state.queue);
  assert.deepEqual(edited.completedMilestones, state.completedMilestones);
  assert.equal(edited.playerHairAccentColor, '#FFBBEE');
});

test('author validation rejects missing destinations and branching creation successors', () => {
  const defs = structuredClone(Object.values(SCENES));
  defs[0].beats.training_welcome.choices[0].effects[0].scene.sceneId = 'missing';
  assert.throws(() => validateScenes(defs), /unknown scene/);
  const branches = structuredClone(Object.values(SCENES));
  const sex = branches.find(scene => scene.id === 'character_1_sex');
  sex.beats.drink_feedback_correct.choices[0].effects[0].scene.sceneId = 'hallway';
  assert.throws(() => validateScenes(branches), /share one successor/);
});
