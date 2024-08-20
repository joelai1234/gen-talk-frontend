import { cn } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'
import { IoMdAdd } from 'react-icons/io'
import PersonaItem from './PersonaItem'
import { PersonaData } from '@/model/persona'

interface PersonaMenuAutoHightDialogProps {
  className?: string
  isOpen: boolean
  onClose: () => void
  personaOptions: PersonaData[]
  activePersonaId?: number
  onClickNewPersona?: () => void
  onChangePersona: (personaId: number) => void
}

export default function PersonaMenuAutoHightDialog({
  className,
  isOpen,
  onClose,
  personaOptions,
  activePersonaId,
  onClickNewPersona,
  onChangePersona
}: PersonaMenuAutoHightDialogProps) {
  const [height, setHeight] = useState('0px')
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? `${contentRef.current.scrollHeight}px` : '0px')
    }
  }, [isOpen])

  return (
    <div
      className={cn(
        'max-h-0 ease-in-out overflow-hidden w-full transition-all duration-300 flex flex-col',
        className
      )}
      style={{
        maxHeight: height,
        boxShadow: '0px 20px 20px 0 rgba(65,76,65,0.07)'
      }}
    >
      <button
        className="mx-6 mb-4 mt-2 flex items-center gap-1"
        onClick={() => {
          onClose()
          onClickNewPersona?.()
        }}
      >
        <IoMdAdd className="text-earth-green" />
        <p className="text-sm text-earth-green">New Persona</p>
      </button>
      <div className="max-h-[346px] flex-1 overflow-auto pb-2" ref={contentRef}>
        {personaOptions.map((persona, index) => (
          <PersonaItem
            key={persona.id}
            className={cn({
              'border-b border-b-[#EDEDED]': index !== personaOptions.length - 1
            })}
            avatar={persona.avatar}
            name={persona.name}
            active={persona.id === activePersonaId}
            onClick={() => {
              onClose()
              onChangePersona(persona.id)
            }}
          />
        ))}
      </div>
    </div>
  )
}
