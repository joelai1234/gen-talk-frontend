import { ChatRoomMessage, PersonaMessages } from '@/model/persona'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ChatHistoryState {
  chatHistoryList: PersonaMessages[]
  setChatHistoryList: (data: PersonaMessages[]) => void
  addOrUpdateChatHistoryByPersonaId: (data: {
    personaId: number
    messages: PersonaMessages
  }) => void
  addMessageByPersonaId: (data: {
    personaId: number
    message: ChatRoomMessage
  }) => void
}

export const useChatHistoryStore = create<ChatHistoryState>()(
  persist(
    (set) => ({
      chatHistoryList: [],
      setChatHistoryList: (data) => set({ chatHistoryList: data }),
      addOrUpdateChatHistoryByPersonaId: (data) => {
        set((state) => {
          const chatHistoryList = state.chatHistoryList
          if (
            chatHistoryList.find((item) => item.personaId === data.personaId)
          ) {
            return {
              chatHistoryList: chatHistoryList.map((item) => {
                if (item.personaId === data.personaId) {
                  return data.messages
                }
                return item
              })
            }
          } else {
            return {
              chatHistoryList: [...chatHistoryList, data.messages]
            }
          }
        })
      },
      addMessageByPersonaId: (data) => {
        set((state) => {
          const chatHistoryList = state.chatHistoryList
          return {
            chatHistoryList: chatHistoryList.map((item) => {
              if (item.personaId === data.personaId) {
                return {
                  personaId: data.personaId,
                  messages: [...item.messages, data.message]
                }
              }
              return item
            })
          }
        })
      }
    }),
    {
      name: 'chat-history' // name of item in the storage (must be unique)
    }
  )
)
