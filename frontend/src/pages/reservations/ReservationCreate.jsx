import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import Loading from "../../components/common/Loading";
import Alert from "../../components/common/Alert";
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
    catwayNumber: catwayId || "",
    clientName: "",
    boatName: "",
    startDate: "",
    endDate: "",
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

  const fetchCatways = async () => {
    try {
      const response = await api.get("/catways");
      setCatways(response.data);
    } catch (err) {
      setError("Erreur lors du chargement des catways");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Gère la mise à jour des champs du formulaire de manière générique.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Intercepte la soumission du formulaire et envoie les données à l'API.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await api.post(`/catways/${formData.catwayNumber}/reservations`, {
        clientName: formData.clientName,
        boatName: formData.boatName,
        startDate: formData.startDate,
        endDate: formData.endDate,
      });
      navigate("/reservations", {
        state: { success: "Réservation créée avec succès" },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la création");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="container">
      <div className="page-header">
        <h1>
          <FaPlus /> Nouvelle Réservation
        </h1>
        <Link to="/reservations" className="btn btn-secondary">
          <FaArrowLeft /> Retour
        </Link>
      </div>

      <div className="card fade-in" style={{ maxWidth: "600px" }}>
        <div className="card-body">
          {error && (
            <Alert
              type="danger"
              message={error}
              onClose={() => setError(null)}
            />
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="catwayNumber" className="form-label">
                Catway *
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
                {catways.map((catway) => (
                  <option key={catway._id} value={catway.catwayNumber}>
                    #{catway.catwayNumber} -{" "}
                    {catway.catwayType === "long" ? "Long" : "Court"}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="clientName" className="form-label">
                Nom du client *
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

            <div className="form-group">
              <label htmlFor="boatName" className="form-label">
                Nom du bateau *
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

            <div className="form-group">
              <label htmlFor="startDate" className="form-label">
                Date de début *
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

            <div className="form-group">
              <label htmlFor="endDate" className="form-label">
                Date de fin *
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

            <div className="btn-group">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="spinner-sm"></span>
                    Création...
                  </>
                ) : (
                  <>
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
