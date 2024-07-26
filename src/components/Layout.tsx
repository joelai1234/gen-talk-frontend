import { Outlet } from 'react-router-dom'
import Header from './Header'

export default function Layout() {
  return (
    <div
      className="min-h-[var(--vh)*100] bg-pale-green bg-cover bg-center"
      style={{
        backgroundImage: 'url(/images/bg.png)'
      }}
    >
      <div>
        <Header />
      </div>
      <Outlet />
    </div>
  )
}
