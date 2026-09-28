import type { ScenarioDef } from '../engine/sceneTypes';
import welcome from './welcome';

const scene: ScenarioDef = {
  id: 'exam_intro', entryBeat: 'exam_intro',
  beats: {
    exam_intro: {
      id: 'exam_intro', type: 'dialogueScene', sceneLabel: '',
      stageKey: 'studio-chair', backgroundKey: 'studio-chair',
      // Reuse the opening facilitator's appearance and existing speaker label.
      characters: welcome.beats.training_welcome.characters,
      dialogue: [{
        speaker: welcome.beats.training_welcome.characters![0].name,
        // Dialogue and button wording supplied verbatim by the user.
        text: 'This wraps up the practice portion of the training. As you answer the following questions, remember that the company values safety first, kindness second, and hard work third.',
      }],
      choices: [{ id: 'continue_to_exam', label: 'continue to exam', complete: true,
        effects: [{ kind: 'enqueueScene', scene: { sceneId: 'hallway', mode: 'required' } }] }],
    },
  },
};
export default scene;
