import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <div className="p-3 text-center">
      <Link to="/" className="font-bold">
        DevsHub
      </Link>
    </div>
  )
}

export default Header
