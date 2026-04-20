// Importations des hooks React et composants nécessaires
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Loading from "../../components/common/Loading";
import Alert from "../../components/common/Alert";
import EmptyState from "../../components/common/EmptyState";
import Modal from "../../components/common/Modal";
import { FaCalendarAlt, FaPlus, FaEye, FaEdit, FaTrash, FaHome } from "react-icons/fa";
import { format } from "date-fns";

/**
 * Page listant toutes les réservations.
 * Récupère et agrège les réservations de tous les catways pour les afficher dans un tableau.
 */
function ReservationsIndex() {
  // États locaux
  const [reservations, setReservations] = useState([]); // Liste agrégée de toutes les réservations
  const [loading, setLoading] = useState(true); // Indicateur de chargement
  const [error, setError] = useState(null); // Message d'erreur
  const [success, setSuccess] = useState(null); // Message de succès (ex: après suppression)
  // État gérant l'ouverture de la modale de confirmation de suppression et la réservation ciblée
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    reservation: null,
  });

  // Déclenche la récupération des données au premier montage du composant
  useEffect(() => {
    fetchReservations();
  }, []);

  /**
   * Récupère tous les catways, puis pour chaque catway, récupère ses réservations.
   * Agrège ensuite le tout dans un seul tableau trié par date.
   */
  const fetchReservations = async () => {
    try {
      setLoading(true);
      // Étape 1 : Récupérer la liste complète des catways
      const catwaysRes = await api.get("/catways");
      const catways = catwaysRes.data;

      const allReservations = [];

      // Étape 2 : Boucler sur chaque catway pour récupérer ses propres réservations
      for (const catway of catways) {
        try {
          const resResponse = await api.get(
            `/catways/${catway.catwayNumber}/reservations`,
          );
          const reservationsData = resResponse.data || [];

          // Ajout du numéro de catway à chaque réservation pour l'affichage et les liens
          reservationsData.forEach((res) => {
            allReservations.push({ ...res, catwayNumber: catway.catwayNumber });
          });
        } catch (err) {
          // On ignore les erreurs individuelles pour ne pas bloquer l'affichage des autres réservations
        }
      }

      // Étape 3 : Trier la liste finale par date de début décroissante (les plus récentes en premier)
      allReservations.sort(
        (a, b) => new Date(b.startDate) - new Date(a.startDate),
      );
      setReservations(allReservations);
    } catch (err) {
      setError("Erreur lors du chargement des réservations");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Gère la suppression effective d'une réservation après confirmation via la modale.
   */
  const handleDelete = async () => {
    if (!deleteModal.reservation) return;

    try {
      await api.delete(
        `/catways/${deleteModal.reservation.catwayNumber}/reservations/${deleteModal.reservation._id}`,
      );
      setSuccess("Réservation supprimée avec succès");
      // Mise à jour de l'état local pour retirer la réservation supprimée sans recharger la page
      setReservations(
        reservations.filter((r) => r._id !== deleteModal.reservation._id),
      );
      setDeleteModal({ isOpen: false, reservation: null });
    } catch (err) {
      setError("Erreur lors de la suppression");
    }
  };

  /**
   * Détermine le statut d'une réservation (À venir, En cours, Terminée)
   * en comparant les dates de la réservation avec la date du jour.
   * @returns {Object} Un objet contenant le libellé et la classe CSS du badge.
   */
  const getStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) return { label: "À venir", class: "badge-primary" };
    if (now >= start && now <= end)
      return { label: "En cours", class: "badge-success" };
    return { label: "Terminée", class: "badge-secondary" };
  };

  // Affichage du composant Loading pendant la récupération des données
  if (loading) return <Loading />;

  return (
    <div className="container">
      <div className="page-header">
        <h1>
          <FaCalendarAlt /> Gestion des Réservations
        </h1>
        <Link to="/reservations/create" className="btn btn-primary">
          <FaPlus /> Nouvelle Réservation
        </Link>
      </div>

      {/* Affichage des notifications de succès ou d'erreur */}
      {success && (
        <Alert
          type="success"
          message={success}
          onClose={() => setSuccess(null)}
        />
      )}
      {error && (
        <Alert type="danger" message={error} onClose={() => setError(null)} />
      )}

      <div className="card fade-in">
        <div className="card-body">
          {reservations.length > 0 ? (
            // Tableau des réservations si la liste n'est pas vide
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Catway</th>
                    <th>Client</th>
                    <th>Bateau</th>
                    <th>Début</th>
                    <th>Fin</th>
                    <th>Statut</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Boucle d'affichage des lignes du tableau */}
                  {reservations.map((reservation) => {
                    const status = getStatus(
                      reservation.startDate,
                      reservation.endDate,
                    );
                    return (
                      <tr key={reservation._id}>
                        <td>
                          <Link to={`/catways/${reservation.catwayNumber}`}>
                            <span className="badge badge-primary">
                              #{reservation.catwayNumber}
                            </span>
                          </Link>
                        </td>
                        <td>{reservation.clientName}</td>
                        <td>{reservation.boatName}</td>
                        <td>
                          {format(
                            new Date(reservation.startDate),
                            "dd/MM/yyyy",
                          )}
                        </td>
                        <td>
                          {format(new Date(reservation.endDate), "dd/MM/yyyy")}
                        </td>
                        <td>
                          <span className={`badge ${status.class}`}>
                            {status.label}
                          </span>
                        </td>
                        <td>
                          <div className="table-actions">
                            <Link
                              to={`/catways/${reservation.catwayNumber}/reservations/${reservation._id}`}
                              className="btn btn-sm btn-secondary"
                              title="Voir"
                            >
                              <FaEye />
                            </Link>
                            <Link
                              to={`/catways/${reservation.catwayNumber}/reservations/${reservation._id}/edit`}
                              className="btn btn-sm btn-warning"
                              title="Modifier"
                            >
                              <FaEdit />
                            </Link>
                            <button
                              onClick={() =>
                                setDeleteModal({ isOpen: true, reservation })
                              }
                              className="btn btn-sm btn-danger"
                              title="Supprimer"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            // Composant affiché si aucune réservation n'est trouvée
            <EmptyState
              icon={<FaCalendarAlt />}
              title="Aucune réservation"
              description="Commencez par créer votre première réservation."
              action={
                <Link to="/reservations/create" className="btn btn-primary">
                  <FaPlus /> Créer une réservation
                </Link>
              }
            />
          )}
        </div>
      </div>

      <div className="mt-4 hide-on-mobile">
        <Link to="/dashboard" className="btn btn-secondary">
          <FaHome /> Retour 
        </Link>
      </div>

      {/* Modale de confirmation pour la suppression */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, reservation: null })}
        title="Confirmer la suppression"
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() =>
                setDeleteModal({ isOpen: false, reservation: null })
              }
            >
              Annuler
            </button>
            <button className="btn btn-danger" onClick={handleDelete}>
              <FaTrash /> Supprimer
            </button>
          </>
        }
      >
        <p>
          Êtes-vous sûr de vouloir supprimer la réservation de
          <strong> {deleteModal.reservation?.clientName}</strong> ?
        </p>
        <p className="text-muted">Cette action est irréversible.</p>
      </Modal>
    </div>
  );
}

export default ReservationsIndex;
