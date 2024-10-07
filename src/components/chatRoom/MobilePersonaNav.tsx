import { cn } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'
import { IoIosArrowDown, IoMdAdd, IoMdSearch } from 'react-icons/io'
import { MdOutlineEdit } from 'react-icons/md'
import ChatBotItem from '../ChatBotItem'
import { Link, useNavigate } from 'react-router-dom'

interface MobilePersonaNavProps {
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

export default function MobilePersonaNav({
  personaId,
  personaOptions,
  onChangePersona,
  search,
  onChangeSearch
}: MobilePersonaNavProps) {
  const navigate = useNavigate()
  const [isOpenMobileMenu, setIsOpenMobileMenu] = useState(false)

  const [height, setHeight] = useState('0px')
  const contentRef = useRef<HTMLDivElement>(null)

  const toggleCollapse = () => {
    setIsOpenMobileMenu(!isOpenMobileMenu)
  }

  useEffect(() => {
    if (contentRef.current) {
      setHeight(
        isOpenMobileMenu ? `${contentRef.current.scrollHeight}px` : '0px'
      )
    }
  }, [isOpenMobileMenu])

  const persona = personaOptions.find((item) => item.id === personaId)

  return (
    <div className="relative mb-4 sm:hidden">
      <div className="z-20 flex h-[56px] items-center justify-between bg-white pl-4">
        {isOpenMobileMenu && (
          <div className="relative w-full rounded-xl px-2">
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
        )}
        {!isOpenMobileMenu && (
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-full border border-[#EBEBEB]">
              {persona ? (
                <div className="flex h-full items-center justify-center text-xl">
                  {persona.avatar}
                </div>
              ) : (
                <img src="/images/default-persona.png" alt="icon" />
              )}
            </div>
            <p className="text-base text-[#4c4c4c]">
              {persona ? persona.name : 'Persona'}
            </p>
            {persona && (
              <button
                className="size-6"
                onClick={() => {
                  navigate(`/persona/${persona?.id}/edit`)
                }}
              >
                <MdOutlineEdit className=" text-earth-green" />
              </button>
            )}
          </div>
        )}
        <button className="p-4 pl-0" onClick={toggleCollapse}>
          <IoIosArrowDown
            className={cn('size-5 text-[#4c4c4c]', {
              'transform rotate-180': isOpenMobileMenu
            })}
          />
        </button>
      </div>
      <div
        className={cn(
          'rounded-b-[20px] z-10 bg-white max-h-0 ease-in-out overflow-hidden absolute w-full transition-all duration-300 flex flex-col'
        )}
        style={{
          maxHeight: height,
          boxShadow: '0px 20px 20px 0 rgba(65,76,65,0.07)'
        }}
      >
        <button className="mx-6 mb-4 mt-2 flex items-center gap-1">
          <IoMdAdd className="text-earth-green" />
          <Link className="text-sm text-earth-green" to="/persona/create">
            New Persona
          </Link>
        </button>
        <div className="max-h-[374px] flex-1 overflow-auto" ref={contentRef}>
          {personaOptions.map((item) => (
            <ChatBotItem
              key={item.id}
              id={item.id}
              avatar={item.avatar}
              name={item.name}
              time={item.time}
              active={item.id === persona?.id}
              onClick={() => {
                setIsOpenMobileMenu(false)
                onChangePersona(item.id)
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
