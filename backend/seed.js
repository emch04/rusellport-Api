// Importation des dépendances pour l'initialisation de la base de données
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import User from "./models/User.js";

// Chargement des variables d'environnement (notamment l'URI de la base de données)
dotenv.config();

/**
 * Script de "seeding" pour initialiser la base de données avec des données par défaut.
 * Ici, nous créons un utilisateur administrateur initial.
 */
const seedDB = async () => {
  try {
    // Connexion à la base de données MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connecté à MongoDB pour le seeding");

    // Optionnel : On pourrait vider la collection avant de rajouter des données
    // await User.deleteMany({});

    // Hachage du mot de passe par défaut pour l'administrateur
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // Création de l'objet utilisateur administrateur
    const adminUser = new User({
      username: "admin",
      email: "admin@berthelot.fr",
      password: hashedPassword
    });

    // Enregistrement de l'administrateur dans la base de données
    await adminUser.save();
    
    console.log("✅ Utilisateur admin créé avec succès !");
    console.log("Email: admin@berthelot.fr");
    console.log("Password: admin123");

    // On ferme le processus avec succès
    process.exit(0);
  } catch (err) {
    // En cas d'erreur, on l'affiche et on ferme le processus avec un code d'erreur
    console.error("❌ Erreur lors du seeding:", err.message);
    process.exit(1);
  }
};

// Exécution de la fonction de seeding
seedDB();
