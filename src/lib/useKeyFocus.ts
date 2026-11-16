import { useEffect, useRef, useState } from 'react';
import { bindKeyTarget } from '@/lib/keys';
import { useShell } from '@/lib/useShell';

/** Anneau clavier sur Mac et sur une fenêtre web large. Inerte sur iPhone. */
export function useKeyFocus(enabled: boolean, onPress?: () => void): boolean {
  const { keyboard } = useShell();
  const press = useRef(onPress);
  press.current = onPress;
  const [focused, setFocused] = useState(false);
  useEffect(() => {
    if (!keyboard || !enabled || !onPress) return;
    return bindKeyTarget(() => press.current?.(), setFocused);
  }, [keyboard, enabled, Boolean(onPress)]);
  return keyboard && focused;
}
