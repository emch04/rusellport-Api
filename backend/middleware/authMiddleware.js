// Importation du module jsonwebtoken pour la gestion des tokens JWT
import jwt from "jsonwebtoken";

/**
 * Middleware d'authentification pour sécuriser les routes de l'API.
 * Il vérifie la présence et la validité d'un token JWT dans l'en-tête Authorization.
 * 
 * @param {Object} req - L'objet de requête Express
 * @param {Object} res - L'objet de réponse Express
 * @param {Function} next - La fonction pour passer au middleware/contrôleur suivant
 */
export const authenticate = (req, res, next) => {
  // Récupération du token depuis l'en-tête 'Authorization' (format "Bearer <token>")
  const token = req.header("Authorization")?.split(" ")[1];

  // Si aucun token n'est présent, on renvoie une erreur 401 (Non autorisé)
  if (!token) {
    return res
      .status(401)
      .json({ message: "Accès refusé. Aucun token fourni." });
  }

  try {
    // Vérification de la validité du token avec la clé secrète
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    
    // Si le token est valide, on ajoute les informations de l'utilisateur à l'objet req
    req.user = verified;
    
    // On passe au contrôleur suivant
    next(); 
  } catch (err) {
    // En cas de token invalide ou expiré, on renvoie une erreur 400 (Requête incorrecte)
    res.status(400).json({ message: "Token invalide." });
  }
};
