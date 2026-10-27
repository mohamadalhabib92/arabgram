import React, { useEffect, useState } from 'react';
import { Pressable, Text, View, type StyleProp, type TextStyle } from 'react-native';
import { router } from 'expo-router';
import { useTheme, alpha } from '@/kit/theme';
import { Header, IconButton, Ionicons, T, useToast } from '@/kit/ui';
import { LICENSES, type LicenseId } from '@/data/licenses';
import { arabicFamily } from '@/lib/fonts';
import { hasArabicVoice, speakArabic } from '@/lib/speech';
import { useI18n } from '@/lib/i18n';
import { store } from '@/state';

/** Texte arabe vocalisé : RTL, police Naskh, interligne généreux pour les diacritiques. */
export function AR({
  children,
  size = 26,
  color,
  center,
  system,
  style,
  weight = '500',
}: {
  children: React.ReactNode;
  size?: number;
  color?: string;
  center?: boolean;
  system?: boolean;
  style?: StyleProp<TextStyle>;
  weight?: TextStyle['fontWeight'];
}) {
  const t = useTheme();
  const arScale = store.useSelect((s) => s.settings.arScale);
  const fs = size * arScale * t.fontScale;
  return (
    <Text
      // @ts-ignore — lang est transmis au DOM sur le web (lecteurs d’écran, césure)
      lang="ar"
      style={[
        {
          fontFamily: arabicFamily(system),
          fontSize: fs,
          lineHeight: Math.round(fs * 1.85),
          writingDirection: 'rtl',
          textAlign: center ? 'center' : 'right',
          color: color ?? t.text,
          fontWeight: weight,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

export function Translit({ children, center }: { children: React.ReactNode; center?: boolean }) {
  const show = store.useSelect((s) => s.settings.showTranslit);
  if (!show) return null;
  return (
    <T v="small" muted center={center} style={{ fontStyle: 'italic' }}>
      {children}
    </T>
  );
}

/** Bouton « écouter » : voix de l’appareil uniquement (aucune API payante). */
export function AudioButton({ text, size = 22 }: { text: string; size?: number }) {
  const t = useTheme();
  const toast = useToast();
  const { pick } = useI18n();
  const enabled = store.useSelect((s) => s.settings.audio);
  if (!enabled) return null;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={pick({ fr: 'Écouter la prononciation', ar: 'اِسْتَمِعْ إِلَى النُّطْق', en: 'Listen to pronunciation' })}
      onPress={async () => {
        const ok = await hasArabicVoice();
        if (!ok) {
          toast(pick({ fr: 'Aucune voix arabe sur cet appareil — installez-en une dans les réglages système.', ar: 'لَا يُوجَدُ صَوْتٌ عَرَبِيّ عَلَى هٰذَا الجِهَاز', en: 'No Arabic voice on this device — install one in system settings.' }), 'info');
          return;
        }
        speakArabic(text);
      }}
      style={({ pressed }) => ({
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: alpha(t.primary, pressed ? 0.25 : 0.12),
      })}
    >
      <Ionicons name="volume-high" size={size} color={t.primary} />
    </Pressable>
  );
}

export function LicenseTag({ id, compact }: { id: LicenseId; compact?: boolean }) {
  const t = useTheme();
  const { lang } = useI18n();
  const lic = LICENSES[id];
  const color = lic.kind === 'placeholder' ? t.warning : lic.kind === 'public-domain' ? t.info : t.success;
  const icon = lic.kind === 'placeholder' ? 'alert-circle' : lic.kind === 'public-domain' ? 'globe-outline' : 'ribbon-outline';
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={lic.short[lang]}
      onPress={() => router.push('/sources')}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', paddingHorizontal: 10, minHeight: compact ? 28 : 32, borderRadius: 999, backgroundColor: alpha(color, 0.12) }}
    >
      <Ionicons name={icon} size={14} color={color} />
      <Text style={{ color, fontSize: 12 * t.fontScale, fontWeight: '700' }}>{lic.short[lang]}</Text>
    </Pressable>
  );
}

export function BackHeader({ title, subtitle, right }: { title: string; subtitle?: string; right?: React.ReactNode }) {
  const { lang, t } = useI18n();
  return (
    <Header
      title={title}
      subtitle={subtitle}
      right={right}
      left={
        <IconButton
          icon={lang === 'ar' ? 'arrow-forward' : 'arrow-back'}
          a11y={t('back')}
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/learn'))}
        />
      }
    />
  );
}

/** Hook utilitaire : true si une voix arabe est disponible (pour l’affichage d’aide). */
export function useArabicVoice(): boolean | null {
  const [ok, setOk] = useState<boolean | null>(null);
  useEffect(() => {
    let alive = true;
    hasArabicVoice().then((v) => alive && setOk(v));
    return () => {
      alive = false;
    };
  }, []);
  return ok;
}

export function Pill({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: alpha(color, 0.14) }}>
      <Text style={{ color, fontWeight: '700', fontSize: 12 }}>{children}</Text>
    </View>
  );
}
