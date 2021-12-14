import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'

interface Props {
  chats?: {
    id: string
    user_picture: string
    username: string
  }[]
}

const Sidebar = ({ chats }: Props) => {
  const loginUser = useSelector((state) => (state as any).loginUser)
  const [profileImage, setProfileImage] = useState<string | null>(null)

  useEffect(() => {
    const fetchPhoto = async () => {
      const { data, error } = await supabase.storage.from('user-upload').download(loginUser.photos[0])
      const imageUrl = URL.createObjectURL(data as Blob)
      setProfileImage(imageUrl)
    }
    if (loginUser.photos && loginUser.photos.length > 0) fetchPhoto()
  }, [loginUser])

  return (
    <div className="w-[300px] border-r border-gray-200 p-6">
      <div className="flex flex-wrap items-center space-x-3">
        <img
          src={profileImage || loginUser.gh_avatar}
          className="rounded-full w-[30px] border box-content"
          alt=""
        />
        <div className="font-semibold">
          <Link to="/settings">{loginUser.firstname || loginUser.username}</Link>
        </div>
      </div>
      <div className="h-[2px] bg-slate-200 my-5" />
      {chats && (
        <>
          <div className="mb-4 text-base font-bold">Chats</div>
          {chats.map((chat) => (
            <Link
              to={`/chats/${chat.id}`}
              key={chat.id}
              className="flex flex-wrap items-center p-3 mb-3 space-x-3 rounded-full hover:bg-slate-200"
            >
              <img src={chat.user_picture} className="w-[25px] rounded-full border box-content" alt="" />
              <div className="text-sm font-semibold">{chat.username}</div>
            </Link>
          ))}
        </>
      )}
    </div>
  )
}

export default Sidebar
