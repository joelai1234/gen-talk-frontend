import axios, { AxiosInstance } from 'axios'
import {
  ChatHistoryResponse,
  CreatePersonaPayload,
  Pagination,
  PersonaAPIData,
  RewriteMessagePayload,
  SendConversationsResponse,
  SendConversationsPayload,
  UpdatePersonaPayload,
  ChatroomPersonaAPIData
} from './model/persona'

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL
const http = axios.create({
  baseURL: VITE_BACKEND_URL
})

export const getAllPersonas = (http: AxiosInstance) => () => {
  return http.get<PersonaAPIData[]>('/api/v1/personas/all')
}

export const getDefaultPersonas = () => {
  return http.get<{ data: PersonaAPIData[]; pagination: Pagination }>(
    '/api/v1/personas/default'
  )
}

export const getMePersonas = (http: AxiosInstance) => () => {
  return http.get<{ data: PersonaAPIData[]; pagination: Pagination }>(
    `/api/v1/personas`
  )
}

export const getChatroomPersonas = (http: AxiosInstance) => () => {
  return http.get<{ data: ChatroomPersonaAPIData[]; pagination: Pagination }>(
    `/api/v1/chatrooms`
  )
}

export const getOnePersona =
  (http: AxiosInstance) =>
  ({ persona_id }: { persona_id: number }) => {
    return http.get<PersonaAPIData>(`/api/v1/personas/${persona_id}`)
  }

export const createPersona =
  (http: AxiosInstance) => (payload: CreatePersonaPayload) => {
    return http.post<PersonaAPIData>(`/api/v1/personas`, payload)
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
    return http.delete<unknown>(`/api/v1/personas/${persona_id}`)
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
    return http.post<ReadableStream<Uint8Array>>(
      `/api/v1/chatrooms/${chatroom_id}/chat`,
      {
        message
      },
      {
        headers: {
          Accept: 'text/event-stream'
        },
        responseType: 'stream',
        adapter: 'fetch'
      }
    )
  }

export const rewriteMessage =
  (http: AxiosInstance) => (payload: RewriteMessagePayload) => {
    return http.post<ReadableStream<Uint8Array>>(`/api/v1/rewrites`, payload, {
      headers: {
        Accept: 'text/event-stream'
      },
      responseType: 'stream',
      adapter: 'fetch'
    })
  }

export const getRewriteContexts = (http: AxiosInstance) => () => {
  return http.get<string[]>('/api/v1/rewrites/contexts')
}

export const sendConversations =
  (http: AxiosInstance) => (payload: SendConversationsPayload) => {
    return http.post<SendConversationsResponse>(
      '/api/v1/conversations/scenarios',
      payload
    )
  }
