// Importation du module Mongoose pour la modélisation des données
import mongoose from "mongoose";

// Définition du schéma pour les catways (emplacements d'amarrage)
const catwaySchema = new mongoose.Schema({
  // Numéro unique du catway, obligatoire
  catwayNumber: { type: Number, required: true, unique: true },
  // Type de catway, doit être 'long' ou 'short', obligatoire
  type: { type: String, enum: ["long", "short"], required: true },
  // État actuel du catway (ex: "occupé", "libre", "en maintenance"), obligatoire
  catwayState: { type: String, required: true },
});

// Exportation du modèle Mongoose 'Catway' basé sur le schéma défini
export default mongoose.model("Catway", catwaySchema);
