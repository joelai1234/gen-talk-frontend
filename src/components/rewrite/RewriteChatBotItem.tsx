import { cn } from '@/lib/utils'

interface RewriteChatBotItemProps {
  avatar: string
  name: string
  active?: boolean
  onClick?: () => void
}

export default function RewriteChatBotItem({
  avatar,
  name,
  active,
  onClick
}: RewriteChatBotItemProps) {
  return (
    <div
      className={cn(
        'flex w-full group cursor-pointer items-center justify-between border-l-[6px] border-t border-l-transparent border-t-[#EBEBEB] py-2 pl-[18px] pr-6 transition',
        {
          'border-l-pale bg-pale/40': active
        }
      )}
      onClick={onClick}
      onTouchStart={onClick}
    >
      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-full border border-[#EBEBEB] bg-white text-xl">
          {avatar}
        </div>
        <p className="text-[#4c4c4c]">{name}</p>
      </div>
    </div>
  )
}
