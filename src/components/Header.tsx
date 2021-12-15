import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <div className="flex justify-center p-3">
      <Link to="/" className="font-bold">
        DevsHub
      </Link>
    </div>
  )
}

export default Header
