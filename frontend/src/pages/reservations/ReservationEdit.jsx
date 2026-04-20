// Importations standards
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import Loading from "../../components/common/Loading";
import Alert from "../../components/common/Alert";
import { FaEdit, FaArrowLeft, FaSave, FaHome } from "react-icons/fa";

/**
 * Composant de modification d'une réservation existante.
 * Charge les données actuelles de la réservation et permet leur mise à jour.
 */
function ReservationEdit() {
  // Récupération des paramètres de l'URL (numéro du catway et ID de la réservation)
  const { catwayId, id } = useParams();
  const navigate = useNavigate();

  // État local du formulaire
  const [formData, setFormData] = useState({
    clientName: "",
    boatName: "",
    startDate: "",
    endDate: "",
  });
  const [loading, setLoading] = useState(true); // Chargement initial des données
  const [saving, setSaving] = useState(false); // Chargement lors de l'enregistrement
  const [error, setError] = useState(null); // Gestion des erreurs

  useEffect(() => {
    fetchReservation();
  }, [catwayId, id]);

  /**
   * Récupère les données de la réservation spécifique pour pré-remplir le formulaire.
   */
  const fetchReservation = async () => {
    try {
      const response = await api.get(`/catways/${catwayId}/reservations/${id}`);
      const res = response.data;
      // Pré-remplissage du formulaire en isolant la partie date ("YYYY-MM-DD") des timestamps ISO
      setFormData({
        clientName: res.clientName,
        boatName: res.boatName,
        startDate: res.startDate.split("T")[0],
        endDate: res.endDate.split("T")[0],
      });
    } catch (err) {
      setError("Réservation non trouvée");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Gère les changements sur les champs du formulaire.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Soumet les modifications à l'API via une requête PUT.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // Envoi des nouvelles données à l'API
      await api.put(`/catways/${catwayId}/reservations/${id}`, formData);
      // Redirection vers la vue détaillée avec un message de succès
      navigate(`/catways/${catwayId}/reservations/${id}`, {
        state: { success: "Réservation modifiée avec succès" },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la modification");
    } finally {
      setSaving(false);
    }
  };

  // Écran de chargement tant que les données initiales ne sont pas récupérées
  if (loading) return <Loading />;

  return (
    <div className="container">
      <div className="page-header">
        <h1>
          <FaEdit /> Modifier la réservation
        </h1>
        <Link
          to={`/catways/${catwayId}/reservations/${id}`}
          className="btn btn-secondary"
        >
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
            {/* Affichage du numéro de catway (Lecture seule) */}
            <div className="form-group">
              <label className="form-label">Catway</label>
              <input
                type="text"
                className="form-control"
                value={`#${catwayId}`}
                disabled
              />
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

            {/* Champ de date de fin (Empêche de choisir une date antérieure à la date de début) */}
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

            {/* Boutons d'action */}
            <div className="btn-group">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="spinner-sm"></span>
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <FaSave /> Enregistrer
                  </>
                )}
              </button>
              <Link
                to={`/catways/${catwayId}/reservations/${id}`}
                className="btn btn-secondary"
              >
                Annuler
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ReservationEdit;
