import mongoose from "mongoose";

const apartmentSchema = new mongoose.Schema({
  title: String,
  price: Number,
  city: String,
  description: String,
  link: String,
  date: { type: Date, default: Date.now }
});

export default mongoose.model("Apartment", apartmentSchema);
