import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import api from '../../services/api'
import Loading from '../../components/common/Loading'
import Alert from '../../components/common/Alert'
import Modal from '../../components/common/Modal'
import { FaUser, FaArrowLeft, FaEdit, FaTrash, FaEnvelope } from 'react-icons/fa'

function UserShow() {
  const { email } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteModal, setDeleteModal] = useState(false)

  useEffect(() => {
    fetchUser()
  }, [email])

  const fetchUser = async () => {
    try {
      const response = await api.get(`/users/${encodeURIComponent(email)}`)
      setUser(response.data)
    } catch (err) {
      setError('Utilisateur non trouvé')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/users/${encodeURIComponent(email)}`)
      navigate('/users', { state: { success: 'Utilisateur supprimé avec succès' } })
    } catch (err) {
      setError('Erreur lors de la suppression')
      setDeleteModal(false)
    }
  }

  if (loading) return <Loading />
  if (error || !user) return (
    <div className="container">
      <Alert type="danger" message={error || 'Utilisateur non trouvé'} />
      <Link to="/users" className="btn btn-secondary">
        <FaArrowLeft /> Retour aux utilisateurs
      </Link>
    </div>
  )

  return (
    <div className="container">
      <div className="page-header">
        <h1><FaUser /> {user.username}</h1>
        <div className="btn-group">
          <Link to="/users" className="btn btn-secondary">
            <FaArrowLeft /> Retour
          </Link>
          <Link to={`/users/${encodeURIComponent(email)}/edit`} className="btn btn-warning">
            <FaEdit /> Modifier
          </Link>
          <button onClick={() => setDeleteModal(true)} className="btn btn-danger">
            <FaTrash /> Supprimer
          </button>
        </div>
      </div>

      <div className="card fade-in">
        <div className="card-header">
          <h3>Informations</h3>
        </div>
        <div className="card-body">
          <div className="detail-grid">
            <div className="detail-item">
              <div className="detail-label"><FaUser /> Nom d'utilisateur</div>
              <div className="detail-value">{user.username}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label"><FaEnvelope /> Email</div>
              <div className="detail-value">{user.email}</div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Confirmer la suppression"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setDeleteModal(false)}>
              Annuler
            </button>
            <button className="btn btn-danger" onClick={handleDelete}>
              <FaTrash /> Supprimer
            </button>
          </>
        }
      >
        <p>Êtes-vous sûr de vouloir supprimer l'utilisateur <strong>{user.username}</strong> ?</p>
        <p className="text-muted">Cette action est irréversible.</p>
      </Modal>
    </div>
  )
}

export default UserShow
