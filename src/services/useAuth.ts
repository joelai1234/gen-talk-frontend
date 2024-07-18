import { useUserDataStore } from '@/store/useUserDataStore'

export const useAuth = () => {
  const { userData, setUserData, deleteUserData } = useUserDataStore()
  const isLogin = !!userData

  const signIn = async () => {
    // Call API to sign in
    setUserData({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      me: {
        id: 1,
        name: 'John doe',
        email: 'john.doe@example.com'
      }
    })
  }
  const signOut = async () => {
    deleteUserData()
  }
  return {
    isLogin,
    signIn,
    signOut
  }
}
