import { useEffect, useState } from 'react';
import { RiveCharacter } from '../rive/RiveCharacter';
import { SceneProp } from './SceneProp';
import type { SceneDef } from '../engine/sceneTypes';
import './mustard-stage.css';
import { revealUndershirt, type PlayerAppearance } from '../engine/playerAppearance';
import { ShirtProp } from './ShirtProp';

interface Props {
  player: PlayerAppearance;
  action: NonNullable<SceneDef['mustardAction']>;
  entryActive: boolean;
}

const coworkers = [
  { artboard: 'generic-man', skin: '#B98260', hair: '#393331', shirt: '#847665' },
  { artboard: 'generic-woman', skin: '#E7B997', hair: '#6C382A', shirt: '#638271' },
  { artboard: 'generic-man', skin: '#724A35', hair: '#22202A', shirt: '#7388B8' },
  { artboard: 'generic-woman', skin: '#D2A686', hair: '#C8AD77', shirt: '#B8796D' },
] as const;

export function MustardStage(props: Props) {
  // Keep the outgoing shirt fixed while the live rig reveals the layer beneath it.
  const [outgoing] = useState(() => ({ ...props.player }));
  const [changed, setChanged] = useState(false);
  const [conversation, setConversation] = useState(-1);
  useEffect(() => {
    const timers: number[] = [];
    if (props.action === 'remove') timers.push(window.setTimeout(() => setChanged(true), 1100));
    if (props.action === 'montage') {
      for (let index = 0; index < 4; index++) {
        timers.push(window.setTimeout(() => setConversation(index), 1800 + index * 2000));
      }
    }
    return () => timers.forEach(window.clearTimeout);
  }, [props.action]);
  const partner = conversation >= 0 ? coworkers[conversation] : undefined;
  const action = props.action === 'leave' ? 'walk' : props.action === 'montage' ? 'talk'
    : props.action === 'remove' || (props.action === 'spill' && props.entryActive) ? 'interact' : 'idle';

  return <div className={`mustard-stage mustard-stage--${props.action}${changed ? ' is-changed' : ''}${partner ? ' is-montage' : ''}`}
    data-conversation={conversation} aria-hidden="true">
    <div className="kitchen-cabinets" /><div className="kitchen-counter" /><div className="kitchen-sink" />
    <div className="kitchen-door" />
    {!partner ? <>
      <div className="kitchen-chair kitchen-chair--man" /><div className="kitchen-chair kitchen-chair--woman" />
      <div className="kitchen-observer kitchen-observer--man">
        <RiveCharacter artboard="generic-man" name="" side="right" action="idle" seated
          appearanceBlend={0} outfitPrimaryColor="#85745F" hairColor="#80776F" />
      </div>
      <div className="kitchen-observer kitchen-observer--woman">
        <RiveCharacter artboard="generic-woman" name="" side="right" action="idle" seated
          appearanceBlend={0} outfitPrimaryColor="#687968" hairColor="#583629" />
      </div>
      <div className="kitchen-background-table" />
    </> : <div key={conversation} className="mustard-conversation-partner">
      <RiveCharacter artboard={partner.artboard} name="" side="right" action="talk"
        appearanceBlend={0} skinColor={partner.skin} hairColor={partner.hair} outfitPrimaryColor={partner.shirt} />
    </div>}
    <div className="mustard-player">
      <RiveCharacter {...(changed ? revealUndershirt(props.player) : props.player)} side="left" action={action} />
      <svg className="mustard-stain" viewBox="0 0 500 800" focusable="false">
        <path d="M270 353q-15-8-18 5t14 11q15-3 8 11t10 4q9-7-3-18t-11-13" fill="#F2C51B" stroke="#CCA10F" strokeWidth="2" />
      </svg>
      {props.action === 'spill' ? <>
        <SceneProp name="mustard-bottle" className="mustard-bottle" />
        <svg className="mustard-stream" viewBox="0 0 500 800" focusable="false">
          <path d="M389 420 Q415 285 270 358" pathLength="100" fill="none" stroke="#F2C51B" strokeWidth="9" strokeLinecap="round" />
        </svg>
      </> : null}
      {props.action === 'remove' ? <ShirtProp appearance={outgoing} className="mustard-removable-shirt" /> : null}
    </div>
    {!partner ? <div className="kitchen-food-table"><SceneProp name="hotdog" className="mustard-hotdog" /></div> : null}
    {partner ? <div key={conversation} className="mustard-montage-cut" /> : null}
  </div>;
}
