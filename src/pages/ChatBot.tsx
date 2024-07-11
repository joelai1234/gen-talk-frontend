import ChatBotItem from '@/components/ChatBotItem'
import ImageWithFallback from '@/components/ImageWithFallback'
import { useEffect, useRef, useState } from 'react'
import { IoMdSearch } from 'react-icons/io'
import { IoMdAdd } from 'react-icons/io'
import { format } from 'date-fns'
import { ChatRoomSender } from '@/enum/persona'
import { mockPersonaMessagesList, mockPersonasData } from '@/data/mockData'
import { ChatRoomMessage } from '@/model/persona'

export default function ChatBot() {
  const [selectedPersonaId, setSelectedPersonaId] = useState<
    number | string | undefined
  >()

  const persona = mockPersonasData.find(
    (persona) => persona.id === selectedPersonaId
  )
  const chatEndRef = useRef<HTMLDivElement | null>(null)

  const [search, setSearch] = useState('')

  const [personaMessagesList, setPersonaMessagesList] = useState<
    {
      personaId: number | string
      messages: ChatRoomMessage[]
    }[]
  >(mockPersonaMessagesList)

  const messages =
    personaMessagesList.find((item) => item.personaId === selectedPersonaId)
      ?.messages ?? []

  const handleSendMessage = (message: string) => {
    if (selectedPersonaId === undefined) return
    const newMessage: ChatRoomMessage = {
      id: messages.length + 1,
      message,
      timestamp: new Date(),
      sender: ChatRoomSender.User
    }
    setPersonaMessagesList((prevMessages) => {
      const newMessages = [...prevMessages]
      const index = newMessages.findIndex(
        (item) => item.personaId === selectedPersonaId
      )
      if (index !== -1) {
        newMessages[index].messages.push(newMessage)
      } else {
        newMessages.push({
          personaId: selectedPersonaId,
          messages: [newMessage]
        })
      }
      return newMessages
    })
    setTimeout(() => {
      setPersonaMessagesList((prevMessages) => {
        const newMessages = [...prevMessages]
        const index = newMessages.findIndex(
          (item) => item.personaId === selectedPersonaId
        )
        const mockBotMessage: ChatRoomMessage = {
          id: 1,
          message:
            'I am sorry to hear that. Can you tell me more about what is causing your anxiety?',
          timestamp: new Date(),
          sender: ChatRoomSender.Bot
        }
        if (index !== -1) {
          newMessages[index].messages.push({
            ...mockBotMessage,
            id: newMessages[index].messages.length + 1
          })
        } else {
          newMessages.push({
            personaId: selectedPersonaId,
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

  const chatBotData = mockPersonasData.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  )

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
                value={search}
                onChange={(event) => setSearch(event.currentTarget.value)}
              />
            </div>
            <button className="flex items-center gap-1">
              <IoMdAdd className="text-earth-green" />
              <p className="text-sm text-earth-green">New Persona</p>
            </button>
          </div>
          <div>
            {chatBotData
              .sort((a, b) => {
                const AMessagesLength =
                  personaMessagesList.find(
                    (chatRoom) => chatRoom.personaId === a.id
                  )?.messages?.length ?? 0
                const BMessagesLength =
                  personaMessagesList.find(
                    (chatRoom) => chatRoom.personaId === b.id
                  )?.messages?.length ?? 0

                const lastMessageTimeA =
                  personaMessagesList
                    .find((chatRoom) => chatRoom.personaId === a.id)
                    ?.messages[AMessagesLength - 1].timestamp.getTime() ?? 0

                const lastMessageTimeB =
                  personaMessagesList
                    .find((chatRoom) => chatRoom.personaId === b.id)
                    ?.messages[BMessagesLength - 1].timestamp.getTime() ?? 0

                return lastMessageTimeB - lastMessageTimeA
              })
              .map((item) => {
                const length =
                  personaMessagesList.find(
                    (chatRoom) => chatRoom.personaId === item.id
                  )?.messages?.length ?? 0
                return (
                  <ChatBotItem
                    key={item.id}
                    avatar={item.avatar}
                    name={item.name}
                    time={
                      length > 0
                        ? format(
                            personaMessagesList.find(
                              (chatRoom) => chatRoom.personaId === item.id
                            )?.messages[length - 1].timestamp ?? new Date(),
                            'hh:mm a'
                          )
                        : 'New'
                    }
                    active={item.id === selectedPersonaId}
                    onClick={() => setSelectedPersonaId(item.id)}
                  />
                )
              })}
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
                          fallbackSrc={mockPersonasData[0].avatar}
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
                      {messages.map((data) => {
                        if (data.sender === ChatRoomSender.User) {
                          return (
                            <div
                              key={data.id}
                              className="ml-20 w-fit self-end rounded-3xl bg-[#ebebeb] px-4 py-2"
                            >
                              <p className="text-base text-[#4c4c4c]">
                                {data.message}
                              </p>
                            </div>
                          )
                        } else {
                          return (
                            <div
                              key={data.id}
                              className="mr-20 w-fit rounded-3xl bg-white px-4 py-2"
                            >
                              <p className="text-base text-[#4c4c4c]">
                                {data.message}
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
