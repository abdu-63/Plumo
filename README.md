# Plumo

**Plumo** est une plateforme moderne de streaming d'animés axée sur une expérience utilisateur premium. Elle propose une interface élégante et responsive, des contrôles de lecture robustes et un historique de visionnage personnalisé synchronisé sur votre compte.

## Fonctionnalités

- **Streaming Immersif** : Lecture vidéo de haute qualité intégrée avec `Plyr`.
- **Reprise de Lecture** : Mémorise intelligemment votre dernière position de visionnage pour chaque épisode. Synchronisation automatique entre local et serveur.
- **Historique de Visionnage** : Suit votre progression sur tous vos appareils (Authentification via Firebase).
- **Système de Favoris** : Sauvegardez et gérez vos séries préférées.
- **Intégration Torrent** : Accès direct aux liens torrent pour un visionnage hors ligne de meilleure qualité.
- **Design Responsive** : Entièrement optimisé pour les expériences sur ordinateur et mobile.

## Stack Technique

- **Framework** : [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Style** : CSS Modules (Intégration Vanilla CSS)
- **Authentification** : NextAuth.js
- **Backend / Base de données** : Firebase (Firestore, Admin SDK)
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

    Créez un fichier `.env.local` à la racine du projet. Vous aurez besoin d'un projet Firebase configuré. 
    
    > **Note :** Le projet utilise à la fois le SDK Client (pour le frontend) et le SDK Admin (pour les routes API protégées).

    ```env
    # --- Configuration Client Firebase (Visible dans la console Firebase) ---
    NEXT_PUBLIC_FIREBASE_API_KEY=votre_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=votre_project_id.firebaseapp.com
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=votre_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=votre_project_id.appspot.com
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=votre_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=votre_app_id
    
    # --- Configuration Admin Firebase (Compte de Service) ---
    # Générez une clé privée via : Paramètres du projet > Comptes de service > Générer une nouvelle clé privée
    # Collez le contenu JSON complet sur une seule ligne (ou tel quel si votre environnement le supporte).
    GOOGLE_SERVICE_KEY='{"type": "service_account", "project_id": "...", ...}'
    
    # (Optionnel) Fallback legacy si GOOGLE_SERVICE_KEY n'est pas utilisé
    FIREBASE_PROJECT_ID=votre_project_id
    FIREBASE_CLIENT_EMAIL=votre_email_service_account
    FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."

    # --- Configuration NextAuth ---
    NEXTAUTH_SECRET=générez_une_chain_aléatoire_avec_openssl_rand_base64_32
    NEXTAUTH_URL=http://localhost:3000
    
    # --- Fournisseurs OAuth ---
    DISCORD_CLIENT_ID=...
    DISCORD_CLIENT_SECRET=...
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
- `src/hooks/` : Hooks personnalisés (ex: `useWatchHistory`, `useFavorites`).
- `src/lib/` : Utilitaires et initialisation des clients Firebase (Admin & Client).

## Contribuer

Les contributions sont les bienvenues ! N'hésitez pas à soumettre une Pull Request.

---
*Plumo - Vos Animés, Votre Façon.*

*Temps de développement : 37h*