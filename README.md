# ArabGram

Application pour **apprendre à lire l’arabe** lettre après lettre, avec le tashkīl (voyelles brèves), en Expo (React Native + expo-router, TypeScript). Interface **français / العربية (RTL) / English**. Fonctionne sur iOS, Android et en **PWA installable** (web).

> Recréation complète à partir du cahier des charges (le code d’origine n’était pas disponible).

## Fonctionnalités (100 % locales, hors ligne, sans compte)

- **Accueil en 3 étapes** : langue de l’interface, niveau de départ (unité 1, 5 ou 7), objectif quotidien.
- **Parcours de 11 unités / ~25 leçons** : alphabet (formes isolée, initiale, médiane, finale), ḥarakāt, voyelles longues, tanwīn, shadda, salutations, famille, nombres, pronoms et phrase nominale, proverbes et vers classiques.
- **Exercices** : arabe → sens, sens → arabe, arabe → translittération. Correction immédiate, les erreurs reviennent une fois en fin de série. Une leçon est réussie à 60 % ; l’unité suivante s’ouvre quand toutes ses leçons sont réussies.
- **Révisions espacées (Leitner, 5 boîtes)** : intervalles de 0, 1, 3, 7 et 16 jours. Une bonne réponse fait monter l’élément d’une boîte, une erreur le renvoie en boîte 1. L’onglet affiche une pastille avec le nombre d’éléments à revoir.
- **Course du guide « سباق المرشد »** : le guide lit à une allure fixe (mots/minute) ; pour chaque mot, choisissez la bonne lecture.
  - Score = vitesse × précision.
  - L’allure s’adapte : +5 si vous gagnez avec ≥ 80 % de précision, −5 sous 60 %.
  - **Mode sans chrono** pour l’accessibilité.
- **Test de tashkīl** :
  - rendu des diacritiques à plusieurs tailles, police Noto Naskh ou police système ;
  - composeur lettre + signe → translittération ;
  - quiz de 10 paires minimales (كَتَبَ / كُتِبَ / كُتُب…).
- **Audio** : prononciation par la **voix arabe installée sur l’appareil** (expo-speech). Aucun service payant ; un message s’affiche si aucune voix arabe n’est installée.
- **Progrès** : XP, série de jours, précision, boîtes Leitner, avancement par unité, historique des courses, meilleur score au test de tashkīl.
- **Accessibilité** :
  - zones tactiles ≥ 44 pt ;
  - taille du texte et taille de l’arabe réglables ;
  - contraste élevé, thèmes clair et sombre ;
  - translittération masquable, animations réduites ;
  - libellés pour lecteurs d’écran ; `lang`/`dir` corrects en arabe.
- Export JSON de la progression ; réinitialisation.

## Contenu et licences

Chaque leçon et chaque passage affiche son étiquette de licence. L’écran **Sources et licences** les récapitule.

| Étiquette | Contenu |
|---|---|
| Contenu original ArabGram | vocabulaire, phrases, translittérations, traductions, exercices rédigés pour l’app. **Licence de diffusion à confirmer par le propriétaire** (proposition : CC BY-SA 4.0) |
| Domaine public — proverbes | proverbes arabes traditionnels, sans auteur identifiable |
| Domaine public — poésie classique | vers d’al-Mutanabbī (m. 965) et d’Imruʾ al-Qays (VIe s.) ; traductions originales |
| **Placeholder / non licencié — à remplacer** | leçon `u11l3` (lecture longue) : volontairement vide, à remplir avec un texte possédé ou sous licence ouverte |

Composants tiers :
- Noto Naskh Arabic (SIL OFL 1.1, `assets/fonts/`) ;
- Ionicons (MIT) ;
- Expo / React Native (MIT).

Aucun manuel, enregistrement audio ou texte protégé n’est inclus.

## Lancer en local

```bash
npm install
npx expo start          # iOS / Android (Expo Go) ou « w » pour le web
```

## Build web / PWA

```bash
npm run typecheck       # tsc --noEmit
npm run build:web       # expo export -p web + manifest, service worker, icônes, 404.html
npm run serve:web       # http://localhost:8080/arabgram/
```

`dist/` est une PWA installable : elle fonctionne hors ligne après la première visite, le service worker précache tous les fichiers.

## GitHub Pages

Le workflow `.github/workflows/pages.yml` construit `dist/` et le publie à chaque push sur `main`. Il faut activer **Settings → Pages → Source : GitHub Actions**.

Dans `app.json`, `expo.experiments.baseUrl` vaut `/arabgram`. **Le dépôt doit donc s’appeler `arabgram`** ; sinon, ajustez cette valeur.

## Configuration (placeholders)

Le cœur n’a besoin d’**aucune** variable. Le fichier `.env.example` ne contient que la phase 2 :

- `EXPO_PUBLIC_TUTOR_API_URL=YOUR_TUTOR_API_URL` : l’URL publique de **votre** serveur tuteur (aucun secret).
- `OPENAI_API_KEY` : **côté serveur uniquement**, jamais dans l’app ni dans une variable `EXPO_PUBLIC_*`.

L’écran « Tuteur IA » indique clairement que l’IA n’est pas active.

## Limites connues

- Le tuteur IA (phase 2) n’est pas branché : il reste à écrire le serveur et l’intégration.
- La qualité de l’audio dépend de la voix système. Sur le web, certains navigateurs n’ont pas de voix arabe.
- La leçon de lecture longue `u11l3` est un placeholder.
- La licence du contenu original reste à confirmer par le propriétaire.
- Identifiants iOS et Android : `com.yourcompany.arabgram`, à remplacer avant de publier sur les stores.
- Pas de synchronisation entre appareils : les données restent locales, mais l’export JSON est possible.
