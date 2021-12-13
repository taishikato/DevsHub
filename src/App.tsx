import { Provider } from 'react-redux'
import { initializeStore } from './store/store'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Profile from './components/Profile'
import Login from './components/Login'
import Auth from './components/Auth'

const store = initializeStore()

function App() {
  return (
    <Provider store={store}>
      <Auth>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/settings" element={<Profile />} />
            <Route path="login" element={<Login />} />
          </Routes>
        </BrowserRouter>
      </Auth>
    </Provider>
  )
}

export default App
