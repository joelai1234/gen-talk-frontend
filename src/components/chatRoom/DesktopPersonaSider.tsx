import { IoMdAdd, IoMdSearch } from 'react-icons/io'
import ChatBotItem from '../ChatBotItem'
import { Link } from 'react-router-dom'

interface DesktopPersonaSiderProps {
  personaId?: number
  personaOptions: {
    id: number
    avatar: string
    name: string
    time: string
    active?: boolean
  }[]
  onChangePersona: (id: number) => void
  search: string
  onChangeSearch: (search: string) => void
}

export default function DesktopPersonaSider({
  personaId,
  personaOptions,
  onChangePersona,
  search,
  onChangeSearch
}: DesktopPersonaSiderProps) {
  return (
    <div className="hidden h-full w-80 flex-col overflow-auto bg-white py-6 sm:flex">
      <div className="space-y-3 px-6 pb-3">
        <div className="relative rounded-xl">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
            <IoMdSearch className="size-4 text-[#9a9a9a]" />
          </div>
          <input
            className="w-full rounded-xl border border-[#ebebeb] py-2 pl-10 pr-4 text-sm placeholder:text-[#9a9a9a] focus:outline-none"
            type="text"
            placeholder="Search"
            value={search}
            onChange={(event) => onChangeSearch(event.currentTarget.value)}
          />
        </div>
        <button className="flex items-center gap-1">
          <IoMdAdd className="text-earth-green" />
          <Link className="text-sm text-earth-green" to="/persona/create">
            New Persona
          </Link>
        </button>
      </div>
      <div className=" flex-1 overflow-auto">
        {personaOptions.map((item) => (
          <ChatBotItem
            key={item.id}
            id={item.id}
            avatar={item.avatar}
            name={item.name}
            time={item.time}
            active={item.id === personaId}
            onClick={() => {
              onChangePersona(item.id)
            }}
          />
        ))}
      </div>
    </div>
  )
}
