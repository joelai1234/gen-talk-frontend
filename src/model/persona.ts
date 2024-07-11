import {
  ChatRoomSender,
  PersonaLanguage,
  PersonaStyle,
  PersonaTone
} from '@/enum/persona'

export interface PersonaData {
  id: string | number
  avatar: string
  name: string
  description: string
  tone: PersonaTone
  language: PersonaLanguage
  style: PersonaStyle
  messageColor: string
}

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
