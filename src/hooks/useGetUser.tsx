import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

const useGetUser = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<any | null>(null)

  useEffect(() => {
    getProfile()
  }, [])

  async function getProfile() {
    try {
      setLoading(true)
      const user = supabase.auth.user()

      let { data, error, status } = await supabase
        .from('users')
        .select(`firstname, lastname, username`)
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
