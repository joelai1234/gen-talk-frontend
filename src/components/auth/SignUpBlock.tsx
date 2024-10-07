import { AuthStatus } from '@/enum/auth'
import { IoMdClose } from 'react-icons/io'
import {
  MdOutlineAccountCircle,
  MdOutlineEmail,
  MdOutlinePassword
} from 'react-icons/md'
import { Button } from '../ui/button'
import { useSearchParams } from 'react-router-dom'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useAuth } from '@/services/auth/hooks/useAuth'
import { ErrorResponse } from '@/apis/model/commen'
import { handleEnterKeyPress } from '@/utils'

type SignUpInputs = {
  email: string
  username: string
  password: string
}

interface SignUpBlockProps {
  setAuthAction: (action: AuthStatus) => void
  onSubmit: () => void
}

export default function SignUpBlock({ setAuthAction }: SignUpBlockProps) {
  const { signUpMutation } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignUpInputs>({
    defaultValues: {
      email: 'joelai1234567890+local@gmail.com',
      username: 'Joe',
      password: 'Test1234!'
    }
  })

  const setSearchParamsEmail = (email: string) => {
    const currentParams = new URLSearchParams(searchParams)
    currentParams.set('email', email)
    setSearchParams(currentParams)
  }

  const onSubmit: SubmitHandler<SignUpInputs> = async (data) => {
    signUpMutation.mutate(
      {
        ...data,
        name: data.username
      },
      {
        onSuccess: () => {
          setSearchParamsEmail(data.email)
          setAuthAction(AuthStatus.resendSignUpVerificationEmail)
        }
      }
    )
  }

  const errorMessageDetail = (signUpMutation.error as unknown as ErrorResponse)
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
          Sign Up
        </h4>
        <div className="space-y-3">
          <div>
            <div className="relative">
              <div className=" pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
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
                    'usernameInput'
                  )
                }
              />
            </div>
            <p className="text-sm text-red-500">{errors.email?.message}</p>
          </div>
          <div>
            <div className="relative">
              <div className=" pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MdOutlineAccountCircle className=" text-2xl text-[#4C4C4C]" />
              </div>
              <input
                id="usernameInput"
                className="w-full rounded-lg border border-[#ebebeb] px-3 py-2 pl-11 text-base outline-none disabled:bg-[#ebebeb] disabled:text-[#9A9A9A]"
                type="text"
                placeholder="Username"
                {...register('username', { required: 'Username is required' })}
                onKeyDown={(e) =>
                  handleEnterKeyPress(
                    e,
                    handleSubmit(onSubmit),
                    'passwordInput'
                  )
                }
              />
            </div>
            <p className="text-sm text-red-500">{errors.username?.message}</p>
          </div>
          <div>
            <div className="relative">
              <div className=" pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MdOutlinePassword className=" text-2xl text-[#4C4C4C]" />
              </div>
              <input
                id="passwordInput"
                className="w-full rounded-lg border border-[#ebebeb] px-3 py-2 pl-11 text-base outline-none disabled:bg-[#ebebeb] disabled:text-[#9A9A9A]"
                type="password"
                placeholder="Password"
                {...register('password', { required: 'Password is required' })}
                onKeyDown={(e) =>
                  handleEnterKeyPress(e, handleSubmit(onSubmit))
                }
              />
            </div>
            <p className="text-red-500">{errors.password?.message}</p>
          </div>
        </div>
        <div>
          <Button
            className="w-full"
            onClick={handleSubmit(onSubmit)}
            isLoading={signUpMutation.isPending}
          >
            Continue
          </Button>
          <p className="text-red-500">{errorMessage}</p>
        </div>
      </div>
      <p className="mt-6 text-center text-base">
        <span className="text-[#4c4c4c]">Already have an account? </span>
        <span
          className="cursor-pointer text-earth-green"
          onClick={() => {
            setAuthAction(AuthStatus.login)
          }}
        >
          Login
        </span>
      </p>
    </div>
  )
}
