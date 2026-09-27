import { useStageRuntime } from './stageContext';
type PropName = 'mustard-bottle' | 'hotdog' | 'broom' | 'mop' | 'shirt';

/** Text-free decorative artwork; its meaning is supplied by authored scene copy. */
export function SceneProp({ name, className = '' }: { name: PropName; className?: string }) {
  const { failed } = useStageRuntime();
  if (failed.has(`${import.meta.env.BASE_URL}props/${name}.svg`)) return null;
  return <img className={`scene-prop ${className}`} src={`${import.meta.env.BASE_URL}props/${name}.svg`}
    alt="" aria-hidden="true" draggable={false} />;
}
