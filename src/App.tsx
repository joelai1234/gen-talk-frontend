import { RouterProvider } from 'react-router-dom'
import { router } from './routes/routes'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useInitVh } from './hooks/useInitVh'
import AuthProvider from './services/auth/containers/AuthProvider'

const queryClient = new QueryClient()

function App() {
  useInitVh()
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
