import { PersonaLanguage, PersonaStyle, PersonaTone } from '@/enum/persona'

export interface PersonaAPIData {
  persona_id: number
  persona_name: string
  tone: PersonaTone
  lang: PersonaLanguage
  style: PersonaStyle
  persona_description: string
  user_id: number // TODO: get from accessToken

  // persona_icon: string
  // message_background_color: string

  // created_at: Date | number // created persona at
  // updated_at: Date | number // updated persona at
  // last_message_sent_at: Date | number // last message sent at
}

export type CreatePersonaPayload = Omit<PersonaAPIData, 'persona_id'>

export type UpdatePersonaPayload = Partial<Omit<PersonaAPIData, 'persona_id'>>
