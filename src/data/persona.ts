import { PersonaLanguage, PersonaStyle, PersonaTone } from '@/enum/persona'

export const defaultPersonaIcon = '/images/avatar1.png'

export const personaToneOptions = [
  {
    label: 'Empathetic',
    value: PersonaTone.Empathetic
  },
  {
    label: 'Authoritative',
    value: PersonaTone.Authoritative
  },
  {
    label: 'Cheerful',
    value: PersonaTone.Cheerful
  },
  {
    label: 'Casual',
    value: PersonaTone.Casual
  },
  {
    label: 'Sincere',
    value: PersonaTone.Sincere
  }
]

export const personaLanguageOptions = [
  {
    label: 'Formal',
    value: PersonaLanguage.Formal
  },
  {
    label: 'Informal',
    value: PersonaLanguage.Informal
  },
  {
    label: 'Motivational',
    value: PersonaLanguage.Motivational
  },
  {
    label: 'Technical',
    value: PersonaLanguage.Technical
  },
  {
    label: 'Simple',
    value: PersonaLanguage.Simple
  }
]

export const personaStyleOptions = [
  {
    label: 'Direct',
    value: PersonaStyle.Direct
  },
  {
    label: 'Indirect',
    value: PersonaStyle.Indirect
  },
  {
    label: 'Storytelling',
    value: PersonaStyle.Storytelling
  },
  {
    label: 'Analytical',
    value: PersonaStyle.Analytical
  },
  {
    label: 'Reflective',
    value: PersonaStyle.Reflective
  }
]
