import React from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/kit/theme';
import { Card, Header, Row, Screen, Section, T } from '@/kit/ui';
import { PdfButton } from '@/components/BookBlocks';
import { bookParts, resolveSection, type BookPart } from '@/data/book';
import { useI18n } from '@/lib/i18n';
import { store } from '@/state';

export default function BookIndex() {
  const p = useTheme();
  const { t, pick } = useI18n();
  const book = store.useSelect((s) => s.book);
  const parts = bookParts();
  const recent = book?.recent ? parts.find((part) => part.id === book.recent) : undefined;
  const recentSection = recent ? recent.sections.find((section) => section.id === book?.positions?.[recent.id]) : undefined;

  return (
    <Screen
      header={
        <Header
          title={t('book')}
          subtitle={pick({ fr: 'Ebook · lecture dans l’app', ar: 'كِتَابٌ لِلقِرَاءَة', en: 'Ebook · read in the app' })}
        />
      }
    >
      <Card accent={p.primary}>
        <T v="h3">{pick({ fr: 'Lire l’arabe, lettre après lettre', ar: 'اِقْرَأِ العَرَبِيَّةَ حَرْفًا حَرْفًا', en: 'Read Arabic, letter by letter' })}</T>
        <T v="body" muted>
          {pick({
            fr: 'Le livre est en français, comme l’ebook. Les lettres, les mots et les passages viennent des leçons. Hors ligne, sans compte, sans suivi.',
            ar: 'الكِتَابُ بِالفَرَنْسِيَّةِ. الحُرُوفُ وَالكَلِمَاتُ مِنَ الدُّرُوسِ. بِلَا حِسَابٍ وَبِلَا تَتَبُّع.',
            en: 'The book is in French, like the ebook. Letters, words and passages come from the lessons. Offline, no account, no tracking.',
          })}
        </T>
      </Card>

      {recent ? (
        <Card
          accent={p.accent}
          a11y={pick({ fr: 'Reprendre la lecture', ar: 'تَابِعِ القِرَاءَة', en: 'Resume reading' })}
          onPress={() => router.push({ pathname: '/ebook/[id]', params: { id: recent.id } })}
        >
          <T v="caption" color={p.accent}>{pick({ fr: 'Reprendre', ar: 'تَابِعْ', en: 'Resume' })}</T>
          <T v="h3">{recent.title}</T>
          <T v="small" muted>{recentSection?.title ?? recent.kicker}</T>
        </Card>
      ) : null}

      <PdfButton detail={pick({ fr: 'Le même livre en PDF, pour l’envoyer vers une reMarkable ou l’imprimer.', ar: 'نَفْسُ الكِتَابِ بِصِيغَةِ PDF', en: 'The same book as a PDF, to send to a reMarkable or to print.' })} />

      <Shelf title={pick({ fr: 'Avant les chapitres', ar: 'قَبْلَ الفُصُول', en: 'Before the chapters' })} parts={parts.filter((part) => part.group === 'avant')} />
      <Shelf title={pick({ fr: 'Six chapitres', ar: 'سِتَّةُ فُصُول', en: 'Six chapters' })} parts={parts.filter((part) => part.group === 'chapitre')} numbered />
      <Shelf title={pick({ fr: 'Récapitulatif', ar: 'الخُلَاصَة', en: 'Back matter' })} parts={parts.filter((part) => part.group === 'fin')} />
    </Screen>
  );
}

function Shelf({ title, parts, numbered }: { title: string; parts: BookPart[]; numbered?: boolean }) {
  const p = useTheme();
  const book = store.useSelect((s) => s.book);
  return (
    <Section title={title}>
      {parts.map((part, index) => {
        const saved = book?.positions?.[part.id];
        const section = saved ? part.sections.find((entry) => entry.id === saved) : undefined;
        const here = resolveSection(part, saved);
        const started = section && here !== part.sections[0]?.id;
        return (
          <Card key={part.id} a11y={`${part.kicker}. ${part.title}`} onPress={() => router.push({ pathname: '/ebook/[id]', params: { id: part.id } })}>
            <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View style={{ flex: 1, gap: 2 }}>
                <T v="caption" color={p.primary}>{numbered ? `${index + 1}. ${part.kicker}` : part.kicker}</T>
                <T v="h3">{part.title}</T>
                <T v="small" muted>{started ? section?.title : part.blurb}</T>
              </View>
              <T v="label" muted>{part.sections.length}</T>
            </Row>
          </Card>
        );
      })}
    </Section>
  );
}
