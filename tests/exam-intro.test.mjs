import test from 'node:test';
import assert from 'node:assert/strict';
import { createInitialGameState } from '../src/engine/gameState.ts';
import { applyChoice, getCurrentBeat } from '../src/engine/scheduler.ts';
import { SCENES } from '../src/scenes/index.ts';

test('every hair feedback path returns to the opening facilitator before the exam', () => {
  for (const beat of ['salon_natural', 'salon_bright']) {
    const initial = { ...createInitialGameState(42), currentSceneId: 'character_5_hair', currentBeatId: beat,
      flags: { characterCreationComplete: true } };
    const interlude = applyChoice(initial, getCurrentBeat(initial).choices[0].id);
    assert.equal(interlude.currentSceneId, 'exam_intro');
    const scene = getCurrentBeat(interlude);
    assert.equal(scene.backgroundKey, 'studio-chair');
    assert.deepEqual(scene.characters, SCENES.welcome.beats.training_welcome.characters);
    assert.equal(scene.dialogue[0].text, 'This wraps up the practice portion of the training. As you answer the following questions, remember that the company values safety first, kindness second, and hard work third.');
    assert.equal(scene.choices[0].label, 'continue to exam');
    assert.equal(applyChoice(interlude, scene.choices[0].id).currentSceneId, 'hallway');
  }
});
