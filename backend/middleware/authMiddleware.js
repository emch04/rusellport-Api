import jwt from "jsonwebtoken";

/**
 * Middleware d'authentification par JWT.
 * Vérifie le token envoyé par le frontend dans les headers.
 */
export const authenticate = (req, res, next) => {
  const authorizedEmail = "emchkongo@gmail.com";
  
  // Récupération du token (format: Bearer <token>)
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Accès refusé. Veuillez vous connecter." });
  }

  try {
    // Vérification du token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Vérification de l'autorisation spécifique (votre demande)
    if (decoded.email !== authorizedEmail) {
      return res.status(403).json({ message: "Accès refusé. Vous n'êtes pas l'administrateur autorisé." });
    }

    // On ajoute l'utilisateur décodé à la requête
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Session expirée ou invalide. Veuillez vous reconnecter." });
  }
};
