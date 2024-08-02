import axios from 'axios'
import {
  CreatePersonaPayload,
  PersonaAPIData,
  UpdatePersonaPayload
} from './model/persona'

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const http = axios.create({
  baseURL: VITE_BACKEND_URL
})

export const getAllPersonas = () => {
  return http.get<PersonaAPIData[]>('/api/v1/personas/all')
}

export const getDefaultPersonas = () => {
  return http.get<PersonaAPIData[]>('/api/personas/default')
}

export const getMePersonas = ({ user_id }: { user_id: number }) => {
  return http.get<PersonaAPIData[]>(`/api/v1/personas/${user_id}`)
}

export const getOnePersona = ({ persona_id }: { persona_id: number }) => {
  return http.get<PersonaAPIData>(`/api/personas/id/${persona_id}`)
}

export const createPersona = (payload: CreatePersonaPayload) => {
  return http.post<unknown>(`/api/personas/create/${payload.user_id}`, payload)
}

export const updatePersona = ({
  persona_id,
  payload
}: {
  persona_id: number
  payload: UpdatePersonaPayload
}) => {
  return http.post<unknown>(`/api/v1/personas/${persona_id}`, payload)
}

export const deletePersona = ({ persona_id }: { persona_id: number }) => {
  return http.delete<unknown>(`/api/personas/delete/${persona_id}`)
}

export const getPersonaHistory = ({ persona_id }: { persona_id: number }) => {
  return http.delete<unknown>(`/api/v1/personas/chat-history/${persona_id}`)
}
