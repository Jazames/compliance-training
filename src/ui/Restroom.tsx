/** A non-graphic training diagram: occupied fixture is unavailable. */
export function Restroom({ male }: { male: boolean }) {
  return <div className="restroom-diagram" aria-label={male ? 'Four urinals; the first is occupied' : 'Four stalls; feet are visible under the first'}>
    {[0, 1, 2, 3].map((index) => <div key={index}>
      <svg viewBox="0 0 120 170" role="img" aria-label={index === 0 ? 'Occupied by coworker' : `Available ${male ? 'urinal' : 'stall'} ${index}`}>
        {male ? <>
          <path d="M32 30 H88 V115 Q60 150 32 115 Z" fill="#eef4f6" stroke="#647880" strokeWidth="3" />
          {index === 0 ? <g><circle cx="60" cy="25" r="14" fill="#bd9479" />
            <path d="M36 45 H84 L89 108 H31 Z" fill="#4d6479" />
            <path d="M43 108 V160 M77 108 V160" stroke="#293843" strokeWidth="16" /></g> : null}
        </> : <>
          <path d="M10 10 V160 M110 10 V160 M10 12 H110" stroke="#637a85" strokeWidth="5" />
          <path d="M16 16 H104 V132 H16 Z" fill="#c2d2d9" stroke="#637a85" strokeWidth="2" />
          <circle cx="90" cy="80" r="4" fill="#637a85" />
          {index === 0 ? <path d="M35 145 h18 v15 H30 Z M68 145 h18 l5 15 H68 Z" fill="#293843" /> : null}
        </>}
      </svg>
      <span>{index === 0 ? 'Occupied' : index === 1 ? 'Neighboring' : index === 2 ? 'One space away' : 'Farthest'}</span>
    </div>)}
  </div>;
}
