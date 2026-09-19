import welcome from './welcome';
import sex from './character_1_sex';
import skin from './character_2_skin';
import eyes from './character_3_eyes';
import name from './character_4_name';
import hair from './character_5_hair';
import hallway from './hallway';
import mustard from './mustard';
import cybersecurity from './cybersecurity';
import romance from './romance_notification';
import complete from './course_complete';
import intro from './training_intro';
import romanceFeedback from './romance_feedback';
import type { ScenarioDef } from '../engine/sceneTypes';
import { validateScenes } from '../engine/validateScenes';

const definitions = [welcome, sex, skin, eyes, name, hair, hallway, mustard,
  cybersecurity, romance, complete, intro, romanceFeedback];
export const SCENES: Record<string, ScenarioDef> = Object.fromEntries(
  definitions.map((scene) => [scene.id, scene]),
);
validateScenes(definitions);
export const TOTAL_MILESTONES = definitions.filter((scene) => scene.milestone).length;
