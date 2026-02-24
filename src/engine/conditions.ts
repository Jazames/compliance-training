import type { ConditionExpr } from './sceneTypes';
import type { GameState } from './gameState';

export function evaluateConditions(state: GameState, conditions?: ConditionExpr[]): boolean {
  if (!conditions?.length) {
    return true;
  }

  return conditions.every((condition) => {
    if (condition.kind === 'flagIs') {
      return Boolean(state.flags[condition.key]) === condition.value;
    }

    if (condition.kind === 'meterAtLeast') {
      const meterValue = state.meters[condition.key as keyof typeof state.meters];
      return typeof meterValue === 'number' && meterValue >= Number(condition.value);
    }

    return false;
  });
}

