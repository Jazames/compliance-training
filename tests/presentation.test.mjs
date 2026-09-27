import test from 'node:test';
import assert from 'node:assert/strict';
import { SCENES } from '../src/scenes/index.ts';
import { needsEntrance, isSkipKey } from '../src/ui/transitionPolicy.ts';
import { prepareImage } from '../src/ui/stageAssets.ts';

const beat = (scenario, name) => SCENES[scenario].beats[name ?? SCENES[scenario].entryBeat];
test('continuous stage handoffs preserve visual identity while new locations fade', () => {
  const question = beat('character_1_sex');
  assert.equal(needsEntrance(beat('welcome'), question), true);
  for (const name of ['drink_feedback_correct', 'drink_feedback_pressure', 'drink_feedback_avoidance']) {
    const feedback = beat('character_1_sex', name);
    assert.equal(needsEntrance(question, feedback), false);
    assert.equal(needsEntrance(feedback, beat('character_2_skin')), false);
  }
  assert.equal(needsEntrance(beat('character_2_skin'), beat('character_3_eyes')), true);
  assert.equal(needsEntrance(beat('character_3_eyes'), beat('character_3_eyes', 'restroom_courtesy')), false);
  assert.equal(needsEntrance(beat('character_3_eyes'), beat('character_3_eyes', 'mirror_question')), true);
  for (const scenario of ['hallway', 'mustard', 'character_5_hair']) {
    for (const target of Object.values(SCENES[scenario].beats)) assert.equal(needsEntrance(beat(scenario), target), false);
  }
  assert.equal(needsEntrance(question, { ...question, entrance: 'fade' }), true);
  for (const scenario of Object.values(SCENES)) for (const value of Object.values(scenario.beats)) assert.ok(value.stageKey);
});

test('skip accepts ordinary keys but preserves navigation and browser shortcuts', () => {
  const key = { key: ' ', repeat: false, ctrlKey: false, metaKey: false, altKey: false };
  assert.equal(isSkipKey(key), true);
  for (const name of ['Tab', 'Shift', 'Control', 'Meta', 'Alt', 'CapsLock', 'F5']) assert.equal(isSkipKey({ ...key, key: name }), false);
  for (const flag of ['repeat', 'ctrlKey', 'metaKey', 'altKey']) assert.equal(isSkipKey({ ...key, [flag]: true }), false);
});

test('asset readiness waits for decoding, caches success, and freezes timeout results', async () => {
  const savedImage = globalThis.Image;
  const savedWindow = globalThis.window;
  const instances = [];
  const timeouts = [];
  globalThis.window = { setTimeout: (callback) => { timeouts.push(callback); return 0; } };
  globalThis.Image = class {
    constructor() { instances.push(this); }
    decode() { return new Promise((resolve) => { this.finishDecode = resolve; }); }
  };
  try {
    const first = prepareImage('/test-decoded.svg');
    let ready = false;
    first.then(() => { ready = true; });
    assert.equal(prepareImage('/test-decoded.svg'), first);
    instances[0].onload();
    await Promise.resolve();
    assert.equal(ready, false);
    instances[0].finishDecode();
    assert.equal(await first, true);
    assert.equal(prepareImage('/test-decoded.svg'), first);
    const failed = prepareImage('/test-timeout.svg');
    timeouts.at(-1)();
    assert.equal(await failed, false);
    instances[1].onload();
    instances[1].finishDecode();
    assert.equal(await failed, false);
    const retry = prepareImage('/test-timeout.svg');
    assert.notEqual(retry, failed);
    instances[2].onerror();
    assert.equal(await retry, false);
  } finally {
    globalThis.Image = savedImage;
    globalThis.window = savedWindow;
  }
});
