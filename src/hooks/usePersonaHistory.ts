import { useChatHistoryStore } from '@/store/useChatHistoryStore'
import { useQuery } from '@tanstack/react-query'
import { getPersonaHistory } from '@/apis/persona'
import { useAuth } from '@/services/auth/hooks/useAuth'
import { ChatRoomMessage } from '@/model/persona'
import { ChatRoomSender } from '@/enum/persona'
import { useEffect } from 'react'

interface UsePersonaHistoryProps {
  selectedPersonaId?: number
}

export default function usePersonaHistory({
  selectedPersonaId
}: UsePersonaHistoryProps) {
  const { authAxios } = useAuth()
  const { chatHistoryList, addOrUpdateChatHistoryByPersonaId } =
    useChatHistoryStore()

  const messages =
    chatHistoryList.find((item) => item.personaId === selectedPersonaId)
      ?.messages ?? []

  const { data } = useQuery({
    queryKey: ['getPersonaHistory', authAxios, selectedPersonaId],
    queryFn: () =>
      getPersonaHistory(authAxios!)({ chatroom_id: selectedPersonaId ?? 0 }),
    enabled: !!authAxios && !!selectedPersonaId
  })

  useEffect(() => {
    if (!selectedPersonaId) return
    if (data?.data.data) {
      const messages: ChatRoomMessage[] = data.data.data
        .sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        )
        .map((item) => ({
          id: item.id,
          sender: item.persona_id ? ChatRoomSender.Bot : ChatRoomSender.User,
          message: item.content
        }))

      addOrUpdateChatHistoryByPersonaId({
        personaId: selectedPersonaId,
        messages: { personaId: selectedPersonaId, messages }
      })
    }
  }, [data, selectedPersonaId, addOrUpdateChatHistoryByPersonaId])

  if (!selectedPersonaId) return []

  return messages
}
