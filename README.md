# projet-immo

# 🏠 Projet Immobilier - "Prête moi ton App"

Ce projet est une application web full-stack développée dans le cadre d’un projet universitaire en technologies web.

## ✨ Fonctionnalités principales

- 🔐 Authentification (login, inscription, session utilisateur)
- 🏘️ CRUD complet pour la gestion d'appartements
- 📦 Upload et suppression d’images multiples
- 🗺️ Carte interactive avec Leaflet
- 🔍 Filtres dynamiques (recherche, sélection)
- 📈 Statistiques visuelles (prix moyen, GES, etc.)
- ❤️ Système de favoris
- 📬 Formulaire de contact (envoi d’email)

## 🛠️ Stack technique

### Frontend
- React
- React Router
- Axios
- Leaflet (cartographie)
- Context API (authentification, thème)
- Vite

### Backend
- Express.js
- MongoDB + Mongoose
- Passport (authentification)
- Nodemailer (contact par email)
- Scraping avec Puppeteer (PAP, SeLoger, LeBonCoin)
- Multer (upload fichiers)

## 📂 Structure du projet

```bash
frontend-app/
  ├── src/
  │   ├── pages/         # Pages React (Dashboard, Login, Contact, etc.)
  │   ├── components/    # Composants réutilisables
  │   ├── api/           # Axios instance
  │   └── App.jsx        # Routing principal

Back_end/
  ├── routes/            # Routes API (auth, apartments, contact)
  ├── models/            # Schémas Mongoose
  ├── utils/             # Scrapers et utilitaires
  ├── middlewares/       # Auth, upload
  └── app.js             # Point d’entrée serveur


👤 Auteur
Simon Bonduelle

Étudiant en 4e année

Contact : bonduelle.simon@gmail.com

🚀 Lancer le projet localement
Pré-requis
Node.js

MongoDB (en local ou Atlas)

Lancer le backend
cd Back_end
npm install
npm start

Lancer le frontend
cd frontend-app
npm install
npm run dev


📬 Contact
Une page Contact est disponible sur le site pour envoyer un message à l'auteur directement via email.

Merci d’avoir visité ce projet ! ✨







