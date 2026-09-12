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
  | { kind: 'addMeter'; key: keyof MeterState; amount: number }
  | { kind: 'enqueueEvent'; event: GameEvent };

export interface GameEvent {
  id: string;
  kind: 'interruptScene' | 'endingCheck';
  priority: number;
  payload?: Record<string, string | number | boolean>;
}

export interface ChoiceDef {
  id: string;
  label: string;
  speaker?: string;
  swatch?: string;
  effects: EffectDef[];
  goto?: string;
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
}

export interface SceneDef {
  id: string;
  type: SceneType;
  trainingStep?: number;
  sceneLabel?: string;
  backgroundKey?: string;
  characters?: CharacterPlacement[];
  title?: string;
  body?: string;
  dialogue?: DialogueLine[];
  entryDelayMs?: number;
  entryText?: string;
  fadeOnExit?: boolean;
  skinTonePicker?: boolean;
  interaction?: 'restroom' | 'nameplate';
  choices?: ChoiceDef[];
  nextSceneId?: string;
  conditions?: ConditionExpr[];
}

export interface MeterState {
  compliance: number;
  romanceDrift: number;
  heistDrift: number;
  survivalDrift: number;
}
