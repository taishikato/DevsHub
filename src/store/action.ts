export const LOGIN = 'login'
export const LOGOUT = 'logout'

/**
 * LoginUser
 */
export const loginUser = (user: any) => ({
  type: LOGIN,
  id: user.id,
  username: user.username,
  email: user.email,
})

export const logoutUser = () => ({
  type: LOGOUT,
})
