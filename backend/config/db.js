// Importation du module Mongoose pour la connexion à MongoDB
import mongoose from "mongoose";

// Fonction asynchrone pour établir la connexion à la base de données MongoDB
export const connectDB = async () => {
  try {
    // Tente de se connecter à MongoDB en utilisant l'URI stockée dans les variables d'environnement
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connecté");
  } catch (err) {
    // En cas d'erreur de connexion, affiche le message d'erreur
    console.error("Erreur MongoDB:", err.message);
    // Arrête le processus de l'application avec un code d'erreur (1)
    process.exit(1);
  }
};
