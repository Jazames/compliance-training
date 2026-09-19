import type { GameState } from './gameState';
import type { EffectDef } from './sceneTypes';

function clamp(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export function applyEffects(state: GameState, effects: EffectDef[]): GameState {
  let next = state;

  for (const effect of effects) {
    if (effect.kind === 'setPlayerEyeColor') {
      if (/^#[0-9a-f]{6}$/i.test(effect.color)) next = { ...next, playerEyeColor: effect.color };
      continue;
    }
    if (effect.kind === 'setPlayerHairColor') {
      if ([effect.color, effect.accentColor].every((color) => /^#[0-9a-f]{6}$/i.test(color))) {
        next = { ...next, playerHairColor: effect.color, playerHairAccentColor: effect.accentColor };
      }
      continue;
    }

    if (effect.kind === 'setPlayerSkinColor') {
      if (/^#[0-9a-f]{6}$/i.test(effect.color)) {
        next = { ...next, playerSkinColor: effect.color };
      }
      continue;
    }

    if (effect.kind === 'setFlag') {
      next = {
        ...next,
        flags: {
          ...next.flags,
          [effect.key]: effect.value,
        },
      };
      continue;
    }

    if (effect.kind === 'setPlayerCharacter') {
      next = {
        ...next,
        playerCharacterId: effect.characterId,
      };
      continue;
    }

    if (effect.kind === 'addMeter') {
      next = {
        ...next,
        meters: {
          ...next.meters,
          [effect.key]: clamp(next.meters[effect.key] + effect.amount),
        },
      };
      continue;
    }

    if (effect.kind === 'enqueueScene') {
      const request = effect.scene;
      if (next.queue.some((item) => item.sceneId === request.sceneId ||
        (request.oneShotKey && item.oneShotKey === request.oneShotKey)) ||
        (request.oneShotKey && next.playedOneShots.includes(request.oneShotKey))) continue;
      next = {
        ...next,
        queue: [...next.queue, request],
      };
    }
  }

  return next;
}
