import {
  ChatRoomSender,
  PersonaLanguage,
  PersonaStyle,
  PersonaTone
} from '@/enum/persona'

export interface PersonaData {
  createdAt?: Date
  updatedAt?: Date
  // lastMessageSentAt?: Date
  id: number
  avatar: string
  name: string
  description: string
  tone: PersonaTone
  language: PersonaLanguage
  style: PersonaStyle
  messageColor: string
  isPreset?: boolean
}

export type TempPersonaData = Omit<PersonaData, 'id'> & {
  id?: number
}

export interface ChatRoomMessage {
  id: string | number
  sender: ChatRoomSender
  message: string
  // timestamp: Date
}

export interface PersonaMessages {
  personaId: number
  messages: ChatRoomMessage[]
}
