/**
 * Mise en page iPhone / iPad / Mac. L’iPhone (même en paysage) ne passe pas
 * en mode large : seul un iPad, un Mac, ou une fenêtre web large le fait.
 */
export type ShellInput = {
  width: number;
  pad: boolean;
  mac: boolean;
  tv: boolean;
  web: boolean;
};

export type ShellMetrics = {
  wide: boolean;
  contentMax: number;
  sidebar: boolean;
  typeBoost: number;
  keyboard: boolean;
};

export function shellMetrics(input: ShellInput): ShellMetrics {
  if (input.tv) return { wide: false, contentMax: 820, sidebar: false, typeBoost: 1, keyboard: false };
  const wide = (input.pad || input.mac || input.web) && input.width >= 900;
  return {
    wide,
    contentMax: wide ? 1080 : 820,
    sidebar: wide,
    typeBoost: input.mac ? 1.12 : 1,
    keyboard: input.mac || (input.web && input.width >= 900),
  };
}

export type HostFeature = 'haptics' | 'camera' | 'notifications' | 'speech' | 'share';

/** Retourne faux pour ce qui n’existe pas sur le Mac « Designed for iPad », ni sur l’Apple TV. */
export function featureAvailable(feature: HostFeature, host: { mac: boolean; tv: boolean }): boolean {
  if (host.tv) return false;
  if (host.mac && (feature === 'haptics' || feature === 'camera' || feature === 'notifications')) return false;
  return true;
}
