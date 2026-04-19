// Importation du modèle Catway
import Catway from "../models/Catway.js";

// GET /catways : Récupérer tous les catways
export const getCatways = async (req, res) => {
  try {
    const catways = await Catway.find();
    res.status(200).json(catways); // Retourne la liste avec un code 200 (OK)
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Erreur lors de la récupération des catways",
        error: err.message,
      });
  }
};

// GET /catways/:id : Récupérer un catway spécifique par son numéro (catwayNumber)
export const getCatwayById = async (req, res) => {
  try {
    // On cherche par catwayNumber et non par l'ID technique MongoDB (_id)
    const catway = await Catway.findOne({ catwayNumber: req.params.id });
    if (!catway) return res.status(404).json({ message: "Catway non trouvé" });
    res.status(200).json(catway);
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Format de numéro invalide ou erreur serveur",
        error: err.message,
      });
  }
};

// POST /catways : Créer un nouveau catway
export const createCatway = async (req, res) => {
  const { catwayNumber, type, catwayState } = req.body; // Extraction des données
  try {
    const newCatway = new Catway({ catwayNumber, type, catwayState });
    await newCatway.save(); // Enregistrement en base
    res.status(201).json(newCatway); // 201 : Ressource créée
  } catch (err) {
    // Erreur possible : doublon de catwayNumber (unique: true)
    res
      .status(400)
      .json({
        message: "Erreur lors de la création du catway",
        error: err.message,
      });
  }
};

// PUT /catways/:id : Mettre à jour un catway par son numéro
export const updateCatway = async (req, res) => {
  try {
    const catway = await Catway.findOneAndUpdate(
      { catwayNumber: req.params.id }, // Filtre de recherche
      req.body, // Données à mettre à jour
      { new: true }, // Retourne l'objet modifié plutôt que l'ancien
    );
    if (!catway) return res.status(404).json({ message: "Catway non trouvé" });
    res.status(200).json(catway);
  } catch (err) {
    res
      .status(400)
      .json({
        message: "Données invalides pour la mise à jour",
        error: err.message,
      });
  }
};

// DELETE /catways/:id : Supprimer un catway par son numéro
export const deleteCatway = async (req, res) => {
  try {
    // Suppression basée sur le numéro métier
    const catway = await Catway.findOneAndDelete({
      catwayNumber: req.params.id,
    });
    if (!catway) return res.status(404).json({ message: "Catway non trouvé" });
    res.status(200).json({ message: "Catway supprimé avec succès" });
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Erreur lors de la suppression du catway",
        error: err.message,
      });
  }
};
