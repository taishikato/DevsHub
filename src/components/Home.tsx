import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { supabase } from '../supabaseClient'
import Header from './Header'
import Sidebar from './Sidebar'
import { IoChatbubbleOutline, IoClose } from 'react-icons/io5'
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

    const { data } = await supabase
      .from('users')
      .select('username, photos, id, gh_avatar, bio, languages')
      .not('id', 'eq', loginUser.id)

    if ((data as any).length === 0) {
      setTextToShow('Sorry...We need more people to show other users.')
      return
    }

    const randomIndex = Math.floor(Math.random() * (data as any[]).length)

    const potentialUser = (data as any[])[randomIndex]

    if (potentialUser.photos) {
      const { data } = await supabase.storage.from('user-upload').download(potentialUser.photos[0])
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

    const { data } = await supabase
      .from('chats')
      .insert({ id: uuidv4(), user_ids: [loginUser.id, potentialUser.id] })
      .single()

    navigate(`/chats/${(data as any).id}`)
  }

  return (
    <>
      <div className="flex h-screen">
        <Sidebar showChats={true} />
        <div className="flex-1">
          <Header />
          {potentialUser ? (
            <div className="m-8 rounded-md h-[500px]">
              <div className="flex space-x-3 m-8 rounded-md h-[500px]">
                <div
                  style={{ backgroundImage: `url(${potentialUser.imageUrl || potentialUser.gh_avatar})` }}
                  className="w-1/2 bg-center bg-no-repeat bg-cover rounded-2xl"
                />
                <div className="w-1/2 h-full p-4">
                  <div className="mb-3 text-3xl font-bold">{potentialUser.username}</div>
                  <div className="flex flex-wrap mb-3 space-x-2">
                    {potentialUser.languages &&
                      potentialUser.languages.map((language: string) => {
                        return (
                          <div
                            key={language}
                            className="inline px-3 py-1 text-sm font-semibold text-green-500 bg-green-100 rounded-full"
                          >
                            {language}
                          </div>
                        )
                      })}
                  </div>
                  <div>{potentialUser.bio}</div>
                </div>
              </div>
              <div className="flex justify-center mt-2 space-x-7">
                <button
                  className="p-3 text-xl font-semibold border rounded-full cursor-pointer border-slate-500 text-slate-700 hover:bg-slate-200"
                  title="Meet another dev"
                  onClick={(e) => {
                    e.preventDefault()
                    fetchPosientialUser()
                  }}
                >
                  <IoClose size={30} />
                </button>
                <button
                  className="flex items-center px-4 py-2 space-x-2 text-xl font-semibold text-white bg-green-500 rounded-full hover:bg-green-600"
                  title="Talk"
                  onClick={(e) => {
                    e.preventDefault()
                    createOrGetChatRoom()
                  }}
                >
                  <IoChatbubbleOutline size={30} />
                  <div>Commit to talk</div>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-lg font-semibold">
              {textToShow}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Home
