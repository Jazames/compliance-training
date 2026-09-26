import { useEffect, useRef, useState } from 'react';
import type { GameState } from '../engine/gameState';
import { EmployeeRecord } from './EmployeeRecord';

// New labels are verbatim words supplied in the user's menu request.
// EmployeeRecord retains its existing legacy copy unchanged.
export function CourseMenu({ game, open, onOpenChange, arachnophobia, onToggle, onSave }: {
  game: GameState;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  arachnophobia: boolean;
  onToggle: () => void;
  onSave: (draft: GameState) => void;
}) {
  const [selectedTab, setTab] = useState('main');
  const tab = game.playerCharacterId ? selectedTab : 'main';
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const dismiss = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) onOpenChange(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onOpenChange(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener('pointerdown', dismiss);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', dismiss);
      document.removeEventListener('keydown', escape);
    };
  }, [open, onOpenChange]);
  return <div className="course-menu" ref={root}>
    <button ref={trigger} type="button" className="menu-trigger" aria-label="menu"
      aria-expanded={open} aria-controls="course-menu-panel" onClick={() => onOpenChange(!open)}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 6h14M5 12h14M5 18h14" /></svg>
    </button>
    {open ? <div id="course-menu-panel" className="menu-panel">
      <div role="tablist" aria-label="menu" className="menu-tabs">
        {['main', 'character'].map((name, index) => <button key={name} type="button"
          id={`menu-tab-${name}`} role="tab" aria-selected={tab === name}
          disabled={name === 'character' && !game.playerCharacterId}
          aria-controls={`menu-panel-${name}`} tabIndex={tab === name ? 0 : -1}
          onClick={() => setTab(name)} onKeyDown={(event) => {
            if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
            event.preventDefault();
            const next = event.key === 'Home' ? 'main' : event.key === 'End' ? 'character' : ['main', 'character'][1 - index];
            if (next === 'character' && !game.playerCharacterId) return;
            setTab(next);
            document.getElementById(`menu-tab-${next}`)?.focus();
          }}>{name}</button>)}
      </div>
      <div role="tabpanel" id={`menu-panel-${tab}`} aria-labelledby={`menu-tab-${tab}`}>
        {tab === 'main' ? <label className="arachnophobia-setting">
          <span>arachnophobia</span>
          <input type="checkbox" role="switch" checked={arachnophobia} onChange={onToggle} />
        </label> : <EmployeeRecord game={game} onCancel={() => {
          onOpenChange(false); trigger.current?.focus();
        }} onSave={(draft) => {
          onSave(draft); onOpenChange(false); trigger.current?.focus();
        }} />}
      </div>
    </div> : null}
  </div>;
}
