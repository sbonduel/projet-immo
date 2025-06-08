import mongoose, { Document, Model } from "mongoose";
import bcrypt from "bcrypt";

// 🔒 Interface pour un utilisateur
export interface IUser extends Document {
  name?: string;
  email: string;
  password: string;
  comparePassword(password: string): Promise<boolean>;
}

// ✅ Définition du schéma
const userSchema = new mongoose.Schema<IUser>({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// 🔐 Middleware : hash du mot de passe
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🔐 Méthode de comparaison
userSchema.methods.comparePassword = function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

// 📦 Export du modèle
const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default User;
