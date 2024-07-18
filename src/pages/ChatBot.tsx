import ChatBotItem from '@/components/ChatBotItem'
import { useEffect, useRef, useState } from 'react'
import { IoMdSearch } from 'react-icons/io'
import { IoMdAdd } from 'react-icons/io'
import { format } from 'date-fns'
import { ChatRoomSender } from '@/enum/persona'
import { ChatRoomMessage } from '@/model/persona'
import { useMockDataStore } from '@/store/useMockDataStore'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

const VITE_OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY as string

export default function ChatBot() {
  const {
    mockPersonasData,
    mockPersonaMessagesList,
    setMockPersonasData,
    setMockPersonaMessagesList
  } = useMockDataStore()
  const [selectedPersonaId, setSelectedPersonaId] = useState<
    number | string | undefined
  >()

  const [personaMessagesList, setPersonaMessagesList] = useState<
    {
      personaId: number | string
      messages: ChatRoomMessage[]
    }[]
  >(mockPersonaMessagesList)

  const persona = mockPersonasData.find(
    (persona) => persona.id === selectedPersonaId
  )
  const chatEndRef = useRef<HTMLDivElement | null>(null)

  const [search, setSearch] = useState('')

  const messages =
    personaMessagesList.find((item) => item.personaId === selectedPersonaId)
      ?.messages ?? []

  useEffect(() => {
    setMockPersonaMessagesList(personaMessagesList)
  }, [personaMessagesList, setMockPersonaMessagesList])

  const handleSendMessage = async (message: string) => {
    if (message.trim() === '') return
    if (selectedPersonaId === undefined) return

    const newMessage: ChatRoomMessage = {
      id: uuidv4(),
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

    setMockPersonasData(
      mockPersonasData.map((item) => {
        if (item.id === selectedPersonaId) {
          return {
            ...item,
            updated: new Date()
          }
        }
        return item
      })
    )

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are a helpful assistant.
              name: ${persona?.name}.
              description: ${persona?.description}.
              tone: ${persona?.tone}.
              style: ${persona?.style}.
              language: ${persona?.language}.
              `
            },
            ...messages.map((msg) => ({
              role: msg.sender === ChatRoomSender.User ? 'user' : 'assistant',
              content: msg.message
            })),
            { role: 'user', content: message }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${VITE_OPENAI_API_KEY}`
          }
        }
      )

      const gptMessage: ChatRoomMessage = {
        id: uuidv4(),
        message: response.data.choices[0].message.content,
        timestamp: new Date(),
        sender: ChatRoomSender.Bot
      }

      setPersonaMessagesList((prevMessages) => {
        const newMessages = [...prevMessages]
        const index = newMessages.findIndex(
          (item) => item.personaId === selectedPersonaId
        )
        if (index !== -1) {
          newMessages[index].messages.push(gptMessage)
        } else {
          newMessages.push({
            personaId: selectedPersonaId,
            messages: [gptMessage]
          })
        }
        return newMessages
      })

      setMockPersonasData(
        mockPersonasData.map((item) => {
          if (item.id === selectedPersonaId) {
            return {
              ...item,
              updated: new Date()
            }
          }
          return item
        })
      )
    } catch (error) {
      console.error('Error fetching response from ChatGPT:', error)
    }
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
    <div className="flex h-[calc(100vh-60px)] px-16 pb-16 pt-6">
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
              <Link className="text-sm text-earth-green" to="/persona/create">
                New Persona
              </Link>
            </button>
          </div>
          <div>
            {chatBotData
              .reverse()
              .sort((a, b) => {
                const aTime = a.updated?.getTime() ?? 0
                const bTime = b.updated?.getTime() ?? 0
                return bTime - aTime
              })
              .map((item) => {
                const length =
                  personaMessagesList.find(
                    (chatRoom) => chatRoom.personaId === item.id
                  )?.messages?.length ?? 0
                return (
                  <ChatBotItem
                    key={item.id}
                    id={item.id}
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
                      <div className="flex size-12 items-center justify-center rounded-full border border-[#EBEBEB] bg-white text-3xl">
                        {persona.avatar}
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
                              className="ml-20 w-fit self-end rounded-3xl px-4 py-2"
                              style={{
                                backgroundColor: persona.messageColor
                              }}
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
