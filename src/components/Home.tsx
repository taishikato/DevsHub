import Header from './Header'
import Sidebar from './Sidebar'

const Home = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <div className="flex m-8 bg-yellow-100 rounded-md fle h-5/6">
          <div
            style={{backgroundImage: 'url(https://bit.ly/dan-abramov)'}}
            className="w-1/2 bg-center bg-no-repeat bg-cover rounded-l"
          />
          <div className="flex items-center w-1/2 p-4 text-lg font-bold">Dan</div>
        </div>
      </div>
    </div>
  )
}

export default Home
