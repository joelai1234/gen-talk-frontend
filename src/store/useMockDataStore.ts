import { mockPersonaMessagesList, mockPersonasData } from '@/data/mockData'
import { PersonaData, PersonaMessages } from '@/model/persona'
import { create } from 'zustand'

interface MockDataState {
  mockPersonasData: PersonaData[]
  mockPersonaMessagesList: PersonaMessages[]
  setMockPersonasData: (data: PersonaData[]) => void
  addMockPersonaData: (data: PersonaData) => void
  deleteMockPersonaData: (id: string | number) => void
  setMockPersonaMessagesList: (data: PersonaMessages[]) => void
}

export const useMockDataStore = create<MockDataState>()((set) => ({
  mockPersonasData: mockPersonasData,
  mockPersonaMessagesList: mockPersonaMessagesList,
  setMockPersonasData: (data) => set({ mockPersonasData: data }),
  addMockPersonaData: (data) =>
    set((state) => ({ mockPersonasData: [...state.mockPersonasData, data] })),
  deleteMockPersonaData: (id) => {
    set((state) => ({
      mockPersonasData: state.mockPersonasData.filter(
        (persona) => persona.id !== id
      )
    }))
    set((state) => ({
      mockPersonaMessagesList: state.mockPersonaMessagesList.filter(
        (messages) => messages.personaId !== id
      )
    }))
  },
  setMockPersonaMessagesList: (data) => set({ mockPersonaMessagesList: data })
}))
