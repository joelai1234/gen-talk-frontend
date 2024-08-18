import { cn } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'
import { IoIosArrowDown, IoMdAdd, IoMdSearch } from 'react-icons/io'
import { TempPersonaData } from '@/model/persona'
import { HiOutlineAdjustments } from 'react-icons/hi'
import SimpleChatBotItem from '../SimpleChatBotItem'

interface MobilePersonaNavProps {
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
  onClickAdjustments: () => void
}

export default function MobileRewritePersonaNav({
  persona,
  personaOptions,
  onChangePersona,
  search,
  onChangeSearch,
  onClickNewPersona,
  onClickAdjustments
}: MobilePersonaNavProps) {
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
    <div className="relative z-10 mb-4 h-[40px] sm:hidden">
      <div className="flex cursor-pointer items-start gap-2 px-6">
        <div
          className="flex-1 rounded-[24px] border border-[#ebebeb] bg-white"
          onClick={toggleCollapse}
        >
          <div className="flex flex-1 items-center gap-2  px-3 py-2">
            {isOpenMobileMenu && (
              <div
                className="relative w-full rounded-xl px-2"
                onClick={(event) => {
                  event.preventDefault()
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
                  onChange={(event) => {
                    onChangeSearch(event.currentTarget.value)
                  }}
                />
              </div>
            )}
            {!isOpenMobileMenu && (
              <div className="flex flex-1 items-center gap-2">
                <div className="size-6 rounded-full border border-[#EBEBEB]">
                  {persona?.id ? (
                    <div className="flex h-full items-center justify-center text-xl">
                      {persona.avatar}
                    </div>
                  ) : (
                    <img src="/images/default-persona.png" alt="icon" />
                  )}
                </div>
                <p className="text-base text-[#4c4c4c]">
                  {persona?.id ? persona.name : 'New'}
                </p>
              </div>
            )}
            <button>
              <IoIosArrowDown
                className={cn('size-5 text-[#4c4c4c]', {
                  'transform rotate-180': isOpenMobileMenu
                })}
              />
            </button>
          </div>
          <div
            className={cn(
              'max-h-0 ease-in-out rounded-b-[24px] overflow-hidden w-full transition-all duration-300 flex flex-col'
            )}
            style={{
              maxHeight: height,
              boxShadow: '0px 20px 20px 0 rgba(65,76,65,0.07)'
            }}
          >
            <button
              className="mx-6 mb-4 mt-2 flex items-center gap-1"
              onClick={onClickNewPersona}
            >
              <IoMdAdd className="text-earth-green" />
              <p className="text-sm text-earth-green">New Persona</p>
            </button>
            <div
              className="max-h-[346px] flex-1 overflow-auto pb-2"
              ref={contentRef}
            >
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
        <HiOutlineAdjustments
          className="mt-3 text-xl text-[#4C4C4C]"
          onClick={onClickAdjustments}
        />
      </div>
    </div>
  )
}
