import { useDispatch } from 'react-redux'
import { ReactNode, useEffect } from 'react'
import useGetUser from '../hooks/useGetUser'
import { loginUser, checkingLoginDone } from '../store/action'

const Auth = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch()
  const { user, loading } = useGetUser()

  useEffect(() => {
    if (loading) return
    dispatch(checkingLoginDone())
    if (user) dispatch(loginUser(user))
  }, [user, dispatch, loading])

  return <>{children}</>
}

export default Auth
