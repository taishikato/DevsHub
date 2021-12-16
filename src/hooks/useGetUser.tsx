import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

const useGetUser = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any | null>(null)

  useEffect(() => {
    getProfile()
  }, [])

  async function getProfile() {
    try {
      setLoading(true)
      const user = supabase.auth.user()

      if (user === null) return

      let { data, error, status } = await supabase
        .from('users')
        .select(`firstname, id, lastname, username, photos, gh_avatar, bio, languages`)
        .eq('id', user?.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) setUser(data)
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }
  }

  return { user, loading, error }
}

export default useGetUser
