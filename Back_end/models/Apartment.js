const mongoose = require('mongoose');

const ApartmentSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  pays: {
    type: String,
    required: true
  },
  ville: {
    type: String,
    required: true
  },
  postalCode: {
    type: String,
    required: false
  },
  rue: {
    type: String,
    required: true
  },
  rueNombre: {
    type: String,
    required: false
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  surface: {
    type: Number,
    required: false,
    min: 5
  },
  piece: {
    type: Number,
    required: false,
    min: 1
  },
  chambre: {
    type: Number,
    required: false
  },
  etage: {
    type: String,
    required: false
  },
  a_cave: {
    type: Boolean,
    default: false
  },
  a_box: {
    type: Boolean,
    default: false
  },
  chaufage: {
    type: String,
    enum: ['collectif gaz', 'individuel gaz', 'électrique', 'autre'],
    required: false
  },
  charges: {
    type: Number,
    required: false
  },
  taxeFonciere: {
    type: Number,
    required: false
  },
energyClass: {
  type: String,
  enum: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
  required: false,
  default: undefined,
},

ges: {
  type: String,
  enum: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
  required: false,
  default: undefined,
},
  location: {
    lat: {
      type: Number,
      required: false
    },
    lng: {
      type: Number,
      required: false
    }
  },
  auteur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sourceUrl: {
    type: String,
    required: true,
    unique: true
  },

  // 📸 Nouveau champ image (stockée dans /public/images)
images: {
  type: [String], 
  default: []
}
});

ApartmentSchema.index({ sourceUrl: 1 }, { unique: true });

module.exports = mongoose.model('Apartment', ApartmentSchema);
