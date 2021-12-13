export const LOGIN = 'login'
export const LOGOUT = 'logout'
export const DONE_CHECKING = 'doneChecking'

/**
 * LoginUser
 */
export const loginUser = (user: any | null) => ({
  type: LOGIN,
  user,
})

export const logoutUser = () => ({
  type: LOGOUT,
})

export const checkingLoginDone = () => ({
  type: DONE_CHECKING,
})
