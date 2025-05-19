// app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const apartmentRoutes = require('./routes/apartmentRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const contactRoutes = require('./routes/contactRoutes'); // ✅ nouvelle route

const scrapeSeloger = require('./utils/selogerScraper');
const scrapeLeboncoin = require('./utils/leboncoinScraper');
const scrapePAP = require('./utils/papScraper');

require('./config/passport');

const app = express();

// CORS - pour accepter les cookies venant du frontend
app.use(cors({
  origin: 'http://localhost:5173', // l'URL de ton FRONT
  credentials: true,               // autorise cookies + sessions
}));

// Middleware standard
app.use(express.json());
app.use(cookieParser());

// Sessions
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    maxAge: 3600000,     // 1 heure
    httpOnly: true,
    secure: false,       // true en HTTPS production
    sameSite: 'lax',
  },
}));

// Auth avec passport
app.use(passport.initialize());
app.use(passport.session());

// Fichiers statiques
app.use('/images', express.static(path.join(__dirname, '../frontend-app/public/images')));

// Routes principales
app.use('/api/auth', authRoutes);
app.use('/api/apartments', apartmentRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/contact', contactRoutes); // ✅ ajout de la route contact

// Connexion à MongoDB
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB connected');

    // Lancer un seul scraper si souhaité
    // await scrapeSeloger();
    // await scrapeLeboncoin();
    //await scrapePAP();

    app.listen(process.env.PORT || 5000, () =>
      console.log('🚀 Server running on port', process.env.PORT || 5000)
    );
  } catch (err) {
    console.error('Erreur MongoDB ou scraping :', err);
  }
}

startServer();
