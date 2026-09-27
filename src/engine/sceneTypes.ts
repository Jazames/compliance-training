import type { PlayerClothing } from './playerAppearance';

export type SceneType = 'trainingSlide' | 'dialogueScene' | 'phoneScene' | 'minigameScene';

export interface ConditionExpr {
  kind: 'meterAtLeast' | 'flagIs';
  key: string;
  value: number | boolean;
}

export type EffectDef =
  | { kind: 'setPlayerName'; name: string; onlyIfEmpty?: boolean }
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
  speakerRole?: 'otherCharacter';
  text: string;
}

export interface CharacterPlacement {
  id: string;
  name: string;
  artboard: 'generic-man' | 'generic-woman';
  side: 'left' | 'center' | 'right';
  /** Orientation is independent of placement; omitted uses the rig's right-facing default. */
  facing?: 'left' | 'right';
  seated?: boolean;
  sittingStyle?: 'front' | 'sideways' | 'three-quarter';
  action?: 'idle' | 'talk' | 'walk';
  entryAction?: 'idle' | 'talk' | 'walk';
  framing?: 'full' | 'presenter';
  pose?: string;
  x?: number;
  clothing?: Partial<PlayerClothing>;
  hairColor?: string;
  hairAccentColor?: string;
  eyeColor?: string;
}

export interface SceneDef {
  stageKey?: string;
  entrance?: 'fade';
  feedback?: 'correct' | 'incorrect';
  meetingRoom?: boolean;
  showRecordedName?: boolean;
  mirrorCloseup?: boolean;
  restroomFixture?: 0 | 1 | 2 | 3;
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
  hallwayAction?: 'approach' | 'jump' | 'pickup' | 'report';
  mustardAction?: 'spill' | 'leave' | 'montage' | 'remove';
  autoAdvance?: { afterMs: number; choiceId: string };
  skinTonePicker?: boolean;
  skinToneLabel?: string;
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
