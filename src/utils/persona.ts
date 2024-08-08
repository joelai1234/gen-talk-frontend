import { PersonaAPIData } from '@/apis/model/persona'
import { PersonaData } from '@/model/persona'

export const formatPersona: (personaAPIData: PersonaAPIData) => PersonaData = (
  personaAPIData
) => {
  return {
    id: personaAPIData.persona_id,
    avatar: personaAPIData.icon,
    name: personaAPIData.persona_name,
    description: personaAPIData.persona_description,
    tone: personaAPIData.tone,
    language: personaAPIData.lang,
    style: personaAPIData.style,
    messageColor: personaAPIData.message_color ?? '#EBEBEB',
    isPreset: personaAPIData.user_id == '-1',
    createdAt: new Date(personaAPIData.time_created) ?? 0,
    updatedAt: new Date(personaAPIData.time_updated) ?? 0
  }
}
