import { PersonaAPIData } from '@/apis/model/persona'

export const formatPersona = (personaAPIData: PersonaAPIData) => {
  return {
    id: personaAPIData.persona_id,
    avatar: '🌳',
    name: personaAPIData.persona_name,
    description: personaAPIData.persona_description,
    tone: personaAPIData.tone,
    language: personaAPIData.lang,
    style: personaAPIData.style,
    messageColor: '#EBEBEB'
  }
}
