import React, { useEffect } from 'react';
import { Platform, StyleSheet, View, type ViewProps } from 'react-native';
import { router } from 'expo-router';
import { requireNativeViewManager } from 'expo-modules-core';
import { activateKeyTarget, focusSearch, hasSearch, moveKeyTarget } from '@/lib/keys';
import { isIosAppOnMac } from '@/lib/mac';
import { useShell } from '@/lib/useShell';

type KeyPayload = { nativeEvent?: { key?: string }; key?: string };

function readKey(event: KeyPayload): string {
  return event.nativeEvent?.key ?? event.key ?? '';
}

function applyKey(key: string, shift = false) {
  if (key === 'escape') {
    if (router.canGoBack()) router.back();
    return;
  }
  if (key === 'find') {
    focusSearch();
    return;
  }
  if (key === 'up' || key === 'left' || (key === 'tab' && shift)) moveKeyTarget(-1);
  else if (key === 'down' || key === 'right' || key === 'tab') moveKeyTarget(1);
  else if (key === 'enter' || key === 'space') activateKeyTarget();
}

let NativeKey: React.ComponentType<ViewProps & { onKey?: (event: KeyPayload) => void }> | null | undefined;

function nativeKeyView() {
  if (NativeKey !== undefined) return NativeKey;
  if (Platform.OS !== 'ios') {
    NativeKey = null;
    return null;
  }
  try {
    NativeKey = requireNativeViewManager('MacHost');
  } catch {
    NativeKey = null;
  }
  return NativeKey;
}

/** Raccourcis Mac (et clavier d’une fenêtre web large). Le module natif ne s’active pas sur iPhone. */
export function MacKeyboard({ children }: { children: React.ReactNode }) {
  const { keyboard } = useShell();
  const mac = isIosAppOnMac();

  useEffect(() => {
    if (!keyboard || Platform.OS !== 'web' || typeof document === 'undefined') return;
    const onKey = (event: KeyboardEvent) => {
      const metaF = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'f';
      if (metaF) {
        if (!hasSearch()) return;
        event.preventDefault();
        applyKey('find');
        return;
      }
      const node = event.target as HTMLElement | null;
      const typing = !!node && (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA' || node.isContentEditable);
      if (typing) return;
      if (event.key === 'Escape') applyKey('escape');
      else if (event.key === 'ArrowUp') applyKey('up');
      else if (event.key === 'ArrowDown') applyKey('down');
      else if (event.key === 'ArrowLeft') applyKey('left');
      else if (event.key === 'ArrowRight') applyKey('right');
      else if (event.key === 'Tab') {
        event.preventDefault();
        applyKey('tab', event.shiftKey);
      } else if (event.key === 'Enter') applyKey('enter');
      else if (event.key === ' ') applyKey('space');
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [keyboard]);

  if (!mac) return <View style={styles.fill}>{children}</View>;
  const Catcher = nativeKeyView();
  if (!Catcher) return <View style={styles.fill}>{children}</View>;
  return (
    <Catcher style={styles.fill} onKey={(event) => applyKey(readKey(event))}>
      {children}
    </Catcher>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
