import React from 'react';
import { View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/kit/theme';
import { Banner, Button, Card, EmptyState, Ionicons, Row, Screen, Section, T } from '@/kit/ui';
import { AR, BackHeader, LicenseTag } from '@/components/common';
import { UNITS, playable } from '@/data/curriculum';
import { useI18n } from '@/lib/i18n';
import { store, unitUnlocked } from '@/state';

export default function UnitScreen() {
  const p = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { lang, t, pick } = useI18n();
  const s = store.use();
  const gloss = s.settings.gloss;
  const unit = UNITS.find((u) => String(u.id) === String(id));

  if (!unit)
    return (
      <Screen header={<BackHeader title={t('unit')} />}>
        <EmptyState icon="help-circle-outline" title={pick({ fr: 'Unité introuvable', ar: 'الوَحْدَةُ غَيْرُ مَوْجُودَةٍ', en: 'Unit not found' })} action={<Button title={t('learn')} onPress={() => router.replace('/learn')} />} />
      </Screen>
    );

  const open = unitUnlocked(s, unit.id);
  return (
    <Screen header={<BackHeader title={`${t('unit')} ${unit.id}`} subtitle={lang === 'ar' ? undefined : unit[gloss]} />}>
      <Card>
        <AR size={34} center weight="700">{unit.ar}</AR>
        <T v="body" muted center>{unit.goal[gloss]}</T>
      </Card>
      {!open ? <Banner kind="warning" icon="lock-closed" text={pick({ fr: 'Unité verrouillée : terminez l’unité précédente (ou « Tout débloquer » dans Réglages).', ar: 'هٰذِهِ الوَحْدَةُ مُقْفَلَةٌ', en: 'Locked unit: finish the previous one (or “Unlock all” in Settings).' })} /> : null}
      <Section title={t('lessons')}>
        {unit.lessons.map((l, i) => {
          const rec = s.lessons[l.id];
          const ok = playable(l);
          return (
            <Card
              key={l.id}
              a11y={`${t('lesson')} ${i + 1} — ${l.title[gloss]}`}
              onPress={open ? () => router.push({ pathname: '/lesson/[id]', params: { id: l.id } }) : undefined}
              accent={!ok ? p.warning : rec && rec.best >= 0.6 ? p.success : undefined}
            >
              <Row style={{ justifyContent: 'space-between' }}>
                <View style={{ flex: 1, gap: 2 }}>
                  <T v="caption" muted>{t('lesson')} {i + 1}{ok ? ` · ${l.items.length} ${pick({ fr: 'éléments', ar: 'عَنَاصِر', en: 'items' })}` : ''}</T>
                  <T v="h3">{lang === 'ar' ? l.title.ar : l.title[gloss]}</T>
                </View>
                <AR size={20}>{l.title.ar}</AR>
              </Row>
              <Row style={{ justifyContent: 'space-between' }} wrap>
                <LicenseTag id={l.license} compact />
                {rec ? (
                  <Row gap={4}>
                    <Ionicons name={rec.best >= 0.6 ? 'checkmark-circle' : 'ellipse-outline'} size={16} color={rec.best >= 0.6 ? p.success : p.textMuted} />
                    <T v="small" muted>{t('accuracy')} {Math.round(rec.best * 100)} %</T>
                  </Row>
                ) : null}
              </Row>
            </Card>
          );
        })}
      </Section>
    </Screen>
  );
}
