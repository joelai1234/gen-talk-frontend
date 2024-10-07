import axios from 'axios'
import {
  ConfirmPayload,
  ForgetPasswordPayload,
  SignInPayload,
  SignInResponse,
  SignUpPayload
} from './model/auth'

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL
// const VITE_BACKEND_URL = ''
// http://0.0.0.0:8000/api/v1/login
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
  return http.post<unknown>('/api/v1/forgotpassword', payload)
}
