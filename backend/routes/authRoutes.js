// Importation des modules nécessaires
import express from "express";
import bcrypt from "bcrypt"; // Pour comparer les mots de passe hachés
import User from "../models/User.js"; // Modèle de données Utilisateur

// Initialisation du routeur Express
const router = express.Router();

import jwt from "jsonwebtoken";

// Route POST /login : Authentifie un utilisateur et retourne un token JWT
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Identifiants invalides" });

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass)
      return res.status(401).json({ message: "Identifiants invalides" });

    // Préparation des données pour le token
    const userData = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    // Génération du token JWT (valable 24h)
    const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: "24h" });

    // Renvoi du token et des infos utilisateur au frontend
    res.json({ 
      token,
      user: userData 
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur technique : " + error.message });
  }
});

// Route GET /profile : Vérifie le token (via le middleware) et renvoie les infos
router.get("/profile", (req, res) => {
  // Le middleware 'authenticate' aura déjà ajouté req.user s'il est valide
  if (req.user) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ message: "Non authentifié" });
  }
});

// Route POST /logout : Détruit la session de l'utilisateur
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Erreur lors de la déconnexion" });
    }
    // Efface le cookie de session côté client
    // 'connect.sid' est le nom par défaut du cookie de session
    res.clearCookie("connect.sid");
    res.json({ message: "Déconnecté avec succès" });
  });
});

export default router;
