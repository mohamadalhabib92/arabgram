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
  { name: 'Noto Naskh Arabic', what: { fr: 'Police arabe embarquée — licence SIL OFL 1.1 annoncée, à valider sur le fichier', en: 'Bundled Arabic font — SIL OFL 1.1 declared, confirm the file' }, lic: 'SIL OFL 1.1 · à valider', by: 'Google / Noto project' },
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
      <Banner kind="warning" icon="alert-circle-outline" title="à valider" text={pick({ fr: 'Audit Passe 1 : chaque leçon et chaque passage a une étiquette. Rien n’est confirmé juridiquement. Les sons, attributions (al-Mutanabbī, Imruʾ al-Qays) et le statut « domaine public » sont à valider par Mohamed. u11l3 est vide : « Contenu à fournir ». Aucun texte Madinah ni Duolingo. La police Noto Naskh est annoncée SIL OFL 1.1 — à valider sur le fichier embarqué.', ar: 'كُلُّ التَّرَاخِيصِ بِحَاجَةٍ إِلَى تَأْكِيد. u11l3: مُحْتَوًى مَطْلُوب.', en: 'Passe 1 audit: every lesson and passage has a label. Nothing is legally confirmed. Sounds, attributions and public-domain status are to be confirmed by Mohamed. u11l3 is empty: “Content to be provided”. No Madinah or Duolingo text. Noto Naskh is declared SIL OFL 1.1 — confirm against the bundled file.' })} />
      {ids.map((id) => {
        const L = LICENSES[id];
        const lessons = ALL_LESSONS.filter((l) => l.license === id);
        const passages = PASSAGES.filter((x) => x.license === id);
        return (
          <Card key={id} accent={color(L.kind)}>
            <Row style={{ justifyContent: 'space-between' }}>
              <T v="h3" style={{ flex: 1 }}>{L.short[lang]}</T>
              <Badge label={L.kind === 'owned' ? pick({ fr: 'Original · à valider', ar: 'أَصْلِيّ · à valider', en: 'Original · à valider' }) : L.kind === 'public-domain' ? pick({ fr: 'Statut à valider', ar: 'à valider', en: 'Status to confirm' }) : 'Contenu à fournir'} color={color(L.kind)} />
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
