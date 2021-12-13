import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { IoPersonCircleSharp } from 'react-icons/io5'

const Sidebar = () => {
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
    <div className="w-[300px] border-r border-gray-200">
      <div className="flex flex-wrap items-center p-8 space-x-4">
        <img src={profileImage || loginUser.gh_avatar} className="rounded-full" width="40" alt="" />
        <div className="font-semibold">
          <Link to="/settings">{loginUser.firstname || loginUser.username}</Link>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
