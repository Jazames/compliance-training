import { useState } from 'react';

const STOPS = [
  { label: 'Pink', color: '#E8A0A8' },
  { label: 'Pale', color: '#F3D9C6' },
  { label: 'Tan', color: '#CFA17E' },
  { label: 'Brown', color: '#805238' },
  { label: 'Black', color: '#211813' },
];

function colorAt(position: number): string {
  const segment = Math.min(3, Math.floor(position / 25));
  const fraction = (position - segment * 25) / 25;
  const channels = [1, 3, 5].map((offset) => {
    const start = parseInt(STOPS[segment].color.slice(offset, offset + 2), 16);
    const end = parseInt(STOPS[segment + 1].color.slice(offset, offset + 2), 16);
    return Math.round(start + (end - start) * fraction).toString(16).padStart(2, '0');
  });
  return '#' + channels.join('');
}

export function SkinToneSlider({ onChange, initialColor = '#CFA17E' }: { onChange: (color: string) => void; initialColor?: string }) {
  const [position, setPosition] = useState(() => {
    let best = 50;
    let distance = Infinity;
    for (let index = 0; index <= 1000; index++) {
      const candidate = colorAt(index / 10);
      const difference = [1, 3, 5].reduce((sum, offset) => sum +
        (parseInt(candidate.slice(offset, offset + 2), 16) - parseInt(initialColor.slice(offset, offset + 2), 16)) ** 2, 0);
      if (difference < distance) { best = index / 10; distance = difference; }
    }
    return best;
  });
  const segment = Math.min(3, Math.floor(position / 25));
  const description = position % 25 === 0
    ? STOPS[position / 25].label
    : `Between ${STOPS[segment].label.toLowerCase()} and ${STOPS[segment + 1].label.toLowerCase()}`;

  return (
    <div className="skin-tone-picker">
      <label htmlFor="skin-tone">The shade that would offend me personally</label>
      <input
        id="skin-tone"
        type="range"
        min={0}
        max={100}
        step={0.1}
        value={position}
        aria-valuetext={description}
        style={{ background: `linear-gradient(to right, ${STOPS.map((stop) => stop.color).join(', ')})` }}
        onChange={(event) => {
          const value = Number(event.target.value);
          setPosition(value);
          onChange(colorAt(value));
        }}
      />
      <div className="skin-tone-labels" aria-hidden="true">
        {STOPS.map((stop) => <span key={stop.label}>{stop.label}</span>)}
      </div>
    </div>
  );
}
