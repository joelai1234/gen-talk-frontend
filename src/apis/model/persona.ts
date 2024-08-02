export interface PersonaAPIData {
  persona_id: number
  persona_name: string
  tone: string
  lang: string
  style: string
  persona_description: string
  user_id: number
  // persona_icon: string
  // message_background_color: string
}

export type CreatePersonaPayload = Omit<PersonaAPIData, 'persona_id'>

export type UpdatePersonaPayload = Partial<Omit<PersonaAPIData, 'persona_id'>>
