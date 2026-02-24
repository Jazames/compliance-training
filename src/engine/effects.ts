import type { GameState } from './gameState';
import type { EffectDef } from './sceneTypes';

function clamp(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export function applyEffects(state: GameState, effects: EffectDef[]): GameState {
  let next = state;

  for (const effect of effects) {
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

    if (effect.kind === 'enqueueEvent') {
      next = {
        ...next,
        queue: [...next.queue, effect.event],
      };
    }
  }

  return next;
}

