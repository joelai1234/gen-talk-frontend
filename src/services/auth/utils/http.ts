import axios from 'axios'

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const createAuthAxiosWithRefresh = (
  accessToken: string,
  refreshTokenHandler: () => Promise<string | undefined>
) => {
  const authAxios = axios.create({
    baseURL: VITE_BACKEND_URL,
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })

  authAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true
        const newToken = await refreshTokenHandler()
        if (newToken) {
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`
          return authAxios(originalRequest)
        }
      }
      return Promise.reject(error)
    }
  )

  return authAxios
}

export const createAuthAxios = (
  accessToken: string,
  refreshTokenHandler: () => Promise<string | undefined>
) => {
  return createAuthAxiosWithRefresh(accessToken, refreshTokenHandler)
}
