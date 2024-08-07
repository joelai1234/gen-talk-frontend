import { AuthStatus } from '@/enum/auth'
import { IoMdClose } from 'react-icons/io'
import { Button } from '../ui/button'
import { MdOutlineVerifiedUser } from 'react-icons/md'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '@/services/auth/hooks/useAuth'

interface ResendSignUpVerificationEmailBlockProps {
  setAuthAction: (action: AuthStatus) => void
}

export default function ResendSignUpVerificationEmailBlock({
  setAuthAction
}: ResendSignUpVerificationEmailBlockProps) {
  const [code, setCode] = useState('')
  const [searchParams] = useSearchParams()
  const { confirmSignUpMutation } = useAuth()

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
              john@email.com
            </span>
            <span className="w-[366px] shrink-0 grow-0 self-stretch text-center text-base text-[#4c4c4c]">
              .{' '}
            </span>
          </p>
        </div>
        <div className="relative">
          <div className=" pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MdOutlineVerifiedUser className=" text-2xl text-[#4C4C4C]" />
          </div>
          <input
            className="w-full rounded-lg border border-[#ebebeb] px-3 py-2 pl-11 text-base outline-none disabled:bg-[#ebebeb] disabled:text-[#9A9A9A]"
            type="text"
            placeholder="Verification code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>
        <Button
          className="w-full"
          onClick={() => {
            const email = searchParams.get('email') || ''
            confirmSignUpMutation.mutate(
              { email, confirmation_code: code },
              {
                onSuccess: () => {
                  setAuthAction(AuthStatus.login)
                }
              }
            )
          }}
        >
          Continue
        </Button>
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
