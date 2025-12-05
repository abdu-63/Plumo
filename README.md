# Plumo

**Plumo** est une plateforme moderne de streaming d'animés axée sur une expérience utilisateur premium. Elle propose une interface élégante et responsive, des contrôles de lecture robustes et un historique de visionnage personnalisé.

## Fonctionnalités

- **Streaming Immersif** : Lecture vidéo de haute qualité intégrée avec `Plyr`.
- **Reprise de Lecture** : Mémorise intelligemment votre dernière position de visionnage pour chaque épisode. Options "Reprendre là où vous êtiez".
- **Historique de Visionnage** : Suit votre progression sur tous vos appareils (authentification via Firebase) ou localement.
- **Système de Favoris** : Sauvegardez et gérez vos séries préférées.
- **Intégration Torrent** : Accès direct aux liens torrent pour un visionnage hors ligne de meilleure qualité.
- **Design Responsive** : Entièrement optimisé pour les expériences sur ordinateur et mobile.

## Stack Technique

- **Framework** : [Next.js](https://nextjs.org/) (App Router)
- **Style** : CSS Modules (Intégration Vanilla CSS)
- **Authentification** : NextAuth.js
- **Backend / Base de données** : Firebase (Firestore)
- **Lecteur Média** : Plyr-React
- **Icônes** : Lucide React

## Commencer

### Prérequis

- Node.js (v18 ou supérieur recommandé)
- NPM (Node Package Manager)

### Installation

1.  **Cloner le dépôt**

    ```bash
    git clone https://github.com/votre-nom-utilisateur/plumo.git
    cd plumo
    ```

2.  **Installer les dépendances**

    ```bash
    npm install
    ```

3.  **Configuration de l'environnement**

    Créez un fichier `.env` à la racine du projet. Vous aurez besoin d'un projet Firebase configuré. Ajoutez vos identifiants comme suit :

    ```env
    # Configuration Client Firebase
    NEXT_PUBLIC_FIREBASE_API_KEY=votre_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=votre_project_id.firebaseapp.com
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=votre_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=votre_project_id.appspot.com
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=votre_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=votre_app_id
    
    # Configuration NextAuth
    NEXTAUTH_SECRET=votre_nextauth_secret
    NEXTAUTH_URL=http://localhost:3000
    ```

4.  **Lancer le serveur de développement**

    ```bash
    npm run dev
    ```

    Ouvrez [http://localhost:3000](http://localhost:3000) avec votre navigateur pour commencer à utiliser Plumo.

## Structure du Projet

- `src/app/` : Pages et mises en page du Next.js App Router.
- `src/components/` : Composants UI réutilisables (Navbar, VideoPlayer, EpisodeList, etc.).
- `src/data/` : Définitions de données statiques pour les séries et épisodes.
- `src/hooks/` : Hooks personnalisés (ex: `useWatchHistory` pour gérer l'état de visionnage).
- `src/lib/` : Utilitaires et initialisation du client Firebase.

## Contribuer

Les contributions sont les bienvenues ! N'hésitez pas à soumettre une Pull Request.

---
*Plumo - Vos Animés, Votre Façon.*

*Temps de développement : 24h30*