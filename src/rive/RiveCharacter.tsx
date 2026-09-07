import { useEffect, useState } from 'react';
import { Alignment, Fit, Layout, useRive } from '@rive-app/react-canvas';

type CharacterArtboard = 'generic-man' | 'generic-woman';

interface RiveCharacterProps {
  artboard: CharacterArtboard;
  name: string;
  side: 'left' | 'right';
  appearanceBlend: number;
}

const CHARACTER_SOURCE = `${import.meta.env.BASE_URL}rive/compliance-characters.riv`;

export function RiveCharacter({
  artboard,
  name,
  side,
  appearanceBlend,
}: RiveCharacterProps) {
  const [loadFailed, setLoadFailed] = useState(false);
  const instanceName = artboard === 'generic-woman' ? 'Instance 1' : 'Instance';
  const { rive, RiveComponent } = useRive({
    src: CHARACTER_SOURCE,
    artboard,
    stateMachines: 'State Machine 1',
    autoplay: true,
    autoBind: false,
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.BottomCenter }),
    onLoadError: () => setLoadFailed(true),
  });

  useEffect(() => {
    if (!rive) return;

    const viewModel = rive.viewModelByName('CharacterData');
    const instance = viewModel?.instanceByName(instanceName);

    if (!instance) {
      setLoadFailed(true);
      return;
    }

    rive.bindViewModelInstance(instance);
  }, [instanceName, rive]);

  useEffect(() => {
    if (!rive?.viewModelInstance) return;

    const appearance = rive.viewModelInstance.number('numberProperty');
    if (appearance) {
      appearance.value = Math.max(0, Math.min(1, appearanceBlend));
    }
  }, [appearanceBlend, rive]);

  return (
    <figure className={`rive-character rive-character--${side}`} aria-label={name}>
      <div className="rive-character__canvas">
        {loadFailed ? (
          <div className="rive-character__fallback" role="img" aria-label={`${name} asset unavailable`}>
            <span>{name.slice(0, 1)}</span>
          </div>
        ) : (
          <RiveComponent aria-label={`${name}, animated character`} />
        )}
      </div>
      <figcaption>{name}</figcaption>
    </figure>
  );
}
