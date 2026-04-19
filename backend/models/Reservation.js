// Importation du module Mongoose pour la modélisation des données
import mongoose from "mongoose";

// Définition du schéma pour les réservations
const reservationSchema = new mongoose.Schema({
  // Numéro du catway réservé, obligatoire
  catwayNumber: { type: Number, required: true },
  // Nom du client effectuant la réservation, obligatoire
  clientName: { type: String, required: true },
  // Nom du bateau pour lequel la réservation est faite, obligatoire
  boatName: { type: String, required: true },
  // Date de début de la réservation, obligatoire
  startDate: { type: Date, required: true },
  // Date de fin de la réservation, obligatoire
  endDate: { type: Date, required: true },
});

// Exportation du modèle Mongoose 'Reservation' basé sur le schéma défini
export default mongoose.model("Reservation", reservationSchema);
