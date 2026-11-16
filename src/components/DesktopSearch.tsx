import React, { useCallback, useRef } from 'react';
import { TextInput } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useTheme } from '@/kit/theme';
import { registerSearch } from '@/lib/keys';
import { useShell } from '@/lib/useShell';

/** Champ de recherche visible seulement hors iPhone. Cmd+F le prend quand l’écran est devant. */
export function DesktopSearch({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) {
  const shell = useShell();
  const t = useTheme();
  const node = useRef<React.ComponentRef<typeof TextInput>>(null);
  useFocusEffect(
    useCallback(() => {
      if (!shell.keyboard) return;
      return registerSearch(() => node.current?.focus());
    }, [shell.keyboard]),
  );
  if (!shell.keyboard) return null;
  return (
    <TextInput
      ref={node}
      value={value}
      onChangeText={onChange}
      placeholder={placeholder}
      placeholderTextColor={t.textMuted}
      accessibilityLabel={placeholder}
      autoCorrect={false}
      clearButtonMode="while-editing"
      style={{
        minHeight: 48,
        borderRadius: t.radius,
        borderWidth: 1,
        borderColor: t.border,
        backgroundColor: t.surface,
        color: t.text,
        paddingHorizontal: 14,
        fontSize: 16 * t.fontScale,
      }}
    />
  );
}
