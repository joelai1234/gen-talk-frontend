import { PersonaLanguage, PersonaStyle, PersonaTone } from '@/enum/persona'
import { PersonaData, PersonaMessages } from '@/model/persona'

// export const user_id = '-1'
// export const user_id = '017bc590-6071-7060-1a65-6e312f3e6877'

export const mockPersonasData: PersonaData[] = [
  {
    id: 1,
    avatar: '🌳',
    name: 'Counselor',
    description:
      'This persona is empathetic and patient, often allowing individuals to explore their feelings and fears at their own pace. They provide a safe space for individuals to express their concerns.',
    tone: PersonaTone.Empathetic,
    language: PersonaLanguage.Informal,
    style: PersonaStyle.Storytelling,
    messageColor: '#EBEBEB',
    isPreset: true
  },
  {
    id: 2,
    avatar: '🎋',
    name: 'Educator',
    description:
      'This persona is knowledgeable and informative, providing individuals with the tools and resources they need to make informed decisions. They are often seen as a trusted source of information.',
    tone: PersonaTone.Authoritative,
    language: PersonaLanguage.Technical,
    style: PersonaStyle.Analytical,
    messageColor: '#EBEBEB',
    isPreset: true
  },
  {
    id: 3,
    avatar: '😊',
    name: 'Peer',
    description:
      'This persona is relatable and supportive, often sharing their own experiences and offering advice based on personal knowledge. They are seen as a friend and confidant.',
    tone: PersonaTone.Casual,
    language: PersonaLanguage.Simple,
    style: PersonaStyle.Reflective,
    messageColor: '#EBEBEB',
    isPreset: true
  },
  {
    id: 4,
    avatar: '🎄',
    name: 'Coach',
    description:
      'This persona is motivational and goal-oriented, helping individuals to identify their strengths and weaknesses and set achievable goals. They are often seen as a mentor and role model.',
    tone: PersonaTone.Sincere,
    language: PersonaLanguage.Motivational,
    style: PersonaStyle.Direct,
    messageColor: '#EBEBEB',
    isPreset: true
  },
  {
    id: 5,
    avatar: '🫥',
    name: 'Cheerleader',
    description:
      'This persona is positive and encouraging, providing individuals with emotional support and motivation to overcome challenges. They are often seen as a source of inspiration and motivation',
    tone: PersonaTone.Cheerful,
    language: PersonaLanguage.Formal,
    style: PersonaStyle.Indirect,
    messageColor: '#EBEBEB',
    isPreset: true
  }
]

export const mockPersonaMessagesList: PersonaMessages[] = []
