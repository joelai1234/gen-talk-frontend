import { ChatRoomSender } from '@/enum/persona'
import { Fragment } from 'react/jsx-runtime'
import TypingIndicator from '../TypingIndicator'
import { useEffect, useRef } from 'react'

interface ChatRoomProps {
  messageColor: string
  isLoadingAIMessage: boolean
  messages: {
    id: number | string
    sender: ChatRoomSender
    message: string
  }[]
}

export default function ChatRoom({
  isLoadingAIMessage,
  messages,
  messageColor
}: ChatRoomProps) {
  const chatEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'auto' })
    }
  }, [messages])

  useEffect(() => {
    setTimeout(() => {
      if (chatEndRef.current) {
        chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
      }
    })
  }, [messages.length])

  return (
    <div className="w-full overflow-auto px-6">
      <div className="mx-auto flex w-full max-w-3xl  flex-col space-y-2 overflow-auto pb-4">
        {messages.map((data) => {
          if (data.sender === ChatRoomSender.User) {
            return (
              <div
                key={data.id}
                className="ml-20 w-fit self-end rounded-3xl px-4 py-2"
                style={{
                  backgroundColor: messageColor
                }}
              >
                <p
                  className="text-base mix-blend-luminosity"
                  style={{
                    color: messageColor,
                    filter:
                      'invert(1) grayscale(1) brightness(1.3) contrast(9000)'
                  }}
                >
                  {data.message.split('\n').map((line, index) => (
                    <Fragment key={index}>
                      {line}
                      <br />
                    </Fragment>
                  ))}
                </p>
              </div>
            )
          } else {
            return (
              <div
                key={data.id}
                className="mr-20 w-fit rounded-3xl bg-white px-4 py-2"
              >
                <p className="text-base text-[#4c4c4c]">{data.message}</p>
              </div>
            )
          }
        })}
        {isLoadingAIMessage && (
          <div className="mr-20 flex w-fit gap-1 rounded-3xl bg-white p-3">
            <TypingIndicator />
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
    </div>
  )
}
