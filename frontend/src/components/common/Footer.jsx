import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} Port de Plaisance de Russell. Tous droits réservés.</p>
        <div>
          <Link to="/documentation">Documentation API</Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
