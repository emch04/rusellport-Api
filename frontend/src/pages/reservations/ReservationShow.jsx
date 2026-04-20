// Importations
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import Loading from "../../components/common/Loading";
import Alert from "../../components/common/Alert";
import {
  FaCalendarAlt,
  FaArrowLeft,
  FaTrash,
  FaShip,
  FaUser,
  FaAnchor,
  FaHome,
} from "react-icons/fa";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

/**
 * Page de détails d'une réservation.
 * Affiche toutes les informations concernant le client, le bateau et les dates.
 */
function ReservationShow() {
  const { catwayId, id } = useParams(); // id est l'identifiant technique de la réservation
  const navigate = useNavigate();

  // États locaux
  const [reservation, setReservation] = useState(null); // Contient les données de la réservation
  const [loading, setLoading] = useState(true); // État de chargement initial
  const [error, setError] = useState(null); // Gestion des erreurs API

  // Exécuté au chargement du composant pour récupérer les données de la réservation
  useEffect(() => {
    const fetchReservation = async () => {
      try {
        // Récupération de la réservation ciblée
        const response = await api.get(`/reservations/${id}`);
        setReservation(response.data);
      } catch (err) {
        setError("Réservation introuvable.");
      } finally {
        setLoading(false);
      }
    };
    fetchReservation();
  }, [id]);

  /**
   * Supprime la réservation après confirmation.
   */
  const handleDelete = async () => {
    // Demande de confirmation native via le navigateur
    if (window.confirm("Voulez-vous vraiment annuler cette réservation ?")) {
      try {
        // Appel API pour la suppression
        await api.delete(`/reservations/${id}`);
        // Redirection vers l'index des réservations une fois supprimé
        navigate("/reservations");
      } catch (err) {
        setError("Erreur lors de la suppression.");
      }
    }
  };

  // Affichage du spinner pendant le chargement
  if (loading) return <Loading />;

  return (
    <div className="container">
      <div className="page-header">
        <button onClick={() => navigate(-1)} className="btn btn-secondary">
          <FaArrowLeft /> Retour
        </button>
        <h1>
          <FaCalendarAlt /> Détails de la Réservation
        </h1>
      </div>

      {error && <Alert type="danger" message={error} />}

      {/* Affichage conditionnel : s'assure que la réservation est bien chargée */}
      {reservation && (
        <div className="card fade-in">
          <div className="card-body">
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">
                  <FaAnchor /> Emplacement
                </span>
                <span className="detail-value">
                  Catway #{reservation.catwayNumber}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">
                  <FaUser /> Client
                </span>
                <span className="detail-value">{reservation.clientName}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">
                  <FaShip /> Bateau
                </span>
                <span className="detail-value">{reservation.boatName}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Période</span>
                <span className="detail-value">
                  Du {format(new Date(reservation.startDate), "dd/MM/yyyy")} au{" "}
                  {format(new Date(reservation.endDate), "dd/MM/yyyy")}
                </span>
              </div>
            </div>

            {/* Actions spécifiques à cette réservation */}
            <div className="btn-group mt-4">
              <button
                onClick={() =>
                  navigate(`/catways/${catwayId}/reservations/${id}/edit`)
                }
                className="btn btn-warning"
              >
                Modifier
              </button>
              <button onClick={handleDelete} className="btn btn-danger">
                <FaTrash /> Annuler la réservation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReservationShow;
