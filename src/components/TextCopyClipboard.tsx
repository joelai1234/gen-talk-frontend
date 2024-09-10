import CopyToClipboard from 'react-copy-to-clipboard'
import { FaRegCopy } from 'react-icons/fa'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { useState } from 'react'

interface TextCopyClipboardProps {
  text: string
}

export default function TextCopyClipboard({ text }: TextCopyClipboardProps) {
  const [copied, setCopied] = useState(false)
  const [tooltipOpen, setTooltipOpen] = useState(false)

  return (
    <CopyToClipboard
      text={text}
      onCopy={() => {
        setCopied(true)
        setTooltipOpen(true)
        setTimeout(() => {
          setTooltipOpen(false)
          setTimeout(() => {
            setCopied(false)
          }, 500)
        }, 1000)
      }}
    >
      <div className="group flex cursor-pointer justify-between rounded-xl bg-[#f7f7f7] p-4 transition hover:bg-pale-green">
        <p className="text-[#4c4c4c]">
          {text.length > 200 ? `${text.slice(0, 200)}...` : text}
        </p>
        <TooltipProvider>
          <Tooltip
            open={tooltipOpen}
            onOpenChange={(open) => setTooltipOpen(open)}
          >
            <TooltipTrigger>
              <FaRegCopy className=" shrink-0 text-earth-green group-hover:text-[#94C987]" />
            </TooltipTrigger>
            <TooltipContent>
              <p>{copied ? 'Copied!' : 'Copy to clipboard'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </CopyToClipboard>
  )
}
