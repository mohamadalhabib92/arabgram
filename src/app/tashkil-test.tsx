import React, { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { alpha, useTheme } from '@/kit/theme';
import { Banner, Button, Card, Chip, Ionicons, Progress, Row, Screen, Section, Segmented, T } from '@/kit/ui';
import { AR, AudioButton, BackHeader } from '@/components/common';
import { BASE_LETTERS, MARKS, PHONETIC_TEST, RENDER_SAMPLES } from '@/data/tashkil';
import { shuffle } from '@/lib/drill';
import { useI18n } from '@/lib/i18n';
import { store } from '@/state';

export default function TashkilTest() {
  const p = useTheme();
  const { pick } = useI18n();
  const gloss = store.useSelect((s) => s.settings.gloss);
  const best = store.useSelect((s) => s.tashkilBest);
  const [font, setFont] = useState<'naskh' | 'system'>('naskh');
  const [letter, setLetter] = useState(0);
  const [mark, setMark] = useState(0);
  const [qi, setQi] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [round, setRound] = useState(0);
  const order = useMemo(() => shuffle(PHONETIC_TEST), [round]);
  const q = order[qi];
  const opts = useMemo(() => (q ? shuffle(q.options) : []), [q]);
  const sys = font === 'system';
  const L = BASE_LETTERS[letter];
  const M = MARKS[mark];
  const composed = L.ar + M.char;

  const choose = (o: string) => {
    if (picked) return;
    setPicked(o);
    if (o === q.answer) setScore((n) => n + 1);
  };
  const next = () => {
    if (qi + 1 >= order.length) {
      const final = score;
      store.set((s) => ({ ...s, tashkilBest: Math.max(s.tashkilBest ?? 0, final) }));
      setDone(true);
    } else {
      setQi(qi + 1);
      setPicked(null);
    }
  };
  const restart = () => {
    setRound((r) => r + 1);
    setQi(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  };

  return (
    <Screen header={<BackHeader title={pick({ fr: 'Test de tashkīl', ar: 'اِخْتِبَارُ التَّشْكِيل', en: 'Tashkīl test' })} subtitle={pick({ fr: 'Rendu des diacritiques et lecture phonétique', ar: 'عَرْضُ الحَرَكَاتِ وَالقِرَاءَة', en: 'Diacritic rendering and phonetic reading' })} />}>
      <Section title={pick({ fr: '1. Rendu', ar: '١. العَرْض', en: '1. Rendering' })}>
        <Card>
          <Segmented<'naskh' | 'system'>
            options={[
              { key: 'naskh', label: 'Noto Naskh Arabic' },
              { key: 'system', label: pick({ fr: 'Police système', ar: 'خَطّ النِّظَام', en: 'System font' }) },
            ]}
            value={font}
            onChange={setFont}
          />
          {[18, 26, 38].map((sz) => (
            <View key={sz} style={{ borderBottomWidth: 1, borderBottomColor: p.border, paddingVertical: 4 }}>
              <T v="caption" muted>{sz} pt</T>
              {RENDER_SAMPLES.slice(0, sz === 38 ? 2 : 4).map((r) => (
                <AR key={r} size={sz} system={sys}>{r}</AR>
              ))}
            </View>
          ))}
          <T v="caption" muted>{pick({ fr: 'Vérifiez que chaque signe est bien placé au-dessus ou au-dessous de sa lettre, sans chevauchement ni carré vide (□).', ar: 'تَأَكَّدْ مِنْ مَوْضِعِ كُلِّ حَرَكَة', en: 'Check that each mark sits above or below its letter, with no overlap or empty box (□).' })}</T>
        </Card>
      </Section>

      <Section title={pick({ fr: '2. Composeur', ar: '٢. التَّرْكِيب', en: '2. Composer' })}>
        <Card>
          <Row wrap gap={6}>
            {BASE_LETTERS.map((b, i) => (
              <Chip key={b.ar} label={b.ar} selected={i === letter} onPress={() => setLetter(i)} />
            ))}
          </Row>
          <Row wrap gap={6}>
            {MARKS.map((m, i) => (
              <Chip key={m.id} label={`ـ${m.char}`} selected={i === mark} onPress={() => setMark(i)} />
            ))}
          </Row>
          <Row style={{ justifyContent: 'space-between', backgroundColor: alpha(p.primary, 0.07), borderRadius: 12, padding: 12 }}>
            <View style={{ flex: 1 }}>
              <T v="h2">{M.suffix(L.tr)}</T>
              <T v="small" muted>{gloss === 'fr' ? M.fr : M.en}</T>
              <AR size={16}>{M.name}</AR>
            </View>
            <AR size={60} system={sys} weight="600">{composed}</AR>
            <AudioButton text={composed} />
          </Row>
        </Card>
      </Section>

      <Section title={pick({ fr: '3. Lecture : paires minimales', ar: '٣. القِرَاءَة', en: '3. Reading: minimal pairs' })}>
        {done ? (
          <Card style={{ alignItems: 'center' }}>
            <Ionicons name={score >= 8 ? 'ribbon' : 'school'} size={48} color={score >= 8 ? p.accent : p.primary} />
            <T v="h2" center>{score}/{order.length}</T>
            <T v="small" muted center>{pick({ fr: 'Meilleur résultat', ar: 'أَفْضَلُ نَتِيجَة', en: 'Best result' })} : {Math.max(best ?? 0, score)}/{order.length}</T>
            <Button title={pick({ fr: 'Recommencer', ar: 'أَعِدْ', en: 'Restart' })} icon="refresh" onPress={restart} />
          </Card>
        ) : q ? (
          <Card>
            <Progress value={qi / order.length} />
            <T v="label" muted>{pick({ fr: 'Comment se lit ce mot ?', ar: 'كَيْفَ تُقْرَأُ؟', en: 'How is this word read?' })} ({qi + 1}/{order.length})</T>
            <Row style={{ justifyContent: 'center' }}>
              <AR size={48} center system={sys} weight="600">{q.ar}</AR>
              <AudioButton text={q.ar} />
            </Row>
            {opts.map((o) => {
              const isAns = o === q.answer;
              const isPick = o === picked;
              return (
                <Pressable
                  key={o}
                  accessibilityRole="button"
                  accessibilityLabel={o}
                  onPress={() => choose(o)}
                  style={{ minHeight: 52, borderRadius: p.radius, borderWidth: 2, alignItems: 'center', justifyContent: 'center', borderColor: picked && isAns ? p.success : isPick ? p.danger : p.border, backgroundColor: picked && isAns ? alpha(p.success, 0.12) : isPick ? alpha(p.danger, 0.12) : p.surface }}
                >
                  <T v="h3">{o}</T>
                </Pressable>
              );
            })}
            {picked ? (
              <>
                <Banner kind={picked === q.answer ? 'success' : 'danger'} title={picked === q.answer ? pick({ fr: 'Correct', ar: 'صَحِيح', en: 'Correct' }) : `${pick({ fr: 'Réponse', ar: 'الجَوَاب', en: 'Answer' })} : ${q.answer}`} text={gloss === 'fr' ? q.fr : q.en} />
                <Button title={pick({ fr: 'Suivant', ar: 'التَّالِي', en: 'Next' })} onPress={next} full />
              </>
            ) : null}
          </Card>
        ) : null}
      </Section>
      <T v="caption" muted center>{pick({ fr: 'Contenu original ArabGram · police Noto Naskh Arabic (SIL OFL 1.1)', ar: 'مُحْتَوًى أَصْلِيّ', en: 'ArabGram original content · Noto Naskh Arabic font (SIL OFL 1.1)' })}</T>
    </Screen>
  );
}
