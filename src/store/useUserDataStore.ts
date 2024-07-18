import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserData {
  accessToken: string
  refreshToken: string
  me: {
    id: number
    name: string
    email: string
  }
}

interface UserDataState {
  userData?: UserData
  setUserData: (data: UserData) => void
  deleteUserData: () => void
}

export const useUserDataStore = create<UserDataState>()(
  persist(
    (set) => ({
      setUserData: (data) => set({ userData: data }),
      deleteUserData: () => set({ userData: undefined })
    }),
    {
      name: 'user-data' // name of item in the storage (must be unique)
    }
  )
)
