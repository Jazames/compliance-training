import { useEffect, useId, useRef, useState } from 'react';
import { Alignment, Fit, Layout, Rive } from '@rive-app/react-canvas';
import { prepareCharacter } from './stageAssets';
import './animation-test.css';

type Rig = 'generic-man' | 'generic-woman';
type Outfit = { topId: number; bottomId: number };
const driftInputs = ['numberProperty', 'heistDrift', 'survivalDrift'];
const playbackNames = (animation: string) => driftInputs.includes(animation) ? 'State Machine 1'
  : animation;

function AnimationPreview({ buffer, rig, outfit, animation }: {
  buffer: ArrayBuffer; rig: Rig; outfit: Outfit; animation: string;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const captionId = useId();
  const [enabled, setEnabled] = useState(() => !matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [visible, setVisible] = useState(false);
  const runtime = useRef<Rive | null>(null);
  const ready = useRef(false);
  const playback = useRef(false);
  useEffect(() => {
    playback.current = enabled && visible;
    const rive = runtime.current;
    if (!rive || !ready.current) return;
    if (playback.current) rive.play(playbackNames(animation));
    else rive.pause();
  }, [enabled, visible, animation]);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (canvas.current) observer.observe(canvas.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!canvas.current) return;
    let disposed = false;
    let restart: number | undefined;
    let elapsed = 0;
    const drift = driftInputs.includes(animation);
    const side = /Sideways|Three Quarter/.test(animation);
    const seated = side || /Sitting Down|Standing Up/.test(animation);
    const standing = /Standing/.test(animation);
    const target = animation.includes('Three Quarter') ? -1 : 1;
    let posture: ReturnType<NonNullable<ReturnType<Rive['viewModelByName']>>['instanceByName']> | undefined;
    const rive = new Rive({
      canvas: canvas.current, buffer: buffer.slice(0), artboard: rig,
      // Named previews must run alone: the state machine applies after timelines
      // and overwrites their keyed pose. Drift previews exercise the live machine.
      stateMachines: drift ? 'State Machine 1' : undefined,
      autoBind: false, autoplay: false,
      layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
      onLoad: () => {
        if (disposed) return;
        ready.current = true;
        posture = rive.viewModelByName('CharacterData')?.instanceByName(rig === 'generic-man' ? 'Instance' : 'Instance 1');
        if (posture) {
          rive.bindViewModelInstance(posture);
          for (const [key, value] of Object.entries({ ...outfit, numberProperty: 0, heistDrift: 0, survivalDrift: 0, sitAmount: 0, sideSitAmount: 0 })) {
            const input = posture.number(key);
            if (input) input.value = value;
          }
          if (seated && standing) {
            const input = posture.number(side ? 'sideSitAmount' : 'sitAmount');
            if (input) input.value = target;
          }
        }
        rive.resizeDrawingSurfaceToCanvas();
        // Render a bound initial frame even when motion is disabled.
        rive.play(playbackNames(animation));
      },
      onAdvance: (event) => {
        elapsed += Number(event.data);
        if (driftInputs.includes(animation)) {
          // Five-second round trip: 2.5 seconds out, 2.5 seconds back, no holds.
          const phase = elapsed % 5;
          const progress = phase <= 2.5 ? phase / 2.5 : (5 - phase) / 2.5;
          const input = posture?.number(animation);
          if (input) input.value = progress * progress * (3 - 2 * progress);
        }
        if (seated) {
          // Match the saved pose keys and the production posture transition.
          const t = Math.min(1, elapsed);
          const progress = t * t * (3 - 2 * t);
          const input = posture?.number(side ? 'sideSitAmount' : 'sitAmount');
          if (input) input.value = target * (standing ? 1 - progress : progress);
        }
        if (!playback.current) rive.pause();
      },
      onStop: () => {
        if (disposed || !playback.current) return;
        restart = window.setTimeout(() => {
          if (disposed || !playback.current) return;
          elapsed = 0;
          rive.play(animation);
        }, 650);
      },
    });
    runtime.current = rive;
    const resize = new ResizeObserver(() => rive.resizeDrawingSurfaceToCanvas());
    resize.observe(canvas.current);
    return () => { disposed = true; ready.current = false; runtime.current = null; clearTimeout(restart); resize.disconnect(); rive.cleanup(); };
  }, [buffer, rig, outfit, animation]);

  return <figure className="animation-test-card">
    <canvas ref={canvas} aria-labelledby={captionId} />
    <figcaption id={captionId}><label>
      <input type="checkbox" checked={enabled} onChange={(event) => setEnabled(event.target.checked)} />
      {animation}
    </label></figcaption>
  </figure>;
}

export function AnimationTest() {
  const [rig, setRig] = useState<Rig>('generic-man');
  const [outfit, setOutfit] = useState<Outfit>({ topId: 0, bottomId: 0 });
  const [buffer, setBuffer] = useState<ArrayBuffer>();
  const [animations, setAnimations] = useState<string[]>([]);
  const [error, setError] = useState<string>();
  useEffect(() => {
    let cancelled = false;
    void prepareCharacter().then((data) => { if (!cancelled) setBuffer(data); }, (reason: unknown) => {
      if (!cancelled) setError(String(reason));
    });
    return () => { cancelled = true; };
  }, []);
  useEffect(() => {
    if (!buffer) return;
    let disposed = false;
    const discovery = new Rive({
      canvas: document.createElement('canvas'), buffer: buffer.slice(0), artboard: rig,
      autoplay: false,
      onLoad: () => { if (!disposed) setAnimations([...discovery.animationNames, ...driftInputs]); },
      onLoadError: (event) => { if (!disposed) setError(String(event.data)); },
    });
    return () => { disposed = true; discovery.cleanup(); };
  }, [buffer, rig]);
  const outfits = Array.from({ length: 3 }, (_, topId) =>
    Array.from({ length: rig === 'generic-man' ? 3 : 5 }, (_, bottomId) => ({ topId, bottomId }))).flat();
  return <main className="animation-test">
    {/* Labels below are verbatim words from the user's test-scene request.
        Animation names and outfit pairs are native rig identifiers/data, not story copy. */}
    <header className="animation-test-controls">
      <h1>animations</h1>
      <label>man/woman<select value={rig} onChange={(event) => {
        setRig(event.target.value as Rig);
        setOutfit((previous) => ({ ...previous, bottomId: Math.min(previous.bottomId, event.target.value === 'generic-man' ? 2 : 4) }));
      }}><option value="generic-man">man</option><option value="generic-woman">woman</option></select></label>
      <label>outfit<select value={`${outfit.topId}/${outfit.bottomId}`} onChange={(event) => {
        const [topId, bottomId] = event.target.value.split('/').map(Number);
        setOutfit({ topId, bottomId });
      }}>{outfits.map(({ topId, bottomId }) => <option key={`${topId}/${bottomId}`} value={`${topId}/${bottomId}`}>{`topId=${topId} / bottomId=${bottomId}`}</option>)}</select></label>
    </header>
    {error && <pre role="alert">{error}</pre>}
    <div className="animation-test-gallery" aria-busy={!buffer || animations.length === 0}>
      {buffer && animations.map((animation) => <AnimationPreview key={`${rig}:${animation}`} buffer={buffer} rig={rig} outfit={outfit} animation={animation} />)}
    </div>
  </main>;
}
