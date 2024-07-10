import ChatBotItem from '@/components/ChatBotItem'
import ImageWithFallback from '@/components/ImageWithFallback'
import { ChatRoomSender } from '@/model/chatBot'
import { useEffect, useMemo, useRef, useState } from 'react'
import { IoMdSearch } from 'react-icons/io'
import { IoMdAdd } from 'react-icons/io'

const mockChatBotData = [
  {
    id: 1,
    avatar: '/images/avatar1.png',
    name: 'Counselor',
    time: 'New',
    description:
      'This persona is empathetic and patient, often allowing individuals to explore their feelings and fears at their own pace. They provide a safe space for individuals to express their concerns.'
  },
  {
    id: 2,
    avatar: '/images/avatar2.png',
    name: 'Educator',
    time: 'New',
    description:
      'This persona is knowledgeable and informative, providing individuals with the tools and resources they need to make informed decisions. They are often seen as a trusted source of information.'
  },
  {
    id: 3,
    avatar: '/images/avatar3.png',
    name: 'Peer',
    time: 'New',
    description:
      'This persona is relatable and supportive, often sharing their own experiences and offering advice based on personal knowledge. They are seen as a friend and confidant.'
  },
  {
    id: 4,
    avatar: '/images/avatar4.png',
    name: 'Coach',
    time: 'New',
    description:
      'This persona is motivational and goal-oriented, helping individuals to identify their strengths and weaknesses and set achievable goals. They are often seen as a mentor and role model.'
  },
  {
    id: 5,
    avatar: '/images/avatar5.png',
    name: 'Cheerleader',
    time: 'New',
    description:
      'This persona is positive and encouraging, providing individuals with emotional support and motivation to overcome challenges. They are often seen as a source of inspiration and motivation'
  }
]

export default function ChatBot() {
  const [selectedPersonaId, setSelectedPersonaId] = useState<
    number | undefined
  >()

  const persona = mockChatBotData.find((item) => item.id === selectedPersonaId)
  const chatEndRef = useRef<HTMLDivElement | null>(null)

  const [chatRoomMessages, setChatRoomMessages] = useState([
    {
      selectedPersonaId: 1,
      messages: [
        {
          id: 1,
          text: 'Hello! How can I help you today?',
          time: '12:00 PM',
          sender: ChatRoomSender.User
        },
        {
          id: 2,
          text: 'I am feeling really anxious lately.',
          time: '12:01 PM',
          sender: ChatRoomSender.Bot
        },
        {
          id: 3,
          text: 'I am sorry to hear that. Can you tell me more about what is causing your anxiety?',
          time: '12:02 PM',
          sender: ChatRoomSender.User
        }
      ]
    }
  ])

  const messages =
    chatRoomMessages.find(
      (item) => item.selectedPersonaId === selectedPersonaId
    )?.messages ?? []

  const handleSendMessage = (message: string) => {
    if (selectedPersonaId === undefined) return
    const newMessage = {
      id: messages.length + 1,
      text: message,
      time: new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      }),
      sender: ChatRoomSender.User
    }
    setChatRoomMessages((prevMessages) => {
      const newMessages = [...prevMessages]
      const index = newMessages.findIndex(
        (item) => item.selectedPersonaId === selectedPersonaId
      )
      if (index !== -1) {
        newMessages[index].messages.push(newMessage)
      } else {
        newMessages.push({
          selectedPersonaId,
          messages: [newMessage]
        })
      }
      return newMessages
    })
    setTimeout(() => {
      setChatRoomMessages((prevMessages) => {
        const newMessages = [...prevMessages]
        const index = newMessages.findIndex(
          (item) => item.selectedPersonaId === selectedPersonaId
        )
        const mockBotMessage = {
          id: 1,
          text: 'I am sorry to hear that. Can you tell me more about what is causing your anxiety?',
          time: new Date().toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
          }),
          sender: ChatRoomSender.Bot
        }
        if (index !== -1) {
          newMessages[index].messages.push({
            ...mockBotMessage,
            id: newMessages[index].messages.length + 1
          })
        } else {
          newMessages.push({
            selectedPersonaId,
            messages: [mockBotMessage]
          })
        }
        return newMessages
      })
    }, 500)
  }

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'auto' })
    }
  }, [selectedPersonaId])

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages.length])

  return (
    <div className="flex h-[calc(100vh-56px)] px-16 pb-16 pt-6">
      <div
        className="box-border flex flex-1 overflow-hidden rounded-[20px] bg-[#f7f7f7]"
        style={{ boxShadow: '0px 8px 40px 0 rgba(65,76,65,0.16)' }}
      >
        <div className="h-full w-80 bg-white py-6">
          <div className="space-y-3 px-6 pb-3">
            <div className="relative rounded-xl">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
                <IoMdSearch className="size-4 text-[#9a9a9a]" />
              </div>
              <input
                className="w-full rounded-xl border border-[#ebebeb] py-2 pl-10 pr-4 text-sm placeholder:text-[#9a9a9a] focus:outline-none"
                type="text"
                placeholder="Search"
              />
            </div>
            <button className="flex items-center gap-1">
              <IoMdAdd className="text-earth-green" />
              <p className="text-sm text-earth-green">New Persona</p>
            </button>
          </div>
          <div>
            {mockChatBotData.map((item) => (
              <ChatBotItem
                key={item.id}
                avatar={item.avatar}
                name={item.name}
                time={item.time}
                active={item.id === selectedPersonaId}
                onClick={() => setSelectedPersonaId(item.id)}
              />
            ))}
          </div>
        </div>
        <div className="flex-1">
          {!persona && (
            <div className="flex size-full items-center justify-center">
              <div className="flex h-[164px] w-[265px] -translate-y-6 flex-col items-center justify-center space-y-1">
                <img src="/images/mountain.png" alt="mountain" />
                <p className="text-center text-base text-[#4c4c4c]">Welcome!</p>
                <p className="text-center text-sm text-[#9a9a9a]">
                  Pick a persona from the menu and start your conversation.
                </p>
              </div>
            </div>
          )}
          {persona && (
            <div className="size-full ">
              <div className="mx-auto flex size-full flex-col py-6">
                {messages.length === 0 && (
                  <div className="flex w-full flex-1 items-center justify-center">
                    <div className="flex w-[265px] -translate-y-6 flex-col items-center justify-center space-y-1">
                      <div className="flex size-12 items-center justify-center rounded-full border border-[#EBEBEB] bg-white">
                        <ImageWithFallback
                          className="size-[22px] object-contain"
                          src={persona.avatar}
                          fallbackSrc={mockChatBotData[0].avatar}
                          alt={persona.name}
                        />
                      </div>
                      <p className="text-center text-base text-[#4c4c4c]">
                        {persona.name}
                      </p>
                      <p className="text-center text-sm text-[#9a9a9a]">
                        {persona.description}
                      </p>
                    </div>
                  </div>
                )}
                {messages.length > 0 && (
                  <div className="w-full  overflow-auto px-6">
                    <div className="mx-auto flex  w-full max-w-3xl  flex-col space-y-2 overflow-auto pb-4">
                      {messages.map((message) => {
                        if (message.sender === ChatRoomSender.User) {
                          return (
                            <div
                              key={message.id}
                              className="ml-20 w-fit self-end rounded-3xl bg-[#ebebeb] px-4 py-2"
                            >
                              <p className="text-base text-[#4c4c4c]">
                                {message.text}
                              </p>
                            </div>
                          )
                        } else {
                          return (
                            <div
                              key={message.id}
                              className="mr-20 w-fit rounded-3xl bg-white px-4 py-2"
                            >
                              <p className="text-base text-[#4c4c4c]">
                                {message.text}
                              </p>
                            </div>
                          )
                        }
                      })}
                      <div ref={chatEndRef} />
                    </div>
                  </div>
                )}
                <div className="mt-auto px-6">
                  <div className="mx-auto  w-full max-w-3xl">
                    <input
                      className="w-full rounded-full bg-[#ebebeb] px-4 py-2.5 text-base placeholder:text-[#9a9a9a] focus:outline-none"
                      type="text"
                      placeholder="Message..."
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          handleSendMessage(event.currentTarget.value)
                          event.currentTarget.value = ''
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
