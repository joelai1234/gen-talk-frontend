import { useEffect, useState } from 'react'
import { ChatRoomSender } from '@/enum/persona'
import { ChatRoomMessage } from '@/model/persona'
import { useMockDataStore } from '@/store/useMockDataStore'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
// import { useQuery } from '@tanstack/react-query'
// import { getDefaultPersonas, getMePersonas } from '@/apis/persona'
import WelcomeChatRoom from '@/components/chatRoom/WelcomeChatRoom'
import NewChatRoom from '@/components/chatRoom/NewChatRoom'
import { format } from 'date-fns'
import ChatRoom from '@/components/chatRoom/ChatRoom'
import MessageTextarea from '@/components/MessageTextarea'
import MobilePersonaNav from '@/components/chatRoom/MobilePersonaNav'
import DesktopPersonaSider from '@/components/chatRoom/DesktopPersonaSider'
// import { formatPersona } from '@/utils/persona'

const VITE_OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY as string

// const isLogin = true
// const user_id = 1

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
  const [isLoadingAIMessage, setIsLoadingAIMessage] = useState(false)
  const [personaMessagesList, setPersonaMessagesList] = useState<
    {
      personaId: number | string
      messages: ChatRoomMessage[]
    }[]
  >(mockPersonaMessagesList)

  const persona = mockPersonasData.find(
    (persona) => persona.id === selectedPersonaId
  )
  const [search, setSearch] = useState('')

  // const { data: personasRes } = useQuery({
  //   queryKey: ['getMePersonas', user_id],
  //   queryFn: () => {
  //     if (isLogin) {
  //       return getMePersonas({ user_id })
  //     } else {
  //       return getDefaultPersonas()
  //     }
  //   }
  // })

  // const personas = personasRes?.data.map(formatPersona)

  // const persona: PersonaData | undefined = personas?.find(
  //   (item) => item.id === selectedPersonaId
  // )

  // const personaOptions =
  //   personas
  //     ?.map((item) => {
  //       return {
  //         id: item.id,
  //         avatar: item.avatar,
  //         name: item.name,
  //         time: 'New',
  //         active: item.id === selectedPersonaId
  //       }
  //     })
  //     .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
  //     .reverse() ?? []

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
    setIsLoadingAIMessage(true)
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
      setIsLoadingAIMessage(false)
    } catch (error) {
      console.error('Error fetching response from ChatGPT:', error)
    }
  }

  const chatBotData = mockPersonasData.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  )

  const chatBotOptionData = [...chatBotData].reverse().sort((a, b) => {
    const aTime = a.updated?.getTime() ?? 0
    const bTime = b.updated?.getTime() ?? 0
    return bTime - aTime
  })

  const mockPersonaOptions = chatBotOptionData.map((item) => {
    const length =
      personaMessagesList.find((chatRoom) => chatRoom.personaId === item.id)
        ?.messages?.length ?? 0
    return {
      id: item.id,
      avatar: item.avatar,
      name: item.name,
      time:
        length > 0
          ? format(
              personaMessagesList.find(
                (chatRoom) => chatRoom.personaId === item.id
              )?.messages[length - 1].timestamp ?? new Date(),
              'hh:mm a'
            )
          : 'New',
      active: item.id === selectedPersonaId
    }
  })

  return (
    <div className="flex h-[calc(var(--vh)*100-60px)] pt-6 sm:px-16 sm:pb-16">
      <div
        className="box-border flex flex-1 overflow-hidden rounded-t-[20px] bg-[#f7f7f7] sm:rounded-b-[20px]"
        style={{ boxShadow: '0px 8px 40px 0 rgba(65,76,65,0.16)' }}
      >
        <DesktopPersonaSider
          persona={persona}
          onChangePersona={(id) => {
            setSelectedPersonaId(id)
          }}
          personaOptions={mockPersonaOptions}
          search={search}
          onChangeSearch={setSearch}
        />
        <div className="flex-1">
          <div className="size-full">
            <div className="mx-auto flex size-full flex-col pb-6 sm:pt-6">
              <MobilePersonaNav
                persona={persona}
                onChangePersona={(id) => {
                  setSelectedPersonaId(id)
                }}
                personaOptions={mockPersonaOptions}
                search={search}
                onChangeSearch={setSearch}
              />

              {!persona && <WelcomeChatRoom />}
              {persona && messages.length === 0 && (
                <NewChatRoom
                  persona={{
                    avatar: persona.avatar,
                    name: persona.name,
                    description: persona.description
                  }}
                />
              )}
              {persona && messages.length > 0 && (
                <ChatRoom
                  messageColor={persona.messageColor}
                  isLoadingAIMessage={isLoadingAIMessage}
                  messages={messages}
                />
              )}
              <div className="mt-auto px-6">
                {persona && (
                  <MessageTextarea onSendMessage={handleSendMessage} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
