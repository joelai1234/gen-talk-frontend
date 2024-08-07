import { mockPersonaMessagesList, mockPersonasData } from '@/data/mockData'
import {
  PersonaData,
  PersonaMessages,
  RewritePersonaData
} from '@/model/persona'
import { create } from 'zustand'

interface MockDataState {
  mockPersonasData: PersonaData[]
  mockRewritePersonasData: RewritePersonaData[]
  mockPersonaMessagesList: PersonaMessages[]
  setMockPersonasData: (data: PersonaData[]) => void
  addMockPersonaData: (data: PersonaData) => void
  deleteMockPersonaData: (id: string | number) => void
  setMockRewritePersonasData: (data: RewritePersonaData[]) => void
  addMockRewritePersonaData: (data: RewritePersonaData) => void
  deleteMockRewritePersonaData: (id: string | number) => void
  setMockPersonaMessagesList: (data: PersonaMessages[]) => void
}

export const useMockDataStore = create<MockDataState>()((set) => ({
  mockPersonasData: mockPersonasData,
  mockRewritePersonasData: [],
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
  setMockRewritePersonasData: (data) => set({ mockRewritePersonasData: data }),
  addMockRewritePersonaData: (data) =>
    set((state) => ({
      mockRewritePersonasData: [...state.mockRewritePersonasData, data]
    })),
  deleteMockRewritePersonaData: (id) => {
    set((state) => ({
      mockRewritePersonasData: state.mockRewritePersonasData.filter(
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
