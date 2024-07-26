import { Link, Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div
      className="min-h-[var(--vh)*100] bg-pale-green bg-cover bg-center"
      style={{
        backgroundImage: 'url(/images/bg.png)'
      }}
    >
      <div>
        <header className="flex h-[60px] items-center justify-between px-6 py-2">
          <Link to="/chatbot">
            <div className="flex items-center gap-2">
              <img src="/images/logo.png" alt="logo" />
              <h1 className=" text-2xl text-earth-green">GenTalk</h1>
            </div>
          </Link>
        </header>
      </div>
      <Outlet />
    </div>
  )
}
