import { PersonaAPIData } from '@/apis/model/persona'
import { PersonaData } from '@/model/persona'

export const formatPersona: (personaAPIData: PersonaAPIData) => PersonaData = (
  personaAPIData
) => {
  return {
    id: personaAPIData.id,
    avatar: personaAPIData.icon,
    name: personaAPIData.name,
    description: personaAPIData.description,
    tone: personaAPIData.tone,
    language: personaAPIData.lang,
    style: personaAPIData.style,
    messageColor: personaAPIData.message_color ?? '#EBEBEB',
    isPreset: personaAPIData.default_persona_id > 0,
    createdAt: new Date(personaAPIData.created_at) ?? 0,
    updatedAt: new Date(personaAPIData.updated_at) ?? 0
  }
}
