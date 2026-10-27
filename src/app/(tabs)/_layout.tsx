import React from 'react';
import type { ColorValue } from 'react-native';
import { Redirect, Tabs } from 'expo-router';
import { useTheme } from '@/kit/theme';
import { Ionicons } from '@/kit/ui';
import { useI18n } from '@/lib/i18n';
import { dueItems, store } from '@/state';

export default function TabsLayout() {
  const p = useTheme();
  const { t } = useI18n();
  const onboarded = store.useSelect((s) => s.onboarded);
  const due = store.useSelect((s) => dueItems(s).length);
  if (!onboarded) return <Redirect href="/onboarding" />;
  const icon = (name: React.ComponentProps<typeof Ionicons>['name']) =>
    function TabIcon({ color, size }: { color: ColorValue; size: number }) {
      return <Ionicons name={name} color={color as string} size={size} />;
    };
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: p.primary,
        tabBarInactiveTintColor: p.textMuted,
        tabBarStyle: { backgroundColor: p.surface, borderTopColor: p.border, minHeight: 60 },
        tabBarLabelStyle: { fontSize: 12 * Math.min(p.fontScale, 1.2), fontWeight: '600' },
      }}
    >
      <Tabs.Screen name="learn" options={{ title: t('learn'), tabBarAccessibilityLabel: t('learn'), tabBarIcon: icon('book') }} />
      <Tabs.Screen name="review" options={{ title: t('review'), tabBarAccessibilityLabel: t('review'), tabBarIcon: icon('albums'), tabBarBadge: due > 0 ? due : undefined }} />
      <Tabs.Screen name="pacer" options={{ title: t('pacer'), tabBarAccessibilityLabel: t('pacer'), tabBarIcon: icon('speedometer') }} />
      <Tabs.Screen name="progress" options={{ title: t('progress'), tabBarAccessibilityLabel: t('progress'), tabBarIcon: icon('stats-chart') }} />
      <Tabs.Screen name="settings" options={{ title: t('settings'), tabBarAccessibilityLabel: t('settings'), tabBarIcon: icon('settings') }} />
    </Tabs>
  );
}
