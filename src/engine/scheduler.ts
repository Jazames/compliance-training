import { SCENES } from './sceneDb';
import type { GameState } from './gameState';
import { applyEffects } from './effects';
import { evaluateConditions } from './conditions';

function getAvailableChoices(state: GameState) {
  const scene = SCENES[state.currentSceneId];
  return (scene?.choices ?? []).filter((choice) => evaluateConditions(state, choice.conditions));
}

function pickInterrupt(state: GameState): { sceneId: string; nextQueue: GameState['queue'] } | null {
  if (!state.queue.length) {
    return null;
  }

  const sorted = [...state.queue].sort((a, b) => b.priority - a.priority);
  const candidate = sorted[0];

  if (candidate.kind !== 'interruptScene') {
    return null;
  }

  const sceneId = String(candidate.payload?.sceneId ?? '');
  if (!sceneId || !SCENES[sceneId]) {
    return null;
  }

  const removeIndex = state.queue.findIndex((event) => event.id === candidate.id);
  const nextQueue = state.queue.filter((_, index) => index !== removeIndex);

  return { sceneId, nextQueue };
}

export function applyChoice(state: GameState, choiceId: string): GameState {
  const scene = SCENES[state.currentSceneId];
  if (!scene) {
    return state;
  }

  const choice = getAvailableChoices(state).find((item) => item.id === choiceId);
  if (!choice) {
    return state;
  }

  let nextState = applyEffects(state, choice.effects);

  if (
    nextState.meters.romanceDrift >= 0.8 &&
    nextState.flags.romanceCommit &&
    !nextState.locks.romanceLocked
  ) {
    nextState = {
      ...nextState,
      locks: { ...nextState.locks, romanceLocked: true },
    };
  }

  const interrupt = pickInterrupt(nextState);
  if (interrupt) {
    return {
      ...nextState,
      currentSceneId: interrupt.sceneId,
      queue: interrupt.nextQueue,
    };
  }

  const nextSceneId = choice.goto ?? scene.nextSceneId ?? state.currentSceneId;
  return {
    ...nextState,
    currentSceneId: SCENES[nextSceneId] ? nextSceneId : state.currentSceneId,
  };
}

