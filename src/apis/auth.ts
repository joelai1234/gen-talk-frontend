import axios, { AxiosInstance } from 'axios'
import {
  ConfirmPayload,
  ForgetPasswordPayload,
  GetMeResponse,
  RefreshAccessTokenPayload,
  ResetPasswordPayload,
  SignInPayload,
  SignInResponse,
  SignUpPayload,
  UpdatePasswordPayload
} from './model/auth'

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL
const http = axios.create({
  baseURL: VITE_BACKEND_URL
})

export const signIn = (payload: SignInPayload) => {
  return http.post<SignInResponse>('/api/v1/login', payload)
}

export const signUp = (payload: SignUpPayload) => {
  return http.post<unknown>('/api/v1/signup', payload)
}

export const verifyEmail = (payload: ConfirmPayload) => {
  return http.post<unknown>('/api/v1/verify-email', payload)
}

export const forgetPassword = (payload: ForgetPasswordPayload) => {
  return http.post<unknown>('/api/v1/forgot-password', payload)
}

export const resetPassword = (payload: ResetPasswordPayload) => {
  return http.post<unknown>('/api/v1/reset-password', payload)
}

export const refreshAccessToken = (payload: RefreshAccessTokenPayload) => {
  return http.post<{ access_token: string }>(
    `/api/v1/refresh-token?refresh_token=${payload.refresh_token}`
  )
}

export const updatePassword =
  (_http: AxiosInstance) => (payload: UpdatePasswordPayload) => {
    return _http.post<unknown>('/api/v1/update-password', payload)
  }

export const getMeData = (_http: AxiosInstance) => () => {
  return _http.get<GetMeResponse>('/api/v1/users/me')
}
