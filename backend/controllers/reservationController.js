import Reservation from "../models/Reservation.js";
import Catway from "../models/Catway.js";

// GET /reservations
// Récupère la liste de toutes les réservations
export const getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.status(200).json(reservations);
  } catch (err) {
    res.status(500).json({
      message: "Erreur lors de la récupération des réservations",
      error: err.message,
    });
  }
};

// GET /reservations/:id
// Récupère une réservation spécifique par son identifiant unique (_id)
export const getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation)
      return res.status(404).json({ message: "Réservation non trouvée" });
    res.status(200).json(reservation);
  } catch (err) {
    res.status(500).json({
      message: "Erreur lors de la récupération de la réservation",
      error: err.message,
    });
  }
};

// POST /reservations
// Crée une nouvelle réservation dans la base de données
export const createReservation = async (req, res) => {
  try {
    const { catwayNumber, startDate, endDate } = req.body;

    // Validation de la cohérence des dates
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({
        message: "La date de fin doit être strictement après la date de début.",
      });
    }

    // Vérification de l'existence du catway avant réservation
    const catwayExists = await Catway.findOne({ catwayNumber });
    if (!catwayExists) {
      return res
        .status(404)
        .json({ message: "Le numéro de catway spécifié n'existe pas." });
    }
    // Vérification de la disponibilité du catway pour les dates demandées
    // On cherche s'il existe une réservation pour ce catway qui chevauche la période demandée
    const overlappingReservation = await Reservation.findOne({
      catwayNumber,
      $or: [
        {
          startDate: { $lt: new Date(endDate) },
          endDate: { $gt: new Date(startDate) },
        }, // Nouvelle réservation chevauche une existante
        { startDate: { $gte: new Date(startDate), $lt: new Date(endDate) } }, // Début de la nouvelle réservation est dans une existante
        { endDate: { $gt: new Date(startDate), $lte: new Date(endDate) } }, // Fin de la nouvelle réservation est dans une existante
      ],
    });

    if (overlappingReservation) {
      return res.status(409).json({
        message: "Le catway est déjà réservé pour une partie de ces dates.",
      });
    }

    // Si tout est bon, créer la nouvelle réservation
    const newReservation = new Reservation(req.body);
    await newReservation.save();
    res.status(201).json(newReservation);
  } catch (err) {
    res.status(400).json({
      message: "Erreur lors de la création de la réservation",
      error: err.message,
    });
  }
};

// PUT /reservations/:id
// Met à jour les informations d'une réservation existante
export const updateReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }, // Cette option permet de renvoyer l'objet après modification
    );
    if (!reservation)
      return res.status(404).json({ message: "Réservation non trouvée" });
    res.status(200).json(reservation);
  } catch (err) {
    res.status(400).json({
      message: "Erreur lors de la mise à jour de la réservation",
      error: err.message,
    });
  }
};

// DELETE /reservations/:id
// Supprime une réservation de la base de données
export const deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);
    if (!reservation)
      return res.status(404).json({ message: "Réservation non trouvée" });
    res.status(200).json({ message: "Réservation supprimée avec succès" });
  } catch (err) {
    res.status(500).json({
      message: "Erreur lors de la suppression de la réservation",
      error: err.message,
    });
  }
};
