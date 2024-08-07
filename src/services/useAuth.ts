import { confirmSignUp, signUp, signIn } from '@/apis/auth'
import { useUserDataStore } from '@/store/useUserDataStore'
import { useMutation } from '@tanstack/react-query'

export const useAuth = () => {
  const { userData, setUserData, deleteUserData } = useUserDataStore()
  const signInMutation = useMutation({
    mutationFn: signIn
  })
  const signUpMutation = useMutation({ mutationFn: signUp })
  const confirmSignUpMutation = useMutation({ mutationFn: confirmSignUp })

  const isLogin = !!userData

  // const signIn = async () => {
  //   // Call API to sign in
  //   setUserData({
  //     accessToken: 'access-token',
  //     refreshToken: 'refresh-token',
  //     me: {
  //       id: 1,
  //       name: 'John doe',
  //       email: 'john.doe@example.com'
  //     }
  //   })
  // }
  const signOut = async () => {
    deleteUserData()
  }
  return {
    signInMutation,
    signUpMutation,
    confirmSignUpMutation,
    isLogin,
    userData,
    setUserData,
    signIn,
    signOut
  }
}
