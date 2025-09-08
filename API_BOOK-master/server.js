import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import { requireAuth } from "./middlewares/authMiddleware.js";
import cors from "cors";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";

// Pour __dirname avec ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Configuration CORS
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || "http://localhost:3000",
      "http://localhost:3001",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:3001",
    ],
    credentials: true, // Pour permettre les cookies/sessions
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Pour POST formulaire

// Connexion MongoDB avec fallback
const connectDB = async () => {
  try {
    // Essayer MongoDB Atlas d'abord
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log("MongoDB Atlas connecté");
    } else {
      // Fallback vers MongoDB local
      await mongoose.connect("mongodb://127.0.0.1:27017/books");
      console.log("MongoDB local connecté");
    }
  } catch (err) {
    console.error("Erreur MongoDB Atlas, tentative locale...");
    try {
      await mongoose.connect("mongodb://127.0.0.1:27017/books");
      console.log("MongoDB local connecté en fallback");
    } catch (localErr) {
      console.error("Erreur de connexion MongoDB:", localErr);
      console.log(
        "Assurez-vous que MongoDB est installé localement ou que l'IP est autorisée dans Atlas"
      );
    }
  }
};

connectDB();

// Servir les fichiers uploadés (AVANT l'authentification pour accès public)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Configuration de la session (doit être AVANT le middleware de protection et les routes)
app.use(
  session({
    secret: "votre_secret_session", // À remplacer par une vraie clé secrète en prod
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 8 }, // 8h
  })
);

// Middleware pour exclure les routes publiques
app.use((req, res, next) => {
  const publicRoutes = [
    { path: "/api/auth/login", method: "POST" },
    { path: "/api/auth/signup", method: "POST" },
    { path: "/api/books", method: "GET" },
    { path: "/api/books/bestrating", method: "GET" },
  ];

  // Vérifier les routes publiques exactes
  const isPublicRoute = publicRoutes.some(
    (route) => req.path === route.path && req.method === route.method
  );

  // Vérifier les routes GET /api/books/:id
  const isPublicBookRoute =
    req.path.startsWith("/api/books/") &&
    req.method === "GET" &&
    !req.path.includes("/rating");

  // Vérifier les routes uploads (fichiers statiques)
  const isUploadRoute = req.path.startsWith("/uploads/");

  if (isPublicRoute || isPublicBookRoute || isUploadRoute) {
    return next();
  }

  requireAuth(req, res, next);
});

// Routes API avec préfixe /api
app.use("/api/auth", userRoutes);
app.use("/api/books", bookRoutes);

// Lancement serveur
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});
