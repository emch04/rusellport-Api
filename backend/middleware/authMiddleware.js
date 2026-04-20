/**
 * Middleware d'authentification et d'autorisation.
 * Vérifie que l'utilisateur est connecté ET qu'il s'agit de l'administrateur autorisé.
 */
export const authenticate = (req, res, next) => {
  const authorizedEmail = "emchkongo@gmail.com";

  if (req.session && req.session.user) {
    if (req.session.user.email === authorizedEmail) {
      // Utilisateur connecté et autorisé
      next();
    } else {
      // Utilisateur connecté mais non autorisé
      res.status(403).json({ 
        message: "Accès refusé. Vous n'avez pas les droits nécessaires pour accéder à cette ressource." 
      });
    }
  } else {
    // Non connecté
    res.status(401).json({ message: "Accès refusé. Veuillez vous connecter." });
  }
};
