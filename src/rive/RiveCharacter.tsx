import { useEffect, useRef, useState } from 'react';
import { Alignment, EventType, Fit, Layout, useRive, type Event } from '@rive-app/react-canvas';
import { DEFAULT_HAIR } from '../engine/hairColors';
import { createIdleClock, finishIdle, IDLE_ANIMATION, sampleIdle } from './idlePlayback';

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
  outfitPrimaryColor,
  pantsColor = '#344454',
  suitColor,
  outfitSecondaryColor = '#E9ECE9',
  outfitAccentColor = '#94705A',
}: RiveCharacterProps) {
  const [loadFailed, setLoadFailed] = useState(false);
  const [postureTransitioning, setPostureTransitioning] = useState(false);
  const appearanceRef = useRef(appearanceBlend);
  const instanceName = artboard === 'generic-woman' ? 'Instance 1' : 'Instance';
  const { rive, RiveComponent } = useRive({
    src: CHARACTER_SOURCE,
    artboard,
    // Do not instantiate the state machine: its idle layer blinks continuously.
    // The synchronized one-second appearance timeline replaces its blend layer.
    animations: [IDLE_ANIMATION, 'Anime Transformation'],
    autoplay: false,
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
    appearanceRef.current = Math.max(0, Math.min(1, appearanceBlend));
    if (!rive?.viewModelInstance) return;

    const appearance = rive.viewModelInstance.number('numberProperty');
    if (appearance) {
      appearance.value = Math.max(0, Math.min(1, appearanceBlend));
    }
  }, [appearanceBlend, rive]);

  useEffect(() => {
    if (!rive) return;
    const clock = createIdleClock(performance.now());
    let frame = 0;
    let disposed = false;
    const hold = () => {
      rive.pause(IDLE_ANIMATION);
      rive.scrub(IDLE_ANIMATION, 0);
    };
    const onLoop = (event: Event) => {
      if (event.data && typeof event.data === 'object' && 'animation' in event.data &&
        event.data.animation === IDLE_ANIMATION && clock.startedAt !== null) {
        finishIdle(clock, performance.now());
        hold();
      }
    };
    // Scrubbing a *playing* timeline emits its real loop boundary. No assumed
    // duration or hardcoded blink frames; the exported clip determines one cycle.
    const advance = (now: number) => {
      if (disposed) return;
      const sample = sampleIdle(clock, now);
      if (sample.start) rive.play(IDLE_ANIMATION);
      rive.scrub('Anime Transformation', appearanceRef.current);
      rive.scrub(IDLE_ANIMATION, sample.time);
      frame = requestAnimationFrame(advance);
    };
    const onVisibility = () => {
      // No catch-up loops after backgrounding, and never leave eyes half closed.
      finishIdle(clock, performance.now());
      hold();
    };
    rive.on(EventType.Loop, onLoop);
    document.addEventListener('visibilitychange', onVisibility);
    hold();
    frame = requestAnimationFrame(advance);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      rive.off(EventType.Loop, onLoop);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [rive]);

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
    const property = rive?.viewModelInstance?.number('outfitId');
    if (!property) return;
    const maximum = artboard === 'generic-woman' ? 4 : 2;
    const selection = Math.round(outfitId);
    property.value = Number.isFinite(selection) && selection >= 0 && selection <= maximum
      ? selection : 0;
  }, [rive, artboard, outfitId]);

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
