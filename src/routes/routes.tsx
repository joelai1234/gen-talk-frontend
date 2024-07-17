import { Navigate, createBrowserRouter } from 'react-router-dom'
import Components from '@/pages/Components'
import Layout from '@/components/Layout'
import ChatBot from '@/pages/ChatBot'
import EditPersona from '@/pages/Persona/Edit'
import CreatePersona from '@/pages/Persona/Create'
import ResetPassword from '@/pages/Auth/ResetPassword'
import AuthLayout from '@/components/AuthLayout'
import SignIn from '@/pages/Auth/SignIn'
import SignUp from '@/pages/Auth/SignUp'
import ForgetPassword from '@/pages/Auth/ForgetPassword'
import VerifySignUpEmail from '@/pages/Auth/VerifySignUpEmail'
import ResendVerificationEmail from '@/pages/Auth/ResendVerificationEmail'
import ForgetPasswordSentEmail from '@/pages/Auth/ForgetPasswordSentEmail'
import VerifyResetPasswordEmail from '@/pages/Auth/VerifyResetPasswordEmail'
import SuccessResetPassword from '@/pages/Auth/SuccessResetPassword'

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
        path: '/auth/sign-in',
        element: <SignIn />
      },
      {
        path: '/auth/sign-up',
        element: <SignUp />
      },
      {
        path: '/auth/resend-verification-email',
        element: <ResendVerificationEmail />
      },
      {
        path: '/auth/forget-password',
        element: <ForgetPassword />
      },
      {
        path: '/auth/forget-password-sent-email',
        element: <ForgetPasswordSentEmail />
      },
      {
        path: '/auth/reset-password',
        element: <ResetPassword />
      },
      {
        path: '/auth/reset-password/verify',
        element: <VerifyResetPasswordEmail />
      },
      {
        path: '/auth/reset-password/success',
        element: <SuccessResetPassword />
      },
      {
        path: '/auth/sign-up/verify',
        element: <VerifySignUpEmail />
      }
    ]
  }
])
