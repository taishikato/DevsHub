import { memo } from 'react'
import { Link } from 'react-router-dom'

const Header = () => (
  <div className="flex justify-center p-3">
    <Link to="/" className="text-2xl font-bold">
      DevsHub
    </Link>
  </div>
)

export default memo(Header)
