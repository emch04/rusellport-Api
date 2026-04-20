// Importations des icônes
import { FaBook, FaShip, FaCalendarAlt, FaUsers, FaLock } from "react-icons/fa";

/**
 * Page statique présentant la documentation de l'API REST du port de plaisance.
 */
function Documentation() {
  return (
    <div className="container">
      {/* En-tête */}
      <div className="page-header">
        <h1>
          <FaBook /> Documentation de l'API
        </h1>
      </div>

      {/* Section : Introduction */}
      <div className="card fade-in mb-4">
        <div className="card-header">
          <h3>Introduction</h3>
        </div>
        <div className="card-body">
          <p>
            L'API du Port de Plaisance de Russell permet de gérer les catways,
            les réservations et les utilisateurs. Toutes les routes (sauf
            /login) nécessitent une authentification via JWT.
          </p>
          <p>
            <strong>URL de base :</strong> <code>/api</code>
          </p>
        </div>
      </div>

      {/* Section : Authentification */}
      <div className="card fade-in mb-4">
        <div className="card-header">
          <h3>
            <FaLock /> Authentification
          </h3>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Méthode</th>
                  <th>Route</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <span className="badge badge-success">POST</span>
                  </td>
                  <td>
                    <code>/auth/login</code>
                  </td>
                  <td>Connexion utilisateur</td>
                </tr>
                <tr>
                  <td>
                    <span className="badge badge-primary">GET</span>
                  </td>
                  <td>
                    <code>/auth/logout</code>
                  </td>
                  <td>Déconnexion</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4 className="mt-4">Corps de la requête (login)</h4>
          <pre className="code-block">
            {`{
  "email": "user@example.com",
  "password": "votre_mot_de_passe"
}`}
          </pre>
        </div>
      </div>

      {/* Section : Gestion des Catways */}
      <div className="card fade-in mb-4">
        <div className="card-header">
          <h3>
            <FaShip /> Catways
          </h3>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Méthode</th>
                  <th>Route</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <span className="badge badge-primary">GET</span>
                  </td>
                  <td>
                    <code>/catways</code>
                  </td>
                  <td>Liste tous les catways</td>
                </tr>
                <tr>
                  <td>
                    <span className="badge badge-primary">GET</span>
                  </td>
                  <td>
                    <code>/catways/:id</code>
                  </td>
                  <td>Détails d'un catway</td>
                </tr>
                <tr>
                  <td>
                    <span className="badge badge-success">POST</span>
                  </td>
                  <td>
                    <code>/catways</code>
                  </td>
                  <td>Créer un catway</td>
                </tr>
                <tr>
                  <td>
                    <span className="badge badge-warning">PUT</span>
                  </td>
                  <td>
                    <code>/catways/:id</code>
                  </td>
                  <td>Modifier l'état d'un catway</td>
                </tr>
                <tr>
                  <td>
                    <span className="badge badge-danger">DELETE</span>
                  </td>
                  <td>
                    <code>/catways/:id</code>
                  </td>
                  <td>Supprimer un catway</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4 className="mt-4">Modèle de données</h4>
          <pre className="code-block">
            {`{
  "catwayNumber": 1,           // Numéro unique (requis)
  "catwayType": "long",        // "long" ou "short" (requis)
  "catwayState": "Bon état"    // Description de l'état
}`}
          </pre>
        </div>
      </div>

      {/* Section : Gestion des Réservations */}
      <div className="card fade-in mb-4">
        <div className="card-header">
          <h3>
            <FaCalendarAlt /> Réservations
          </h3>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Méthode</th>
                  <th>Route</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <span className="badge badge-primary">GET</span>
                  </td>
                  <td>
                    <code>/catways/:id/reservations</code>
                  </td>
                  <td>Liste les réservations d'un catway</td>
                </tr>
                <tr>
                  <td>
                    <span className="badge badge-primary">GET</span>
                  </td>
                  <td>
                    <code>/catways/:id/reservations/:idReservation</code>
                  </td>
                  <td>Détails d'une réservation</td>
                </tr>
                <tr>
                  <td>
                    <span className="badge badge-success">POST</span>
                  </td>
                  <td>
                    <code>/catways/:id/reservations</code>
                  </td>
                  <td>Créer une réservation</td>
                </tr>
                <tr>
                  <td>
                    <span className="badge badge-warning">PUT</span>
                  </td>
                  <td>
                    <code>/catways/:id/reservations/:idReservation</code>
                  </td>
                  <td>Modifier une réservation</td>
                </tr>
                <tr>
                  <td>
                    <span className="badge badge-danger">DELETE</span>
                  </td>
                  <td>
                    <code>/catways/:id/reservations/:idReservation</code>
                  </td>
                  <td>Supprimer une réservation</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4 className="mt-4">Modèle de données</h4>
          <pre className="code-block">
            {`{
  "catwayNumber": 1,              // Numéro du catway
  "clientName": "Jean Dupont",    // Nom du client (requis)
  "boatName": "L'Aventurier",     // Nom du bateau (requis)
  "startDate": "2024-06-01",      // Date de début (requis)
  "endDate": "2024-06-15"         // Date de fin (requis)
}`}
          </pre>
        </div>
      </div>

      {/* Section : Gestion des Utilisateurs */}
      <div className="card fade-in mb-4">
        <div className="card-header">
          <h3>
            <FaUsers /> Utilisateurs
          </h3>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Méthode</th>
                  <th>Route</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <span className="badge badge-primary">GET</span>
                  </td>
                  <td>
                    <code>/users</code>
                  </td>
                  <td>Liste tous les utilisateurs</td>
                </tr>
                <tr>
                  <td>
                    <span className="badge badge-primary">GET</span>
                  </td>
                  <td>
                    <code>/users/:email</code>
                  </td>
                  <td>Détails d'un utilisateur</td>
                </tr>
                <tr>
                  <td>
                    <span className="badge badge-success">POST</span>
                  </td>
                  <td>
                    <code>/users</code>
                  </td>
                  <td>Créer un utilisateur</td>
                </tr>
                <tr>
                  <td>
                    <span className="badge badge-warning">PUT</span>
                  </td>
                  <td>
                    <code>/users/:email</code>
                  </td>
                  <td>Modifier un utilisateur</td>
                </tr>
                <tr>
                  <td>
                    <span className="badge badge-danger">DELETE</span>
                  </td>
                  <td>
                    <code>/users/:email</code>
                  </td>
                  <td>Supprimer un utilisateur</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4 className="mt-4">Modèle de données</h4>
          <pre className="code-block">
            {`{
  "username": "jean.dupont",       // Nom d'utilisateur (requis)
  "email": "jean@example.com",     // Email unique (requis)
  "password": "motdepasse123"      // Min. 6 caractères (requis)
}`}
          </pre>
        </div>
      </div>

      {/* Section : Lexique des Codes de réponse HTTP */}
      <div className="card fade-in">
        <div className="card-header">
          <h3>Codes de réponse HTTP</h3>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Signification</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <span className="badge badge-success">200</span>
                  </td>
                  <td>Succès</td>
                </tr>
                <tr>
                  <td>
                    <span className="badge badge-success">201</span>
                  </td>
                  <td>Ressource créée</td>
                </tr>
                <tr>
                  <td>
                    <span className="badge badge-warning">400</span>
                  </td>
                  <td>Requête invalide</td>
                </tr>
                <tr>
                  <td>
                    <span className="badge badge-warning">401</span>
                  </td>
                  <td>Non authentifié</td>
                </tr>
                <tr>
                  <td>
                    <span className="badge badge-warning">404</span>
                  </td>
                  <td>Ressource non trouvée</td>
                </tr>
                <tr>
                  <td>
                    <span className="badge badge-danger">500</span>
                  </td>
                  <td>Erreur serveur</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Documentation;
