import { cn } from '@/lib/utils'

interface PersonaItemProps {
  className?: string
  avatar: string
  name: string
  active?: boolean
  onClick?: () => void
}

export default function PersonaItem({
  className,
  avatar,
  name,
  active,
  onClick
}: PersonaItemProps) {
  return (
    <button
      className={cn(
        'flex w-full group items-center justify-between border-l-[6px] border-l-transparent py-2 pl-[18px] pr-6 transition hover:border-l-pale hover:bg-pale/40',
        {
          'border-l-pale bg-pale/40': active
        },
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-full border border-[#EBEBEB] bg-white text-xl">
          {avatar}
        </div>
        <p className="text-[#4c4c4c]">{name}</p>
      </div>
    </button>
  )
}
