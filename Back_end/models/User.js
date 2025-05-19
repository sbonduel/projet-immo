const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  googleId: { type: String },
  role: { type: String, default: 'user' },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Apartment', require:false}]
});

module.exports = mongoose.model('User', UserSchema);
