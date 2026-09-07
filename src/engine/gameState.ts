import type { GameEvent, MeterState } from './sceneTypes';

export interface GameState {
  currentSceneId: string;
  flags: Record<string, boolean>;
  meters: MeterState;
  queue: GameEvent[];
  locks: {
    romanceLocked: boolean;
    heistLocked: boolean;
    survivalLocked: boolean;
  };
}

export function createInitialGameState(): GameState {
  return {
    currentSceneId: 'drink_question',
    flags: {},
    meters: {
      compliance: 0.5,
      romanceDrift: 0,
      heistDrift: 0,
      survivalDrift: 0,
    },
    queue: [],
    locks: {
      romanceLocked: false,
      heistLocked: false,
      survivalLocked: false,
    },
  };
}
