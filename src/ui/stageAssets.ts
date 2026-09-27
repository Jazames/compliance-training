const base = import.meta.env?.BASE_URL ?? '/';
export const CHARACTER_SOURCE = `${base}rive/compliance-characters.riv?v=20260927-viewer-facing`;
export const BACKGROUNDS: Record<string, string> = {
  'studio-chair': `${base}bg/studio-chair.png`,
  'break-room': `${base}bg/break-room.png`,
};
export const STAGE_ASSETS: Record<string, string[]> = {
  'studio-chair': [BACKGROUNDS['studio-chair']],
  'break-room': [BACKGROUNDS['break-room']],
  hallway: ['broom', 'mop'].map((name) => `${base}props/${name}.svg`),
  'mustard-kitchen': ['mustard-bottle', 'hotdog', 'shirt'].map((name) => `${base}props/${name}.svg`),
};
const images = new Map<string, Promise<boolean>>();
/** Failures are frozen by the stage owner, but may be retried on a later visit. */
export function prepareImage(url: string): Promise<boolean> {
  const existing = images.get(url);
  if (existing) return existing;
  const promise = new Promise<boolean>((resolve) => {
    const image = new Image();
    let settled = false;
    const finish = (ok: boolean) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (!ok) images.delete(url);
      resolve(ok);
    };
    const timer = window.setTimeout(() => finish(false), 15_000);
    image.onerror = () => finish(false);
    image.onload = () => { image.decode().then(() => finish(true), () => finish(false)); };
    image.src = url;
  });
  images.set(url, promise);
  return promise;
}
let characterFile: Promise<ArrayBuffer> | undefined;
export function prepareCharacter(): Promise<ArrayBuffer> {
  if (!characterFile) {
    characterFile = fetch(CHARACTER_SOURCE, { signal: AbortSignal.timeout(15_000) })
      .then((response) => {
        if (!response.ok) throw new Error('Character asset request failed');
        return response.arrayBuffer();
      }).catch((error: unknown) => { characterFile = undefined; throw error; });
  }
  return characterFile;
}
