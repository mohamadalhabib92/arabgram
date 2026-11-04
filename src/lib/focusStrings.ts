import type { FocusRecord } from '@/kit/focus';
import type { FocusStrings, GuideStrings } from '@/kit/FocusUI';
import type { UiLang } from '@/state';

/**
 * Textes du Mode Focus (FR / AR / EN). Nouveaux textes arabes : à relire
 * (liste dans la description de la PR). Aucun texte arabe existant n’est modifié.
 */
type L = { fr: string; ar: string; en: string };
const pickL = (o: L, lang: UiLang) => o[lang];

export type FocusScreenText = {
  screenTitle: string;
  screenSub: string;
  duration: string;
  durationA11y: (n: number) => string;
  during: string;
  nextLesson: (title: string) => string;
  thisLesson: (title: string) => string;
  reviewDue: (n: number) => string;
  review: string;
  nothingToStudy: string;
  promise: string[];
  start: (n: number) => string;
  activeTitle: string;
  resume: string;
  history: string;
  historyEmpty: string;
  totals: (sessions: number, completed: number, minutes: number) => string;
  completed: string;
  emergencyOutcome: string;
  interruptions: (n: number) => string;
  guideAgain: string;
  started: (n: number) => string;
  entryTitle: string;
  entryText: string;
  entryA11y: string;
};

export function focusText(lang: UiLang, num: (n: number) => string) {
  const n = num;
  const ui: FocusStrings = {
    title: pickL({ fr: 'Mode Focus', ar: 'وَضْعُ التَّرْكِيزِ', en: 'Focus mode' }, lang),
    ringLabel: pickL({ fr: 'temps de concentration écoulé', ar: 'الوَقْتُ المُنْقَضِي', en: 'focus time elapsed' }, lang),
    remaining: (m) => (lang === 'ar' ? `المُتَبَقِّي: ${n(m)} دَقِيقَة` : lang === 'en' ? `${n(m)} min left` : `${n(m)} min restante${m > 1 ? 's' : ''}`),
    minShort: pickL({ fr: 'min', ar: 'د', en: 'min' }, lang),
    calm: pickL(
      {
        fr: 'Une chose à la fois. L’écran reste allumé, l’app reste silencieuse.',
        ar: 'شَيْءٌ وَاحِدٌ فِي كُلِّ مَرَّةٍ. تَبْقَى الشَّاشَةُ مُضَاءَةً وَيَبْقَى التَّطْبِيقُ صَامِتًا.',
        en: 'One thing at a time. The screen stays on, the app stays quiet.',
      },
      lang,
    ),
    emergency: pickL({ fr: 'Sortie d’urgence', ar: 'خُرُوجٌ طَارِئٌ', en: 'Emergency exit' }, lang),
    emergencyHint: pickL({ fr: 'Maintenez 3 secondes, puis confirmez', ar: 'اِضْغَطْ مُطَوَّلًا ثَلَاثَ ثَوَانٍ ثُمَّ أَكِّدْ', en: 'Hold for 3 seconds, then confirm' }, lang),
    holding: (s) => (lang === 'ar' ? `وَاصِلِ الضَّغْطَ… ${n(s)} ث` : lang === 'en' ? `Keep holding… ${n(s)} s` : `Maintenez… ${n(s)} s`),
    confirmTitle: pickL({ fr: 'Quitter le Mode Focus ?', ar: 'الخُرُوجُ مِنْ وَضْعِ التَّرْكِيزِ؟', en: 'Leave focus mode?' }, lang),
    confirmText: (m) =>
      lang === 'ar'
        ? `المُتَبَقِّي: ${n(m)} دَقِيقَة. سَتُسَجَّلُ الجَلْسَةُ كَجَلْسَةٍ مُنْقَطِعَةٍ.`
        : lang === 'en'
          ? `${n(m)} min left. The session will be saved as interrupted.`
          : `Il reste ${n(m)} min. La session sera enregistrée comme interrompue.`,
    stay: pickL({ fr: 'Rester concentré', ar: 'اِبْقَ مُرَكِّزًا', en: 'Stay focused' }, lang),
    leave: pickL({ fr: 'Quitter', ar: 'خُرُوج', en: 'Leave' }, lang),
    left: pickL({ fr: 'Mode Focus quitté', ar: 'تَمَّ الخُرُوجُ مِنْ وَضْعِ التَّرْكِيزِ', en: 'Focus mode ended' }, lang),
    successTitle: pickL({ fr: 'Session terminée', ar: 'اِنْتَهَتِ الجَلْسَةُ', en: 'Session complete' }, lang),
    successText: (r: FocusRecord) =>
      lang === 'ar'
        ? `${n(r.plannedMinutes)} دَقِيقَة مِنَ التَّرْكِيزِ · ${r.interruptions === 0 ? 'دُونَ انْقِطَاعٍ' : `الاِنْقِطَاعَاتُ: ${n(r.interruptions)}`}`
        : lang === 'en'
          ? `${n(r.plannedMinutes)} min of focus · ${r.interruptions === 0 ? 'no interruptions' : `${n(r.interruptions)} interruption${r.interruptions > 1 ? 's' : ''}`}`
          : `${n(r.plannedMinutes)} min de concentration · ${r.interruptions === 0 ? 'aucune interruption' : `${n(r.interruptions)} interruption${r.interruptions > 1 ? 's' : ''}`}`,
    successButton: pickL({ fr: 'Continuer', ar: 'تَابِعْ', en: 'Continue' }, lang),
    num: n,
  };

  const guide: GuideStrings = {
    title: pickL({ fr: 'Pour aller plus loin (à régler une fois)', ar: 'لِتَرْكِيزٍ أَعْمَقَ (يُضْبَطُ مَرَّةً وَاحِدَةً)', en: 'Going further (set up once)' }, lang),
    honest: pickL(
      {
        fr: 'En toute honnêteté : sur un iPhone personnel, aucune app ne peut verrouiller le téléphone ni bloquer les notifications des autres apps. Le Mode Focus garde l’écran allumé et rend ArabGram silencieux ; pour le reste, utilisez les outils du système ci-dessous.',
        ar: 'بِصَرَاحَةٍ: عَلَى آيْفُون شَخْصِيٍّ لَا يَسْتَطِيعُ أَيُّ تَطْبِيقٍ قَفْلَ الهَاتِفِ وَلَا حَجْبَ إِشْعَارَاتِ التَّطْبِيقَاتِ الأُخْرَى. يُبْقِي وَضْعُ التَّرْكِيزِ الشَّاشَةَ مُضَاءَةً وَيَجْعَلُ ArabGram صَامِتًا؛ وَلِلْبَاقِي اسْتَخْدِمْ أَدَوَاتِ النِّظَامِ أَدْنَاهُ.',
        en: 'To be honest: on a personal iPhone, no app can lock the phone or block other apps’ notifications. Focus mode keeps the screen on and makes ArabGram quiet; for the rest, use the system tools below.',
      },
      lang,
    ),
    sections: [
      {
        title: pickL({ fr: 'iPhone : Accès guidé (triple-clic)', ar: 'آيْفُون: الوُصُولُ المُوَجَّهُ (ثَلَاثُ ضَغَطَاتٍ)', en: 'iPhone: Guided Access (triple-click)' }, lang),
        steps: [
          pickL({ fr: 'Réglages › Accessibilité › Accès guidé : activez-le et choisissez un code.', ar: 'الإِعْدَادَاتُ › تَسْهِيلَاتُ الاِسْتِخْدَامِ › الوُصُولُ المُوَجَّهُ: فَعِّلْهُ وَاخْتَرْ رَمْزًا.', en: 'Settings › Accessibility › Guided Access: turn it on and choose a passcode.' }, lang),
          pickL({ fr: 'Au début de la session, triple-cliquez le bouton latéral (ou principal), puis touchez « Démarrer ».', ar: 'فِي بِدَايَةِ الجَلْسَةِ اضْغَطِ الزِّرَّ الجَانِبِيَّ (أَوْ زِرَّ الصَّفْحَةِ الرَّئِيسِيَّةِ) ثَلَاثَ مَرَّاتٍ، ثُمَّ «بَدْء».', en: 'When the session starts, triple-click the side (or Home) button, then tap “Start”.' }, lang),
          pickL({ fr: 'Pour sortir : triple-clic, code, puis « Fin ».', ar: 'لِلْخُرُوجِ: ثَلَاثُ ضَغَطَاتٍ، ثُمَّ الرَّمْزُ، ثُمَّ «إِنْهَاء».', en: 'To leave: triple-click, passcode, then “End”.' }, lang),
        ],
      },
      {
        title: pickL({ fr: 'iPhone : une Concentration « Étude » ou « Prière »', ar: 'آيْفُون: تَرْكِيزُ «دِرَاسَة» أَوْ «صَلَاة»', en: 'iPhone: a “Study” or “Prayer” Focus' }, lang),
        steps: [
          pickL({ fr: 'Réglages › Concentration › « + » › Personnalisée : nommez-la « Étude » ou « Prière ».', ar: 'الإِعْدَادَاتُ › التَّرْكِيزُ › «+» › مُخَصَّص: سَمِّهِ «دِرَاسَة» أَوْ «صَلَاة».', en: 'Settings › Focus › “+” › Custom: name it “Study” or “Prayer”.' }, lang),
          pickL({ fr: 'N’autorisez que les personnes et apps indispensables.', ar: 'اِسْمَحْ فَقَطْ بِالأَشْخَاصِ وَالتَّطْبِيقَاتِ الضَّرُورِيَّةِ.', en: 'Allow only the people and apps you really need.' }, lang),
          pickL({ fr: 'Activez-la depuis le Centre de contrôle avant la session.', ar: 'فَعِّلْهُ مِنْ مَرْكَزِ التَّحَكُّمِ قَبْلَ الجَلْسَةِ.', en: 'Turn it on from Control Center before the session.' }, lang),
        ],
      },
      {
        title: pickL({ fr: 'Android : épingler l’app', ar: 'أَنْدْرُويْد: تَثْبِيتُ التَّطْبِيقِ عَلَى الشَّاشَةِ', en: 'Android: pin the app' }, lang),
        steps: [
          pickL({ fr: 'Paramètres › Sécurité (› Plus de paramètres) › Épinglage d’application : activez-le.', ar: 'الإِعْدَادَاتُ › الأَمَانُ › تَثْبِيتُ التَّطْبِيقِ: فَعِّلْهُ.', en: 'Settings › Security (› More settings) › App pinning: turn it on.' }, lang),
          pickL({ fr: 'Ouvrez les apps récentes, touchez l’icône d’ArabGram, puis « Épingler ».', ar: 'اِفْتَحْ قَائِمَةَ التَّطْبِيقَاتِ الأَخِيرَةِ، وَالْمِسْ أَيْقُونَةَ ArabGram، ثُمَّ «تَثْبِيت».', en: 'Open Recents, tap the ArabGram icon, then “Pin”.' }, lang),
          pickL({ fr: 'Pour désépingler : maintenez Retour et Aperçu ensemble (ou balayez vers le haut et maintenez, selon le téléphone).', ar: 'لِإِلْغَاءِ التَّثْبِيتِ: اضْغَطْ مُطَوَّلًا عَلَى «رُجُوع» وَ«النَّظْرَة العَامَّة» مَعًا (أَوِ اسْحَبْ لِلْأَعْلَى وَاسْتَمِرَّ، حَسَبَ الهَاتِفِ).', en: 'To unpin: hold Back and Overview together (or swipe up and hold, depending on the phone).' }, lang),
        ],
      },
      {
        title: pickL({ fr: 'Android : Ne pas déranger', ar: 'أَنْدْرُويْد: عَدَمُ الإِزْعَاجِ', en: 'Android: Do Not Disturb' }, lang),
        steps: [
          pickL({ fr: 'Paramètres › Notifications › Ne pas déranger (ou « Modes ») : activez-le avant la session.', ar: 'الإِعْدَادَاتُ › الإِشْعَارَاتُ › عَدَمُ الإِزْعَاجِ: فَعِّلْهُ قَبْلَ الجَلْسَةِ.', en: 'Settings › Notifications › Do Not Disturb (or “Modes”): turn it on before the session.' }, lang),
        ],
      },
    ],
    footnote: pickL(
      {
        fr: 'Les noms des menus varient selon la version et la marque du téléphone. ArabGram ne s’épingle pas tout seul dans cette version.',
        ar: 'تَخْتَلِفُ أَسْمَاءُ القَوَائِمِ حَسَبَ الإِصْدَارِ وَالشَّرِكَةِ المُصَنِّعَةِ. لَا يُثَبِّتُ ArabGram نَفْسَهُ تِلْقَائِيًّا فِي هٰذَا الإِصْدَارِ.',
        en: 'Menu names vary by OS version and phone brand. ArabGram does not pin itself in this version.',
      },
      lang,
    ),
    ok: pickL({ fr: 'J’ai compris', ar: 'فَهِمْتُ', en: 'Got it' }, lang),
    num: n,
  };

  const screen: FocusScreenText = {
    screenTitle: ui.title,
    screenSub: pickL({ fr: `Une session sans distraction, de ${n(10)} à ${n(30)} min`, ar: `جَلْسَةٌ بِلَا تَشْتِيتٍ، مِنْ ${n(10)} إِلَى ${n(30)} دَقِيقَة`, en: `A distraction-free session, ${n(10)} to ${n(30)} min` }, lang),
    duration: pickL({ fr: 'Durée', ar: 'المُدَّة', en: 'Duration' }, lang),
    durationA11y: (m) => (lang === 'ar' ? `${n(m)} دَقِيقَة` : lang === 'en' ? `${n(m)} minutes` : `${n(m)} minutes`),
    during: pickL({ fr: 'Pendant la session', ar: 'أَثْنَاءَ الجَلْسَةِ', en: 'During the session' }, lang),
    nextLesson: (title) => (lang === 'ar' ? `الدَّرْسُ التَّالِي: ${title}` : lang === 'en' ? `Next lesson: ${title}` : `Leçon suivante : ${title}`),
    thisLesson: (title) => (lang === 'ar' ? `هٰذَا الدَّرْسُ: ${title}` : lang === 'en' ? `This lesson: ${title}` : `Cette leçon : ${title}`),
    reviewDue: (c) => (lang === 'ar' ? `المُرَاجَعَة (${n(c)})` : lang === 'en' ? `Review (${n(c)} due)` : `Révisions (${n(c)} à revoir)`),
    review: pickL({ fr: 'Révisions', ar: 'المُرَاجَعَة', en: 'Review' }, lang),
    nothingToStudy: pickL({ fr: 'Parcours terminé : la session ouvrira l’onglet Apprendre.', ar: 'اِكْتَمَلَ المَسَارُ: سَتَفْتَحُ الجَلْسَةُ صَفْحَةَ «تَعَلَّمْ».', en: 'Path complete: the session will open the Learn tab.' }, lang),
    promise: [
      pickL({ fr: 'Plein écran, sans barre d’onglets : la leçon et les exercices continuent dedans.', ar: 'شَاشَةٌ كَامِلَةٌ بِلَا شَرِيطِ تَبْوِيبٍ: يَسْتَمِرُّ الدَّرْسُ وَالتَّمَارِينُ دَاخِلَهَا.', en: 'Full screen, no tab bar: the lesson and drills carry on inside it.' }, lang),
      pickL({ fr: 'L’écran reste allumé et les messages de l’app sont en sourdine.', ar: 'تَبْقَى الشَّاشَةُ مُضَاءَةً وَتُكْتَمُ رَسَائِلُ التَّطْبِيقِ.', en: 'The screen stays on and the app’s messages are muted.' }, lang),
      pickL({ fr: 'Avant la fin, on ne sort que par la « Sortie d’urgence » (maintenir 3 s, puis confirmer).', ar: 'قَبْلَ النِّهَايَةِ لَا خُرُوجَ إِلَّا بِـ«الخُرُوجِ الطَّارِئِ» (ضَغْطٌ مُطَوَّلٌ ثَلَاثَ ثَوَانٍ ثُمَّ تَأْكِيدٌ).', en: 'Before the end, the only way out is “Emergency exit” (hold 3 s, then confirm).' }, lang),
      pickL({ fr: 'Le minuteur continue si vous quittez l’app ; chaque sortie est notée.', ar: 'يَسْتَمِرُّ المُؤَقِّتُ إِنْ غَادَرْتَ التَّطْبِيقَ، وَتُسَجَّلُ كُلُّ مُغَادَرَةٍ.', en: 'The timer keeps running if you leave the app; each exit is noted.' }, lang),
    ],
    start: (m) => (lang === 'ar' ? `اِبْدَأْ: ${n(m)} دَقِيقَة` : lang === 'en' ? `Start ${n(m)} min` : `Lancer ${n(m)} min`),
    activeTitle: pickL({ fr: 'Session en cours', ar: 'جَلْسَةٌ جَارِيَةٌ', en: 'Session in progress' }, lang),
    resume: pickL({ fr: 'Reprendre', ar: 'اِسْتِئْنَاف', en: 'Resume' }, lang),
    history: pickL({ fr: 'Vos sessions', ar: 'جَلَسَاتُكَ', en: 'Your sessions' }, lang),
    historyEmpty: pickL({ fr: 'Aucune session pour l’instant.', ar: 'لَا تُوجَدُ جَلَسَاتٌ بَعْدُ.', en: 'No sessions yet.' }, lang),
    totals: (s, c, m) =>
      lang === 'ar'
        ? `الجَلَسَاتُ: ${n(s)} · المُكْتَمِلَةُ: ${n(c)} · ${n(m)} دَقِيقَة`
        : lang === 'en'
          ? `${n(s)} sessions · ${n(c)} completed · ${n(m)} min`
          : `${n(s)} session${s > 1 ? 's' : ''} · ${n(c)} terminée${c > 1 ? 's' : ''} · ${n(m)} min`,
    completed: pickL({ fr: 'Terminée', ar: 'مُكْتَمِلَة', en: 'Completed' }, lang),
    emergencyOutcome: pickL({ fr: 'Sortie d’urgence', ar: 'خُرُوجٌ طَارِئٌ', en: 'Emergency exit' }, lang),
    interruptions: (c) => (lang === 'ar' ? `الاِنْقِطَاعَاتُ: ${n(c)}` : lang === 'en' ? `${n(c)} interruption${c === 1 ? '' : 's'}` : `${n(c)} interruption${c > 1 ? 's' : ''}`),
    guideAgain: pickL({ fr: 'Revoir le guide iPhone / Android', ar: 'إِعَادَةُ عَرْضِ دَلِيلِ آيْفُون / أَنْدْرُويْد', en: 'See the iPhone / Android guide again' }, lang),
    started: (m) => (lang === 'ar' ? `بَدَأَ وَضْعُ التَّرْكِيزِ: ${n(m)} دَقِيقَة` : lang === 'en' ? `Focus mode started: ${n(m)} minutes` : `Mode Focus lancé : ${n(m)} minutes`),
    entryTitle: ui.title,
    entryText: pickL({ fr: `Une leçon sans distraction, de ${n(10)} à ${n(30)} min.`, ar: `دَرْسٌ بِلَا تَشْتِيتٍ، مِنْ ${n(10)} إِلَى ${n(30)} دَقِيقَة.`, en: `A distraction-free lesson, ${n(10)} to ${n(30)} min.` }, lang),
    entryA11y: pickL({ fr: 'Ouvrir le Mode Focus', ar: 'فَتْحُ وَضْعِ التَّرْكِيزِ', en: 'Open focus mode' }, lang),
  };
  return { ui, guide, screen };
}
