import React, { createContext, useContext, useRef, useState } from 'react';
import { Platform, Pressable, ScrollView, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import * as ReactNative from 'react-native';
import { useTheme } from '@/kit/theme';
import { arabicFamily } from '@/lib/fonts';

/** Marges sûres à 1920×1080 : ~90 px sur les côtés, ~60 px en haut et en bas. */
export const TV_SAFE = { paddingHorizontal: 90, paddingTop: 60, paddingBottom: 60 };

const ScrollTo = createContext<(y: number) => void>(() => {});

function Guide({ children }: { children: React.ReactNode }) {
  const TVFocusGuideView = (ReactNative as unknown as { TVFocusGuideView?: React.ComponentType<{ autoFocus?: boolean; style?: ViewStyle; children?: React.ReactNode }> }).TVFocusGuideView;
  if (Platform.isTV && TVFocusGuideView) {
    return (
      <TVFocusGuideView autoFocus style={{ flex: 1 }}>
        {children}
      </TVFocusGuideView>
    );
  }
  return <View style={{ flex: 1 }}>{children}</View>;
}

export function TvScreen({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const scroll = useRef<{ scrollTo: (opts: { y: number; animated?: boolean }) => void } | null>(null);
  return (
    <Guide>
      <ScrollTo.Provider value={(y) => scroll.current?.scrollTo({ y: Math.max(0, y - 80), animated: !theme.reduceMotion })}>
        <ScrollView ref={scroll as never} style={{ flex: 1, backgroundColor: theme.bg }} contentContainerStyle={TV_SAFE}>
          {children}
        </ScrollView>
      </ScrollTo.Provider>
    </Guide>
  );
}

export function TvTitle({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  return <Text style={{ color: theme.text, fontSize: 48, fontWeight: '800', letterSpacing: -0.4 }}>{children}</Text>;
}

export function TvMuted({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  return <Text style={{ color: theme.textMuted, fontSize: 26, lineHeight: 36, marginTop: 10 }}>{children}</Text>;
}

export function TvArabic({ children, size = 56 }: { children: string; size?: number }) {
  const theme = useTheme();
  return (
    <Text
      accessibilityLanguage="ar"
      // @ts-ignore lang web
      lang="ar"
      style={{
        fontFamily: arabicFamily(),
        writingDirection: 'rtl',
        textAlign: 'center',
        color: theme.text,
        fontSize: size,
        lineHeight: Math.round(size * 1.85),
        fontWeight: '600',
      }}
    >
      {children}
    </Text>
  );
}

/**
 * Un seul habillage de focus pour toute la télé :
 * fond clair ou bord épais, échelle 1,08, halo, texte contrasté.
 * Sans focus, la tuile est plus sombre.
 */
export function TvFocus({
  label,
  onPress,
  preferred,
  children,
  style,
}: {
  label: string;
  onPress: () => void;
  preferred?: boolean;
  children: React.ReactNode | ((focused: boolean) => React.ReactNode);
  style?: StyleProp<ViewStyle>;
}) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);
  const y = useRef(0);
  const scroll = useContext(ScrollTo);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: focused }}
      hasTVPreferredFocus={preferred}
      onFocus={() => {
        setFocused(true);
        scroll(y.current);
      }}
      onBlur={() => setFocused(false)}
      onLayout={(event) => {
        y.current = event.nativeEvent.layout.y;
      }}
      onPress={onPress}
      style={[
        {
          minHeight: 88,
          borderRadius: 22,
          paddingHorizontal: 28,
          paddingVertical: 18,
          justifyContent: 'center',
          opacity: focused ? 1 : 0.72,
          transform: [{ scale: focused ? 1.08 : 1 }],
          backgroundColor: focused ? theme.primary : theme.surface,
          borderWidth: focused ? 6 : 2,
          borderColor: focused ? theme.accent : theme.border,
          shadowColor: theme.primary,
          shadowOpacity: focused ? 0.85 : 0,
          shadowRadius: focused ? 22 : 0,
          shadowOffset: { width: 0, height: 0 },
        },
        style,
      ]}
    >
      {typeof children === 'function' ? children(focused) : children}
    </Pressable>
  );
}
