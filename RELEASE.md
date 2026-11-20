# Release next

`release/next` est la branche des builds iOS (iPhone, iPad, Mac Apple Silicon, et le profil Apple TV). Elle n’est pas `main`.

`main` publie uniquement la PWA, via `.github/workflows/pages.yml` (push sur `main`). Ne pas fusionner cette branche dans `main` sans accord : un push sur `main` déploie le site.

## Ce que la CI vérifie

`.github/workflows/ci.yml` part sur chaque push et chaque pull request, y compris `release/next` :

1. `npm run typecheck`
2. `npm test` (persistance, livre, grammaire, Mac, accessibilité, Focus, verre, scan VoiceOver, script Apple TV)
3. `npx expo export --platform web`

Cet export ne signe rien, ne touche pas aux identifiants, et n’envoie rien sur TestFlight ni sur GitHub Pages.

## TestFlight — iPhone, iPad et Mac

Même binaire iOS, même bundle `ch.mohamadba.arabgram`, profil EAS `production`. Le Mac est l’app iPad sur Apple Silicon : pas de second bundle, pas de cible Catalyst. `eas.json` et `app.json` ne changent pas pour ce train.

Depuis un clone à jour de **cette** branche :

```bash
git checkout release/next
git pull
npm ci
npx eas build --platform ios --profile production
npx eas submit --platform ios --profile production
```

Ensuite, dans App Store Connect, ouvrir le build dans TestFlight (pas la fiche prête pour la revue, et pas « Soumettre pour vérification »). Le build doit indiquer iPhone, iPad et Mac. L’installer avec TestFlight sur iPhone et avec TestFlight pour Mac.

`production` incrémente le numéro de build côté Expo (`autoIncrement`). Le `buildNumber` du fichier `app.json` reste `1`. Ne pas lancer ces commandes depuis `main`.

## TestFlight — Apple TV

Profil séparé `production-tv` (`EXPO_TV=1` seulement dans ce profil). Même bundle, build tvOS `2`, slug `arabgram-tv`. Il faut d’abord le projet Expo `arabgram-tv` et son `projectId` à la place de `SET_ON_EXPO_ARABGRAM_TV`. Sans ça, le build s’arrête : le compteur iPhone ne doit pas servir à la télé.

```bash
git checkout release/next
npx eas build --platform ios --profile production-tv
```

Puis envoyer ce build sur la plateforme tvOS de la même fiche (achat universel), toujours via TestFlight, pas via une soumission App Store.

## Ce qu’on ne fait pas depuis ici

Pas de `eas submit` vers la revue App Store, pas de changement de bundle, d’équipe, d’entitlements ou de signature, pas de migration. Les clés de compte restent dans Expo et App Store Connect, pas dans le dépôt.
