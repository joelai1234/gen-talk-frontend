import { FaUserCircle } from 'react-icons/fa'
import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="flex justify-between px-6 py-2">
      <Link to="/chatbot">
        <div className="flex items-center gap-2">
          <img src="/images/logo.png" alt="logo" />
          <h1 className=" text-2xl text-earth-green">GenTalk</h1>
        </div>
      </Link>

      <div>
        <button>
          <FaUserCircle className="size-8 text-earth-green" />
        </button>
      </div>
    </header>
  )
}
