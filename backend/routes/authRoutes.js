// Importation des modules nécessaires
import express from "express";
import bcrypt from "bcrypt"; // Pour comparer les mots de passe hachés
import jwt from "jsonwebtoken"; // Pour générer les tokens de session
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

    // Création du Token JWT contenant l'ID et l'email, valide pendant 1 jour
    const token = jwt.sign({ id: user._id, email }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Envoi de la réponse avec le token et les données utilisateur (hors mot de passe)
    res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la connexion", error: error.message });
  }
});

// Route GET /logout : Indique la déconnexion
// Note : Le token étant stocké côté client, la déconnexion réelle se fait en supprimant le token du storage côté frontend.
router.get("/logout", (req, res) => {
  res.json({ message: "Déconnecté avec succès" });
});

export default router;
