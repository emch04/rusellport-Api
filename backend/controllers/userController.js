// Importation du modèle User
import User from "../models/User.js";
import bcrypt from "bcrypt";

// GET /users : Récupérer tous les utilisateurs
export const getUsers = async (req, res) => {
  try {
    // On récupère tous les utilisateurs en excluant le mot de passe pour la sécurité
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Erreur lors de la récupération des utilisateurs",
        error: err.message,
      });
  }
};

// GET /users/:id : Récupérer un utilisateur par son ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.status(200).json(user);
  } catch (err) {
    res
      .status(500)
      .json({ message: "ID invalide ou erreur serveur", error: err.message });
  }
};

// POST /users : Créer un nouvel utilisateur (Inscription)
export const createUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Hachage du mot de passe avant stockage
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    // On retourne l'utilisateur créé sans son mot de passe
    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (err) {
    res
      .status(400)
      .json({
        message: "Erreur lors de la création de l'utilisateur",
        error: err.message,
      });
  }
};

// PUT /users/:id : Modifier un utilisateur
export const updateUser = async (req, res) => {
  try {
    // Si le mot de passe est modifié, il faut le re-hacher (logique simplifiée ici)
    const updates = req.body;
    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    }).select("-password");
    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.status(200).json(user);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Erreur lors de la mise à jour", error: err.message });
  }
};

// DELETE /users/:id : Supprimer un utilisateur
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.status(200).json({ message: "Utilisateur supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};
