// Importation des modules nécessaires
import express from "express";
import bcrypt from "bcrypt"; // Pour comparer les mots de passe hachés
import User from "../models/User.js"; // Modèle de données Utilisateur

// Initialisation du routeur Express
const router = express.Router();

// Route POST /login : Authentifie un utilisateur et retourne un token JWT
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body; // Récupération des identifiants depuis le corps de la requête

    // Vérification de l'existence de l'utilisateur en base de données
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Identifiants invalides" });

    // Comparaison du mot de passe fourni avec le mot de passe haché stocké en base
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass)
      return res.status(401).json({ message: "Identifiants invalides" });

    // Préparation des données utilisateur à stocker dans la session (sans le mot de passe)
    const userData = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    // Stockage des informations de l'utilisateur dans la session
    req.session.user = userData;

    // Forcer la sauvegarde dans MongoDB AVANT de renvoyer la réponse au frontend
    req.session.save((err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Erreur lors de la sauvegarde de la session" });
      }
      res.json({ user: userData });
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la connexion", error: error.message });
  }
});

// Route GET /profile : Vérifie la session et renvoie les données de l'utilisateur
router.get("/profile", (req, res) => {
  if (req.session.user) {
    // Si un utilisateur est trouvé dans la session, on le renvoie
    res.json({ user: req.session.user });
  } else {
    // Sinon, on renvoie une erreur 401 (Non autorisé)
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
