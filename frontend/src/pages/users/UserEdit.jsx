import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../services/api'
import UserForm from '../../components/users/UserForm'
import Loading from '../../components/common/Loading'
import Alert from '../../components/common/Alert'
import { FaUserEdit } from 'react-icons/fa'

function UserEdit() {
  const { email } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchUser()
  }, [email])

  const fetchUser = async () => {
    try {
      const response = await api.get(`/users/${encodeURIComponent(email)}`)
      setUser(response.data)
    } catch (err) {
      setError('Impossible de charger l\'utilisateur')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (formData) => {
    setSubmitting(true)
    try {
      await api.put(`/users/${encodeURIComponent(email)}`, formData)
      navigate('/users')
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour')
      setSubmitting(false)
    }
  }

  if (loading) return <Loading />

  return (
    <div className="container">
      <div className="page-header">
        <h1><FaUserEdit /> Modifier l'utilisateur</h1>
      </div>

      {error && <Alert type="danger" message={error} onClose={() => setError(null)} />}

      <div className="card fade-in">
        <div className="card-body">
          {user && (
            <UserForm 
              initialData={user} 
              onSubmit={handleSubmit} 
              onCancel={() => navigate('/users')}
              loading={submitting}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default UserEdit
