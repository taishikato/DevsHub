import Header from './Header'

const Login = () => {
  const handleLogin = () => {
    console.log('login')
  }

  return (
    <>
      <Header />
      <div className="flex items-center justify-center h-screen">
        <div
          onClick={handleLogin}
          className="px-4 py-2 font-semibold text-gray-800 bg-white border border-gray-300 rounded-md shadow cursor-pointer hover:bg-gray-100">
          Login with GitHub
        </div>
      </div>
    </>
  )
}

export default Login
