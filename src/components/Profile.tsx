import Header from './Header'
import Sidebar from './Sidebar'

const Profile = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <div className="p-12">Profile</div>
      </div>
    </div>
  )
}

export default Profile
