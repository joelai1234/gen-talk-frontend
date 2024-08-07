import { useEffect } from 'react'
import { createAuthAxios } from '../utils/http'
import { useAuthAxiosStore } from '../store/useAuthAxiosStroe'
import { useUserDataStore } from '../store/useUserDataStore'

interface AuthProviderProps {
  children: React.ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { userData } = useUserDataStore()
  const accessToken = userData?.accessToken
  const { setAuthAxios, deleteAuthAxios, setIsAuthenticated } =
    useAuthAxiosStore()

  useEffect(() => {
    console.log('setting auth axios instance')
    if (accessToken) {
      setAuthAxios(createAuthAxios(accessToken))
      setIsAuthenticated(true)
    } else {
      deleteAuthAxios()
      setIsAuthenticated(false)
    }
  }, [accessToken, deleteAuthAxios, setAuthAxios, setIsAuthenticated])

  return <>{children}</>
}
