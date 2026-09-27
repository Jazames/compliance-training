import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { prepareImage, STAGE_ASSETS } from './stageAssets';

import { StageContext } from './stageContext';

/** One owner per visual stage visit, independent of text/decision beat identity. */
export function StageRuntime({ stageKey, playing, onReady, children }: {
  stageKey: string; playing: boolean; onReady: (ready: boolean) => void; children: ReactNode;
}) {
  const pending = useRef(new Set<string>());
  const [revision, setRevision] = useState(0);
  const [assets, setAssets] = useState<{ ready: boolean; failed: Set<string> }>({ ready: false, failed: new Set() });
  const register = useCallback((id: string) => {
    pending.current.add(id);
    setRevision((value) => value + 1);
    return () => {
      if (pending.current.delete(id)) setRevision((value) => value + 1);
    };
  }, []);
  useEffect(() => {
    let cancelled = false;
    const urls = STAGE_ASSETS[stageKey] ?? [];
    void Promise.all(urls.map(async (url) => [url, await prepareImage(url)] as const)).then((results) => {
      if (!cancelled) setAssets({ ready: true, failed: new Set(results.filter(([, ok]) => !ok).map(([url]) => url)) });
    });
    return () => { cancelled = true; };
  }, [stageKey]);
  useEffect(() => {
    onReady(false);
    if (!assets.ready || pending.current.size) return;
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => { if (!pending.current.size) onReady(true); });
    });
    return () => cancelAnimationFrame(frame);
  }, [assets.ready, revision, onReady]);
  const value = useMemo(() => ({ playing, failed: assets.failed, register }), [playing, assets.failed, register]);
  return <StageContext.Provider value={value}>{children}</StageContext.Provider>;
}
