import Reservation from "../models/Reservation.js";
import Catway from "../models/Catway.js";

/**
 * GET /reservations
 * Récupère la liste de toutes les réservations.
 */
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

/**
 * GET /reservations/:id
 * Récupère une réservation par son identifiant unique.
 */
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

/**
 * POST /reservations
 * Crée une nouvelle réservation avec vérification de disponibilité du catway.
 */
export const createReservation = async (req, res) => {
  try {
    const { catwayNumber, startDate, endDate } = req.body;

    // Vérifie que les dates sont cohérentes
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({
        message: "La date de fin doit être strictement après la date de début.",
      });
    }

    // Vérifie que le catway existe
    const catwayExists = await Catway.findOne({ catwayNumber });
    if (!catwayExists) {
      return res.status(404).json({ message: "Le numéro de catway n'existe pas." });
    }

    // Vérifie les chevauchements de dates pour ce catway
    const overlapping = await Reservation.findOne({
      catwayNumber,
      $or: [
        { startDate: { $lt: new Date(endDate) }, endDate: { $gt: new Date(startDate) } }
      ],
    });

    if (overlapping) {
      return res.status(409).json({
        message: "Le catway est déjà réservé pour cette période.",
      });
    }

    const newReservation = new Reservation(req.body);
    await newReservation.save();
    res.status(201).json(newReservation);
  } catch (err) {
    res.status(400).json({
      message: "Erreur lors de la création",
      error: err.message,
    });
  }
};

/**
 * PUT /reservations/:id
 * Modifie une réservation existante.
 */
export const updateReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!reservation)
      return res.status(404).json({ message: "Réservation non trouvée" });
    res.status(200).json(reservation);
  } catch (err) {
    res.status(400).json({
      message: "Erreur lors de la mise à jour",
      error: err.message,
    });
  }
};

/**
 * DELETE /reservations/:id
 * Supprime une réservation.
 */
export const deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);
    if (!reservation)
      return res.status(404).json({ message: "Réservation non trouvée" });
    res.status(200).json({ message: "Réservation supprimée" });
  } catch (err) {
    res.status(500).json({
      message: "Erreur lors de la suppression",
      error: err.message,
    });
  }
};
