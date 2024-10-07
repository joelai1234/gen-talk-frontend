import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { PersonaData } from '@/model/persona'
import { useState } from 'react'
import { IoMdAdd, IoMdSearch } from 'react-icons/io'
import PersonaItem from './PersonaItem'
import { cn } from '@/lib/utils'

interface SearchPersonaModalProps {
  className?: string
  personaOptions: PersonaData[]
  children?: React.ReactNode
  onClickNewPersona?: () => void
  disabledNewPersona?: boolean
  onChangePersona: (persona: PersonaData) => void
}

export default function SearchPersonaModal({
  className,
  personaOptions,
  onClickNewPersona,
  disabledNewPersona,
  children,
  onChangePersona
}: SearchPersonaModalProps) {
  const [search, setSearch] = useState('')

  const personaSearchOptionsData = personaOptions
    .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
    .reverse()
    .sort((a, b) => {
      const aUpdatedAt = a.updatedAt?.getTime() ?? 0
      const bUpdatedAt = b.updatedAt?.getTime() ?? 0
      return bUpdatedAt - aUpdatedAt
    })

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className={cn('overflow-hidden rounded-[20px] px-0 py-3', className)}
      >
        <div className="relative mb-3 w-full rounded-xl px-6">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-9">
            <IoMdSearch className="size-4 text-[#9a9a9a]" />
          </div>
          <input
            className="w-full rounded-xl border border-[#ebebeb] py-2 pl-8 pr-4 text-sm placeholder:text-[#9a9a9a] focus:outline-none"
            type="text"
            placeholder="Search"
            value={search}
            onChange={(event) => setSearch(event.currentTarget.value)}
          />
        </div>
        {!disabledNewPersona && (
          <PopoverClose>
            <button
              className="mx-6 mb-4 mt-2 flex items-center gap-1"
              onClick={onClickNewPersona}
            >
              <IoMdAdd className="text-earth-green" />
              <p className="text-sm text-earth-green">New Persona</p>
            </button>
          </PopoverClose>
        )}

        <div className="max-h-[430px] overflow-auto">
          {personaSearchOptionsData.map((persona, index) => (
            <PopoverClose
              key={persona.id}
              className="flex w-full"
              onClick={() => {
                onChangePersona(persona)
              }}
            >
              <PersonaItem
                className={cn({
                  'border-b border-b-[#EDEDED]':
                    index !== personaSearchOptionsData.length - 1
                })}
                avatar={persona.avatar}
                name={persona.name}
              />
            </PopoverClose>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
