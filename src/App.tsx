import { useState, useEffect } from 'react'
import { Session } from '@supabase/supabase-js'
import { supabase } from './supabaseClient'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Profile from './components/Profile'
import Login from './components/Login'
import useGetUser from './hooks/useGetUser'

function App() {
  const [session, setSession] = useState<Session | null>(null)

  const { user, loading } = useGetUser()

  useEffect(() => {
    setSession(supabase.auth.session())

    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (_event === 'SIGNED_IN') {
        const user = supabase.auth.user()

        const { body } = await supabase.from('users').select('id').eq('id', user?.id).single()
        if (body) return

        // Save user data
        await supabase.from('users').insert({
          id: user?.id,
          email: user?.email,
          username: user?.user_metadata.user_name,
        })
      }

      setSession(session)
    })
  }, [])
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user/:id" element={<Profile />} />
        <Route path="login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
