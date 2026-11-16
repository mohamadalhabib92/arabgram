import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { router, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/kit/theme';
import { Ionicons, T } from '@/kit/ui';
import { useI18n } from '@/lib/i18n';
import { useKeyFocus } from '@/lib/useKeyFocus';
import { dueItems, store } from '@/state';

const LINKS = [
  { href: '/learn', key: 'learn', icon: 'book' },
  { href: '/book', key: 'book', icon: 'library' },
  { href: '/review', key: 'review', icon: 'albums' },
  { href: '/pacer', key: 'pacer', icon: 'speedometer' },
  { href: '/progress', key: 'progress', icon: 'stats-chart' },
  { href: '/settings', key: 'settings', icon: 'settings' },
] as const;

function SideLink({ href, label, icon, active, badge }: { href: string; label: string; icon: (typeof LINKS)[number]['icon']; active: boolean; badge?: number }) {
  const p = useTheme();
  const go = () => router.push(href as '/learn');
  const focused = useKeyFocus(true, go);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={label}
      onPress={go}
      style={(state) => ({
        minHeight: 48,
        paddingHorizontal: 14,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: active ? p.primary : state.pressed || Boolean((state as { hovered?: boolean }).hovered) || focused ? p.surface2 : 'transparent',
        borderWidth: focused ? 2 : 0,
        borderColor: p.accent,
      })}
    >
      <Ionicons name={icon} size={20} color={active ? p.primaryText : p.text} />
      <T v="body" color={active ? p.primaryText : p.text} style={{ fontWeight: '700', flex: 1 }}>
        {label}
      </T>
      {badge ? (
        <T v="caption" color={active ? p.primaryText : p.primary}>
          {badge}
        </T>
      ) : null}
    </Pressable>
  );
}

/** Colonne de navigation sur iPad large, Mac et fenêtre web large. */
export function AppSidebar() {
  const p = useTheme();
  const insets = useSafeAreaInsets();
  const path = usePathname();
  const { t } = useI18n();
  const due = store.useSelect((s) => dueItems(s).length);
  return (
    <View style={[styles.side, { backgroundColor: p.surface, borderEndColor: p.border, paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 }]}>
      <T v="h2" style={{ paddingHorizontal: 8 }}>
        ArabGram
      </T>
      <ScrollView contentContainerStyle={{ gap: 6, paddingTop: 16 }} keyboardShouldPersistTaps="handled">
        {LINKS.map((link) => (
          <SideLink
            key={link.href}
            href={link.href}
            icon={link.icon}
            label={t(link.key)}
            active={path === link.href || path.startsWith(`${link.href}/`)}
            badge={link.key === 'review' && due > 0 ? due : undefined}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  side: { width: 248, borderEndWidth: StyleSheet.hairlineWidth, paddingHorizontal: 12 },
});
