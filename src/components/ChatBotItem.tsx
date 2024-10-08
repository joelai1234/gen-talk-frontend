import { cn } from '@/lib/utils'
import { MdOutlineEdit } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

interface ChatBotItemProps {
  id: string | number
  avatar: string
  name: string
  time?: string
  active?: boolean
  onClick?: () => void
}

export default function ChatBotItem({
  id,
  avatar,
  name,
  time,
  active,
  onClick
}: ChatBotItemProps) {
  const navigate = useNavigate()
  return (
    <div
      className={cn(
        'flex w-full group cursor-pointer items-center justify-between border-l-[6px] border-t border-l-transparent border-t-[#EBEBEB] py-4 pl-[18px] pr-6 transition hover:border-l-pale hover:bg-pale/40',
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
      <button
        className="hidden size-6 group-hover:block"
        onClick={() => {
          navigate(`/persona/${id}/edit`)
        }}
      >
        <MdOutlineEdit className=" text-earth-green" />
      </button>
      <p className="text-xs text-[#9a9a9a] group-hover:hidden">{time}</p>
    </div>
  )
}
