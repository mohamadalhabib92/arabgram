import type { Palette } from '@/kit/theme';

/** ArabGram — sable, émeraude et or. Variantes sombre et contraste élevé. */
const light: Palette = {
  bg: '#FBF7EF',
  surface: '#FFFFFF',
  surface2: '#F1EADB',
  border: '#E3D8C3',
  text: '#1E2622',
  textMuted: '#59625C',
  primary: '#0E6B5C',
  primaryText: '#FFFFFF',
  accent: '#9A6B1C',
  success: '#2E7D4F',
  warning: '#A86A12',
  danger: '#B42318',
  info: '#2B5FA8',
  dark: false,
  radius: 16,
  fontScale: 1,
};

const dark: Palette = {
  bg: '#0F1715',
  surface: '#17221F',
  surface2: '#1F2D29',
  border: '#2C3D38',
  text: '#EEF3EF',
  textMuted: '#A7B5AF',
  primary: '#3FB59E',
  primaryText: '#06231D',
  accent: '#E0B45E',
  success: '#4CC38A',
  warning: '#E6A23C',
  danger: '#F2726A',
  info: '#79A8F2',
  dark: true,
  radius: 16,
  fontScale: 1,
};

const lightHC: Palette = {
  ...light,
  bg: '#FFFFFF',
  surface: '#FFFFFF',
  surface2: '#EDEDED',
  border: '#1A1A1A',
  text: '#000000',
  textMuted: '#2B2B2B',
  primary: '#00473C',
  accent: '#6B4500',
  success: '#0B5D2E',
  danger: '#8A0F06',
};

const darkHC: Palette = {
  ...dark,
  bg: '#000000',
  surface: '#0A0A0A',
  surface2: '#1C1C1C',
  border: '#F5F5F5',
  text: '#FFFFFF',
  textMuted: '#E6E6E6',
  primary: '#6FE3CB',
  primaryText: '#000000',
  accent: '#FFD27A',
};

export function makePalette(opts: { dark: boolean; contrast: boolean; scale: number }): Palette {
  const base = opts.dark ? (opts.contrast ? darkHC : dark) : opts.contrast ? lightHC : light;
  return { ...base, fontScale: opts.scale };
}

export const SPLASH_BG = '#0E4D45';
export const UNIT_COLORS = ['#0E6B5C', '#2B5FA8', '#7B3FA0', '#B0472B', '#9A6B1C', '#1F7A8C', '#2E7D4F', '#A3376B', '#4D5BB5', '#6B5B2E', '#0B5D73'];
