const express = require('express');
const Apartment = require('../models/Apartment');
const { isAuthenticated } = require('../middlewares/authMiddleware');
const { getCoordinatesFromAddress } = require('../utils/geocode');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const fs = require('fs');
const path = require('path');

//Voir un appartement public
router.get('/public/:id', async (req, res) => {
  try {
    const apt = await Apartment.findById(req.params.id).populate('auteur', 'email');
    if (!apt) return res.status(404).json({ message: 'Appartement introuvable' });
    res.json(apt);
  } catch (err) {
    console.error('Erreur public/:id :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

//Voir ses appartements à soi
router.get('/mine', isAuthenticated, async (req, res) => {
  try {
    const apartments = await Apartment.find({ auteur: req.session.user._id });
    res.json(apartments);
  } catch {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

//Voir tous les appartements (admin uniquement)
router.get('/all', isAuthenticated, async (req, res) => {
  try {
    if (req.session.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé' });
    }
    const apartments = await Apartment.find().populate('auteur', 'email');
    res.json(apartments);
  } catch {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

//Ajouter un appartement
router.post('/', isAuthenticated, upload.array('images', 10), async (req, res) => {
  try {
    const {
      titre,
      description,
      pays,
      ville,
      postalCode,
      rue,
      rueNombre,
      price,
      surface,
      piece,
      chambre,
      etage,
      a_cave,
      a_box,
      chaufage,
      charges,
      taxeFonciere,
      energyClass,
      ges,
      sourceUrl
    } = req.body;

    let location = null;
    try {
      location = await getCoordinatesFromAddress({ country: pays, city: ville, street: rue, streetNumber: rueNombre });
    } catch (err) {
      console.warn('Coordonnées non trouvées.');
    }

    const imagePaths = req.files?.map(file => `/images/${file.filename}`) || [];

    const apartment = new Apartment({
      titre,
      description,
      pays,
      ville,
      postalCode,
      rue,
      rueNombre,
      price,
      surface,
      piece,
      chambre,
      etage,
      a_cave: a_cave === 'true',
      a_box: a_box === 'true',
      chaufage,
      charges,
      taxeFonciere,
      energyClass,
      ges,
      sourceUrl,
      location,
      images: imagePaths,
      auteur: req.session.user._id
    });

    await apartment.save();
    res.status(201).json(apartment);
  } catch (err) {
    console.error('Erreur serveur:', err);
    res.status(500).json({ message: "Erreur lors de la création de l'appartement." });
  }
});

//Modifier un appartement
router.put('/:id', isAuthenticated, upload.array('images', 10), async (req, res) => {
  try {
    const query = req.session.user.role === 'admin'
      ? { _id: req.params.id }
      : { _id: req.params.id, auteur: req.session.user._id };

    const apartment = await Apartment.findOne(query);
    if (!apartment) return res.status(404).json({ message: 'Non autorisé ou introuvable' });

    const updateData = { ...req.body };

    ['a_cave', 'a_box'].forEach(field => {
      if (updateData[field] !== undefined) {
        updateData[field] = updateData[field] === 'true';
      }
    });

    const { pays, ville, rue, rueNombre } = req.body;
    if (pays || ville || rue || rueNombre) {
      try {
        updateData.location = await getCoordinatesFromAddress({ country: pays, city: ville, street: rue, streetNumber: rueNombre });
      } catch (err) {
        console.warn('Adresse non géocodée :', err.message);
        updateData.location = null;
      }
    }

    if (req.body.imagesToDelete) {
      const toDelete = Array.isArray(req.body.imagesToDelete)
        ? req.body.imagesToDelete
        : [req.body.imagesToDelete];

      toDelete.forEach(name => {
        const imagePath = path.join(__dirname, '..', 'public', 'images', name);
        if (fs.existsSync(imagePath)) {
          fs.unlink(imagePath, (err) => {
            if (err) console.warn('Erreur suppression fichier:', err.message);
          });
        }
        apartment.images = apartment.images.filter(img => !img.includes(name));
      });
    }

    if (req.files?.length) {
      const newPaths = req.files.map(file => `/images/${file.filename}`);
      apartment.images.push(...newPaths);
    }

    Object.assign(apartment, updateData);
    await apartment.save();

    res.json(apartment);
  } catch (err) {
    console.error('Erreur update :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

//Supprimer un appartement
router.delete('/:id', isAuthenticated, async (req, res) => {
  const query = req.session.user.role === 'admin'
    ? { _id: req.params.id }
    : { _id: req.params.id, auteur: req.session.user._id };

  try {
    const result = await Apartment.findOneAndDelete(query);
    if (!result) return res.status(404).json({ message: 'Non autorisé' });
    res.json({ message: 'Supprimé' });
  } catch {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

//Voir un appartement (authentifié)
router.get('/:id', isAuthenticated, async (req, res) => {
  try {
    const apt = await Apartment.findById(req.params.id).populate('auteur', 'email');
    if (!apt) return res.status(404).json({ message: 'Appartement introuvable' });
    res.json(apt);
  } catch {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

//Voir tous les appartements (authentifié)
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const apartments = await Apartment.find().populate('auteur', 'email');
    res.json(apartments);
  } catch {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
