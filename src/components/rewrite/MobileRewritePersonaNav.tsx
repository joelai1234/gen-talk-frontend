import { cn } from '@/lib/utils'
import { useState } from 'react'
import { IoIosArrowDown, IoMdSearch } from 'react-icons/io'
import { PersonaData, TempPersonaData } from '@/model/persona'
import { HiOutlineAdjustments } from 'react-icons/hi'
import PersonaMenuAutoHightDialog from '../PersonaMenuAutoHightDialog'

interface MobileRewritePersonaProps {
  persona?: TempPersonaData
  personaOptions: PersonaData[]
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
}: MobileRewritePersonaProps) {
  const [isOpenMobileMenu, setIsOpenMobileMenu] = useState(false)

  const toggleCollapse = () => {
    setIsOpenMobileMenu(!isOpenMobileMenu)
  }

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
          <PersonaMenuAutoHightDialog
            className="rounded-b-3xl"
            isOpen={isOpenMobileMenu}
            onClose={() => setIsOpenMobileMenu(false)}
            onChangePersona={onChangePersona}
            personaOptions={personaOptions}
            onClickNewPersona={onClickNewPersona}
          />
        </div>
        <HiOutlineAdjustments
          className="mt-3 text-xl text-[#4C4C4C]"
          onClick={onClickAdjustments}
        />
      </div>
    </div>
  )
}
