import type { GameEvent, MeterState } from './sceneTypes';
import { DEFAULT_HAIR } from './hairColors';

export interface GameState {
  currentSceneId: string;
  playerCharacterId: 'daniel' | 'rachel' | null;
  playerSkinColor: string;
  playerName: string;
  playerEyeColor: string;
  playerHairColor: string;
  playerHairAccentColor: string;
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
    currentSceneId: 'training_welcome',
    playerCharacterId: null,
    playerSkinColor: '#CFA17E',
    playerName: '',
    playerEyeColor: '#58616A',
    playerHairColor: DEFAULT_HAIR.color,
    playerHairAccentColor: DEFAULT_HAIR.accentColor,
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
