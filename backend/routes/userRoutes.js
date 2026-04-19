// Importation du module Express pour la création de routes
import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
// Importation des fonctions du contrôleur d'utilisateurs
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

// Création d'un routeur Express
const router = express.Router();

// Définition des routes pour les opérations CRUD sur les utilisateurs
// GET / : Récupérer tous les utilisateurs
router.get("/", authenticate, getUsers);
// GET /:id : Récupérer un utilisateur spécifique par son ID
router.get("/:id", authenticate, getUserById);
// POST / : Créer un nouvel utilisateur
router.post("/", createUser);
// PUT /:id : Mettre à jour un utilisateur spécifique par son ID
router.put("/:id", authenticate, updateUser);
// DELETE /:id : Supprimer un utilisateur spécifique par son ID
router.delete("/:id", authenticate, deleteUser);

// Exportation du routeur pour être utilisé par l'application Express
export default router;
