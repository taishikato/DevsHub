import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logoutUser } from '../store/action'

const Header = () => {
  const dispatch = useDispatch()
  const loginUser = useSelector((state) => (state as any).loginUser)
  const navigate = useNavigate()

  const logout = async () => {
    await supabase.auth.signOut()
    dispatch(logoutUser())
    navigate('/login')
  }

  return (
    <div className="flex flex-row-reverse justify-between p-3 bg-slate-900 text-slate-50">
      {/* show if the user is logged in */}
      {Object.keys(loginUser).length > 0 && (
        <div onClick={logout} className="cursor-pointer">
          Logout
        </div>
      )}

      <Link to="/" className="font-bold">
        DevsHub
      </Link>

      {/* dummy element */}
      <div />
    </div>
  )
}

export default Header
