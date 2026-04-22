// Importation des dépendances principales
import express from "express";
import dotenv from "dotenv"; // Gestion des variables d'environnement
import cors from "cors"; // Autorisation des requêtes cross-origin
import session from "express-session"; // Gestion des sessions
import MongoStore from "connect-mongo"; // Stockage des sessions dans MongoDB
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js"; // Configuration de la base de données
import catwayRoutes from "./routes/catwayRoutes.js"; // Routes pour les catways
import userRoutes from "./routes/userRoutes.js"; // Routes pour les utilisateurs
import reservationRoutes from "./routes/reservationRoutes.js"; // Routes pour les réservations
import authRoutes from "./routes/authRoutes.js"; // Routes pour l'authentification

// Configuration de __dirname pour les modules ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration initiale : chargement des variables d'environnement et connexion DB
dotenv.config();
connectDB();

// Initialisation de l'application
const app = express();

// Indispensable pour Render (cookies sécurisés derrière un proxy)
app.set("trust proxy", 1);

// Configuration CORS flexible
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3005",
  "http://localhost:5173"
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Autorise les requêtes sans origine (comme Postman ou curl) 
      // ou si l'origine est dans la liste autorisée
      if (!origin || allowedOrigins.some(o => o.replace(/\/$/, "") === origin.replace(/\/$/, ""))) {
        callback(null, true);
      } else {
        callback(new Error("Accès refusé par CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json()); // Permet de lire les données JSON envoyées dans le corps (body) des requêtes

// Configuration des sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    proxy: true,
    cookie: {
      secure: true, // Forcé à true pour HTTPS sur Render
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
      sameSite: "none", // Requis pour le cross-domain
    },
  }),
);

// Définition des préfixes de routes
app.use("/catways", catwayRoutes); // Toutes les routes catways commencent par /catways
app.use("/users", userRoutes); // Toutes les routes utilisateurs commencent par /users
app.use("/reservations", reservationRoutes); // Toutes les routes de réservation commencent par /reservations
app.use("/auth", authRoutes); // Routes d'authentification (/login, /logout)

// Service des fichiers statiques du frontend (Vite utilise 'dist')
app.use(express.static(path.join(__dirname, "..", "frontend", "dist")));

// Route globale pour renvoyer l'index.html du frontend (pour le SPA routing)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "dist", "index.html"));
});

// Middleware global de gestion des erreurs (Error Handler)
// Ce bloc capture toutes les erreurs non gérées dans les routes asynchrones
app.use((err, req, res, next) => {
  console.error("Erreur détectée :", err.stack);
  res.status(500).json({
    message: "Une erreur interne est survenue sur le serveur",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  });
});

// Démarrage du serveur sur le port configuré
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré avec succès sur le port ${PORT}`);
  console.log(`🔗 URL locale : http://localhost:${PORT}`);
});
