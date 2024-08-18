import { cn } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'
import { IoIosArrowDown, IoMdAdd, IoMdSearch } from 'react-icons/io'
import { TempPersonaData } from '@/model/persona'
import SimpleChatBotItem from '../SimpleChatBotItem'

interface MobileConversationPersonaNavProps {
  persona?: TempPersonaData
  personaOptions: {
    id: number
    avatar: string
    name: string
    active?: boolean
  }[]
  onChangePersona: (id: number) => void
  search: string
  onChangeSearch: (search: string) => void
  onClickNewPersona: () => void
}

export default function MobileConversationPersonaNav({
  persona,
  personaOptions,
  onChangePersona,
  search,
  onChangeSearch,
  onClickNewPersona
}: MobileConversationPersonaNavProps) {
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

  return (
    <div className="relative mb-4 sm:hidden">
      <div
        className="z-20 flex h-[56px] cursor-pointer items-center justify-between bg-white px-4"
        onClick={toggleCollapse}
      >
        {isOpenMobileMenu && (
          <div
            className="relative w-full rounded-xl px-2"
            onClick={(event) => {
              event.stopPropagation()
            }}
          >
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
              {persona?.id ? (
                <div className="flex h-full items-center justify-center text-xl">
                  {persona.avatar}
                </div>
              ) : (
                <img src="/images/default-persona.png" alt="icon" />
              )}
            </div>
            <p className="text-base text-[#4c4c4c]">
              {persona ? (persona?.id ? persona.name : 'New') : 'Persona'}
            </p>
          </div>
        )}
        <button onClick={toggleCollapse}>
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
        <button
          className="mx-6 mb-4 mt-2 flex items-center gap-1"
          onClick={() => {
            onClickNewPersona()
            setIsOpenMobileMenu(false)
          }}
        >
          <IoMdAdd className="text-earth-green" />
          <p className="text-sm text-earth-green">New Persona</p>
        </button>
        <div className="max-h-[374px] flex-1 overflow-auto" ref={contentRef}>
          {personaOptions.map((item) => (
            <SimpleChatBotItem
              key={item.id}
              avatar={item.avatar}
              name={item.name}
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
