import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { supabase } from '../supabaseClient'
import Header from './Header'
import Sidebar from './Sidebar'
import { IoChatbubbleSharp, IoSyncCircle } from 'react-icons/io5'
import { v4 as uuidv4 } from 'uuid'

const Home = () => {
  const navigate = useNavigate()
  const loginUser = useSelector((state) => (state as any).loginUser)
  const isCheckingLogin = useSelector((state) => (state as any).isCheckingLogin)
  const [potentialUser, setPotentialUser] = useState<any>(null)
  const [isLogin, setIsLogin] = useState(false)

  const [textToShow, setTextToShow] = useState('Someone is coming...')
  const fetchPosientialUser = async () => {
    setPotentialUser(null)

    const { data, error } = await supabase
      .from('users')
      .select('username, photos, id, gh_avatar')
      .not('id', 'eq', loginUser.id)

    if ((data as any).length === 0) {
      setTextToShow('We need more people to show other users...')
      return
    }

    const randomIndex = Math.floor(Math.random() * (data as any[]).length)

    const potentialUser = (data as any[])[randomIndex]

    if (potentialUser.photos) {
      const { data, error } = await supabase.storage.from('user-upload').download(potentialUser.photos[0])
      const url = URL.createObjectURL(data as Blob)

      potentialUser.imageUrl = url
    }

    setPotentialUser((data as any[])[randomIndex])
  }

  useEffect(() => {
    if (loginUser.id) fetchPosientialUser()
  }, [loginUser])

  useEffect(() => {
    if (isCheckingLogin === false && Object.keys(loginUser).length === 0) {
      setIsLogin(false)
    } else {
      setIsLogin(true)
    }
  }, [loginUser, isCheckingLogin, navigate])

  if (!isLogin) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <Link to="/login" className="text-lg font-semibold text-blue-500">
          Please login
        </Link>
      </div>
    )
  }

  const createOrGetChatRoom = async () => {
    const { body } = await supabase
      .from('chats')
      .select('id')
      .contains('user_ids', [loginUser.id, potentialUser.id])

    if ((body as any[]).length > 0) {
      navigate(`/chats/${(body as any)[0].id}`)
      return
    }

    const { data, error } = await supabase
      .from('chats')
      .insert({ id: uuidv4(), user_ids: [loginUser.id, potentialUser.id] })
      .single()

    navigate(`/chats/${(data as any).id}`)
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1">
        <Header />
        {potentialUser ? (
          <div className="m-8 bg-yellow-100 rounded-md h-[300px]">
            <div className="flex h-full bg-yellow-100 rounded-md">
              <div
                style={{ backgroundImage: `url(${potentialUser.imageUrl || potentialUser.gh_avatar})` }}
                className="w-1/2 bg-center bg-no-repeat bg-cover rounded-l"
              />
              <div className="flex items-center w-1/2 p-4 text-lg font-bold">{potentialUser.username}</div>
            </div>
            <div className="flex justify-center mt-3 space-x-3">
              <div
                className="p-3 text-white bg-gray-500 rounded-full cursor-pointer"
                title="Meet another dev"
                onClick={fetchPosientialUser}
              >
                <IoSyncCircle size={30} />
              </div>
              <div
                className="p-3 text-white bg-green-500 rounded-full cursor-pointer"
                title="Talk"
                onClick={createOrGetChatRoom}
              >
                <IoChatbubbleSharp size={30} />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-lg font-semibold">{textToShow}</div>
        )}
      </div>
    </div>
  )
}

export default Home
