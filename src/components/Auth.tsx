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

  useEffect(() => {
    if (loading) return
    dispatch(checkingLoginDone())
    if (user) dispatch(loginUser(user))
  }, [user, dispatch, loading])

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (_event === 'SIGNED_IN') {
        const user = supabase.auth.user()

        const { body } = await supabase
          .from('users')
          .select('firstname, id, lastname, username, photos, gh_avatar, bio, languages')
          .eq('id', user?.id)
        if ((body as any[]).length > 0) {
          dispatch(loginUser((body as any)[0]))
          return
        }

        // Save user data
        const response = await supabase
          .from('users')
          .insert({
            id: user?.id,
            email: user?.email,
            username: user?.user_metadata.user_name,
            gh_avatar: user?.user_metadata.avatar_url,
          })
          .single()

        dispatch(loginUser(response.body))
      }

      setSession(session)
    })
  }, [dispatch])

  return <>{children}</>
}

export default Auth
