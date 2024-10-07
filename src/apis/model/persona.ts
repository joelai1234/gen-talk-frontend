import { PersonaLanguage, PersonaStyle, PersonaTone } from '@/enum/persona'

export interface PersonaAPIData {
  created_at: string
  updated_at: string
  name: string
  lang: PersonaLanguage
  description: string
  default_persona_id: number
  user_id: number
  icon: string
  tone: PersonaTone
  style: PersonaStyle
  message_color: string
  id: number
}

export interface Pagination {
  count: number
  page: number
  pageCount: number
  total: number
}

export type CreatePersonaPayload = Omit<
  PersonaAPIData,
  'default_persona_id' | 'user_id' | 'id' | 'created_at' | 'updated_at'
>

export type UpdatePersonaPayload = Partial<
  Omit<
    PersonaAPIData,
    'default_persona_id' | 'user_id' | 'id' | 'created_at' | 'updated_at'
  >
>

export interface ChatResponse {
  response: string
  query_id: number
}

export interface ChatHistoryResponse {
  data: {
    user_id?: number
    persona_id?: number
    chatroom_id: number
    content: string
    id: number
    created_at: string
  }[]
  pagination: Pagination
}

export interface RewriteMessagePayload {
  persona_id: number
  message: string
  context: string
}
