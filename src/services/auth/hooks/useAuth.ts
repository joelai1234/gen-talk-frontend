import { confirmSignUp, signUp, signIn } from '@/apis/auth'
import { useMutation } from '@tanstack/react-query'
import { useUserDataStore } from '../store/useUserDataStore'
import { useAuthAxiosStore } from '../store/useAuthAxiosStroe'

export const useAuth = () => {
  const { authAxios } = useAuthAxiosStore()
  const { userData, setUserData, deleteUserData } = useUserDataStore()
  const signInMutation = useMutation({
    mutationFn: signIn
  })
  const signUpMutation = useMutation({ mutationFn: signUp })
  const confirmSignUpMutation = useMutation({ mutationFn: confirmSignUp })

  const isLogin = !!userData

  const mockSignIn = async () => {
    // Call API to sign in
    setUserData({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      idToken: 'id',
      me: {
        id: '1',
        name: 'John doe',
        email: 'john.doe@example.com'
      }
    })
  }
  const signOut = async () => {
    deleteUserData()
  }

  return {
    authAxios,
    signInMutation,
    signUpMutation,
    confirmSignUpMutation,
    isLogin,
    userData,
    setUserData,
    signIn,
    signOut,
    mockSignIn
  }
}
