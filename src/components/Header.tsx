import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'

const Header = () => {
  const logout = async () => {
    await supabase.auth.signOut()
  }
  return (
    <div className="p-3 text-center">
      <Link to="/" className="font-bold">
        DevsHub
      </Link>
      <div onClick={logout}>Logout</div>
    </div>
  )
}

export default Header
