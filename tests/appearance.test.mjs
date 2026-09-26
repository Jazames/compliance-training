import test from 'node:test';
import assert from 'node:assert/strict';
import { createInitialGameState } from '../src/engine/gameState.ts';
import { applyEffects } from '../src/engine/effects.ts';
import { applyChoice } from '../src/engine/scheduler.ts';
import { getPlayerAppearance, revealUndershirt, shirtPalette } from '../src/engine/playerAppearance.ts';

function player(character) {
  return applyEffects(createInitialGameState(12), [{ kind: 'setPlayerCharacter', characterId: character }]);
}

test('male and female starting shirts resolve to their rig palettes', () => {
  assert.equal(shirtPalette(getPlayerAppearance(player('daniel'))).primary, '#438F98');
  assert.equal(shirtPalette(getPlayerAppearance(player('rachel'))).primary, '#86658F');
});

test('shirt prop uses the applied top palette including suit colors', () => {
  const state = applyEffects(player('rachel'), [{ kind: 'setPlayerClothing', clothing: {
    topId: 1, bottomId: 4, outfitPrimaryColor: '#112233', suitColor: '#556677',
    outfitSecondaryColor: '#ABCDEF', outfitAccentColor: '#DDCCBB', undershirtColor: '#EE9933',
  } }]);
  const outgoing = getPlayerAppearance(state);
  assert.deepEqual(shirtPalette(outgoing), { primary: '#556677', secondary: '#ABCDEF', accent: '#DDCCBB' });
  const revealed = revealUndershirt(outgoing);
  assert.equal(revealed.topId, 2);
  assert.equal(revealed.bottomId, 4);
  assert.equal(shirtPalette(revealed).primary, '#EE9933');
  assert.equal(shirtPalette(outgoing).primary, '#556677');
});

test('removal persists only the top change at completion for every valid bottom on both rigs', () => {
  for (const character of ['daniel', 'rachel']) {
    for (let bottomId = 0; bottomId <= (character === 'rachel' ? 4 : 2); bottomId++) {
      let state = applyEffects(player(character), [{ kind: 'setPlayerClothing', clothing: {
        topId: 1, bottomId, pantsColor: '#123456', suitColor: '#654321', undershirtColor: '#FEDCBA',
      } }]);
      state = { ...state, currentSceneId: 'mustard', currentBeatId: 'mustard_question',
        flags: { characterCreationComplete: true } };
      const acting = applyChoice(state, 'remove');
      assert.equal(acting.playerClothing.topId, 1);
      const next = applyChoice(acting, 'finish_action');
      assert.equal(next.currentSceneId, 'cybersecurity');
      const appearance = getPlayerAppearance(next);
      assert.equal(appearance.topId, 2);
      assert.equal(appearance.outfitPrimaryColor, '#FEDCBA');
      assert.equal(appearance.bottomId, bottomId);
      assert.equal(appearance.pantsColor, '#123456');
      assert.equal(appearance.suitColor, '#654321');
      assert.equal(appearance.skinColor, state.playerSkinColor);
      assert.equal(appearance.hairAccentColor, state.playerHairAccentColor);
    }
  }
});

test('other mustard branches retain all clothing; corrections do not reset it', () => {
  let state = applyEffects(player('daniel'), [{ kind: 'setPlayerClothing', clothing: { topId: 2, bottomId: 1, outfitPrimaryColor: '#445566' } }]);
  state = { ...state, currentSceneId: 'mustard', currentBeatId: 'mustard_question', flags: { characterCreationComplete: true } };
  for (const action of ['leave', 'montage']) {
    const next = applyChoice(applyChoice(state, action), 'finish_action');
    assert.deepEqual(next.playerClothing, state.playerClothing);
  }
  const corrected = applyEffects(state, [{ kind: 'setPlayerHairColor', color: '#ABCDEF', accentColor: '#FEDCBA' }]);
  assert.deepEqual(corrected.playerClothing, state.playerClothing);
  assert.equal(createInitialGameState().playerClothing, null);
});

test('invalid clothing values cannot inject prop styles or unsupported wardrobe indices', () => {
  const state = player('daniel');
  const next = applyEffects(state, [{ kind: 'setPlayerClothing', clothing: { topId: 99, bottomId: -3, outfitPrimaryColor: 'invalid' } }]);
  assert.equal(next.playerClothing.topId, 0);
  assert.equal(next.playerClothing.bottomId, 0);
  assert.equal(next.playerClothing.outfitPrimaryColor, state.playerClothing.outfitPrimaryColor);
});
