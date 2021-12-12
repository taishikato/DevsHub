import {Link} from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className="w-[250px] border-r border-gray-200">
      <div className="flex flex-wrap items-center p-2 space-x-4">
        <img src="https://bit.ly/dan-abramov" className="rounded-full" width="40" alt="" />
        <div className="font-semibold">
          <Link to="/user/your-id">Dan Abramov</Link>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
