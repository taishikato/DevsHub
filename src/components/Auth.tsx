import { supabase } from '../supabaseClient'
import { Session } from '@supabase/supabase-js'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { ReactNode, useEffect } from 'react'
import useGetUser from '../hooks/useGetUser'
import { loginUser, checkingLoginDone } from '../store/action'

const Auth = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch()
  const { user, loading } = useGetUser()
  const [session, setSession] = useState<Session | null>(null)
  console.log({ user })
  console.log({ loading })

  useEffect(() => {
    if (loading) return
    dispatch(checkingLoginDone())
    if (user) dispatch(loginUser(user))
  }, [user, dispatch, loading])

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (_event === 'SIGNED_IN') {
        const user = supabase.auth.user()

        const { body } = await supabase.from('users').select('id').eq('id', user?.id).single()
        if (body) {
          dispatch(loginUser(body))
          return
        }

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

  return <>{children}</>
}

export default Auth
