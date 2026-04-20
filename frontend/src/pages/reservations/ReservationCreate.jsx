// Importation des hooks React essentiels pour la gestion de l'état et du cycle de vie
import { useState, useEffect } from "react";
// Importation des hooks de React Router pour la navigation et la récupération des paramètres d'URL
import { useParams, Link, useNavigate } from "react-router-dom";
// Importation du client API pré-configuré
import api from "../../services/api";
// Importation des composants réutilisables
import Loading from "../../components/common/Loading";
import Alert from "../../components/common/Alert";
// Importation des icônes de la librairie react-icons
import { FaPlus, FaArrowLeft, FaSave } from "react-icons/fa";

/**
 * Page de création d'une nouvelle réservation.
 * Permet à l'utilisateur de sélectionner un catway (si non pré-sélectionné)
 * et d'entrer les détails du client, du bateau et des dates de séjour.
 */
function ReservationCreate() {
  const { catwayId } = useParams(); // Récupère le numéro du catway depuis l'URL s'il est présent
  const navigate = useNavigate(); // Hook pour la navigation programmatique

  // États locaux du composant
  const [catways, setCatways] = useState([]); // Liste des catways pour le menu déroulant
  const [formData, setFormData] = useState({
    catwayNumber: catwayId || "", // Pré-remplit le catway si l'ID est fourni dans l'URL
    clientName: "", // Nom du client effectuant la réservation
    boatName: "", // Nom du bateau concerné
    startDate: "", // Date de début prévue
    endDate: "", // Date de fin prévue
  });

  const [loading, setLoading] = useState(true); // État de chargement initial (chargement des catways)
  const [saving, setSaving] = useState(false); // État de chargement pendant la soumission
  const [error, setError] = useState(null); // Gestion des erreurs API

  /**
   * Effet déclenché au montage du composant.
   * Récupère la liste de tous les catways pour remplir le champ "Select".
   */
  useEffect(() => {
    fetchCatways();
  }, []);

  /**
   * Récupère la liste de tous les catways depuis l'API pour alimenter le menu déroulant.
   */
  const fetchCatways = async () => {
    try {
      // Exécution de la requête GET pour récupérer tous les catways
      const response = await api.get("/catways");
      // Enregistrement des données reçues dans l'état local
      setCatways(response.data);
    } catch (err) {
      // Définition d'un message d'erreur si la requête échoue
      setError("Erreur lors du chargement des catways");
    } finally {
      // Indique que le chargement initial est terminé, avec succès ou erreur
      setLoading(false);
    }
  };

  /**
   * Gère la mise à jour des champs du formulaire de manière générique.
   * @param {Object} e - L'événement onChange déclenché par un input ou le select
   */
  const handleChange = (e) => {
    // Extraction du nom (name) du champ et de sa nouvelle valeur (value)
    const { name, value } = e.target;
    // Mise à jour de la propriété correspondante dans l'objet formData
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Intercepte la soumission du formulaire et envoie les données à l'API.
   * @param {Object} e - L'événement onSubmit du formulaire
   */
  const handleSubmit = async (e) => {
    // Empêche le comportement par défaut du navigateur (rechargement de page)
    e.preventDefault();
    // Activation de l'état de sauvegarde (désactive le bouton submit)
    setSaving(true);
    // Nettoyage des erreurs précédentes
    setError(null);

    try {
      // Appel à l'API pour créer la réservation sur le catway sélectionné
      await api.post(`/catways/${formData.catwayNumber}/reservations`, {
        clientName: formData.clientName,
        boatName: formData.boatName,
        startDate: formData.startDate,
        endDate: formData.endDate,
      });
      // Redirection vers la liste des réservations avec un message de succès
      navigate("/reservations", {
        state: { success: "Réservation créée avec succès" },
      });
    } catch (err) {
      // Extraction et affichage du message d'erreur renvoyé par l'API (ou message par défaut)
      setError(err.response?.data?.message || "Erreur lors de la création");
    } finally {
      // Désactivation de l'état de sauvegarde
      setSaving(false);
    }
  };

  // Affichage du composant de chargement tant que les données initiales ne sont pas prêtes
  if (loading) return <Loading />;

  return (
    <div className="container">
      {/* En-tête de la page avec le bouton de retour */}
      <div className="page-header">
        <h1>
          <FaPlus /> Nouvelle Réservation
        </h1>
        <Link to="/reservations" className="btn btn-secondary">
          <FaArrowLeft /> Retour
        </Link>
      </div>

      {/* Conteneur de la carte de formulaire avec une animation d'apparition douce */}
      <div className="card fade-in" style={{ maxWidth: "600px" }}>
        <div className="card-body">
          {/* Affichage des erreurs renvoyées par l'API */}
          {error && (
            <Alert
              type="danger"
              message={error}
              onClose={() => setError(null)}
            />
          )}

          <form onSubmit={handleSubmit}>
            {/* Sélection du Catway */}
            <div className="form-group">
              <label htmlFor="catwayNumber" className="form-label">
                Catway
              </label>
              <select
                id="catwayNumber"
                name="catwayNumber"
                className="form-control form-select"
                value={formData.catwayNumber}
                onChange={handleChange}
                required
                disabled={!!catwayId}
              >
                <option value="">Sélectionnez un catway</option>
                {/* Boucle sur les catways pour générer dynamiquement les options du select */}
                {catways.map((catway) => (
                  <option key={catway._id} value={catway.catwayNumber}>
                    #{catway.catwayNumber} -{" "}
                    {catway.catwayType === "long" ? "Long" : "Court"}
                  </option>
                ))}
              </select>
            </div>

            {/* Champ pour le nom du client */}
            <div className="form-group">
              <label htmlFor="clientName" className="form-label">
                Nom du client
              </label>
              <input
                type="text"
                id="clientName"
                name="clientName"
                className="form-control"
                placeholder="Ex: Jean Dupont"
                value={formData.clientName}
                onChange={handleChange}
                required
              />
            </div>

            {/* Champ pour le nom du bateau */}
            <div className="form-group">
              <label htmlFor="boatName" className="form-label">
                Nom du bateau
              </label>
              <input
                type="text"
                id="boatName"
                name="boatName"
                className="form-control"
                placeholder="Ex: L'Aventurier"
                value={formData.boatName}
                onChange={handleChange}
                required
              />
            </div>

            {/* Champ pour la date de début du séjour */}
            <div className="form-group">
              <label htmlFor="startDate" className="form-label">
                Date de début
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                className="form-control"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>

            {/* Champ pour la date de fin, avec une date minimale (min) forcée à la date de début */}
            <div className="form-group">
              <label htmlFor="endDate" className="form-label">
                Date de fin
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                className="form-control"
                value={formData.endDate}
                onChange={handleChange}
                required
                min={formData.startDate}
              />
            </div>

            {/* Boutons d'action (Soumission / Annulation) */}
            <div className="btn-group">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {/* Changement dynamique du contenu du bouton en fonction de l'état saving */}
                {saving ? (
                  <>
                    {/* Icône de chargement en rotation */}
                    <span className="spinner-sm"></span>
                    Création...
                  </>
                ) : (
                  <>
                    {/* Icône d'enregistrement normale */}
                    <FaSave /> Créer la réservation
                  </>
                )}
              </button>
              <Link to="/reservations" className="btn btn-secondary">
                Annuler
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ReservationCreate;
