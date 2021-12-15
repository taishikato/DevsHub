import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { useParams } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useSelector } from 'react-redux'
import Header from './Header'

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
  const [users] = useState(new Map())
  const loginUser = useSelector((state) => (state as any).loginUser)
  const [sendingMessage, setSendingMessage] = useState(false)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessageFromSub, setNewMessageFromSub] = useState<Message | null>(null)
  const [newOrUpdatedUser, handleNewOrUpdatedUser] = useState<User | null>(null)

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
        .order('inserted_at', { ascending: true })

      setMessages(data as any[])
    }

    fetchMessages()
  }, [id])

  // New or updated user recieved from Postgres
  useEffect(() => {
    if (newOrUpdatedUser) users.set(newOrUpdatedUser.id, newOrUpdatedUser)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newOrUpdatedUser])

  useEffect(() => {
    // Get Channels
    // Listen for new messages
    const messageListener = supabase
      .from('messages')
      .on('*', (payload) => {
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
        let authorId = newMessageFromSub.user_id
        if (!users.get(authorId)) await fetchUser(authorId, (user) => handleNewOrUpdatedUser(user))
        setMessages(messages.concat(newMessageFromSub))
      }
      handleAsync()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newMessageFromSub])

  return (
    <>
      <Header />
      <div className="flex h-full min-h-screen">
        <Sidebar />
        <div className="flex-1 m-8">
          {messages.map((m) => {
            return (
              <div key={m.id} className="p-3 mb-2 bg-gray-200 rounded">
                {m.content}
              </div>
            )
          })}
          <div className="absolute bottom-0">
            <input
              type="text"
              className="p-2 border rounded"
              onChange={(e) => setNewMessage(e.target.value)}
              value={newMessage}
            />
            {newMessage === '' && sendingMessage === false && (
              <button className="px-5 py-2 bg-gray-200 rounded cursor-not-allowed">Send</button>
            )}
            {newMessage.length > 0 && sendingMessage === false && (
              <button
                onClick={(e) => {
                  e.preventDefault()
                  sendNewMessage(newMessage)
                }}
                className="px-5 py-2 bg-gray-300 rounded"
              >
                Send
              </button>
            )}

            {sendingMessage && <button className="px-5 py-2 bg-gray-300 rounded">Sending...</button>}
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
export const fetchUser = async (userId: string, setState: (props: any) => void) => {
  try {
    let { body } = await supabase.from('users').select(`*`).eq('id', userId)
    let user = (body as any)[0]
    if (setState) setState(user)
    return user
  } catch (error) {
    console.log('error', error)
  }
}

export default Chat
