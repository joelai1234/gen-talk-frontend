import { useState } from 'react'
import { ChatRoomSender } from '@/enum/persona'
import { ChatRoomMessage } from '@/model/persona'
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
import { getMePersonas, getPersonaHistory, sendMessage } from '@/apis/persona'
import { user_id } from '@/data/mockData'
import { useChatHistoryStore } from '@/store/useChatHistoryStore'

const isLogin = false

export default function ChatBot() {
  const { authAxios } = useAuth()
  const [selectedPersonaId, setSelectedPersonaId] = useState<
    number | undefined
  >()

  const {
    chatHistoryList,
    addOrUpdateChatHistoryByPersonaId,
    addMessageByPersonaId
  } = useChatHistoryStore()

  const messages =
    chatHistoryList.find((item) => item.personaId === selectedPersonaId)
      ?.messages ?? []

  const [search, setSearch] = useState('')

  const { data: mePersonasRes } = useQuery({
    queryKey: ['getMePersonas', user_id, isLogin],
    queryFn: () => {
      return getMePersonas(authAxios!)({ user_id })
    },
    enabled: !!authAxios
  })

  useQuery({
    queryKey: ['getPersonaHistory', authAxios, selectedPersonaId],
    queryFn: async () => {
      const res = await getPersonaHistory(authAxios!)({
        persona_id: selectedPersonaId!
      })
      const messages: ChatRoomMessage[] = []
      res?.data.forEach((item) => {
        messages.push({
          id: `${item[0]}-user`,
          sender: ChatRoomSender.User,
          message: item[1]
        })
        messages.push({
          id: `${item[0]}-bot`,
          sender: ChatRoomSender.Bot,
          message: item[2]
        })
      })
      addOrUpdateChatHistoryByPersonaId({
        personaId: selectedPersonaId!,
        messages: {
          personaId: selectedPersonaId!,
          messages
        }
      })
      return res
    },
    enabled: !!authAxios && !!selectedPersonaId
  })

  const personasData = mePersonasRes?.data.map(formatPersona) ?? []

  const persona = personasData.find(
    (persona) => persona.id === selectedPersonaId
  )

  const sendMessageMutation = useMutation({
    mutationFn: async ({
      personaId,
      message
    }: {
      message: string
      personaId: number
    }) => {
      addMessageByPersonaId({
        personaId,
        message: {
          id: uuidv4(),
          sender: ChatRoomSender.User,
          message
        }
      })

      return sendMessage(authAxios!)({
        persona_id: personaId,
        user_id,
        message
      })
    },
    onSuccess: (data, payload) => {
      addMessageByPersonaId({
        personaId: payload.personaId,
        message: {
          id: uuidv4(),
          sender: ChatRoomSender.Bot,
          message: data.data.response
        }
      })
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

  let isLoadingSendMessage = false
  if (sendMessageMutation.isPending && messages.length > 1) {
    const lastMessage = messages[messages.length - 1]
    if (lastMessage.sender === ChatRoomSender.User) {
      isLoadingSendMessage = true
    }
  }
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
                  isLoadingAIMessage={isLoadingSendMessage}
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
