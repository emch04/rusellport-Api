import User from "../models/User.js";
import bcrypt from "bcrypt";

/**
 * GET /users
 * Liste tous les utilisateurs enregistrés (sans leur mot de passe).
 */
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({
      message: "Erreur lors de la récupération",
      error: err.message,
    });
  }
};

/**
 * GET /users/:id
 * Récupère un utilisateur par son EMAIL (utilisé comme identifiant métier).
 */
export const getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.id }).select("-password");
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

/**
 * POST /users
 * Enregistre un nouvel utilisateur avec hachage du mot de passe.
 */
export const createUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    const userResponse = newUser.toObject();
    delete userResponse.password;
    res.status(201).json(userResponse);
  } catch (err) {
    res.status(400).json({
      message: "Erreur lors de la création",
      error: err.message,
    });
  }
};

/**
 * PUT /users/:id
 * Met à jour les informations d'un utilisateur (y compris le mot de passe si fourni).
 */
export const updateUser = async (req, res) => {
  try {
    const updates = req.body;
    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    const user = await User.findOneAndUpdate({ email: req.params.id }, updates, { new: true }).select("-password");
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ message: "Erreur de mise à jour", error: err.message });
  }
};

/**
 * DELETE /users/:id
 * Supprime un utilisateur par son email.
 */
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ email: req.params.id });
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.status(200).json({ message: "Utilisateur supprimé" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};
