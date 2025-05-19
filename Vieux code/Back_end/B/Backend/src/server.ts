import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import apartmentRoutes from "./routes/apartmentRoutes";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import connectDB from "./db";
import cookieParser from "cookie-parser";

dotenv.config();
connectDB(); // ✅ Connexion MongoDB centralisée
const app = express();

app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  credentials: true,               // ⬅️ pour autoriser les cookies
}));
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(express.json());

// 📦 Routes
app.use("/apartments", apartmentRoutes);
app.use("/users", userRoutes);
app.use("/auth", authRoutes);

app.listen(process.env.PORT, () => {
  console.log(`🚀 Serveur backend sur http://localhost:${process.env.PORT}`);
});








