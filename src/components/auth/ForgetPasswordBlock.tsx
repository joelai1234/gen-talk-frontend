import { AuthStatus } from '@/enum/auth'
import { IoMdClose } from 'react-icons/io'
import { Button } from '../ui/button'
import { MdOutlineEmail } from 'react-icons/md'
import { ErrorResponse } from '@/apis/model/commen'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '@/services/auth/hooks/useAuth'
import { SubmitHandler, useForm } from 'react-hook-form'
import { handleEnterKeyPress } from '@/utils'

interface ForgetPasswordBlockProps {
  setAuthAction: (action: AuthStatus) => void
}

interface ForgetPasswordInputs {
  email: string
}

export default function ForgetPasswordBlock({
  setAuthAction
}: ForgetPasswordBlockProps) {
  const { forgetPasswordMutation } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ForgetPasswordInputs>({
    defaultValues: {
      // email: 'joelai1234567890+local6@gmail.com'
    }
  })

  const setSearchParamsEmail = (email: string) => {
    const currentParams = new URLSearchParams(searchParams)
    currentParams.set('email', email)
    setSearchParams(currentParams)
  }

  const onSubmit: SubmitHandler<ForgetPasswordInputs> = async (data) => {
    // setSearchParamsEmail(data.email)
    // setAuthAction(AuthStatus.forgetPasswordSentEmail)
    forgetPasswordMutation.mutate(data, {
      onSuccess: () => {
        setSearchParamsEmail(data.email)
        setAuthAction(AuthStatus.forgetPasswordSentEmail)
      }
    })
  }

  const errorMessageDetail = (
    forgetPasswordMutation.error as unknown as ErrorResponse
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
        src="/images/forget-password.svg"
        alt="forget-password"
      />
      <div className="space-y-6">
        <h4 className="text-center text-2xl font-medium text-[#4c4c4c]">
          Forgot Password
        </h4>
        <div className="space-y-3">
          <div className="relative">
            <div className=" pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MdOutlineEmail className=" text-2xl text-[#4C4C4C]" />
            </div>
            <input
              className="w-full rounded-lg border border-[#ebebeb] px-3 py-2 pl-11 text-base outline-none disabled:bg-[#ebebeb] disabled:text-[#9A9A9A]"
              type="text"
              placeholder="Email"
              onKeyDown={(e) => handleEnterKeyPress(e, handleSubmit(onSubmit))}
              {...register('email', {
                required: 'Email is required'
              })}
            />
          </div>
          <p className="text-sm text-red-500">{errors.email?.message}</p>
        </div>
        <div className="space-y-1">
          <Button
            className="w-full"
            onClick={handleSubmit(onSubmit)}
            isLoading={forgetPasswordMutation.isPending}
          >
            Continue
          </Button>
          <Button
            className="w-full"
            variant="white"
            onClick={() => {
              setAuthAction(AuthStatus.login)
            }}
          >
            Back
          </Button>
        </div>
        <p className="text-red-500">{errorMessage}</p>
      </div>
    </div>
  )
}
