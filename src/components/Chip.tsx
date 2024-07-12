import { cn } from '@/lib/utils'

interface ChipProps {
  label: string
  onClick?: () => void
  selected?: boolean
}

export default function Chip({ label, onClick, selected }: ChipProps) {
  return (
    <div
      className={cn(
        'group inline-block w-fit cursor-pointer text-[#9a9a9a] rounded-[100px] bg-[#ebebeb] px-4 py-2.5 transition  hover:bg-earth-green hover:text-white',
        {
          'bg-earth-green text-white': selected
        }
      )}
      onClick={onClick}
    >
      <p className="text-sm">{label}</p>
    </div>
  )
}
