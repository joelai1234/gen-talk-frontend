import { cn } from '@/lib/utils'
import { useState } from 'react'
import { IoIosArrowDown, IoMdSearch } from 'react-icons/io'
import { PersonaData, TempPersonaData } from '@/model/persona'
import PersonaMenuAutoHightDialog from '../PersonaMenuAutoHightDialog'

interface MobileConversationPersonaNavProps {
  persona?: TempPersonaData
  personaOptions: PersonaData[]
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

  const toggleCollapse = () => {
    setIsOpenMobileMenu(!isOpenMobileMenu)
  }

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
      <PersonaMenuAutoHightDialog
        className="absolute z-10 rounded-b-2xl bg-white"
        isOpen={isOpenMobileMenu}
        onClose={() => setIsOpenMobileMenu(false)}
        onChangePersona={onChangePersona}
        personaOptions={personaOptions}
        onClickNewPersona={onClickNewPersona}
      />
    </div>
  )
}
