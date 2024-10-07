import axios from 'axios'

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL
// const VITE_BACKEND_URL = ''

export const createAuthAxios = (accessToken: string) => {
  const axiosInstance = axios.create({
    baseURL: VITE_BACKEND_URL,
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
  return axiosInstance
}
