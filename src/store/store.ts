import { createStore, combineReducers } from 'redux'
import { LOGIN, LOGOUT, DONE_CHECKING } from './action'

const loginUser = (state = {}, action: any) => {
  switch (action.type) {
    case LOGIN:
      if (action.user === null) return null
      return {
        id: action.user.id,
        username: action.user.username,
      }
    case LOGOUT:
      return null
    default:
      return state
  }
}

const isCheckingLogin = (state = true, action: any) => {
  switch (action.type) {
    case DONE_CHECKING:
      return false
    default:
      return state
  }
}

const reducer = combineReducers({
  loginUser,
  isCheckingLogin,
})

export const initializeStore = (preloadedState = {}) => {
  return createStore(reducer, preloadedState)
}
