import { AxiosInstance } from 'axios'
import {
  ChatHistoryResponse,
  ChatResponse,
  CreatePersonaPayload,
  Pagination,
  PersonaAPIData,
  RewriteMessagePayload,
  UpdatePersonaPayload
} from './model/persona'

export const getAllPersonas = (http: AxiosInstance) => () => {
  return http.get<PersonaAPIData[]>('/api/v1/personas/all')
}

export const getDefaultPersonas = (http: AxiosInstance) => () => {
  return http.get<PersonaAPIData[]>('/api/v1/personas/default')
}

export const getMePersonas = (http: AxiosInstance) => () => {
  return http.get<{ data: PersonaAPIData[]; pagination: Pagination }>(
    `/api/v1/personas`
  )
}

export const getOnePersona =
  (http: AxiosInstance) =>
  ({ persona_id }: { persona_id: number }) => {
    return http.get<PersonaAPIData>(`/api/v1/personas/id/${persona_id}`)
  }

export const createPersona =
  (http: AxiosInstance) => (payload: CreatePersonaPayload) => {
    return http.post<PersonaAPIData>(
      `/api/v1/personas/create/${payload.user_id}`,
      {
        persona_id: 0,
        ...payload
      }
    )
  }

export const updatePersona =
  (http: AxiosInstance) =>
  ({
    persona_id,
    payload
  }: {
    persona_id: number
    payload: UpdatePersonaPayload
  }) => {
    return http.put<unknown>(`/api/v1/personas/${persona_id}`, payload)
  }

export const deletePersona =
  (http: AxiosInstance) =>
  ({ persona_id }: { persona_id: number }) => {
    return http.delete<unknown>(`/api/v1/personas/delete/${persona_id}`)
  }

export const getPersonaHistory =
  (http: AxiosInstance) =>
  ({ chatroom_id }: { chatroom_id: number }) => {
    return http.get<ChatHistoryResponse>(
      `/api/v1/chatrooms/${chatroom_id}/history`
    )
  }

export const sendMessage =
  (http: AxiosInstance) =>
  ({ chatroom_id, message }: { chatroom_id: number; message: string }) => {
    return http.post<any>(
      `/api/v1/chatrooms/${chatroom_id}/chat`,
      {
        message
      },
      {
        headers: {
          Accept: 'text/event-stream'
        },
        responseType: 'stream',
        adapter: 'fetch' // <- this option can also be set in axios.create()
      }
      // {
      //   responseType: 'stream'
      // }
    )
  }

export const rewriteMessage =
  (http: AxiosInstance) =>
  ({ persona_id, user_id, message }: RewriteMessagePayload) => {
    return http.post<ChatResponse>(
      `/api/v1/chat/rewrite/${user_id}/${persona_id}`,
      {
        query: message
      }
    )
  }
