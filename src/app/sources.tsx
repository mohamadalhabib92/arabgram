import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@/kit/theme';
import { Badge, Banner, Card, Row, Screen, Section, T } from '@/kit/ui';
import { BackHeader } from '@/components/common';
import { LICENSES, type LicenseId } from '@/data/licenses';
import { ALL_LESSONS } from '@/data/curriculum';
import { PASSAGES } from '@/data/passages';
import { useI18n } from '@/lib/i18n';
import { store } from '@/state';

const THIRD_PARTY = [
  { name: 'Noto Naskh Arabic', what: { fr: 'Police arabe embarquée', en: 'Bundled Arabic font' }, lic: 'SIL Open Font License 1.1', by: 'Google / Noto project' },
  { name: 'Ionicons (@expo/vector-icons)', what: { fr: 'Icônes', en: 'Icons' }, lic: 'MIT', by: 'Ionic' },
  { name: 'Expo, React Native, expo-router', what: { fr: 'Framework', en: 'Framework' }, lic: 'MIT', by: 'Expo / Meta' },
  { name: 'expo-speech', what: { fr: 'Synthèse vocale : utilise la voix installée sur l’appareil (aucun enregistrement fourni, aucun service payant)', en: 'Speech: uses the voice installed on the device (no recordings shipped, no paid service)' }, lic: 'MIT', by: 'Expo' },
];

export default function Sources() {
  const p = useTheme();
  const { pick, lang } = useI18n();
  const gloss = store.useSelect((s) => s.settings.gloss);
  const ids = Object.keys(LICENSES) as LicenseId[];
  const color = (k: string) => (k === 'owned' ? p.primary : k === 'public-domain' ? p.success : p.warning);

  return (
    <Screen header={<BackHeader title={pick({ fr: 'Sources et licences', ar: 'المَصَادِرُ وَالتَّرَاخِيص', en: 'Sources & licences' })} />}>
      <Banner kind="info" icon="shield-checkmark-outline" text={pick({ fr: 'Tout le contenu pédagogique est soit original (rédigé pour ArabGram), soit du domaine public. Aucun manuel, enregistrement ou texte protégé n’est inclus. Les emplacements vides sont marqués « Placeholder / non licencié — à remplacer ».', ar: 'كُلُّ المُحْتَوَى أَصْلِيٌّ أَوْ مِلْكٌ عَامّ', en: 'All teaching content is either original (written for ArabGram) or public domain. No copyrighted textbook, recording or text is included. Empty slots are marked “Placeholder / unlicensed — to replace”.' })} />
      {ids.map((id) => {
        const L = LICENSES[id];
        const lessons = ALL_LESSONS.filter((l) => l.license === id);
        const passages = PASSAGES.filter((x) => x.license === id);
        return (
          <Card key={id} accent={color(L.kind)}>
            <Row style={{ justifyContent: 'space-between' }}>
              <T v="h3" style={{ flex: 1 }}>{L.short[lang]}</T>
              <Badge label={L.kind === 'owned' ? pick({ fr: 'Original', ar: 'أَصْلِيّ', en: 'Original' }) : L.kind === 'public-domain' ? pick({ fr: 'Domaine public', ar: 'مِلْكٌ عَامّ', en: 'Public domain' }) : 'Placeholder'} color={color(L.kind)} />
            </Row>
            <T v="small" selectable>{L.detail[gloss]}</T>
            <T v="caption" muted>{pick({ fr: 'Titulaire', ar: 'المَالِك', en: 'Holder' })} : {L.holder}</T>
            {lessons.length ? <T v="caption" muted>{pick({ fr: 'Leçons', ar: 'الدُّرُوس', en: 'Lessons' })} ({lessons.length}) : {lessons.map((l) => l.id).join(', ')}</T> : null}
            {passages.length ? <T v="caption" muted>{pick({ fr: 'Passages', ar: 'النُّصُوص', en: 'Passages' })} : {passages.map((x) => x.title[gloss]).join(', ')}</T> : null}
          </Card>
        );
      })}
      <Section title={pick({ fr: 'Composants tiers', ar: 'مُكَوِّنَاتٌ خَارِجِيَّة', en: 'Third-party components' })}>
        {THIRD_PARTY.map((x) => (
          <Card key={x.name}>
            <Row style={{ justifyContent: 'space-between' }}>
              <T v="h3" style={{ flex: 1 }}>{x.name}</T>
              <Badge label={x.lic} />
            </Row>
            <T v="small" muted>{x.what[gloss]} · {x.by}</T>
          </Card>
        ))}
      </Section>
      <View style={{ height: 8 }} />
    </Screen>
  );
}
