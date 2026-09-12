import { useState } from 'react';
import type { GameState } from '../engine/gameState';
import { HAIR_COLORS } from '../engine/hairColors';
import { EYE_COLORS } from '../engine/eyeColors';
import { SkinToneSlider } from './SkinToneSlider';

export function EmployeeRecord({ game, onSave, onCancel }: {
  game: GameState; onSave: (draft: GameState) => void; onCancel: () => void;
}) {
  const [draft, setDraft] = useState(game);
  return <form className="employee-record" onSubmit={(event) => {
    event.preventDefault();
    if (draft.playerName.trim()) onSave({ ...draft, playerName: draft.playerName.trim() });
  }}>
    <h2>Correct employee record</h2>
    <label>Nameplate name<input required maxLength={40} value={draft.playerName}
      onChange={(e) => setDraft({ ...draft, playerName: e.target.value })} /></label>
    <label>Sex<select value={draft.playerCharacterId ?? 'daniel'} onChange={(e) =>
      setDraft({ ...draft, playerCharacterId: e.target.value as 'daniel' | 'rachel' })}>
      <option value="daniel">Male</option><option value="rachel">Female</option>
    </select></label>
    <SkinToneSlider initialColor={draft.playerSkinColor} onChange={(color) => setDraft({ ...draft, playerSkinColor: color })} />
    <label>Eye color<select value={draft.playerEyeColor} onChange={(e) => setDraft({ ...draft, playerEyeColor: e.target.value })}>
      {EYE_COLORS.map((eye) => <option key={eye.color} value={eye.color}>{eye.label}</option>)}
    </select></label>
    <label>Hair color<select value={draft.playerHairColor} onChange={(e) => {
      const hair = HAIR_COLORS.find((item) => item.color === e.target.value)!;
      setDraft({ ...draft, playerHairColor: hair.color, playerHairAccentColor: hair.accentColor });
    }}>{HAIR_COLORS.map((hair) => <option key={hair.color} value={hair.color}>{hair.label}</option>)}</select></label>
    <button type="submit">Save corrections</button> <button type="button" onClick={onCancel}>Cancel</button>
  </form>;
}
