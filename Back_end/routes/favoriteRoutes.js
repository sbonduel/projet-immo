const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { isAuthenticated } = require('../middlewares/authMiddleware');
const mongoose = require('mongoose');
const Apartment = require('../models/Apartment');

// Récupérer les favoris
router.get('/', isAuthenticated, async (req, res) => {
  const user = await User.findById(req.session.user._id);
  res.json(user.favorites || []);
});

// Ajouter un favori
router.post('/:id', isAuthenticated, async (req, res) => {
  const user = await User.findById(req.session.user._id);
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
  return res.status(400).json({ message: 'ID invalide' });
}

const exists = await Apartment.findById(req.params.id);
if (!exists) {
  return res.status(404).json({ message: "Appartement non trouvé" });
}
  if (!user.favorites.includes(req.params.id)) {
    user.favorites.push(req.params.id);
    await user.save();
  }
  res.json({ message: 'Favori ajouté' });
});

// Supprimer un favori
router.delete('/:id', isAuthenticated, async (req, res) => {
  const user = await User.findById(req.session.user._id);
  user.favorites = user.favorites.filter(favId => favId.toString() !== req.params.id);
  await user.save();
  res.json({ message: 'Favori supprimé' });
});

module.exports = router;
