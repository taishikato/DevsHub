import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { useParams } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useSelector } from 'react-redux'

const Chat = () => {
  const [newMessage, setNewMessage] = useState('')
  const { id } = useParams()
  const loginUser = useSelector((state) => (state as any).loginUser)
  const [sendingMessage, setSendingMessage] = useState(false)
  const [messages, setMessages] = useState<any[]>([])

  const sendNewMessage = async (message: string) => {
    setSendingMessage(true)

    await supabase.from('messages').insert({
      chat_id: id,
      content: newMessage,
      user_id: loginUser.id,
    })

    setMessages((prev: any) => {
      const clone = [...prev]
      clone.push({
        content: newMessage,
        user_id: loginUser.id,
      })

      return clone
    })

    setNewMessage('')

    setSendingMessage(false)
  }

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('content, user_id')
        .eq('chat_id', id)
        .order('inserted_at', { ascending: true })

      setMessages(data as any[])
    }

    fetchMessages()
  }, [id])

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 m-8">
        {messages.map((m) => {
          return <div className="p-3 mb-2 bg-gray-200 rounded">{m.content}</div>
        })}
        <input type="text" className="border" onChange={(e) => setNewMessage(e.target.value)} />
        <button
          onClick={(e) => {
            e.preventDefault()
            sendNewMessage(newMessage)
          }}
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default Chat
