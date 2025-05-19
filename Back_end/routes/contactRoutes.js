// routes/contactRoutes.js
const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config();

const router = express.Router();

router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) return res.status(400).json({ message: 'Champs requis manquants' });

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,  // ✅ Correction ici
        pass: process.env.EMAIL_PASS   // ✅ Correction ici
      }
    });

    await transporter.sendMail({
      from: email,
      to: 'bonduelle.simon@gmail.com',
      subject: `📩 Nouveau message de ${name}`,
      text: message,
    });

    res.json({ message: 'Message envoyé' });
  } catch (err) {
    console.error('Erreur envoi email :', err);
    res.status(500).json({ message: 'Erreur lors de l’envoi' });
  }
});

console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS);

module.exports = router;
