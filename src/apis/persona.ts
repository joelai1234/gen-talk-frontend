import { AxiosInstance } from 'axios'
import {
  CreatePersonaPayload,
  PersonaAPIData,
  UpdatePersonaPayload
} from './model/persona'

export const getAllPersonas = (http: AxiosInstance) => () => {
  return http.get<PersonaAPIData[]>('/api/v1/personas/all')
}

export const getDefaultPersonas = (http: AxiosInstance) => () => {
  return http.get<PersonaAPIData[]>('/api/v1/personas/default')
}

export const getMePersonas =
  (http: AxiosInstance) =>
  ({ user_id }: { user_id: number }) => {
    return http.get<PersonaAPIData[]>(`/api/v1/personas/${user_id}`)
  }

export const getOnePersona =
  (http: AxiosInstance) =>
  ({ persona_id }: { persona_id: number }) => {
    return http.get<PersonaAPIData>(`/api/v1/personas/id/${persona_id}`)
  }

export const createPersona =
  (http: AxiosInstance) => (payload: CreatePersonaPayload) => {
    return http.post<unknown>(`/api/v1/personas/create/${payload.user_id}`, {
      persona_id: 0,
      ...payload
    })
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
  ({ persona_id }: { persona_id: number }) => {
    return http.delete<unknown>(`/api/v1/personas/chat-history/${persona_id}`)
  }
