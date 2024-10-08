import {
  verifyEmail,
  signUp,
  signIn,
  forgetPassword,
  resetPassword,
  resendSignUpVerificationEmail
} from '@/apis/auth'
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
  const verifyEmailMutation = useMutation({ mutationFn: verifyEmail })
  const forgetPasswordMutation = useMutation({ mutationFn: forgetPassword })
  const resetPasswordMutation = useMutation({ mutationFn: resetPassword })
  const resendSignUpVerificationEmailMutation = useMutation({
    mutationFn: resendSignUpVerificationEmail
  })

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
    verifyEmailMutation,
    forgetPasswordMutation,
    resetPasswordMutation,
    resendSignUpVerificationEmailMutation,
    isLogin,
    userData,
    setUserData,
    signIn,
    signOut,
    mockSignIn
  }
}
