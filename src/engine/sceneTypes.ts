import type { PlayerClothing } from './playerAppearance';

export type SceneType = 'trainingSlide' | 'dialogueScene' | 'phoneScene' | 'minigameScene';

export interface ConditionExpr {
  kind: 'meterAtLeast' | 'flagIs';
  key: string;
  value: number | boolean;
}

export type EffectDef =
  | { kind: 'setFlag'; key: string; value: boolean }
  | { kind: 'setPlayerCharacter'; characterId: 'daniel' | 'rachel' }
  | { kind: 'setPlayerEyeColor'; color: string }
  | { kind: 'setPlayerSkinColor'; color: string }
  | { kind: 'setPlayerHairColor'; color: string; accentColor: string }
  | { kind: 'setPlayerClothing'; clothing: Partial<PlayerClothing> }
  | { kind: 'revealPlayerUndershirt' }
  | { kind: 'addMeter'; key: keyof MeterState; amount: number }
  | { kind: 'enqueueScene'; scene: PendingScene };

export interface PendingScene {
  sceneId: string;
  mode: 'required' | 'course' | 'optional';
  priority?: number;
  weight?: number;
  conditions?: ConditionExpr[];
  oneShotKey?: string;
}

export interface ChoiceDef {
  id: string;
  label: string;
  speaker?: string;
  swatch?: string;
  effects: EffectDef[];
  nextBeat?: string;
  complete?: boolean;
  restart?: boolean;
  conditions?: ConditionExpr[];
}

export interface DialogueLine {
  speaker: string;
  text: string;
}

export interface CharacterPlacement {
  id: string;
  name: string;
  artboard: 'generic-man' | 'generic-woman';
  side: 'left' | 'center' | 'right';
  action?: 'idle' | 'talk' | 'walk';
  entryAction?: 'idle' | 'talk' | 'walk';
  framing?: 'full' | 'presenter';
  pose?: string;
  x?: number;
  clothing?: Partial<PlayerClothing>;
}

export interface SceneDef {
  id: string;
  type: SceneType;
  sceneLabel?: string;
  backgroundKey?: string;
  characters?: CharacterPlacement[];
  playerOnly?: boolean;
  title?: string;
  body?: string;
  dialogue?: DialogueLine[];
  entryDelayMs?: number;
  entryText?: string;
  fadeOnExit?: boolean;
  hallwayAction?: 'approach' | 'jump' | 'pickup' | 'report';
  mustardAction?: 'spill' | 'leave' | 'montage' | 'remove';
  autoAdvance?: { afterMs: number; choiceId: string };
  skinTonePicker?: boolean;
  interaction?: 'restroom' | 'nameplate';
  choices?: ChoiceDef[];
  email?: { from: string; subject: string; body: string; signoff: string };
  nameplate?: { label: string; choiceId: string; maxLength: number };
  conditions?: ConditionExpr[];
}

/** One author-owned scenario; beats never enter the global queue. */
export interface ScenarioDef {
  id: string;
  entryBeat: string;
  beats: Record<string, SceneDef>;
  creation?: boolean;
  milestone?: boolean;
  terminal?: boolean;
}

export interface MeterState {
  compliance: number;
  romanceDrift: number;
  heistDrift: number;
  survivalDrift: number;
}
