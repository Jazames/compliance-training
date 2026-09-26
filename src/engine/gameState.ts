import type { PendingScene, MeterState } from './sceneTypes';
import { DEFAULT_HAIR } from './hairColors';
import type { PlayerClothing } from './playerAppearance';

export interface GameState {
  currentSceneId: string;
  currentBeatId: string;
  completedMilestones: string[];
  playedOneShots: string[];
  randomSeed: number;
  consecutiveOptional: number;
  routingError?: string;
  playerCharacterId: 'daniel' | 'rachel' | null;
  playerClothing: PlayerClothing | null;
  playerSkinColor: string;
  playerName: string;
  playerEyeColor: string;
  playerHairColor: string;
  playerHairAccentColor: string;
  flags: Record<string, boolean>;
  meters: MeterState;
  queue: PendingScene[];
  locks: {
    romanceLocked: boolean;
    heistLocked: boolean;
    survivalLocked: boolean;
  };
}

export function createInitialGameState(seed = Math.floor(Math.random() * 0x100000000)): GameState {
  return {
    currentSceneId: 'welcome',
    currentBeatId: 'training_welcome',
    completedMilestones: [],
    playedOneShots: [],
    randomSeed: seed >>> 0,
    consecutiveOptional: 0,
    playerCharacterId: null,
    playerClothing: null,
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
