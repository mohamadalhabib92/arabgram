import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { alpha, useTheme } from '@/kit/theme';
import { Banner, Button, Card, Header, IconButton, Ionicons, Row, Screen, Section, Stat, T, ToggleRow } from '@/kit/ui';
import { AR, LicenseTag } from '@/components/common';
import { PASSAGES, type Passage } from '@/data/passages';
import { shuffle } from '@/lib/drill';
import { useI18n } from '@/lib/i18n';
import { addXp, recordPacer, setSettings, store, type PacerSession } from '@/state';

const ALL_TR = Array.from(new Set(PASSAGES.flatMap((p) => p.words.map((w) => w.tr))));

type Mode = 'setup' | 'run' | 'result';
type Mark = 'ok' | 'ko' | 'miss';

/** Progression de piste (guide ou lecteur), 0 → 1. */
function Lane({ label, value, color, icon }: { label: string; value: number; color: string; icon: React.ComponentProps<typeof Ionicons>['name'] }) {
  const p = useTheme();
  const v = Math.max(0, Math.min(1, value));
  return (
    <View style={{ gap: 4 }} accessible accessibilityLabel={`${label} ${Math.round(v * 100)} %`}>
      <T v="caption" muted>{label}</T>
      <View style={{ height: 30, borderRadius: 15, backgroundColor: p.surface2, justifyContent: 'center' }}>
        <View style={{ position: 'absolute', top: 0, bottom: 0, start: 0, width: `${v * 100}%`, borderRadius: 15, backgroundColor: alpha(color, 0.25) }} />
        <View style={{ position: 'absolute', start: `${v * 92}%`, width: 30, height: 30, borderRadius: 15, backgroundColor: color, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name={icon} size={16} color="#fff" />
        </View>
      </View>
    </View>
  );
}

export default function Pacer() {
  const p = useTheme();
  const { lang, pick } = useI18n();
  const s = store.use();
  const gloss = s.settings.gloss;
  const untimed = s.settings.untimedPacer;
  const reduceMotion = s.settings.reduceMotion;
  const [mode, setMode] = useState<Mode>('setup');
  const [passage, setPassage] = useState<Passage>(PASSAGES[0]);
  const [target, setTarget] = useState<number>(s.pacer.target);
  const [idx, setIdx] = useState(0);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [startAt, setStartAt] = useState(0);
  const [wordAt, setWordAt] = useState(0);
  const [now, setNow] = useState(0);
  const [last, setLast] = useState<{ ok: boolean; tr: string } | null>(null);
  const [result, setResult] = useState<PacerSession | null>(null);
  const finished = useRef(false);

  useEffect(() => setTarget(s.pacer.target), [s.pacer.target]);

  const n = passage.words.length;
  const secPerWord = 60 / target;
  const limitMs = secPerWord * 2 * 1000;
  const guideTotalMs = n * secPerWord * 1000;

  const options = useMemo(() => {
    const w = passage.words[idx];
    if (!w) return [];
    const others = shuffle(ALL_TR.filter((x) => x !== w.tr)).slice(0, 2);
    return shuffle([w.tr, ...others]);
  }, [passage, idx]);

  const finish = useCallback(
    (finalMarks: Mark[], endAt: number) => {
      if (finished.current) return;
      finished.current = true;
      const elapsedMin = Math.max((endAt - startAt) / 60000, 1 / 60);
      const okCount = finalMarks.filter((m) => m === 'ok').length;
      const acc = okCount / n;
      const wpm = Math.round(n / elapsedMin);
      const won = !untimed && endAt - startAt <= guideTotalMs;
      const sess: PacerSession = { at: new Date().toISOString(), passage: passage.id, wpm, acc, score: Math.round(wpm * acc), target, won, untimed };
      recordPacer(sess);
      addXp(okCount * 2 + (won && acc >= 0.8 ? 10 : 0));
      setResult(sess);
      setMode('result');
    },
    [startAt, n, untimed, guideTotalMs, passage.id, target]
  );

  const answer = useCallback(
    (mark: Mark, tr: string) => {
      const t0 = Date.now();
      const nextMarks = [...marks, mark];
      setMarks(nextMarks);
      setLast({ ok: mark === 'ok', tr });
      if (idx + 1 >= n) finish(nextMarks, t0);
      else {
        setIdx(idx + 1);
        setWordAt(t0);
      }
    },
    [marks, idx, n, finish]
  );

  // Horloge de course (100 ms) — uniquement en mode chronométré.
  useEffect(() => {
    if (mode !== 'run' || untimed) return;
    const id = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(id);
  }, [mode, untimed]);

  // Mot non lu à temps → manqué, le guide continue.
  useEffect(() => {
    if (mode !== 'run' || untimed || !wordAt) return;
    if (now - wordAt > limitMs) answer('miss', passage.words[idx].tr);
  }, [now, wordAt, limitMs, mode, untimed, answer, passage, idx]);

  const start = (ps: Passage) => {
    finished.current = false;
    const t0 = Date.now();
    setPassage(ps);
    setIdx(0);
    setMarks([]);
    setLast(null);
    setStartAt(t0);
    setWordAt(t0);
    setNow(t0);
    setResult(null);
    setMode('run');
  };

  const title = 'سِبَاقُ المُرْشِد';

  if (mode === 'run') {
    const w = passage.words[idx];
    const guide = untimed ? 0 : (now - startAt) / guideTotalMs;
    const leftMs = Math.max(0, limitMs - (now - wordAt));
    return (
      <Screen
        header={
          <Row style={{ paddingHorizontal: 12, paddingTop: 8, width: '100%', maxWidth: 820, alignSelf: 'center' }}>
            <IconButton icon="close" a11y={pick({ fr: 'Abandonner la course', ar: 'إِنْهَاءُ السِّبَاقِ', en: 'Quit race' })} onPress={() => setMode('setup')} />
            <AR size={20} style={{ flex: 1 }} center weight="700">{title}</AR>
            <T v="label" muted>{untimed ? pick({ fr: 'libre', ar: 'حُرّ', en: 'free' }) : `${target} ${pick({ fr: 'mots/min', ar: 'كَلِمَة/د', en: 'wpm' })}`}</T>
          </Row>
        }
      >
        {!untimed ? <Lane label={pick({ fr: 'Le guide (المرشد)', ar: 'المُرْشِد', en: 'The guide (المرشد)' })} value={guide} color={p.accent} icon="flag" /> : null}
        <Lane label={pick({ fr: 'Vous', ar: 'أَنْتَ', en: 'You' })} value={idx / n} color={p.primary} icon="person" />

        <Card>
          <View style={{ flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 8, justifyContent: 'flex-start' }}>
            {passage.words.map((x, i) => {
              const m = marks[i];
              const color = m === 'ok' ? p.success : m ? p.danger : i === idx ? p.primary : p.textMuted;
              return (
                <View key={i} style={{ paddingHorizontal: 6, borderRadius: 8, backgroundColor: i === idx ? alpha(p.primary, 0.12) : 'transparent' }}>
                  <AR size={20} color={color} weight={i === idx ? '700' : '400'}>{x.ar}</AR>
                </View>
              );
            })}
          </View>
        </Card>

        <Card style={{ alignItems: 'center', paddingVertical: 18 }}>
          <AR size={46} center weight="700">{w.ar}</AR>
          {!untimed ? (
            reduceMotion ? (
              <T v="label" muted>{(leftMs / 1000).toFixed(1)} s</T>
            ) : (
              <View style={{ width: '70%', height: 6, borderRadius: 3, backgroundColor: p.surface2, overflow: 'hidden' }}>
                <View style={{ width: `${(leftMs / limitMs) * 100}%`, height: 6, backgroundColor: leftMs < limitMs * 0.3 ? p.danger : p.accent }} />
              </View>
            )
          ) : null}
        </Card>

        <T v="label" muted center>{pick({ fr: 'Choisissez la bonne lecture', ar: 'اِخْتَرِ القِرَاءَةَ الصَّحِيحَةَ', en: 'Pick the correct reading' })}</T>
        <View style={{ gap: 10 }}>
          {options.map((o) => (
            <Pressable
              key={o}
              accessibilityRole="button"
              accessibilityLabel={o}
              onPress={() => answer(o === w.tr ? 'ok' : 'ko', w.tr)}
              style={({ pressed }) => ({ minHeight: 54, borderRadius: p.radius, borderWidth: 2, borderColor: p.border, backgroundColor: pressed ? alpha(p.primary, 0.1) : p.surface, alignItems: 'center', justifyContent: 'center' })}
            >
              <T v="h3">{o}</T>
            </Pressable>
          ))}
        </View>
        {last ? (
          <Row style={{ justifyContent: 'center' }} gap={6}>
            <Ionicons name={last.ok ? 'checkmark-circle' : 'close-circle'} size={18} color={last.ok ? p.success : p.danger} />
            <T v="small" color={last.ok ? p.success : p.danger}>{last.ok ? pick({ fr: 'Juste', ar: 'صَحِيح', en: 'Right' }) : `${pick({ fr: 'C’était', ar: 'كَانَتْ', en: 'It was' })} « ${last.tr} »`}</T>
          </Row>
        ) : null}
      </Screen>
    );
  }

  if (mode === 'result' && result) {
    const lic = passage.license;
    return (
      <Screen header={<Header title={pick({ fr: 'Résultat', ar: 'النَّتِيجَة', en: 'Result' })} subtitle={title} />}>
        <View style={{ alignItems: 'center', gap: 6 }}>
          <Ionicons name={result.won ? 'trophy' : result.untimed ? 'book' : 'flag'} size={56} color={result.won ? p.accent : p.primary} />
          <T v="h2" center>
            {result.untimed
              ? pick({ fr: 'Lecture libre terminée', ar: 'اِنْتَهَتِ القِرَاءَةُ', en: 'Free reading done' })
              : result.won
                ? pick({ fr: 'Vous avez battu le guide !', ar: 'سَبَقْتَ المُرْشِدَ!', en: 'You beat the guide!' })
                : pick({ fr: 'Le guide a gagné cette fois', ar: 'سَبَقَكَ المُرْشِدُ هٰذِهِ المَرَّةَ', en: 'The guide won this time' })}
          </T>
        </View>
        <Row>
          <Stat label={pick({ fr: 'Vitesse (mots/min)', ar: 'السُّرْعَة', en: 'Speed (wpm)' })} value={String(result.wpm)} />
          <Stat label={pick({ fr: 'Précision', ar: 'الدِّقَّة', en: 'Accuracy' })} value={`${Math.round(result.acc * 100)} %`} color={result.acc >= 0.8 ? p.success : p.warning} />
          <Stat label="WPM × %" value={String(result.score)} color={p.primary} />
        </Row>
        {!result.untimed ? (
          <Banner
            kind="info"
            icon="speedometer-outline"
            text={pick({
              fr: `Prochaine allure du guide : ${s.pacer.target} mots/min (s’adapte : +5 si vous gagnez avec ≥ 80 %, −5 sous 60 %).`,
              ar: `سُرْعَةُ المُرْشِدِ القَادِمَةُ: ${s.pacer.target}`,
              en: `Next guide pace: ${s.pacer.target} wpm (adapts: +5 if you win with ≥ 80%, −5 below 60%).`,
            })}
          />
        ) : null}
        <Card>
          <AR size={22}>{passage.words.map((w) => w.ar).join(' ')}</AR>
          <T v="small" muted>{passage.gloss[gloss]}</T>
          <LicenseTag id={lic} compact />
        </Card>
        <Row>
          <Button title={pick({ fr: 'Rejouer', ar: 'أَعِدْ', en: 'Play again' })} icon="refresh" onPress={() => start(passage)} style={{ flex: 1 }} />
          <Button title={pick({ fr: 'Autre passage', ar: 'نَصّ آخَر', en: 'Other passage' })} kind="secondary" onPress={() => setMode('setup')} style={{ flex: 1 }} />
        </Row>
      </Screen>
    );
  }

  const best = s.pacer.sessions.reduce((m, x) => Math.max(m, x.score), 0);
  return (
    <Screen header={<Header title={pick({ fr: 'Course du guide', ar: 'السِّبَاق', en: 'Guide race' })} subtitle={pick({ fr: 'Lisez plus vite que le guide, sans perdre en précision.', ar: 'اِقْرَأْ أَسْرَعَ مِنَ المُرْشِدِ بِدِقَّةٍ', en: 'Read faster than the guide, without losing accuracy.' })} />}>
      <Card style={{ alignItems: 'center' }}>
        <AR size={36} center weight="700">{title}</AR>
        <T v="small" muted center>
          {pick({
            fr: 'Le guide avance à une allure fixe. Pour chaque mot, choisissez sa lecture (translittération). Score = vitesse (mots/min) × précision.',
            ar: 'يَتَقَدَّمُ المُرْشِدُ بِسُرْعَةٍ ثَابِتَةٍ. اِخْتَرْ قِرَاءَةَ كُلِّ كَلِمَةٍ.',
            en: 'The guide moves at a fixed pace. For each word, pick its reading (transliteration). Score = speed (wpm) × accuracy.',
          })}
        </T>
        <Row>
          <IconButton icon="remove-circle-outline" a11y={pick({ fr: 'Ralentir le guide', ar: 'أَبْطِئْ', en: 'Slow the guide' })} onPress={() => setTarget((x) => Math.max(10, x - 5))} />
          <View style={{ alignItems: 'center', minWidth: 110 }}>
            <T v="display">{target}</T>
            <T v="caption" muted>{pick({ fr: 'mots / minute', ar: 'كَلِمَة / دَقِيقَة', en: 'words / minute' })}</T>
          </View>
          <IconButton icon="add-circle-outline" a11y={pick({ fr: 'Accélérer le guide', ar: 'أَسْرِعْ', en: 'Speed up the guide' })} onPress={() => setTarget((x) => Math.min(60, x + 5))} />
        </Row>
        {best ? <T v="small" muted>{pick({ fr: 'Meilleur score', ar: 'أَفْضَلُ نَتِيجَة', en: 'Best score' })} : {best}</T> : null}
      </Card>
      <ToggleRow
        label={pick({ fr: 'Mode sans chrono (accessibilité)', ar: 'دُونَ تَوْقِيت', en: 'Untimed mode (accessibility)' })}
        sub={pick({ fr: 'Pas de guide ni de limite par mot ; vitesse mesurée quand même.', ar: 'بِلَا مُرْشِدٍ وَلَا حَدٍّ زَمَنِيّ', en: 'No guide or per-word limit; speed still measured.' })}
        value={untimed}
        onChange={(v) => setSettings({ untimedPacer: v })}
      />
      <Section title={pick({ fr: 'Passages', ar: 'النُّصُوص', en: 'Passages' })}>
        {PASSAGES.map((ps) => (
          <Card key={ps.id} onPress={() => start(ps)} a11y={`${pick({ fr: 'Lancer', ar: 'اِبْدَأْ', en: 'Start' })} ${ps.title[gloss]}`}>
            <Row style={{ justifyContent: 'space-between' }}>
              <View style={{ flex: 1 }}>
                <T v="h3">{lang === 'ar' ? ps.title.ar : ps.title[gloss]}</T>
                <T v="small" muted>{ps.words.length} {pick({ fr: 'mots', ar: 'كَلِمَات', en: 'words' })} · {pick({ fr: 'niveau', ar: 'المُسْتَوَى', en: 'level' })} {ps.level}</T>
              </View>
              <AR size={22}>{ps.title.ar}</AR>
              <Ionicons name="play-circle" size={32} color={p.primary} />
            </Row>
            <LicenseTag id={ps.license} compact />
          </Card>
        ))}
      </Section>
      {s.pacer.sessions.length ? (
        <Section title={pick({ fr: 'Dernières courses', ar: 'آخِرُ السِّبَاقَات', en: 'Recent races' })}>
          {s.pacer.sessions.slice(0, 5).map((x) => (
            <Row key={x.at} style={{ justifyContent: 'space-between', minHeight: 32 }}>
              <T v="small">{PASSAGES.find((q) => q.id === x.passage)?.title[gloss] ?? x.passage}</T>
              <T v="small" muted>{x.wpm} wpm · {Math.round(x.acc * 100)} % · {x.score} {x.won ? '🏆' : ''}</T>
            </Row>
          ))}
        </Section>
      ) : null}
    </Screen>
  );
}
