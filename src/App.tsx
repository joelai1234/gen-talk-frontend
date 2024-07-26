import { RouterProvider } from 'react-router-dom'
import { router } from './routes/routes'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useInitVh } from './hooks/useInitVh'

const queryClient = new QueryClient()

function App() {
  useInitVh()
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

export default App
