import { AuthStatus } from '@/enum/auth'
import { IoMdClose } from 'react-icons/io'
import {
  MdOutlineEmail,
  MdOutlinePassword,
  MdOutlineVerifiedUser
} from 'react-icons/md'
import { Button } from '../ui/button'
import { useSearchParams } from 'react-router-dom'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useAuth } from '@/services/auth/hooks/useAuth'
import { ErrorResponse } from '@/apis/model/commen'
import { handleEnterKeyPress } from '@/utils'

type ResetPasswordBlockInputs = {
  email: string
  password: string
  code: string
}

interface ResetPasswordBlockBlockProps {
  setAuthAction: (action: AuthStatus) => void
}

export default function ResetPasswordBlock({
  setAuthAction
}: ResetPasswordBlockBlockProps) {
  const { resetPasswordMutation } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const email = searchParams.get('email') || ''
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ResetPasswordBlockInputs>({
    defaultValues: {
      email: email,
      password: 'Test1234!'
    }
  })

  const setSearchParamsEmail = (email: string) => {
    const currentParams = new URLSearchParams(searchParams)
    currentParams.set('email', email)
    setSearchParams(currentParams)
  }

  const onSubmit: SubmitHandler<ResetPasswordBlockInputs> = async (data) => {
    resetPasswordMutation.mutate(
      {
        email: data.email,
        new_password: data.password,
        confirmation_code: data.code
      },
      {
        onSuccess: () => {
          setSearchParamsEmail(data.email)
          setAuthAction(AuthStatus.login)
        }
      }
    )
  }

  const errorMessageDetail = (
    resetPasswordMutation.error as unknown as ErrorResponse
  )?.response?.data?.detail

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
          Reset Password
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
                disabled
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
              <div className=" pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MdOutlinePassword className=" text-2xl text-[#4C4C4C]" />
              </div>
              <input
                id="passwordInput"
                className="w-full rounded-lg border border-[#ebebeb] px-3 py-2 pl-11 text-base outline-none disabled:bg-[#ebebeb] disabled:text-[#9A9A9A]"
                type="password"
                placeholder="New password"
                {...register('password', { required: 'Password is required' })}
                onKeyDown={(e) =>
                  handleEnterKeyPress(e, handleSubmit(onSubmit), 'codeInput')
                }
              />
            </div>
            <p className="text-red-500">{errors.password?.message}</p>
          </div>
          <div>
            <div className="relative">
              <div className=" pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MdOutlineVerifiedUser className=" text-2xl text-[#4C4C4C]" />
              </div>
              <input
                id="codeInput"
                className="w-full rounded-lg border border-[#ebebeb] px-3 py-2 pl-11 text-base outline-none disabled:bg-[#ebebeb] disabled:text-[#9A9A9A]"
                type="text"
                placeholder="Verification code"
                {...register('code', {
                  required: 'Code is required'
                })}
                onKeyDown={(e) =>
                  handleEnterKeyPress(e, handleSubmit(onSubmit))
                }
              />
            </div>
            <p className="text-sm text-red-500">{errors.code?.message}</p>
          </div>
        </div>
        <div>
          <Button
            className="w-full"
            onClick={handleSubmit(onSubmit)}
            isLoading={resetPasswordMutation.isPending}
          >
            Confirm
          </Button>
          <p className="text-red-500">{errorMessage}</p>
        </div>
      </div>
    </div>
  )
}
