import {
  getChatroomPersonas,
  getDefaultPersonas,
  getMePersonas
} from '@/apis/persona'
import { useAuth } from '@/services/auth/hooks/useAuth'
import { formatPersona } from '@/utils/persona'
import { useQuery } from '@tanstack/react-query'

export default function useGetPersonasQuery() {
  const { authAxios } = useAuth()

  const { data: mePersonasRes, isLoading: isLoadingMePersonas } = useQuery({
    queryKey: ['getMePersonas', authAxios],
    queryFn: () => getMePersonas(authAxios!)(),
    enabled: !!authAxios
  })

  const { data: chatroomPersonasRes, isLoading: isLoadingChatroomPersonas } =
    useQuery({
      queryKey: ['getChatroomPersonas', authAxios],
      queryFn: () => getChatroomPersonas(authAxios!)(),
      enabled: !!authAxios
    })

  const { data: defaultPersonasRes, isLoading: isLoadingDefaultPersonas } =
    useQuery({
      queryKey: ['getDefaultPersonas'],
      queryFn: () => getDefaultPersonas()
    })

  if (!authAxios) {
    return {
      data: defaultPersonasRes?.data.data.map(formatPersona) ?? [],
      isLoading: isLoadingDefaultPersonas
    }
  }

  // 如果任一查詢未完成，返回空數據和加載狀態
  if (!mePersonasRes || !chatroomPersonasRes) {
    return {
      data: [],
      isLoading: isLoadingMePersonas || isLoadingChatroomPersonas
    }
  }

  // 根據聊天室角色的順序對用戶角色進行排序
  const sortedPersonas = mePersonasRes.data.data.sort((a, b) => {
    const findIndex = (id: number) =>
      chatroomPersonasRes.data.data.findIndex(
        (chatroomPersona) => chatroomPersona.persona_id === id
      )
    return findIndex(a.id) - findIndex(b.id)
  })

  return {
    data: sortedPersonas.map((persona) => {
      const chatroomPersona = chatroomPersonasRes.data.data.find(
        (cp) => cp.persona_id === persona.id
      )
      return formatPersona({ ...persona, is_new: chatroomPersona?.is_new })
    }),
    isLoading: isLoadingMePersonas || isLoadingChatroomPersonas
  }
}
