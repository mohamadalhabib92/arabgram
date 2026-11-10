import React, { useEffect, useState } from 'react';
import { ScrollView, View, useWindowDimensions } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/kit/theme';
import { Button, Chip, EmptyState, IconButton, Row, T } from '@/kit/ui';
import { BookBody, PdfButton } from '@/components/BookBlocks';
import { bookPart, bookParts, resolveSection } from '@/data/book';
import { useI18n } from '@/lib/i18n';
import { setBookPosition, store } from '@/state';

export default function EbookScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const part = bookPart(String(id));
  const p = useTheme();
  const insets = useSafeAreaInsets();
  const { lang, t, pick } = useI18n();
  const width = useWindowDimensions().width;
  const wide = width >= 900;
  const [sectionId, setSectionId] = useState(() => (part ? resolveSection(part, store.get().book?.positions?.[part.id]) : ''));

  useEffect(() => {
    if (!part) return;
    const next = resolveSection(part, store.get().book?.positions?.[part.id]);
    setSectionId(next);
    setBookPosition(part.id, next);
    // Ouverture d’un chapitre : on reprend la section mémorisée, sans relire à chaque rendu.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [part?.id]);

  if (!part) {
    return (
      <View style={{ flex: 1, backgroundColor: p.bg, paddingTop: insets.top }}>
        <EmptyState
          icon="help-circle-outline"
          title={pick({ fr: 'Chapitre introuvable', ar: 'الفَصْلُ غَيْرُ مَوْجُود', en: 'Chapter not found' })}
          action={<Button title={t('book')} onPress={() => router.replace('/book')} />}
        />
      </View>
    );
  }

  const index = part.sections.findIndex((section) => section.id === sectionId);
  const section = part.sections[index] ?? part.sections[0];
  const choose = (nextId: string) => {
    setSectionId(nextId);
    setBookPosition(part.id, nextId);
  };
  const prev = index > 0 ? part.sections[index - 1] : undefined;
  const next = index >= 0 && index < part.sections.length - 1 ? part.sections[index + 1] : undefined;
  const order = bookParts();
  const partIndex = order.findIndex((entry) => entry.id === part.id);
  const nextPart = partIndex >= 0 ? order[partIndex + 1] : undefined;

  const rail = (
    <View style={{ gap: 6, padding: wide ? 12 : 0 }}>
      {part.sections.map((entry) => (
        <Chip key={entry.id} label={entry.title} selected={entry.id === section.id} onPress={() => choose(entry.id)} />
      ))}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: p.bg, paddingTop: insets.top }}>
      <View style={{ width: '100%', maxWidth: wide ? 1100 : 820, alignSelf: 'center', paddingHorizontal: 8, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        <IconButton icon={lang === 'ar' ? 'arrow-forward' : 'arrow-back'} a11y={t('back')} onPress={() => (router.canGoBack() ? router.back() : router.replace('/book'))} />
        <View style={{ flex: 1 }} accessibilityRole="header">
          <T v="caption" muted>
            {part.kicker} · {index + 1}/{part.sections.length}
          </T>
          <T v="h2">{section.title}</T>
        </View>
        <IconButton icon="list" a11y={pick({ fr: 'Sommaire du livre', ar: 'الفِهْرِس', en: 'Book index' })} onPress={() => router.push('/book')} />
      </View>

      <View style={{ flex: 1, width: '100%', maxWidth: wide ? 1100 : 820, alignSelf: 'center', flexDirection: wide ? 'row' : 'column' }}>
        {wide ? <ScrollView style={{ width: 260, flexGrow: 0 }} contentContainerStyle={{ paddingBottom: 24 }}>{rail}</ScrollView> : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ flexGrow: 0, flexShrink: 0, maxHeight: 68 }}
            contentContainerStyle={{ gap: 8, paddingHorizontal: 16, paddingVertical: 8, alignItems: 'center' }}
          >
            {part.sections.map((entry) => (
              <View key={entry.id} style={{ alignSelf: 'center' }}>
                <Chip label={entry.title} selected={entry.id === section.id} onPress={() => choose(entry.id)} />
              </View>
            ))}
          </ScrollView>
        )}
        <ScrollView key={section.id} style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 32, gap: 14 }}>
          <T v="small" muted>{part.title}</T>
          <BookBody key={section.id} blocks={section.blocks} onGoto={choose} />
          {!section.paper && section.id === part.sections[part.sections.length - 1]?.id ? (
            <PdfButton detail={pick({ fr: 'Emporter le livre en PDF.', ar: 'خُذِ الكِتَابَ PDF', en: 'Take the book as a PDF.' })} />
          ) : null}
        </ScrollView>
      </View>

      <View style={{ borderTopWidth: 1, borderTopColor: p.border, backgroundColor: p.surface, paddingHorizontal: 12, paddingTop: 8, paddingBottom: Math.max(insets.bottom, 8) }}>
        <Row style={{ width: '100%', maxWidth: wide ? 1100 : 820, alignSelf: 'center' }}>
          <View style={{ flex: 1 }}>
            {prev ? <Button kind="secondary" title={pick({ fr: 'Précédent', ar: 'السَّابِق', en: 'Previous' })} onPress={() => choose(prev.id)} /> : null}
          </View>
          <T v="caption" muted>
            {part.sections.length > 1 ? `${index + 1}/${part.sections.length}` : ''}
          </T>
          <View style={{ flex: 1 }}>
            {next ? (
              <Button title={pick({ fr: 'Suivant', ar: 'التَّالِي', en: 'Next' })} onPress={() => choose(next.id)} />
            ) : nextPart ? (
              <Button title={nextPart.kicker} onPress={() => router.push({ pathname: '/ebook/[id]', params: { id: nextPart.id } })} />
            ) : (
              <Button kind="secondary" title={t('book')} onPress={() => router.replace('/book')} />
            )}
          </View>
        </Row>
      </View>
    </View>
  );
}
