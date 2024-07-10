import { cn } from '@/lib/utils'
import ImageWithFallback from './ImageWithFallback'

interface ChatBotItemProps {
  avatar: string
  name: string
  time: string
  active?: boolean
  onClick?: () => void
}

export default function ChatBotItem({
  avatar,
  name,
  time,
  active,
  onClick
}: ChatBotItemProps) {
  return (
    <div
      className={cn(
        'flex w-full cursor-pointer items-center justify-between border-l-[6px] border-t border-l-transparent border-t-[#EBEBEB] py-4 pl-[18px] pr-6 transition hover:border-l-pale hover:bg-pale/40',
        {
          'border-l-pale bg-pale/40': active
        }
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-full border border-[#EBEBEB] bg-white">
          <ImageWithFallback
            className="size-[18px] object-contain"
            src={avatar}
            fallbackSrc="/images/avatar1.png"
            alt={name}
          />
        </div>
        <p className="text-[#4c4c4c]">{name}</p>
      </div>
      <p className="text-xs text-[#9a9a9a]">{time}</p>
    </div>
  )
}
