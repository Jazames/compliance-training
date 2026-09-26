import { useEffect, useState } from 'react';
import { Alignment, Fit, Layout, useRive } from '@rive-app/react-canvas';
import { DEFAULT_HAIR } from '../engine/hairColors';
import { resolveWardrobe } from './wardrobe';

type CharacterArtboard = 'generic-man' | 'generic-woman';

interface RiveCharacterProps {
  artboard: CharacterArtboard;
  name: string;
  side: 'left' | 'center' | 'right';
  action: 'idle' | 'talk' | 'walk' | 'interact';
  framing?: 'full' | 'presenter';
  appearanceBlend: number;
  seated?: boolean;
  eyeColor?: string;
  skinColor?: string;
  hairColor?: string;
  hairAccentColor?: string;
  topId?: number;
  bottomId?: number;
  /** @deprecated Prefer independent topId and bottomId. */
  outfitId?: number;
  outfitPrimaryColor?: string;
  pantsColor?: string;
  suitColor?: string;
  outfitSecondaryColor?: string;
  outfitAccentColor?: string;
}

const CHARACTER_SOURCE = `${import.meta.env.BASE_URL}rive/compliance-characters.riv`;

export function RiveCharacter({
  artboard,
  name,
  side,
  action,
  framing = 'full',
  appearanceBlend,
  seated = false,
  eyeColor = '#58616A',
  skinColor = '#CFA17E',
  hairColor = DEFAULT_HAIR.color,
  hairAccentColor = DEFAULT_HAIR.accentColor,
  outfitId = 0,
  topId,
  bottomId,
  outfitPrimaryColor,
  pantsColor = '#344454',
  suitColor,
  outfitSecondaryColor = '#E9ECE9',
  outfitAccentColor = '#94705A',
}: RiveCharacterProps) {
  const [loadFailed, setLoadFailed] = useState(false);
  const [postureTransitioning, setPostureTransitioning] = useState(false);
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

  useEffect(() => {
    const amount = rive?.viewModelInstance?.number('sitAmount');
    if (!amount) return;
    const from = amount.value;
    const to = seated ? 1 : 0;
    if (Math.abs(from - to) < 0.001) {
      setPostureTransitioning(false);
      return;
    }
    rive?.stop('Walking');
    setPostureTransitioning(true);
    const start = performance.now();
    let frame = 0;
    const advance = (now: number) => {
      const t = Math.min(1, (now - start) / 1000);
      const eased = t * t * (3 - 2 * t);
      amount.value = from + (to - from) * eased;
      if (t < 1) frame = requestAnimationFrame(advance);
      else setPostureTransitioning(false);
    };
    frame = requestAnimationFrame(advance);
    return () => cancelAnimationFrame(frame);
  }, [rive, seated]);

  useEffect(() => {
    const selection = resolveWardrobe(artboard, topId, bottomId, outfitId);
    const top = rive?.viewModelInstance?.number('topId');
    const bottom = rive?.viewModelInstance?.number('bottomId');
    if (top) top.value = selection.topId;
    if (bottom) bottom.value = selection.bottomId;
  }, [rive, artboard, topId, bottomId, outfitId]);

  useEffect(() => {
    const colors = {
      outfitPrimaryColor: outfitPrimaryColor ?? (artboard === 'generic-woman' ? '#86658F' : '#438F98'),
      pantsColor,
      suitColor: suitColor ?? (artboard === 'generic-woman' ? '#495169' : '#344454'),
      outfitSecondaryColor,
      outfitAccentColor,
    };
    for (const [property, color] of Object.entries(colors)) {
      if (!/^#[0-9a-f]{6}$/i.test(color)) continue;
      rive?.viewModelInstance?.color(property)?.rgb(
        parseInt(color.slice(1, 3), 16),
        parseInt(color.slice(3, 5), 16),
        parseInt(color.slice(5, 7), 16),
      );
    }
  }, [rive, artboard, outfitPrimaryColor, pantsColor, suitColor, outfitSecondaryColor, outfitAccentColor]);

  useEffect(() => {
    if (!/^#[0-9a-f]{6}$/i.test(eyeColor)) return;
    rive?.viewModelInstance?.color('eyeColor')?.rgb(
      parseInt(eyeColor.slice(1, 3), 16),
      parseInt(eyeColor.slice(3, 5), 16),
      parseInt(eyeColor.slice(5, 7), 16),
    );
  }, [rive, eyeColor]);

  useEffect(() => {
    if (!/^#[0-9a-f]{6}$/i.test(skinColor)) return;
    rive?.viewModelInstance?.color('skinColor')?.rgb(
      parseInt(skinColor.slice(1, 3), 16),
      parseInt(skinColor.slice(3, 5), 16),
      parseInt(skinColor.slice(5, 7), 16),
    );
  }, [rive, skinColor]);

  useEffect(() => {
    if (!/^#[0-9a-f]{6}$/i.test(hairColor)) return;
    rive?.viewModelInstance?.color('hairColor')?.rgb(
      parseInt(hairColor.slice(1, 3), 16),
      parseInt(hairColor.slice(3, 5), 16),
      parseInt(hairColor.slice(5, 7), 16),
    );
  }, [rive, hairColor]);

  useEffect(() => {
    if (!/^#[0-9a-f]{6}$/i.test(hairAccentColor)) return;
    rive?.viewModelInstance?.color('hairAccentColor')?.rgb(
      parseInt(hairAccentColor.slice(1, 3), 16),
      parseInt(hairAccentColor.slice(3, 5), 16),
      parseInt(hairAccentColor.slice(5, 7), 16),
    );
  }, [rive, hairAccentColor]);

  useEffect(() => {
    if (!rive) return;

    const interaction = rive.animationNames.includes('Interacting') ? 'Interacting' : 'Arm Wave';
    const timeline = action === 'interact' ? interaction : action === 'talk' ? 'Talking' : action === 'walk' && !seated && !postureTransitioning ? 'Walking' : null;
    rive.stop(['Talking', 'Walking', interaction]);
    if (timeline) rive.play(timeline);

    return () => {
      if (timeline) rive.stop(timeline);
    };
  }, [action, rive, seated, postureTransitioning]);

  return (
    <figure
      className={`rive-character rive-character--${side} rive-character--${framing} rive-character--${action === 'walk' && (seated || postureTransitioning) ? 'idle' : action}`}
      aria-label={name}
    >
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
