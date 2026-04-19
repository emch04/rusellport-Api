// Importation du module Mongoose pour la modélisation des données
import mongoose from "mongoose";

// Définition du schéma pour les utilisateurs
const userSchema = new mongoose.Schema({
  // Nom d'utilisateur, obligatoire
  username: { type: String, required: true },
  // Adresse email, obligatoire et unique pour chaque utilisateur
  email: { type: String, required: true, unique: true },
  // Mot de passe, obligatoire (sera haché avant d'être stocké)
  password: { type: String, required: true },
});

// Exportation du modèle Mongoose 'User' basé sur le schéma défini
export default mongoose.model("User", userSchema);
