// Importation des dépendances principales
import express from "express";
import dotenv from "dotenv"; // Gestion des variables d'environnement
import cors from "cors"; // Autorisation des requêtes cross-origin
import session from "express-session"; // Gestion des sessions
import MongoStore from "connect-mongo"; // Stockage des sessions dans MongoDB
import { connectDB } from "./config/db.js"; // Configuration de la base de données
import catwayRoutes from "./routes/catwayRoutes.js"; // Routes pour les catways
import userRoutes from "./routes/userRoutes.js"; // Routes pour les utilisateurs
import reservationRoutes from "./routes/reservationRoutes.js"; // Routes pour les réservations
import authRoutes from "./routes/authRoutes.js"; // Routes pour l'authentification

// Configuration initiale : chargement des variables d'environnement et connexion DB
dotenv.config();
connectDB();

// Initialisation de l'application
const app = express();

// Indispensable pour que les cookies sécurisés (secure: true) fonctionnent derrière un proxy (Render, Heroku...)
app.set("trust proxy", 1);

// Middlewares globaux
// Configuration CORS pour autoriser les cookies depuis l'origine de votre frontend
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3005", // URL de votre frontend (locale ou en production)
    credentials: true,
  }),
);

app.use(express.json()); // Permet de lire les données JSON envoyées dans le corps (body) des requêtes

// Configuration des sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Clé secrète pour signer le cookie de session
    resave: false, // Ne pas sauvegarder la session si elle n'est pas modifiée
    saveUninitialized: false, // Ne pas créer de session pour les requêtes non authentifiées
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }), // Stocker les sessions dans MongoDB
    cookie: {
      secure: process.env.NODE_ENV === "production", // En production, n'envoyer le cookie que sur HTTPS
      httpOnly: true, // Empêche l'accès au cookie via JavaScript côté client
      maxAge: 1000 * 60 * 60 * 24, // Durée de vie du cookie (ici, 1 jour)
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // "none" est requis si le front et le back sont sur des domaines différents
    },
  }),
);

// Définition des préfixes de routes
app.use("/catways", catwayRoutes); // Toutes les routes catways commencent par /catways
app.use("/users", userRoutes); // Toutes les routes utilisateurs commencent par /users
app.use("/reservations", reservationRoutes); // Toutes les routes de réservation commencent par /reservations
app.use("/auth", authRoutes); // Routes d'authentification (/login, /logout)

// Route de test pour vérifier que le serveur répond
app.get("/", (req, res) => {
  res.send("Bienvenue sur l'API du Port de Plaisance Russell!");
});

// Middleware pour gérer les routes non trouvées (404)
app.use((req, res, next) => {
  res.status(404).json({ message: "Route non trouvée" });
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
