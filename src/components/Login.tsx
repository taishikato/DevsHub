import Header from './Header'
import { IoLogoGithub } from 'react-icons/io5'

const Login = () => {
  const handleLogin = () => {
    console.log('login')
  }

  return (
    <div className="h-screen">
      <Header />
      <div className="flex flex-col items-center justify-center h-full">
        <p className="mb-5 text-lg font-semibold">Welcome! Let's get started your journey!</p>
        <div
          onClick={handleLogin}
          className="flex items-center px-4 py-2 font-semibold text-gray-800 bg-white border border-gray-300 rounded-md shadow cursor-pointer hover:bg-gray-100"
        >
          <IoLogoGithub className="mr-2" size={23} />
          Login with GitHub
        </div>
      </div>
    </div>
  )
}

export default Login
