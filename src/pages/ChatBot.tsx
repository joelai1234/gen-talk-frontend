import { useEffect, useState } from 'react'
import { ChatRoomSender } from '@/enum/persona'
import { ChatRoomMessage } from '@/model/persona'
import { useMockDataStore } from '@/store/useMockDataStore'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import WelcomeChatRoom from '@/components/chatRoom/WelcomeChatRoom'
import NewChatRoom from '@/components/chatRoom/NewChatRoom'
import { format } from 'date-fns'
import ChatRoom from '@/components/chatRoom/ChatRoom'
import MessageTextarea from '@/components/MessageTextarea'
import MobilePersonaNav from '@/components/chatRoom/MobilePersonaNav'
import DesktopPersonaSider from '@/components/chatRoom/DesktopPersonaSider'
import { useMutation, useQuery } from '@tanstack/react-query'
import { formatPersona } from '@/utils/persona'
import { useAuth } from '@/services/auth/hooks/useAuth'
import { getMePersonas } from '@/apis/persona'
import { user_id } from '@/data/mockData'

const VITE_OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY as string

const isLogin = false

export default function ChatBot() {
  const { authAxios } = useAuth()
  const {
    // mockPersonasData: personasData,
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

  const [search, setSearch] = useState('')

  // const { data: defaultPersonasRes } = useQuery({
  //   queryKey: ['getMePersonas', user_id, isLogin],
  //   queryFn: () => {
  //     return getDefaultPersonas()
  //   }
  // })

  const { data: mePersonasRes } = useQuery({
    queryKey: ['getMePersonas', user_id, isLogin],
    queryFn: () => {
      return getMePersonas(authAxios!)({ user_id })
    },
    enabled: !!authAxios
  })

  const personasData = mePersonasRes?.data.map(formatPersona) ?? []

  const persona = personasData.find(
    (persona) => persona.id === selectedPersonaId
  )

  const messages =
    personaMessagesList.find((item) => item.personaId === selectedPersonaId)
      ?.messages ?? []

  useEffect(() => {
    setMockPersonaMessagesList(personaMessagesList)
  }, [personaMessagesList, setMockPersonaMessagesList])

  const sendMessageMutation = useMutation({
    mutationFn: async ({
      personaId,
      message
    }: {
      message: string
      personaId: string | number
    }) => {
      const newMessage: ChatRoomMessage = {
        id: uuidv4(),
        message,
        timestamp: new Date(),
        sender: ChatRoomSender.User
      }
      setMockPersonasData(
        personasData.map((item) => {
          if (item.id === personaId) {
            return {
              ...item,
              lastMessageSentAt: new Date()
            }
          }
          return item
        })
      )
      setPersonaMessagesList((prevMessages) => {
        const newMessages = [...prevMessages]
        const index = newMessages.findIndex(
          (item) => item.personaId === personaId
        )
        if (index !== -1) {
          newMessages[index].messages.push(newMessage)
        } else {
          newMessages.push({
            personaId: personaId,
            messages: [newMessage]
          })
        }
        return newMessages
      })
      return axios.post(
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
    },
    onSuccess: (data, payload) => {
      if (!data) {
        return
      }
      const gptMessage: ChatRoomMessage = {
        id: uuidv4(),
        message: data.data.choices[0].message.content,
        timestamp: new Date(),
        sender: ChatRoomSender.Bot
      }

      setPersonaMessagesList((prevMessages) => {
        const newMessages = [...prevMessages]
        const index = newMessages.findIndex(
          (item) => item.personaId === payload.personaId
        )
        if (index !== -1) {
          newMessages[index].messages.push(gptMessage)
        } else {
          newMessages.push({
            personaId: payload.personaId,
            messages: [gptMessage]
          })
        }
        return newMessages
      })

      setMockPersonasData(
        personasData.map((item) => {
          if (item.id === payload.personaId) {
            return {
              ...item,
              lastMessageSentAt: new Date()
            }
          }
          return item
        })
      )
    }
  })

  const handleSendMessage = (message: string) => {
    if (message.trim() === '') return
    if (selectedPersonaId === undefined) return
    sendMessageMutation.mutate({ message, personaId: selectedPersonaId })
  }

  const personaOptionsData = personasData
    .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
    .reverse()
    .sort((a, b) => {
      const aLastMessageSentAt = a.lastMessageSentAt?.getTime() ?? 0
      const bLastMessageSentAt = b.lastMessageSentAt?.getTime() ?? 0
      const aUpdatedAt = a.updatedAt?.getTime() ?? 0
      const bUpdatedAt = b.updatedAt?.getTime() ?? 0
      const aTime =
        aLastMessageSentAt > aUpdatedAt ? aLastMessageSentAt : aUpdatedAt
      const bTime =
        bLastMessageSentAt > bUpdatedAt ? bLastMessageSentAt : bUpdatedAt
      return bTime - aTime
    })

  const personaOptions = personaOptionsData.map((item) => {
    return {
      id: item.id,
      avatar: item.avatar,
      name: item.name,
      time: item.lastMessageSentAt
        ? format(item.lastMessageSentAt, 'hh:mm a')
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
          personaOptions={personaOptions}
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
                personaOptions={personaOptions}
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
                  isLoadingAIMessage={sendMessageMutation.isPending}
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
