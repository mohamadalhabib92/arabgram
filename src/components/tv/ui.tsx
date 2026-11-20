import React, { createContext, useContext, useRef, useState } from 'react';
import { Platform, Pressable, ScrollView, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import * as ReactNative from 'react-native';
import { useReduceTransparency } from '@/kit/a11y';
import { mix } from '@/kit/contrast';
import { useTheme } from '@/kit/theme';
import { panelChrome } from '@/kit/verre';
import { arabicFamily } from '@/lib/fonts';

const TvOn = createContext(false);

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
  const on = useContext(TvOn);
  return <Text style={{ color: on ? theme.primaryText : theme.text, fontSize: 48, fontWeight: '800', letterSpacing: -0.4 }}>{children}</Text>;
}

export function TvMuted({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const on = useContext(TvOn);
  const color = on ? mix(theme.primaryText, theme.primary, 0.82) : theme.textMuted;
  return <Text style={{ color, fontSize: 26, lineHeight: 36, marginTop: 10 }}>{children}</Text>;
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
  const reduceT = useReduceTransparency();
  const [focused, setFocused] = useState(false);
  const y = useRef(0);
  const scroll = useContext(ScrollTo);
  const panel = panelChrome({
    dark: theme.dark,
    bg: theme.bg,
    surface: theme.surface,
    border: theme.border,
    radius: 22,
    reduceTransparency: reduceT,
    tv: true,
  });
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
          paddingHorizontal: 28,
          paddingVertical: 18,
          justifyContent: 'center',
          opacity: 1,
          transform: [{ scale: focused && !theme.reduceMotion ? 1.08 : 1 }],
          ...(focused
            ? {
                backgroundColor: theme.primary,
                borderWidth: 6,
                borderColor: theme.accent,
                borderTopColor: theme.accent,
                shadowColor: theme.primary,
                shadowOpacity: 0.85,
                shadowRadius: 22,
                shadowOffset: { width: 0, height: 0 },
                elevation: 8,
              }
            : panel),
        },
        style,
      ]}
    >
      <TvOn.Provider value={focused}>{typeof children === 'function' ? children(focused) : children}</TvOn.Provider>
    </Pressable>
  );
}
