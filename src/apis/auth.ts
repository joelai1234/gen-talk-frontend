import axios from 'axios'
import { ForgetPasswordPayload, SignInPayload } from './model/auth'

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const http = axios.create({
  baseURL: VITE_BACKEND_URL
})

export const signIn = (payload: SignInPayload) => {
  return http.post<unknown>('/api/v1/auth/login', payload)
}

export const signUp = (payload: SignInPayload) => {
  return http.post<unknown>('/api/v1/auth/signup', payload)
}

export const forgetPassword = (payload: ForgetPasswordPayload) => {
  return http.post<unknown>('/api/v1/auth/forgotpassword', payload)
}
