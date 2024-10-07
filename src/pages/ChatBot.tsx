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
import { useQuery } from '@tanstack/react-query'
import { formatPersona } from '@/utils/persona'
import { useAuth } from '@/services/auth/hooks/useAuth'
import { getMePersonas, getPersonaHistory, sendMessage } from '@/apis/persona'
import { useChatHistoryStore } from '@/store/useChatHistoryStore'
import { useSSEMutation } from '@/hooks/useSSEMutation' // 引入 useSSEMutation

export default function ChatBot() {
  const { authAxios } = useAuth()
  const [selectedPersonaId, setSelectedPersonaId] = useState<
    number | undefined
  >()

  const {
    chatHistoryList,
    addOrUpdateChatHistoryByPersonaId,
    addMessageByPersonaId,
    addOrUpdateMessageByPersonaId
  } = useChatHistoryStore()

  const messages =
    chatHistoryList.find((item) => item.personaId === selectedPersonaId)
      ?.messages ?? []

  const [search, setSearch] = useState('')

  const { data: mePersonasRes } = useQuery({
    queryKey: ['getMePersonas', authAxios],
    queryFn: () => {
      if (!authAxios) return
      return getMePersonas(authAxios!)()
    },
    enabled: !!authAxios
  })

  useQuery({
    queryKey: ['getPersonaHistory', authAxios, selectedPersonaId],
    queryFn: async () => {
      const res = await getPersonaHistory(authAxios!)({
        chatroom_id: selectedPersonaId!
      })
      const messages: ChatRoomMessage[] = []
      res?.data.data
        .sort((a, b) => {
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          )
        })
        .forEach((item) => {
          messages.push({
            id: item.id,
            sender: item.persona_id ? ChatRoomSender.Bot : ChatRoomSender.User,
            message: item.content
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

  const personasData = mePersonasRes?.data.data.map(formatPersona) ?? []

  const persona = personasData.find(
    (persona) => persona.id === selectedPersonaId
  )

  const { mutate: sendMessageMutation, isLoading: isSendingMessage } =
    useSSEMutation({
      mutationFn: async ({
        message
      }: {
        id: string | number // 使用相同的 id
        message: string
      }) => {
        const res = await sendMessage(authAxios!)({
          chatroom_id: selectedPersonaId!,
          message
        })
        return res
      },
      onDownloadProgress: (value, { id }) => {
        // 使用傳遞的 id
        addOrUpdateMessageByPersonaId({
          personaId: selectedPersonaId!,
          message: {
            id, // 使用相同的 id
            sender: ChatRoomSender.Bot,
            message: value
          }
        })
      }
    })

  async function chatWithPersona({
    chatroomId,
    message
  }: {
    chatroomId: number
    message: string
  }) {
    addMessageByPersonaId({
      personaId: chatroomId,
      message: {
        id: uuidv4(),
        sender: ChatRoomSender.User,
        message
      }
    })
    await sendMessageMutation({ message, id: uuidv4() }) // 使用 useSSEMutation 的 mutate 函數
  }

  const handleSendMessage = (message: string) => {
    if (message.trim() === '') return
    if (selectedPersonaId === undefined) return
    chatWithPersona({ chatroomId: selectedPersonaId, message })
  }

  const personaOptionsData = personasData.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  )

  const personaOptions = personaOptionsData.map((item) => {
    return {
      id: item.id,
      avatar: item.avatar,
      name: item.name,
      time: item.updatedAt ? format(item.updatedAt, 'hh:mm a') : 'New',
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
                  isLoadingAIMessage={isSendingMessage}
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
