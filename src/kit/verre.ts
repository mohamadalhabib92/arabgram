import { contrast, mix } from './contrast';

/**
 * Verre — jetons partagés. Les surfaces sont un voile translucide sur le fond.
 * « Réduire la transparence » remplace le voile par la surface pleine.
 * Les glyphes restent sur une couleur dont le contraste est testé (verre plein équivalent).
 */

export const SPACE = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
} as const;

/** Tailles avant Dynamic Type (`fontScale`) et avant le bonus Mac. */
export const TYPE_SCALE = {
  display: 32,
  h1: 24,
  h2: 19,
  h3: 16,
  body: 15,
  small: 13,
  caption: 11.5,
  label: 12,
  mono: 13,
} as const;

export const GLASS = {
  lightVeil: '#FFFFFF',
  phoneLight: 0.78,
  phoneDark: 0.92,
  tv: 0.96,
  /** Lavis derrière les cartes : assez faible pour garder les encres d’unité en AA. */
  washLight: 0.12,
  washDark: 0.05,
} as const;

export function glassAlpha(dark: boolean, tv: boolean): number {
  if (tv) return GLASS.tv;
  return dark ? GLASS.phoneDark : GLASS.phoneLight;
}

export function rgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '').slice(0, 6);
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const a = Math.max(0, Math.min(1, alpha));
  return `rgba(${r},${g},${b},${a})`;
}

/** Couleur pleine équivalente au voile, pour le contraste et le repli opaque. */
export function glassSolid(opts: {
  dark: boolean;
  bg: string;
  surface: string;
  reduceTransparency: boolean;
  tv?: boolean;
  behind?: string;
}): string {
  if (opts.reduceTransparency) return opts.surface;
  const veil = opts.dark ? opts.surface : GLASS.lightVeil;
  return mix(veil, opts.behind ?? opts.bg, glassAlpha(opts.dark, !!opts.tv));
}

/** Fond peint : voile translucide, ou surface pleine si la transparence est réduite. */
export function glassPaint(opts: {
  dark: boolean;
  bg: string;
  surface: string;
  reduceTransparency: boolean;
  tv?: boolean;
}): string {
  if (opts.reduceTransparency) return opts.surface;
  const veil = opts.dark ? opts.surface : GLASS.lightVeil;
  return rgba(veil, glassAlpha(opts.dark, !!opts.tv));
}

export function glassEdge(dark: boolean): { border: string; highlight: string } {
  return dark
    ? { border: 'rgba(255,255,255,0.16)', highlight: 'rgba(255,255,255,0.34)' }
    : { border: 'rgba(255,255,255,0.92)', highlight: 'rgba(255,255,255,0.98)' };
}

export function washPaint(color: string, dark: boolean): string {
  return rgba(color, dark ? GLASS.washDark : GLASS.washLight);
}

type Shadow = {
  shadowColor: string;
  shadowOpacity: number;
  shadowRadius: number;
  shadowOffset: { width: number; height: number };
  elevation: number;
  boxShadow: string;
};

function reliefShadow(dark: boolean, pressed: boolean, soft: boolean): Shadow {
  const color = dark ? '#000000' : '#14241F';
  if (pressed) {
    return {
      shadowColor: color,
      shadowOpacity: dark ? 0.4 : 0.14,
      shadowRadius: 2,
      shadowOffset: { width: 0, height: 1 },
      elevation: 1,
      boxShadow: dark
        ? 'inset 0 2px 4px rgba(0,0,0,0.45), 0 1px 0 rgba(0,0,0,0.4)'
        : 'inset 0 2px 3px rgba(20,36,31,0.18), 0 1px 0 rgba(20,36,31,0.2)',
    };
  }
  return {
    shadowColor: color,
    shadowOpacity: soft ? (dark ? 0.35 : 0.1) : dark ? 0.48 : 0.18,
    shadowRadius: soft ? 18 : 8,
    shadowOffset: { width: 0, height: soft ? 10 : pressed ? 1 : 4 },
    elevation: soft ? 4 : 7,
    boxShadow: dark
      ? 'inset 0 1px 0 rgba(255,255,255,0.28), 0 2px 0 rgba(0,0,0,0.45), 0 12px 24px rgba(0,0,0,0.4)'
      : 'inset 0 1px 0 rgba(255,255,255,0.9), 0 2px 0 rgba(20,36,31,0.16), 0 10px 20px rgba(20,36,31,0.14)',
  };
}

export function panelChrome(opts: {
  dark: boolean;
  bg: string;
  surface: string;
  border: string;
  radius: number;
  reduceTransparency: boolean;
  tv?: boolean;
}): {
  backgroundColor: string;
  borderWidth: number;
  borderColor: string;
  borderTopColor: string;
  borderRadius: number;
} & Shadow {
  const edge = glassEdge(opts.dark);
  const sh = reliefShadow(opts.dark, false, true);
  if (opts.reduceTransparency) {
    return {
      backgroundColor: opts.surface,
      borderWidth: 1,
      borderColor: opts.border,
      borderTopColor: opts.border,
      borderRadius: opts.radius,
      ...sh,
      shadowOpacity: opts.dark ? 0.25 : 0.06,
      elevation: 1,
      boxShadow: '0 1px 0 rgba(0,0,0,0.08)',
    };
  }
  return {
    backgroundColor: glassPaint(opts),
    borderWidth: 1,
    borderColor: edge.border,
    borderTopColor: edge.highlight,
    borderRadius: opts.radius,
    ...sh,
  };
}

/**
 * Bouton en relief : arête claire, lèvre sombre, ombre double.
 * L’enfoncement réduit la lèvre et translate le bouton. Le texte reste sur `face`.
 */
export function buttonChrome(opts: {
  face: string;
  pressed: boolean;
  dark: boolean;
  flat?: boolean;
  disabled?: boolean;
  ring?: string | null;
}): {
  backgroundColor: string;
  borderTopWidth: number;
  borderTopColor: string;
  borderBottomWidth: number;
  borderBottomColor: string;
  borderLeftWidth: number;
  borderRightWidth: number;
  borderLeftColor: string;
  borderRightColor: string;
  transform: { translateY: number }[];
} & Shadow {
  const pressed = !!opts.pressed && !opts.disabled;
  const lip = mix(opts.face, '#000000', 0.62);
  const highlight = mix(opts.face, '#FFFFFF', opts.dark ? 0.35 : 0.5);
  const sh = reliefShadow(opts.dark, pressed, false);
  if (opts.ring) sh.boxShadow = `${sh.boxShadow}, 0 0 0 2px ${opts.ring}`;
  if (opts.flat) {
    return {
      backgroundColor: pressed ? rgba(opts.face, 0.1) : 'transparent',
      borderTopWidth: 1,
      borderTopColor: pressed ? highlight : 'transparent',
      borderBottomWidth: 1,
      borderBottomColor: 'transparent',
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      transform: [{ translateY: 0 }],
      ...sh,
      shadowOpacity: 0,
      elevation: 0,
      boxShadow: opts.ring ? `0 0 0 2px ${opts.ring}` : 'none',
    };
  }
  if (opts.disabled) {
    return {
      backgroundColor: opts.face,
      borderTopWidth: 1,
      borderTopColor: highlight,
      borderBottomWidth: 1,
      borderBottomColor: lip,
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderLeftColor: lip,
      borderRightColor: lip,
      transform: [{ translateY: 0 }],
      ...sh,
      shadowOpacity: 0,
      elevation: 0,
      boxShadow: 'none',
    };
  }
  return {
    backgroundColor: pressed ? mix(opts.face, '#000000', 0.88) : opts.face,
    borderTopWidth: 1,
    borderTopColor: pressed ? mix(highlight, '#000000', 0.8) : highlight,
    borderBottomWidth: pressed ? 1 : 3,
    borderBottomColor: lip,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderLeftColor: lip,
    borderRightColor: lip,
    transform: [{ translateY: pressed ? 2 : 0 }],
    ...sh,
  };
}

/** Vrai si le fond est sombre (pour choisir l’ombre sans connaître le thème). */
export function isDarkHex(hex: string): boolean {
  return contrast('#FFFFFF', hex) >= contrast('#000000', hex);
}
