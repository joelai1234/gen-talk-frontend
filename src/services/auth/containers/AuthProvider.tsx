import { useEffect, useCallback } from 'react'
import { createAuthAxios } from '../utils/http'
import { useAuthAxiosStore } from '../store/useAuthAxiosStroe'
import { useUserDataStore } from '../store/useUserDataStore'
import { refreshAccessToken } from '../../../apis/auth'

interface AuthProviderProps {
  children: React.ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { userData, setUserData } = useUserDataStore()
  const accessToken = userData?.accessToken
  const refreshToken = userData?.refreshToken

  const { setAuthAxios, deleteAuthAxios, setIsAuthenticated } =
    useAuthAxiosStore()

  const refreshTokenHandler = useCallback(async () => {
    if (refreshToken) {
      try {
        const response = await refreshAccessToken({
          refresh_token: refreshToken
        })
        const newAccessToken = response.data.access_token
        setUserData({ ...userData, accessToken: newAccessToken })
        return newAccessToken
      } catch (error) {
        console.error('Failed to refresh token:', error)
        deleteAuthAxios()
        setIsAuthenticated(false)
        // 可能需要在此處理登出邏輯
      }
    }
  }, [refreshToken, userData, setUserData, deleteAuthAxios, setIsAuthenticated])

  useEffect(() => {
    if (accessToken) {
      const axiosInstance = createAuthAxios(accessToken, refreshTokenHandler)
      setAuthAxios(axiosInstance)
      setIsAuthenticated(true)
    } else {
      deleteAuthAxios()
      setIsAuthenticated(false)
    }
  }, [
    accessToken,
    deleteAuthAxios,
    setAuthAxios,
    setIsAuthenticated,
    refreshTokenHandler
  ])

  return <>{children}</>
}
