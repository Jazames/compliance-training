import { shirtPalette, type PlayerAppearance } from '../engine/playerAppearance';

/** Geometry stays in the shared asset; colors come from the outgoing rig snapshot. */
export function ShirtProp({ appearance, className }: { appearance: PlayerAppearance; className?: string }) {
  const colors = shirtPalette(appearance);
  const source = `${import.meta.env.BASE_URL}props/shirt.svg`;
  return <svg className={className} viewBox="0 0 180 190" aria-hidden="true" focusable="false">
    <use href={`${source}#${appearance.topId === 2 ? 'tshirt-body' : 'shirt-body'}`} fill={colors.primary} stroke={colors.primary} />
    {appearance.topId !== 2 ? <>
      <use href={`${source}#shirt-collar`} fill={colors.primary} style={{ filter: 'brightness(1.18)' }} />
      <use href={`${source}#shirt-seam`} stroke={appearance.topId === 1 ? colors.secondary : colors.primary} style={{ filter: 'brightness(.7)' }} />
    </> : null}
    {appearance.topId === 1 ? <>
      <path d="M72 22h36L90 111z" fill={colors.secondary} />
      {appearance.artboard === 'generic-man' ? <path d="M86 30h8l4 57-8 12-8-12z" fill={colors.accent} /> : null}
    </> : null}
    <use href={`${source}#shirt-stain`} fill="#efbd15" />
  </svg>;
}
