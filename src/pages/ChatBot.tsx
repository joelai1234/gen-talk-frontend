import ChatBotItem from '@/components/ChatBotItem'
import { Fragment, useEffect, useRef, useState } from 'react'
import { IoIosArrowDown, IoMdSearch } from 'react-icons/io'
import { IoMdAdd } from 'react-icons/io'
import { format } from 'date-fns'
import { ChatRoomSender } from '@/enum/persona'
import { ChatRoomMessage } from '@/model/persona'
import { useMockDataStore } from '@/store/useMockDataStore'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { cn } from '@/lib/utils'
import { MdOutlineEdit } from 'react-icons/md'
import { FaArrowUp } from 'react-icons/fa'

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
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [text, setText] = useState<string>('')
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
  const navigate = useNavigate()
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
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: `You are a helpful assistant.
              name: ${persona?.name}.
              description: ${persona?.description}.
              tone: ${persona?.tone}.
              style: ${persona?.style}.
              language: ${persona?.language}.
              Keep the responses short enough to easily read. You want to maximize engagement and conversation, not give a lecture.
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

  const chatBotOptionData = chatBotData.reverse().sort((a, b) => {
    const aTime = a.updated?.getTime() ?? 0
    const bTime = b.updated?.getTime() ?? 0
    return bTime - aTime
  })

  const [isOpenMobileMenu, setIsOpenMobileMenu] = useState(false)

  const [height, setHeight] = useState('0px')
  const contentRef = useRef<HTMLDivElement>(null)

  const toggleCollapse = () => {
    setIsOpenMobileMenu(!isOpenMobileMenu)
  }

  useEffect(() => {
    setHeight(
      isOpenMobileMenu ? `${contentRef.current?.scrollHeight}px` : '0px'
    )
  }, [isOpenMobileMenu])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '20px'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [text])

  return (
    <div className="flex h-[calc(var(--vh)*100-60px)] pt-6 sm:px-16 sm:pb-16">
      <div
        className="box-border flex flex-1 overflow-hidden rounded-t-[20px] bg-[#f7f7f7] sm:rounded-b-[20px]"
        style={{ boxShadow: '0px 8px 40px 0 rgba(65,76,65,0.16)' }}
      >
        <div className="hidden h-full w-80 bg-white py-6 sm:block">
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
            {chatBotOptionData.map((item) => {
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
          <div className="size-full">
            <div className="mx-auto flex size-full flex-col pb-6 sm:pt-6">
              <div className="relative mb-4 sm:hidden">
                <div className="z-20 flex h-[56px] items-center justify-between bg-white px-4">
                  {isOpenMobileMenu && (
                    <div className="relative w-full rounded-xl px-2">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
                        <IoMdSearch className="size-4 text-[#9a9a9a]" />
                      </div>
                      <input
                        className="w-full rounded-xl border border-[#ebebeb] py-2 pl-10 pr-4 text-sm placeholder:text-[#9a9a9a] focus:outline-none"
                        type="text"
                        placeholder="Search"
                        value={search}
                        onChange={(event) =>
                          setSearch(event.currentTarget.value)
                        }
                      />
                    </div>
                  )}
                  {!isOpenMobileMenu && (
                    <div className="flex items-center gap-2">
                      <div className="size-8 rounded-full border border-[#EBEBEB]">
                        {persona ? (
                          <div className="flex h-full items-center justify-center text-xl">
                            {persona.avatar}
                          </div>
                        ) : (
                          <img src="/images/default-persona.png" alt="icon" />
                        )}
                      </div>
                      <p className="text-base text-[#4c4c4c]">
                        {persona ? persona.name : 'Persona'}
                      </p>
                      {persona && (
                        <button
                          className="size-6"
                          onClick={() => {
                            navigate(`/persona/${persona?.id}/edit`)
                          }}
                        >
                          <MdOutlineEdit className=" text-earth-green" />
                        </button>
                      )}
                    </div>
                  )}
                  <button onClick={toggleCollapse}>
                    <IoIosArrowDown
                      className={cn('size-5 text-[#4c4c4c]', {
                        'transform rotate-180': isOpenMobileMenu
                      })}
                    />
                  </button>
                </div>
                <div
                  ref={contentRef}
                  className={cn(
                    'rounded-b-[20px] z-10 bg-white max-h-0 ease-in-out overflow-hidden absolute w-full transition-all duration-300',
                    {
                      'max-h-full': isOpenMobileMenu
                    }
                  )}
                  style={{
                    maxHeight: height,
                    boxShadow: '0px 20px 20px 0 rgba(65,76,65,0.07)'
                  }}
                >
                  <button className="mx-6 mb-4 mt-2 flex items-center gap-1">
                    <IoMdAdd className="text-earth-green" />
                    <Link
                      className="text-sm text-earth-green"
                      to="/persona/create"
                    >
                      New Persona
                    </Link>
                  </button>
                  {chatBotOptionData.map((item) => {
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
                        onClick={() => {
                          setIsOpenMobileMenu(false)
                          setSelectedPersonaId(item.id)
                        }}
                      />
                    )
                  })}
                </div>
              </div>

              {!persona && (
                <div className="flex size-full items-center justify-center">
                  <div className="flex h-[164px] w-[265px] -translate-y-6 flex-col items-center justify-center space-y-1">
                    <img src="/images/mountain.png" alt="mountain" />
                    <p className="text-center text-base text-[#4c4c4c]">
                      Welcome!
                    </p>
                    <p className="text-center text-sm text-[#9a9a9a]">
                      Pick a persona from the menu and start your conversation.
                    </p>
                  </div>
                </div>
              )}
              {persona && messages.length === 0 && (
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
              {persona && messages.length > 0 && (
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
                            <p
                              className="text-base mix-blend-luminosity"
                              style={{
                                color: persona.messageColor,
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
                <div
                  className={cn(
                    'mx-auto w-full max-w-3xl flex items-center gap-2',
                    {
                      hidden: !persona
                    }
                  )}
                >
                  <textarea
                    ref={textareaRef}
                    className="min-h-11 flex-1 resize-none overflow-hidden rounded-3xl bg-[#ebebeb] px-4 py-2.5 text-base placeholder:text-[#9a9a9a] focus:outline-none"
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
                          handleSendMessage(event.currentTarget.value)
                        }
                        event.preventDefault()
                      }
                    }}
                  />
                  {text && /Mobi|Android/i.test(navigator.userAgent) && (
                    <button
                      onClick={() => {
                        setText('')
                        handleSendMessage(text)
                        textareaRef.current?.blur()
                      }}
                    >
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-earth-green">
                        <FaArrowUp className="text-white" />
                      </div>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
