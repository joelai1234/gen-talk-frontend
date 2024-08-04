import { useEffect, useRef, useState } from 'react'
import { FaArrowUp } from 'react-icons/fa'

interface MessageTextareaProps {
  onSendMessage: (message: string) => void
}

export default function MessageTextarea({
  onSendMessage
}: MessageTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [text, setText] = useState<string>('')

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '20px'
      textareaRef.current.style.height = `${
        textareaRef.current.scrollHeight + 20
      }px`
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight
    }
  }, [text])

  return (
    <div className="mx-auto flex w-full max-w-3xl items-center gap-2">
      <textarea
        ref={textareaRef}
        className="max-h-44 min-h-11 flex-1 resize-none overflow-y-auto rounded-3xl border-[10px] border-[#ebebeb] bg-[#ebebeb] px-4 text-base placeholder:text-[#9a9a9a] focus:outline-none"
        placeholder="Message..."
        value={text}
        onChange={(event) => {
          setText(event.currentTarget.value)
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && event.shiftKey) {
            setText((prevText) => prevText + '\n')
            event.preventDefault()
            return
          }
          if (event.key === 'Enter') {
            if (/Mobi|Android/i.test(navigator.userAgent)) {
              setText((prevText) => prevText + '\n')
            } else {
              setText('')
              onSendMessage(event.currentTarget.value)
            }
            event.preventDefault()
          }
        }}
      />
      {text && /Mobi|Android/i.test(navigator.userAgent) && (
        <button
          onClick={() => {
            setText('')
            onSendMessage(text)
            textareaRef.current?.blur()
          }}
        >
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-earth-green">
            <FaArrowUp className="text-white" />
          </div>
        </button>
      )}
    </div>
  )
}
