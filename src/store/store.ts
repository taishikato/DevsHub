import { createStore, combineReducers } from 'redux'
import { LOGIN, LOGOUT } from './action'

const loginUser = (state = {}, action: any) => {
  switch (action.type) {
    case LOGIN:
      return {
        id: action.id,
        username: action.username,
      }
    case LOGOUT:
      return {}
    default:
      return state
  }
}

const reducer = combineReducers({
  loginUser,
})

export const initializeStore = (preloadedState = {}) => {
  return createStore(reducer, preloadedState)
}
