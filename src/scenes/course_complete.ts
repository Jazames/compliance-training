import type { ScenarioDef } from '../engine/sceneTypes';
const scene: ScenarioDef = {
    id: 'course_complete',
    entryBeat: 'course_complete',
    terminal: true,
    beats: {
        course_complete: {
            id: 'course_complete',
            type: 'trainingSlide',
            
            title: 'Module Complete',
            body: 'You have reached the end of the prototype path. In the full game, ending checks and genre locks will branch from here.',
            choices: [
                {
                    id: 'restart',
                    label: 'Restart training',
                    restart: true,
                    effects: [],
                },
            ],
        }
    },
};
export default scene;
