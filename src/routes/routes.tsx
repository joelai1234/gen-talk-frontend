import { Navigate, createBrowserRouter } from 'react-router-dom'
import Components from '@/pages/Components'
import Layout from '@/components/Layout'
import ChatBot from '@/pages/ChatBot'
import EditPersona from '@/pages/Persona/Edit'
import CreatePersona from '@/pages/Persona/Create'
import ForgetPassword from '@/pages/ForgetPassword'
import AuthLayout from '@/components/AuthLayout'

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
      },
      {
        path: '/persona/:personaId/edit',
        element: <EditPersona />
      },
      {
        path: '/persona/create',
        element: <CreatePersona />
      }
    ]
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/auth/forget-password',
        element: <ForgetPassword />
      }
    ]
  }
])
