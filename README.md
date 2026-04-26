# EXT_Sedera

# 🏆 SPORTSLIFE - Tournament Manager

Application web permettant de consulter, organiser et suivre des tournois avec gestion des participants, des matchs et des résultats.

---

## 🚀 Démarrage du projet

### 🔹 1. Cloner le projet

```bash
git clone <repo-url>
cd <project-name>
```

## Installation

Il est conseillé d'utiliser une version recente de Node JS version 20.20.2 ou ultérieur.
Dans le dossier racine du projet.

```bash
npm run install:all
```

Cela installera les projets client, serveur et racine.

Dans le cas échéant, vous pouvez faire

```bash
cd <dossier racine>
npm install
cd ./sportslife-server
npm install
cd ../sportslife-client
npm install
```

## Lancement des serveurs

Veuillez ouvrir deux terminaux dans ./sportslife-client et ./sportslife-server

Dans client :

```bash
cd ./sportslife-client
npm run start
```

N'oubliez pas d'ajouter les variables d'environnement .env dans le dossier ./sportslife-server avant de lancer le serveur

Dans server :

```bash
cd ./sportslife-server
npm run dev
```

## 🧱 Architecture du projet

### Backend

Le backend suit une architecture modulaire et en couches :

Modules par domaine métier :
auth
users
tournaments
participants
matches

Organisation interne de chaque module :
controller → gestion des requêtes HTTP
service → logique métier
model → interaction avec la base de données
routes → définition des endpoints
validation → validation des données

Dossiers transverses :
middlewares → gestion des erreurs, authentification, etc.
config → configuration (env, base de données)
common → constantes, enums, utilitaires
core → logique métier isolée (ex : gestion des brackets)

## Cette organisation permet :

une séparation claire des responsabilités
une meilleure maintenabilité
une scalabilité facilitée

## 🧱 Architecture du projet

### Frontend

J’ai choisi une architecture Angular organisée par features, avec un core pour les services transverses, l’authentification et les modèles, afin de garder un découpage proche du métier tout en restant simple et évolutif pour le MVP.

Notre Angular suit une architecture feature-based avec un noyau partagé, pensée pour aller vite sans perdre la lisibilité.

### Vue d’ensemble

On a découpé l’application en 3 zones :

core/ : tout ce qui est global à l’application

features/ : les écrans et cas d’usage métier

shared/ : ce qui peut être réutilisé visuellement ou fonctionnellement

#### core/

C’est le socle applicatif. On y met ce qui ne dépend pas d’une page précise.

Typiquement :

services/
auth.service
tournament.service
participant.service
match.service
interceptors/
ajout automatique du JWT
guards/
protection des routes privées
models/
interfaces TypeScript des données API

Rôle :

centraliser les échanges backend
gérer l’authentification
porter les contrats de données

### features/

C’est le cœur fonctionnel du frontend. Chaque feature correspond à un domaine métier ou à un parcours utilisateur.

Exemples :

features/auth
page de login
features/tournaments
liste des tournois
création tournoi
détail tournoi
Rôle :

contenir les pages
assembler les services du core
gérer les interactions utilisateur
C’est là qu’on code le comportement visible.

### shared/

C’est la zone des briques réutilisables.

On peut y mettre plus tard :

composants UI communs
badges de statut
cartes tournoi
composants de liste de matchs
pipes ou helpers visuels
Pour l’instant, comme on avance vite, cette zone peut rester légère.

### Routing

Le routing est centralisé dans :

app.routes.ts
Il définit :

les pages publiques comme /login
les pages protégées comme /tournaments
les redirections
Le authGuard contrôle l’accès aux pages privées.

### App config

app.config.ts configure globalement l’application :

router
HttpClient
interceptor JWT
Donc toute requête part déjà avec le bon contexte.

### Flux de données

Le flux est simple et propre :

une page dans features/ déclenche une action
elle appelle un service dans core/services
le service appelle l’API backend
la réponse est typée via core/models
la page met à jour son état et l’affichage

### Fonctionnalités principales :

Consultation des tournois
Visualisation des brackets
Suivi des matchs et résultats
Authentification des utilisateurs
Administration des tournois (réservée aux utilisateurs connectés)
