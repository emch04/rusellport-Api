// Importation du module Express pour la création de routes
import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
// Importation des fonctions du contrôleur de réservations
import {
  getReservations,
  getReservationById,
  createReservation,
  updateReservation,
  deleteReservation,
} from "../controllers/reservationController.js";

// Création d'un routeur Express
const router = express.Router();

// Définition des routes CRUD pour les réservations
router.get("/", getReservations); // Liste de toutes les réservations
router.get("/:id", getReservationById); // Détails d'une réservation par son ID
router.post("/", authenticate, createReservation); // Enregistrer une nouvelle réservation (Protégé)
router.put("/:id", authenticate, updateReservation); // Modifier une réservation (Protégé)
router.delete("/:id", authenticate, deleteReservation); // Annuler/Supprimer une réservation (Protégé)

// Exportation du routeur pour être utilisé par l'application Express
export default router;
