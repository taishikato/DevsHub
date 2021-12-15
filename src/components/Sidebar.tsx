import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { logoutUser } from '../store/action'
import { useNavigate } from 'react-router-dom'
import { IoLogOutOutline, IoCreateOutline } from 'react-icons/io5'

interface Props {
  chats?: {
    id: string
    user_picture: string
    username: string
  }[]
  isSettingPage?: boolean
}

const Sidebar = ({ chats, isSettingPage = false }: Props) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const loginUser = useSelector((state) => (state as any).loginUser)
  const [profileImage, setProfileImage] = useState<string | null>(null)

  const logout = async () => {
    await supabase.auth.signOut()
    dispatch(logoutUser())
    navigate('/login')
  }

  useEffect(() => {
    const fetchPhoto = async () => {
      const { data, error } = await supabase.storage.from('user-upload').download(loginUser.photos[0])
      const imageUrl = URL.createObjectURL(data as Blob)
      setProfileImage(imageUrl)
    }
    if (loginUser.photos && loginUser.photos.length > 0) fetchPhoto()
  }, [loginUser])

  return (
    <div className="border-r border-slate-100 p-6 w-1/4 min-w-[260px] max-w-[400px]">
      <div className="flex flex-wrap items-center space-x-3">
        <img
          src={profileImage || loginUser.gh_avatar}
          className="rounded-full w-[48px] border box-content"
          alt=""
        />
        <div className="text-lg font-semibold">
          <Link to="/settings">{loginUser.firstname || loginUser.username}</Link>
        </div>
      </div>
      {chats && (
        <>
          <div className="mt-8 mb-4 text-base font-bold">Chats</div>
          {chats.map((chat) => (
            <Link
              to={`/chats/${chat.id}`}
              key={chat.id}
              className="flex flex-wrap items-center px-3 py-2 mb-3 space-x-3 rounded-full hover:bg-slate-200"
            >
              <img src={chat.user_picture} className="w-[40px] rounded-full border box-content" alt="" />
              <div className="text-base font-semibold">{chat.username}</div>
            </Link>
          ))}
        </>
      )}

      {isSettingPage && (
        <>
          <div
            onClick={logout}
            className="flex items-center justify-center px-3 py-3 mt-8 mb-4 space-x-3 text-lg rounded-full cursor-pointer bg-slate-100 hover:bg-slate-200"
          >
            <IoCreateOutline size={25} />
            <div>Edit profile</div>
          </div>
          <div
            onClick={logout}
            className="flex items-center justify-center px-3 py-3 mb-4 space-x-3 text-lg rounded-full cursor-pointer hover:bg-slate-200"
          >
            <IoLogOutOutline size={25} />
            <div>Log out</div>
          </div>
        </>
      )}
    </div>
  )
}

export default Sidebar
