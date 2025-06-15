const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/authMiddleware');
const {getAddressFromCoordinates } = require('../utils/geocode')

// REGISTER
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hash });
  await user.save();
  res.status(201).json({ message: 'User cree' });
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid conextion' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid conextion' });

  req.session.user = user;
  res.json({ message: 'Logged in', user });
});

router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { country, city, street, streetNumber } = req.body;

    const location = await getAddressFromCoordinates ({ country, city, street, streetNumber });

    const apartment = new Apartment({
      ...req.body,
      location,
      owner: req.session.user._id,
    });

    await apartment.save();
    res.status(201).json(apartment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de l’ajout de l’appartement' });
  }
});

// LOGOUT
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out' });
  });
});

// SESSION CHECK
router.get('/me', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Non connecté' });
  }

  try {
    const user = await User.findById(req.session.user._id).populate('favorites');
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });
    res.json({ user });
  } catch (err) {
    console.error("Erreur auth/me :", err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

/*
router.get('/me', (req, res) => {
  if (req.user) {
    res.json({ user: req.user });
  } else if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.status(401).json({ message: 'Non connecté' });
  }
});*/

// GOOGLE LOGIN
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// GOOGLE CALLBACK
router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: '/login',
  session: false 
}), async (req, res) => {
  //Manuellement créé session comme login
  console.log("Utilisateur Google connecté :", req.user);
  req.session.user = req.user; // Assure que `req.user` contient bien l'utilisateur
  res.redirect('http://localhost:5173/');
});


/*
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: true }),
  (req, res) => {
    // Une fois connecté, rediriger vers le frontend avec cookie
    res.redirect('http://localhost:5173/login-success');
  }
); */


router.get('/:id', isAuthenticated, async (req, res) => {
  try {
    const apartment = await Apartment.findById(req.params.id);
    if (!apartment) return res.status(404).json({ message: 'Appartement non trouvé' });

    const isOwner = apartment.owner.equals(req.session.user._id);
    const isAdmin = req.session.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    res.json(apartment);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});


router.put('/favorites/:apartmentId', isAuthenticated, async (req, res) => {
  const { apartmentId } = req.params;
  const { action } = req.body;
  const userId = req.session.user._id;

  try {
    const update = action === 'add'
      ? { $addToSet: { favorites: apartmentId } }
      : { $pull: { favorites: apartmentId } };

    const updated = await User.findByIdAndUpdate(userId, update, { new: true });

    res.json({ favorites: updated.favorites });
  } catch (err) {
    console.error('Erreur favoris :', err);
    res.status(500).json({ message: 'Erreur mise à jour des favoris' });
  }
});



module.exports = router;
