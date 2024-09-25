import { AuthStatus } from '@/enum/auth'
import { IoMdClose } from 'react-icons/io'
import { MdOutlineEmail, MdOutlinePassword } from 'react-icons/md'
import { Button } from '../ui/button'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useAuth } from '@/services/auth/hooks/useAuth'
import { ErrorResponse } from '@/apis/model/commen'
import axios, { AxiosResponse } from 'axios'
import { jwtDecode } from 'jwt-decode'
import { handleEnterKeyPress } from '@/utils'

type SignInInputs = {
  email: string
  password: string
}

interface SignInBlockProps {
  setAuthAction: (action: AuthStatus) => void
}

export default function SignInBlock({ setAuthAction }: SignInBlockProps) {
  const { signInMutation, setUserData } = useAuth()
  signInMutation.error?.message

  const {
    getValues,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignInInputs>({
    defaultValues: {
      email: 'joelai1234567890+test@gmail.com',
      password: 'Test1234!'
    }
  })
  const onSubmit: SubmitHandler<SignInInputs> = async (data) => {
    signInMutation.mutate(data, {
      onSuccess: (data) => {
        setAuthAction(AuthStatus.none)
        const accessToken = data.data.access_token
        const decoded = jwtDecode<{ username: string }>(accessToken)
        setUserData({
          accessToken: data.data.access_token,
          refreshToken: data.data.refresh_token,
          idToken: data.data.id_token,
          me: {
            id: decoded.username,
            name: 'name (dev)',
            email: getValues('email')
          }
        })
      },
      onError: (error) => {
        if (axios.isAxiosError(error) && error.response) {
          error.response as AxiosResponse<ErrorResponse>
          if (
            error.response.data.detail ===
            'An error occurred (UserNotConfirmedException) when calling the InitiateAuth operation: User is not confirmed.'
          ) {
            setAuthAction(AuthStatus.resendSignUpVerificationEmail)
          }
        }
      }
    })
  }

  const errorMessageDetail = (signInMutation.error as unknown as ErrorResponse)
    ?.response?.data?.detail

  let errorMessage = ''
  if (typeof errorMessageDetail === 'string') {
    errorMessage = errorMessageDetail
  } else if (
    Array.isArray(errorMessageDetail) &&
    errorMessageDetail.every((item) => typeof item.msg === 'string')
  ) {
    errorMessage = errorMessageDetail[0].msg
  }

  return (
    <div className="flex flex-col">
      <button
        className="ml-auto flex size-8 items-center justify-center rounded-full border border-[#EBEBEB]"
        onClick={() => {
          setAuthAction(AuthStatus.none)
        }}
      >
        <IoMdClose />
      </button>
      <img
        className="mx-auto mb-4 h-[83px] w-[153px]"
        src="/images/sign-up.svg"
        alt=""
      />
      <div className="space-y-6">
        <h4 className="text-center text-2xl font-medium text-[#4c4c4c]">
          Login
        </h4>
        <div className="space-y-3">
          <div>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MdOutlineEmail className=" text-2xl text-[#4C4C4C]" />
              </div>
              <input
                className="w-full rounded-lg border border-[#ebebeb] px-3 py-2 pl-11 text-base outline-none disabled:bg-[#ebebeb] disabled:text-[#9A9A9A]"
                type="text"
                placeholder="Email"
                {...register('email', {
                  required: 'Email is required'
                })}
                onKeyDown={(e) =>
                  handleEnterKeyPress(
                    e,
                    handleSubmit(onSubmit),
                    'passwordInput'
                  )
                }
              />
            </div>
            <p className="text-sm text-red-500">{errors.email?.message}</p>
          </div>
          <div>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MdOutlinePassword className=" text-2xl text-[#4C4C4C]" />
              </div>
              <input
                id="passwordInput"
                className="w-full rounded-lg border border-[#ebebeb] px-3 py-2 pl-11 text-base outline-none disabled:bg-[#ebebeb] disabled:text-[#9A9A9A]"
                type="password"
                placeholder="Password"
                {...register('password', {
                  required: 'Password is required'
                })}
                onKeyDown={(e) =>
                  handleEnterKeyPress(e, handleSubmit(onSubmit))
                }
              />
            </div>
            <p className="text-sm text-red-500">{errors.password?.message}</p>
          </div>
          <div className="flex justify-end">
            <p
              className="inline-block cursor-pointer text-sm text-earth-green"
              onClick={() => {
                setAuthAction(AuthStatus.forgetPassword)
              }}
            >
              Forgot Password?
            </p>
          </div>
        </div>
        <div>
          <Button
            className="w-full"
            onClick={handleSubmit(onSubmit)}
            isLoading={signInMutation.isPending}
          >
            Login
          </Button>
          <p className="text-sm text-red-500">{errorMessage}</p>
        </div>
      </div>
      <p className="mt-6 text-center text-base">
        <span className="text-[#4c4c4c]">Already have an account? </span>
        <span
          className="cursor-pointer text-earth-green"
          onClick={() => {
            setAuthAction(AuthStatus.signUp)
          }}
        >
          Sign up
        </span>
      </p>
    </div>
  )
}
