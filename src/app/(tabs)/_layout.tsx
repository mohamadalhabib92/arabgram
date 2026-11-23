import React from 'react';
import type { ColorValue } from 'react-native';
import { Redirect, Tabs } from 'expo-router';
import { useReduceTransparency } from '@/kit/a11y';
import { useTheme } from '@/kit/theme';
import { glassEdge, glassPaint } from '@/kit/verre';
import { Ionicons } from '@/kit/ui';
import { haptic } from '@/kit/haptics';
import { useI18n } from '@/lib/i18n';
import { useShell } from '@/lib/useShell';
import { formatDigits } from '@/kit/format';
import { dueItems, store } from '@/state';
import { useFocus } from '@/kit/focusApp';

export default function TabsLayout() {
  const p = useTheme();
  const { t } = useI18n();
  const onboarded = store.useSelect((s) => s.onboarded);
  const due = store.useSelect((s) => dueItems(s).length);
  const digits = store.useSelect((s) => s.settings.digits);
  const { wide } = useShell();
  const reduceT = useReduceTransparency();
  // Mode Focus : pas de barre d’onglets pendant la session (on reste dans l’écran Focus ou dans le contenu).
  const focusActive = !!useFocus().data.active;
  const edge = glassEdge(p.dark);
  const bar = glassPaint({ dark: p.dark, bg: p.bg, surface: p.surface, reduceTransparency: reduceT });
  if (!onboarded) return <Redirect href="/onboarding" />;
  const icon = (name: React.ComponentProps<typeof Ionicons>['name']) =>
    function TabIcon({ color, size }: { color: ColorValue; size: number }) {
      return <Ionicons name={name} color={color as string} size={size} />;
    };
  return (
    <Tabs
      screenListeners={{ tabPress: () => haptic.select() }}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: p.primary,
        tabBarInactiveTintColor: p.textMuted,
        tabBarStyle:
          wide || focusActive
            ? { display: 'none' as const, height: 0 }
            : {
                backgroundColor: bar,
                borderTopColor: reduceT ? p.border : edge.highlight,
                minHeight: 60,
                elevation: 8,
                shadowColor: p.dark ? '#000000' : '#14241F',
                shadowOpacity: p.dark ? 0.4 : 0.12,
                shadowRadius: 12,
                shadowOffset: { width: 0, height: -4 },
              },
        tabBarLabelStyle: { fontSize: 12 * Math.min(p.fontScale, 1.2), fontWeight: '600' },
      }}
    >
      <Tabs.Screen name="learn" options={{ title: t('learn'), tabBarAccessibilityLabel: t('learn'), tabBarIcon: icon('book') }} />
      <Tabs.Screen name="book" options={{ title: t('book'), tabBarAccessibilityLabel: t('book'), tabBarIcon: icon('library') }} />
      <Tabs.Screen name="review" options={{ title: t('review'), tabBarAccessibilityLabel: t('review'), tabBarIcon: icon('albums'), tabBarBadge: due > 0 ? formatDigits(due, digits) : undefined }} />
      <Tabs.Screen name="pacer" options={{ title: t('pacer'), tabBarAccessibilityLabel: t('pacer'), tabBarIcon: icon('speedometer') }} />
      <Tabs.Screen name="progress" options={{ title: t('progress'), tabBarAccessibilityLabel: t('progress'), tabBarIcon: icon('stats-chart') }} />
      <Tabs.Screen name="settings" options={{ title: t('settings'), tabBarAccessibilityLabel: t('settings'), tabBarIcon: icon('settings') }} />
    </Tabs>
  );
}
