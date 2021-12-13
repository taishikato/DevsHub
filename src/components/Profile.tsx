import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'

const Profile = () => {
  const navigate = useNavigate()
  const loginUser = useSelector((state) => (state as any).loginUser)
  const isCheckingLogin = useSelector((state) => (state as any).isCheckingLogin)

  useEffect(() => {
    if (isCheckingLogin === false && Object.keys(loginUser).length === 0) navigate('/login')
  }, [loginUser, isCheckingLogin, navigate])

  if (isCheckingLogin) return <div className="flex items-center justify-center h-screen">Loading...</div>

  console.log({ loginUser })

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <div className="p-12">
          <div className="font-semibold text-md">Pictures</div>
        </div>
      </div>
    </div>
  )
}

export default Profile
