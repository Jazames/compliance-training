import { SCENES } from '../scenes';
import { createInitialGameState, type GameState } from './gameState';
import { applyEffects } from './effects';
import { evaluateConditions } from './conditions';
import type { ScenarioDef } from './sceneTypes';

export function getCurrentBeat(state: GameState) {
  return SCENES[state.currentSceneId]?.beats[state.currentBeatId];
}

/** Called only at scenario boundaries, never between question and feedback beats. */
export function selectNextScene(state: GameState, registry: Record<string, ScenarioDef> = SCENES): GameState {
  const eligible = state.queue.map((request, index) => ({ request, index }))
    .filter(({ request }) => registry[request.sceneId] && evaluateConditions(state, request.conditions) &&
      (!request.oneShotKey || !state.playedOneShots.includes(request.oneShotKey)) &&
      (state.flags.characterCreationComplete || request.mode === 'required'));
  const required = eligible.filter(({ request }) => request.mode === 'required');
  const course = eligible.filter(({ request }) => request.mode === 'course');
  let candidates = required.length ? required.slice(0, 1)
    : state.consecutiveOptional >= 2 && course.length ? course : eligible;
  if (!candidates.length) {
    return { ...state, routingError: 'No eligible next scene is queued. Check this scene’s completion choices.' };
  }
  const priority = Math.max(...candidates.map(({ request }) => request.priority ?? 0));
  candidates = candidates.filter(({ request }) => (request.priority ?? 0) === priority);
  // LCG state lives in GameState so replays/tests can reproduce each selection.
  const seed = (Math.imul(state.randomSeed, 1664525) + 1013904223) >>> 0;
  const total = candidates.reduce((sum, { request }) => sum + (request.weight ?? 1), 0);
  let remaining = seed / 0x100000000 * total;
  const selected = candidates.find(({ request }) => {
    remaining -= request.weight ?? 1;
    return remaining < 0;
  }) ?? candidates[candidates.length - 1];
  const next = registry[selected.request.sceneId];
  return {
    ...state,
    currentSceneId: next.id,
    currentBeatId: next.entryBeat,
    queue: next.terminal ? [] : state.queue.filter((_, index) => index !== selected.index),
    playedOneShots: selected.request.oneShotKey
      ? [...state.playedOneShots, selected.request.oneShotKey] : state.playedOneShots,
    randomSeed: candidates.length > 1 ? seed : state.randomSeed,
    consecutiveOptional: selected.request.mode === 'optional' ? state.consecutiveOptional + 1 : 0,
    routingError: undefined,
  };
}

export function applyChoice(state: GameState, choiceId: string): GameState {
  if (state.routingError) return state;
  const scenario = SCENES[state.currentSceneId];
  const choice = getCurrentBeat(state)?.choices?.find((item) => item.id === choiceId &&
    evaluateConditions(state, item.conditions));
  if (!scenario || !choice) return state;
  if (choice.restart) return createInitialGameState();
  let next = applyEffects(state, choice.effects);
  if (next.meters.romanceDrift >= 0.8 && next.flags.romanceCommit &&
    !Object.values(next.locks).some(Boolean)) {
    next = { ...next, locks: { ...next.locks, romanceLocked: true } };
  }
  if (choice.nextBeat) return { ...next, currentBeatId: choice.nextBeat };
  if (!choice.complete) return next;
  if (scenario.milestone && !next.completedMilestones.includes(scenario.id)) {
    next = { ...next, completedMilestones: [...next.completedMilestones, scenario.id] };
  }
  return selectNextScene(next);
}
