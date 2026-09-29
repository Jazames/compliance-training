// Internal browser integration test for the actual production hook. No story UI.
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { useDriftAppearance } from '../../src/rive/useDriftAppearance';
const properties = { numberProperty: {value:0}, heistDrift: {value:0}, survivalDrift: {value:0} };
const runtime = { viewModelInstance: { number: (name: string) => properties[name as keyof typeof properties] ?? null } };
const originalMedia = window.matchMedia;
const media = new EventTarget();
let reduced = false;
window.matchMedia = ((query: string) => query === '(prefers-reduced-motion: reduce)' ? {
  matches: reduced, addEventListener: media.addEventListener.bind(media), removeEventListener: media.removeEventListener.bind(media),
} : originalMedia(query)) as typeof window.matchMedia;
const values = () => Object.values(properties).map(p=>p.value);
const checks: string[] = [];
const delay = (ms: number) => new Promise(resolve=>setTimeout(resolve, ms));
function check(name: string, pass: boolean) {
  if (!pass) throw new Error(`${name}: ${values()}`);
  checks.push(name); document.body.dataset.checks=JSON.stringify(checks);
}
export function Probe() {
  const [playing, setPlaying] = useState(false);
  const [target, setTarget] = useState({romance:1,heist:0,survival:0});
  useDriftAppearance(runtime,target,playing);
  useEffect(()=>{
    let cancelled=false;
    const run=async()=>{
      await delay(100);
      check('initial appearance prepared while hidden',values()[0]===1);
      setTarget({romance:0,heist:1,survival:0});
      await delay(100);
      check('paused target waits',values()[0]===1&&values()[1]===0);
      setPlaying(true);
      await delay(250);
      check('resumed appearance interpolates',values()[1]>0&&values()[1]<1);
      setPlaying(false);
      await delay(80);
      const paused=values().join(',');
      await delay(180);
      check('pause freezes displayed appearance',values().join(',')===paused);
      setTarget({romance:0,heist:0,survival:1});
      await delay(80);
      check('interruption preserves displayed appearance',values().join(',')===paused);
      setPlaying(true);
      await delay(1300);
      check('resume reaches new genre',values()[2]===1&&values()[0]===0&&values()[1]===0);
      reduced=true;
      setTarget({romance:.6,heist:0,survival:0});
      await delay(80);
      check('reduced motion settles immediately',values()[0]===.6&&values()[2]===0);
      reduced=false;
      setTarget({romance:0,heist:1,survival:0});
      await delay(250);
      appRoot.unmount();
      const disposed=values().join(',');
      await delay(150);
      check('unmount cancels pending frames',values().join(',')===disposed);
      document.body.dataset.result=cancelled?'passed':'failed';
    };
    void run().catch(error=>{document.body.dataset.result='failed';document.body.dataset.error=String(error);});
    return ()=>{cancelled=true;};
  },[]);
  return null;
}
const appRoot=createRoot(document.getElementById('root')!);
appRoot.render(<Probe />);
