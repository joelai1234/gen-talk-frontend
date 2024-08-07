import axios from 'axios'

// const VITE_BACKEND_API_BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL
const VITE_BACKEND_API_BASE_URL = ''

export const createAuthAxios = (accessToken: string) => {
  const axiosInstance = axios.create({
    baseURL: VITE_BACKEND_API_BASE_URL,
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
  return axiosInstance
}
