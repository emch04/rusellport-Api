// Importation du module Express pour la gestion des routes
import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
// Importation des fonctions du contrôleur Catway
import {
  getCatways,
  getCatwayById,
  createCatway,
  updateCatway,
  deleteCatway,
} from "../controllers/catwayController.js";

// Initialisation du routeur
const router = express.Router();

// Définition des points d'accès (endpoints) pour les Catways
router.get("/", getCatways); // Récupérer la liste complète
router.get("/:id", getCatwayById); // Récupérer un catway par son numéro
router.post("/", authenticate, createCatway); // Ajouter un nouveau catway (Protégé)
router.put("/:id", authenticate, updateCatway); // Modifier un catway existant (Protégé)
router.delete("/:id", authenticate, deleteCatway); // Supprimer un catway (Protégé)

// Exportation pour utilisation dans server.js
export default router;
