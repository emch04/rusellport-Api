# ⚓ Port de Plaisance de Russell

> Système complet de gestion de capitainerie pour la gestion des catways (emplacements de bateaux) et des réservations.

Cette application est une solution moderne de type **MERN Stack** (MongoDB, Express, React, Node.js) permettant aux membres d'une capitainerie de gérer efficacement l'occupation de leur port.

---

## ✨ Fonctionnalités

- **🔐 Authentification Sécurisée** : Système de connexion et d'inscription avec JWT (JSON Web Tokens).
- **🌊 Gestion des Catways** : Création, modification et suivi des emplacements (Type long/court, état).
- **📅 Réservations en Temps Réel** : Gestion des séjours clients avec vérification automatique des disponibilités et chevauchements de dates.
- **👥 Administration Utilisateurs** : Gestion des accès pour le personnel de la capitainerie.
- **📊 Tableau de Bord** : Vue d'ensemble des statistiques du port et des réservations en cours.
- **🎨 Design Moderne** : Interface élégante avec effet **Glassmorphism** (effet verre dépoli) et animations "liquides".

---

## 🚀 Technologies Utilisées

### Backend
- **Node.js** & **Express**
- **MongoDB Atlas** (Base de données NoSQL)
- **Mongoose** (Modélisation de données)
- **Bcrypt** (Hachage des mots de passe)
- **JWT** (Sécurité des sessions)

### Frontend
- **React 18** (Vite)
- **React Router 6** (Navigation)
- **Axios** (Appels API)
- **React Icons** & **Date-fns**
- **CSS3** (Glassmorphism & Animations personnalisées)

---

## 📦 Installation et Configuration

### 1. Prérequis
- Node.js installé
- Un compte MongoDB Atlas (ou une instance locale)

### 2. Configuration du Backend
```bash
cd russell-port/backend
npm install
```
Créez un fichier `.env` dans le dossier `backend` :
```env
MONGO_URI=votre_lien_mongodb
JWT_SECRET=votre_cle_secrete
SESSION_SECRET=une_autre_cle_secrete_tres_longue_et_aleatoire
PORT=5001
```

### 3. Configuration du Frontend
```bash
cd russell-port/frontend
npm install
```

---

## 🛠 Utilisation

### Lancement des serveurs
Ouvrez deux terminaux :
- **Terminal 1 (Backend)** : `cd russell-port/backend && npm run dev`
- **Terminal 2 (Frontend)** : `cd russell-port/frontend && npm run dev`

L'application sera accessible sur **http://localhost:3005**.

### Données initiales (Seed)
Pour créer un compte administrateur par défaut :
```bash
cd russell-port/backend
node seed.js
```
**Identifiants par défaut :**
- **Email** : `admin@berthelot.fr`
- **Mot de passe** : `admin123`

---

## 📡 API Endpoints

| Méthode | Route | Description |
| :--- | :--- | :--- |
| `POST` | `/auth/login` | Connexion utilisateur |
| `POST` | `/users` | Inscription / Création utilisateur |
| `GET` | `/catways` | Liste des catways |
| `POST` | `/reservations` | Créer une réservation |
| `GET` | `/catways/:id` | Détails d'un catway |

---

##  Auteur

Projet développé par **EMMANOUCH** dans le cadre de la gestion du Port de Plaisance de Russell.
