import {
  ChatRoomSender,
  PersonaLanguage,
  PersonaStyle,
  PersonaTone
} from '@/enum/persona'

export interface PersonaData {
  created?: Date
  updated?: Date
  id: string | number
  avatar: string
  name: string
  description: string
  tone: PersonaTone
  language: PersonaLanguage
  style: PersonaStyle
  messageColor: string
  isPreset?: boolean
}

export type RewritePersonaData = Omit<PersonaData, 'isPreset' | 'messageColor'>

export interface ChatRoomMessage {
  id: string | number
  sender: ChatRoomSender
  message: string
  timestamp: Date
}

export interface PersonaMessages {
  personaId: string | number
  messages: ChatRoomMessage[]
}
