# Qui veut gagner des millions

Application web inspirée du jeu **Qui veut gagner des millions ?**, développée avec **Symfony** côté backend et **React** côté frontend.

Le projet permet à un utilisateur de créer un compte, de se connecter, de gérer un profil de jeu, de choisir un thème de questions, de lancer une partie, d'utiliser des jokers, de cumuler des gains fictifs et d'enregistrer ses statistiques.

---

## Sommaire

- [Présentation](#présentation)
- [Fonctionnalités principales](#fonctionnalités-principales)
- [Stack technique](#stack-technique)
- [Architecture du projet](#architecture-du-projet)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration de l'environnement](#configuration-de-lenvironnement)
- [Base de données](#base-de-données)
- [Lancement du projet](#lancement-du-projet)
- [Scripts disponibles](#scripts-disponibles)
- [Routes principales](#routes-principales)
- [Sécurité et authentification](#sécurité-et-authentification)
- [Points d'attention](#points-dattention)
- [Pistes d'amélioration](#pistes-damélioration)
- [Auteur](#auteur)

---

## Présentation

Ce projet reprend les grands principes du jeu **Qui veut gagner des millions ?** :

- une progression sur plusieurs questions ;
- une pyramide de gains ;
- des thèmes de questions ;
- trois jokers : 50/50, appel à un ami et vote du public ;
- un système de compte utilisateur ;
- un ou plusieurs profils de jeu ;
- un enregistrement des résultats de partie ;
- une partie administration.

L'application est construite avec **Symfony 6.3** pour la partie serveur et **React 18** pour l'interface utilisateur. Les assets frontend sont gérés avec **Vite**.

---

## Fonctionnalités principales

### Utilisateur

- Inscription.
- Connexion.
- Déconnexion.
- Vérification de compte par token.
- Réinitialisation de mot de passe.
- Récupération de l'utilisateur connecté.
- Gestion d'un compte ou profil de jeu.

### Jeu

- Choix d'un thème de questions.
- Lancement d'une partie.
- Affichage des questions et réponses.
- Gestion d'un chronomètre.
- Progression dans la pyramide des gains.
- Calcul des gains fictifs.
- Enregistrement des statistiques de partie.

### Jokers

- 50/50.
- Appel à un ami.
- Vote du public.

### Administration

- Accès réservé aux utilisateurs administrateurs.
- Gestion prévue des éléments nécessaires au jeu : thèmes, questions, réponses et statistiques.

---

## Stack technique

### Backend

- PHP >= 8.1
- Symfony 6.3
- Doctrine ORM
- Doctrine Migrations
- Symfony Security
- Symfony Validator
- Symfony Mailer
- Twig

### Frontend

- React 18
- React Router DOM
- Vite
- Tailwind CSS
- Flowbite
- SweetAlert2
- use-sound

### Base de données

Le projet utilise Doctrine. La base peut donc être configurée selon l'environnement local.

L'exemple principal ci-dessous utilise **MySQL / MariaDB**, cohérent avec l'environnement de développement habituel du projet.

Le fichier `.env` généré par Symfony peut contenir une URL PostgreSQL par défaut. Cette valeur doit être adaptée dans `.env.local` selon la base réellement utilisée.

---

## Architecture du projet

Structure générale :

```text
.
├── assets/
│   ├── js/
│   │   ├── app.jsx
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── templates/
│   └── styles/
├── config/
│   ├── packages/
│   └── routes.yaml
├── migrations/
├── public/
├── src/
│   ├── Controller/
│   ├── Entity/
│   ├── Repository/
│   └── Service/
├── templates/
├── composer.json
├── package.json
├── vite.config.js
└── README.md
```

### Backend Symfony

Le backend gère notamment :

- les routes API ;
- l'authentification ;
- les sessions ;
- les utilisateurs ;
- les comptes de jeu ;
- les thèmes ;
- les questions ;
- les parties ;
- les statistiques.

### Frontend React

Le frontend gère notamment :

- la navigation ;
- les pages publiques ;
- les pages utilisateur ;
- l'interface de jeu ;
- les appels API ;
- l'affichage conditionnel selon l'authentification et le rôle utilisateur.

---

## Prérequis

Avant installation, vérifier que les outils suivants sont disponibles :

- PHP 8.1 ou supérieur ;
- Composer ;
- Node.js ;
- npm ;
- Symfony CLI, recommandé ;
- MySQL ou MariaDB ;
- Git.

Exemples de vérification :

```bash
php -v
composer -V
node -v
npm -v
symfony -v
mysql --version
```

---

## Installation

Cloner le dépôt :

```bash
git clone https://github.com/JulienCod/qui-veut-gagner-des-millions.git
cd qui-veut-gagner-des-millions
```

Installer les dépendances PHP :

```bash
composer install
```

Installer les dépendances JavaScript :

```bash
npm install
```

---

## Configuration de l'environnement

Créer un fichier `.env.local` pour la configuration locale :

```bash
cp .env .env.local
```

Adapter au minimum les variables suivantes :

```env
APP_ENV=dev
APP_DEBUG=1
DATABASE_URL="mysql://root:@127.0.0.1:3306/qui_veut_gagner_des_millions?serverVersion=8.0&charset=utf8mb4"
MAILER_DSN=smtp://localhost:1025
```

Exemple avec un utilisateur MySQL dédié :

```env
DATABASE_URL="mysql://utilisateur:motdepasse@127.0.0.1:3306/qui_veut_gagner_des_millions?serverVersion=8.0&charset=utf8mb4"
```

Exemple MariaDB :

```env
DATABASE_URL="mysql://utilisateur:motdepasse@127.0.0.1:3306/qui_veut_gagner_des_millions?serverVersion=mariadb-10.6.0&charset=utf8mb4"
```

Ne pas stocker de secrets de production dans `.env` ou dans un fichier versionné.

---

## Base de données

Créer la base de données :

```bash
php bin/console doctrine:database:create
```

Exécuter les migrations :

```bash
php bin/console doctrine:migrations:migrate
```

Selon l'état du projet, il peut être nécessaire de charger des données initiales pour disposer de thèmes, questions et réponses.

Si des fixtures existent dans le projet, elles peuvent être lancées avec une commande du type :

```bash
php bin/console doctrine:fixtures:load
```

> Cette commande nécessite que le bundle de fixtures soit installé et configuré.

---

## Lancement du projet

Lancer le serveur Symfony :

```bash
symfony serve
```

Ou avec PHP directement :

```bash
php -S localhost:8000 -t public
```

Dans un second terminal, lancer Vite :

```bash
npm run dev
```

L'application est ensuite accessible, selon la configuration locale, à l'adresse :

```text
https://127.0.0.1:8000
```

ou :

```text
http://localhost:8000
```

---

## Scripts disponibles

### Frontend

```bash
npm run dev
```

Lance le serveur de développement Vite.

```bash
npm run build
```

Compile les assets pour la production.

### Backend

```bash
composer install
```

Installe les dépendances PHP.

```bash
php bin/console cache:clear
```

Vide le cache Symfony.

```bash
php bin/console doctrine:migrations:migrate
```

Applique les migrations de base de données.

---

## Routes principales

### Routes frontend

Les routes React sont servies par Symfony via le contrôleur principal, hors routes `/api`.

Exemples de pages :

```text
/
/connexion-inscription
/verif/:token
/oubli-pass/:token
/contact
/compte
/compte/profil/:id
/jeu
/admin
```

### Routes API identifiées

Exemples de routes API utilisées ou déclarées :

```text
POST /api/register
POST /api/login
POST /api/logout
GET  /api/users/me
GET  /api/theme/game/getAll?accountId=:id
GET  /api/theme/game/get/:themeId?accountId=:id
POST /api/account/gain/:id
POST /api/games/save
GET  /api/games/getAccount/:id
GET  /api/games/admin/getAll
```

---

## Sécurité et authentification

Le projet utilise Symfony Security avec une authentification basée sur les sessions.

Le frontend envoie les cookies de session dans les requêtes API grâce à :

```js
credentials: 'include'
```

Le fichier `security.yaml` déclare actuellement les routes `/api/*` en accès public :

```yaml
access_control:
  - { path: ^/api/*, roles: PUBLIC_ACCESS }
```

Les contrôles d'accès sont donc principalement réalisés dans les contrôleurs, par exemple en vérifiant :

- l'utilisateur stocké en session ;
- le rôle utilisateur ;
- l'appartenance d'un compte à l'utilisateur connecté.

Pour une meilleure sécurité, il est recommandé de centraliser davantage les règles d'accès avec Symfony Security, par exemple :

```yaml
access_control:
  - { path: ^/api/login, roles: PUBLIC_ACCESS }
  - { path: ^/api/register, roles: PUBLIC_ACCESS }
  - { path: ^/api/admin, roles: ROLE_ADMIN }
  - { path: ^/api, roles: ROLE_USER }
```

Ou d'utiliser des attributs Symfony dans les contrôleurs sensibles :

```php
#[IsGranted('ROLE_ADMIN')]
```

---

## Points d'attention

### Sécurité des routes API

Les routes API sont actuellement accessibles au niveau global dans `security.yaml`. Il faut donc vérifier que chaque contrôleur sensible contrôle correctement :

- la session ;
- l'utilisateur connecté ;
- le rôle ;
- les droits sur les ressources manipulées.

### Protection des gains

Les gains envoyés par le frontend doivent être recalculés ou validés côté serveur pour éviter qu'un utilisateur puisse modifier manuellement le montant envoyé à l'API.

### Données en localStorage

Le frontend stocke certaines informations utilisateur dans `localStorage`. Ces données ne doivent servir qu'à l'affichage. Elles ne doivent jamais être considérées comme fiables pour la sécurité.

### Jokers

Les jokers doivent être verrouillés après utilisation côté interface et, si nécessaire, contrôlés côté serveur dans les statistiques de partie.

### Robustesse des appels API

Le service générique `FetchApi` suppose que les réponses sont au format JSON. Il peut être utile de rendre la lecture JSON plus défensive pour éviter les erreurs en cas de réponse vide ou non JSON.

---

## Pistes d'amélioration

### Documentation

- Ajouter des captures d'écran.
- Documenter le modèle de données.
- Ajouter une liste complète des routes API.
- Expliquer comment créer un utilisateur administrateur.
- Ajouter une section déploiement.

### Backend

- Centraliser les règles de sécurité dans `security.yaml`.
- Ajouter des attributs `IsGranted` sur les contrôleurs sensibles.
- Recalculer les gains côté serveur.
- Ajouter des tests fonctionnels sur les routes API.
- Ajouter des fixtures pour les thèmes, questions et réponses.

### Frontend

- Extraire la logique de jeu dans des hooks dédiés.
- Externaliser la pyramide des gains dans un fichier de constantes.
- Sécuriser l'accès au jeu si aucun compte courant n'est sélectionné.
- Corriger les mutations directes d'état React.
- Remplacer les images cliquables des jokers par de vrais boutons accessibles.

### Qualité

- Ajouter ESLint / Prettier.
- Ajouter PHP-CS-Fixer ou Easy Coding Standard.
- Ajouter PHPStan ou Psalm.
- Ajouter des tests unitaires et fonctionnels.

---

## Licence

Projet personnel publié sans licence open source explicite.

Le fichier `composer.json` indique une licence propriétaire et le fichier `package.json` indique `UNLICENSED`.

---

## Auteur

Projet développé par **JulienCod**.
