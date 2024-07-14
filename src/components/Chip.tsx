import { cn } from '@/lib/utils'

interface ChipProps {
  label: string
  onClick?: () => void
  selected?: boolean
  disabled?: boolean
}

export default function Chip({
  label,
  onClick,
  selected,
  disabled
}: ChipProps) {
  return (
    <button
      disabled={disabled}
      className={cn(
        'group inline-block w-fit bg-white text-black rounded-[100px] px-4 py-2.5 transition  hover:bg-earth-green hover:text-white disabled:bg-[#ebebeb] disabled:text-[#9a9a9a]',
        {
          'bg-earth-green text-white': selected
        }
      )}
      onClick={onClick}
    >
      <p className="text-sm">{label}</p>
    </button>
  )
}
