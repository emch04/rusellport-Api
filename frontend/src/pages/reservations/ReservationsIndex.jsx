import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import Loading from '../../components/common/Loading'
import Alert from '../../components/common/Alert'
import EmptyState from '../../components/common/EmptyState'
import Modal from '../../components/common/Modal'
import { FaCalendarAlt, FaPlus, FaEye, FaEdit, FaTrash } from 'react-icons/fa'
import { format } from 'date-fns'

function ReservationsIndex() {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, reservation: null })

  useEffect(() => {
    fetchReservations()
  }, [])

  const fetchReservations = async () => {
    try {
      setLoading(true)
      // Récupérer toutes les réservations via une route agrégée
      const catwaysRes = await api.get('/catways')
      const catways = catwaysRes.data

      const allReservations = []
      for (const catway of catways) {
        try {
          const resResponse = await api.get(`/catways/${catway.catwayNumber}/reservations`)
          const reservationsData = resResponse.data || []
          reservationsData.forEach(res => {
            allReservations.push({ ...res, catwayNumber: catway.catwayNumber })
          })
        } catch (err) {
          // Ignorer les erreurs individuelles
        }
      }

      // Trier par date de début décroissante
      allReservations.sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
      setReservations(allReservations)
    } catch (err) {
      setError('Erreur lors du chargement des réservations')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteModal.reservation) return

    try {
      await api.delete(
        `/catways/${deleteModal.reservation.catwayNumber}/reservations/${deleteModal.reservation._id}`
      )
      setSuccess('Réservation supprimée avec succès')
      setReservations(reservations.filter(r => r._id !== deleteModal.reservation._id))
      setDeleteModal({ isOpen: false, reservation: null })
    } catch (err) {
      setError('Erreur lors de la suppression')
    }
  }

  const getStatus = (startDate, endDate) => {
    const now = new Date()
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (now < start) return { label: 'À venir', class: 'badge-primary' }
    if (now >= start && now <= end) return { label: 'En cours', class: 'badge-success' }
    return { label: 'Terminée', class: 'badge-secondary' }
  }

  if (loading) return <Loading />

  return (
    <div className="container">
      <div className="page-header">
        <h1><FaCalendarAlt /> Gestion des Réservations</h1>
        <Link to="/reservations/create" className="btn btn-primary">
          <FaPlus /> Nouvelle Réservation
        </Link>
      </div>

      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}
      {error && <Alert type="danger" message={error} onClose={() => setError(null)} />}

      <div className="card fade-in">
        <div className="card-body">
          {reservations.length > 0 ? (
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
                  {reservations.map(reservation => {
                    const status = getStatus(reservation.startDate, reservation.endDate)
                    return (
                      <tr key={reservation._id}>
                        <td>
                          <Link to={`/catways/${reservation.catwayNumber}`}>
                            <span className="badge badge-primary">#{reservation.catwayNumber}</span>
                          </Link>
                        </td>
                        <td>{reservation.clientName}</td>
                        <td>{reservation.boatName}</td>
                        <td>{format(new Date(reservation.startDate), 'dd/MM/yyyy')}</td>
                        <td>{format(new Date(reservation.endDate), 'dd/MM/yyyy')}</td>
                        <td><span className={`badge ${status.class}`}>{status.label}</span></td>
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
                              onClick={() => setDeleteModal({ isOpen: true, reservation })}
                              className="btn btn-sm btn-danger"
                              title="Supprimer"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
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

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, reservation: null })}
        title="Confirmer la suppression"
        footer={
          <>
            <button 
              className="btn btn-secondary" 
              onClick={() => setDeleteModal({ isOpen: false, reservation: null })}
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
  )
}

export default ReservationsIndex
