import { Navigate, createBrowserRouter } from 'react-router-dom'
import Components from '@/pages/Components'
import Layout from '@/components/Layout'
import ChatBot from '@/pages/ChatBot'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/chatbot" replace={true} />
  },
  {
    path: '/components',
    element: <Components />
  },
  {
    element: <Layout />,
    children: [
      {
        path: '/chatbot',
        element: <ChatBot />
      }
    ]
  }
])
