import { AuthStatus } from '@/enum/auth'
import { IoMdClose } from 'react-icons/io'
import { Button } from '../ui/button'
import { MdOutlineVerifiedUser } from 'react-icons/md'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '@/services/auth/hooks/useAuth'
import { SubmitHandler, useForm } from 'react-hook-form'
import { ErrorResponse } from '@/apis/model/commen'

interface ResendSignUpVerificationEmailBlockProps {
  setAuthAction: (action: AuthStatus) => void
}

export default function ResendSignUpVerificationEmailBlock({
  setAuthAction
}: ResendSignUpVerificationEmailBlockProps) {
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') || ''
  const { confirmSignUpMutation } = useAuth()
  const errorMessage = (confirmSignUpMutation.error as unknown as ErrorResponse)
    ?.response?.data.detail
  console.log(confirmSignUpMutation.error)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<{ code: string }>()

  const onSubmit: SubmitHandler<{ code: string }> = async (data) => {
    confirmSignUpMutation.mutate(
      { email, confirmation_code: data.code },
      {
        onSuccess: () => {
          setAuthAction(AuthStatus.login)
        }
      }
    )
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
        src="/images/verify-email.svg"
        alt=""
      />
      <div className="space-y-6">
        <h4 className="text-center text-2xl font-medium text-[#4c4c4c]">
          Verify Your Email
        </h4>
        <div>
          <p className="w-[366px] shrink-0 grow-0 self-stretch text-center text-base text-[#4c4c4c]">
            <span className="w-[366px] shrink-0 grow-0 self-stretch text-center text-base text-[#4c4c4c]">
              A 6-digit verification code has been sent to{' '}
            </span>
            <span className="w-[366px] shrink-0 grow-0 self-stretch text-center text-base font-bold text-[#4c4c4c]">
              {email}
            </span>
          </p>
        </div>
        <div>
          <div className="relative">
            <div className=" pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MdOutlineVerifiedUser className=" text-2xl text-[#4C4C4C]" />
            </div>
            <input
              className="w-full rounded-lg border border-[#ebebeb] px-3 py-2 pl-11 text-base outline-none disabled:bg-[#ebebeb] disabled:text-[#9A9A9A]"
              type="text"
              placeholder="Verification code"
              {...register('code', {
                required: 'Code is required'
              })}
            />
          </div>
          <p className="text-sm text-red-500">{errors.code?.message}</p>
        </div>
        <div>
          <Button
            className="w-full"
            onClick={handleSubmit(onSubmit)}
            isLoading={confirmSignUpMutation.isPending}
          >
            Continue
          </Button>
          <p className="text-sm text-red-500">{errorMessage}</p>
        </div>

        <p className="mt-6 text-center text-base">
          <span className="text-[#4c4c4c]">Didn’t receive the email? </span>
          <span
            className="cursor-pointer text-earth-green"
            onClick={() => {
              setAuthAction(AuthStatus.login)
            }}
          >
            Resend
          </span>
        </p>
      </div>
    </div>
  )
}
