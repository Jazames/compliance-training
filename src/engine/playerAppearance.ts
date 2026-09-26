import type { GameState } from './gameState';
import { resolveWardrobe } from '../rive/wardrobe';

export interface PlayerClothing {
  topId: number;
  bottomId: number;
  outfitPrimaryColor: string;
  pantsColor: string;
  suitColor: string;
  outfitSecondaryColor: string;
  outfitAccentColor: string;
  undershirtColor: string;
}

export function defaultClothing(character: GameState['playerCharacterId']): PlayerClothing {
  return { topId: 0, bottomId: 0,
    outfitPrimaryColor: character === 'rachel' ? '#86658F' : '#438F98',
    pantsColor: '#344454', suitColor: character === 'rachel' ? '#495169' : '#344454',
    outfitSecondaryColor: character === 'rachel' ? '#E9E4E7' : '#E9ECE9',
    outfitAccentColor: '#94705A', undershirtColor: '#D27B59' };
}

/** One resolved visual contract for ordinary scenes, staged actions and props. */
export function getPlayerAppearance(state: GameState) {
  const artboard = state.playerCharacterId === 'rachel' ? 'generic-woman' : 'generic-man';
  const clothing = state.playerClothing ?? defaultClothing(state.playerCharacterId);
  return {
    ...clothing, ...resolveWardrobe(artboard, clothing.topId, clothing.bottomId),
    artboard: artboard as 'generic-man' | 'generic-woman', name: state.playerName,
    skinColor: state.playerSkinColor, eyeColor: state.playerEyeColor,
    hairColor: state.playerHairColor, hairAccentColor: state.playerHairAccentColor,
    appearanceBlend: state.meters.romanceDrift,
  };
}
export type PlayerAppearance = ReturnType<typeof getPlayerAppearance>;

export function revealUndershirt<T extends PlayerClothing>(appearance: T): T {
  return { ...appearance, topId: 2, outfitPrimaryColor: appearance.undershirtColor };
}

export function shirtPalette(appearance: PlayerClothing) {
  return { primary: appearance.topId === 1 ? appearance.suitColor : appearance.outfitPrimaryColor,
    secondary: appearance.outfitSecondaryColor, accent: appearance.outfitAccentColor };
}
