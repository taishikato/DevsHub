import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { useParams } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useSelector } from 'react-redux'
import Header from './Header'
import _ from 'lodash'

interface Message {
  chat_id: string
  content: string
  user_id: string
}

interface User {
  id: string
}

const Chat = () => {
  const [newMessage, setNewMessage] = useState('')
  const { id } = useParams()
  const [users, setUsers] = useState(new Map())
  const loginUser = useSelector((state) => (state as any).loginUser)
  const [sendingMessage, setSendingMessage] = useState(false)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessageFromSub, setNewMessageFromSub] = useState<Message | null>(null)
  const fetchUser = async (userId: string, setState?: (props: any) => void) => {
    try {
      let { body } = await supabase.from('users').select(`id, username, gh_avatar`).eq('id', userId)
      let user = (body as any)[0]

      return user
    } catch (error) {
      console.log('error', error)
    }
  }

  const sendNewMessage = async (message: string) => {
    setSendingMessage(true)

    await supabase.from('messages').insert({
      chat_id: id,
      content: newMessage,
      user_id: loginUser.id,
    })

    setNewMessage('')

    setSendingMessage(false)
  }

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('id, content, user_id')
        .eq('chat_id', id)
        .order('inserted_at', { ascending: false })
        .limit(15)

      const sorted = _.sortBy(data, ['id'])
      // const { data, error } = await supabase.from('last_messages_4').select('*').eq('chat_id', id)

      setMessages(sorted as any[])
    }

    const fetchChatInfo = async () => {
      const { data, error } = await supabase.from('chats').select('user_ids').eq('id', id).single()

      const usersMap = new Map()
      for (const authorId of data.user_ids) {
        const user = await fetchUser(authorId)
        usersMap.set(user.id, user)
      }

      setUsers(usersMap)
    }

    fetchMessages()
    fetchChatInfo()
  }, [id])

  useEffect(() => {
    // Get Channels
    // Listen for new messages
    const messageListener = supabase
      .from('messages')
      .on('*', (payload: any) => {
        setNewMessageFromSub(payload.new)
      })
      .subscribe()

    // Cleanup on unmount
    return () => {
      messageListener.unsubscribe()
    }
  }, [])

  // New message recieved from Postgres
  useEffect(() => {
    if (newMessageFromSub && newMessageFromSub.chat_id === id) {
      const handleAsync = async () => {
        // let authorId = newMessageFromSub.user_id
        // if (!users.get(authorId)) await fetchUser(authorId, (user) => handleNewOrUpdatedUser(user))
        setMessages(messages.concat(newMessageFromSub))
      }
      handleAsync()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newMessageFromSub])

  return (
    <>
      {/* <Header /> */}
      <div className="flex h-full min-h-screen">
        <Sidebar />
        <div className="flex flex-col flex-1 min-h-full ">
          <div className="h-[calc(100vh-58px)] overflow-y-scroll pb-5">
            {messages.map((m) => {
              return (
                <div className="hover:cursor-pointer hover:bg-slate-100">
                  <div key={m.id} className="flex p-2 m-8 my-4 space-x-4">
                    {users.get(m.user_id) && (
                      <div>
                        <img
                          src={users.get(m.user_id).gh_avatar}
                          alt={users.get(m.user_id).username}
                          className="w-10 h-10 rounded-full"
                        />
                      </div>
                    )}
                    <div>
                      <div className="font-semibold">{users.get(m.user_id)?.username}</div>
                      <div>{m.content}</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="w-full p-2 bg-slate-100">
            <input
              type="text"
              className="w-full p-2 border rounded"
              onChange={(e) => setNewMessage(e.target.value)}
              value={newMessage}
              onKeyPress={(e) => {
                if (e.key !== 'Enter') return

                if (newMessage.replaceAll(' ', '') === '') return

                sendNewMessage(newMessage)
              }}
            />
          </div>
        </div>
      </div>
    </>
  )
}

/**
 * Fetch a single user
 * @param {number} userId
 * @param {function} setState Optionally pass in a hook or callback to set the state
 */
export default Chat
