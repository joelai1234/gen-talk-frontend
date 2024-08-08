import { PersonaLanguage, PersonaStyle, PersonaTone } from '@/enum/persona'

export interface PersonaAPIData {
  persona_id: number
  persona_name: string
  tone: PersonaTone
  lang: PersonaLanguage
  style: PersonaStyle
  persona_description: string
  user_id: string // TODO: get from accessToken
  icon: string
  message_color: string

  time_created: Date | number // created persona at
  time_updated: Date | number // updated persona at
  // last_message_sent_at: Date | number // last message sent at
}

export type CreatePersonaPayload = Omit<
  PersonaAPIData,
  'persona_id' | 'time_created' | 'time_updated'
>

export type UpdatePersonaPayload = Partial<
  Omit<PersonaAPIData, 'persona_id' | 'time_created' | 'time_updated'>
>

export interface ChatResponse {
  response: string
  query_id: number
}
