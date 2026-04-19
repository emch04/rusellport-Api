import Catway from "../models/Catway.js";

/**
 * GET /catways
 * Récupère la liste complète des catways.
 */
export const getCatways = async (req, res) => {
  try {
    const catways = await Catway.find();
    res.status(200).json(catways);
  } catch (err) {
    res.status(500).json({
      message: "Erreur lors de la récupération des catways",
      error: err.message,
    });
  }
};

/**
 * GET /catways/:id
 * Récupère un catway spécifique par son numéro (catwayNumber).
 */
export const getCatwayById = async (req, res) => {
  try {
    const catway = await Catway.findOne({ catwayNumber: req.params.id });
    if (!catway) return res.status(404).json({ message: "Catway non trouvé" });
    res.status(200).json(catway);
  } catch (err) {
    res.status(500).json({
      message: "Format de numéro invalide ou erreur serveur",
      error: err.message,
    });
  }
};

/**
 * POST /catways
 * Crée un nouveau catway. Nécessite une authentification.
 */
export const createCatway = async (req, res) => {
  const { catwayNumber, type, catwayState } = req.body;
  try {
    const newCatway = new Catway({ catwayNumber, type, catwayState });
    await newCatway.save();
    res.status(201).json(newCatway);
  } catch (err) {
    res.status(400).json({
      message: "Erreur lors de la création du catway",
      error: err.message,
    });
  }
};

/**
 * PUT /catways/:id
 * Met à jour un catway existant via son numéro.
 */
export const updateCatway = async (req, res) => {
  try {
    const catway = await Catway.findOneAndUpdate(
      { catwayNumber: req.params.id },
      req.body,
      { new: true }
    );
    if (!catway) return res.status(404).json({ message: "Catway non trouvé" });
    res.status(200).json(catway);
  } catch (err) {
    res.status(400).json({
      message: "Données invalides pour la mise à jour",
      error: err.message,
    });
  }
};

/**
 * DELETE /catways/:id
 * Supprime un catway via son numéro.
 */
export const deleteCatway = async (req, res) => {
  try {
    const catway = await Catway.findOneAndDelete({ catwayNumber: req.params.id });
    if (!catway) return res.status(404).json({ message: "Catway non trouvé" });
    res.status(200).json({ message: "Catway supprimé avec succès" });
  } catch (err) {
    res.status(500).json({
      message: "Erreur lors de la suppression du catway",
      error: err.message,
    });
  }
};
