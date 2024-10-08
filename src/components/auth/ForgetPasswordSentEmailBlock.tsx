import { AuthStatus } from '@/enum/auth'
import { IoMdClose } from 'react-icons/io'
import { Button } from '../ui/button'
import { useSearchParams } from 'react-router-dom'

interface ForgetPasswordSentEmailBlockProps {
  setAuthAction: (action: AuthStatus) => void
}

export default function ForgetPasswordSentEmailBlock({
  setAuthAction
}: ForgetPasswordSentEmailBlockProps) {
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') || ''

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
        <div>
          <p className="w-[366px] shrink-0 grow-0 self-stretch text-center text-base text-[#4c4c4c]">
            <span className="w-[366px] shrink-0 grow-0 self-stretch text-center text-base text-[#4c4c4c]">
              We’ve sent instructions on how to reset your password to{' '}
            </span>
            <span className="w-[366px] shrink-0 grow-0 self-stretch text-center text-base font-bold text-[#4c4c4c]">
              {email}
            </span>
            <span className="w-[366px] shrink-0 grow-0 self-stretch text-center text-base text-[#4c4c4c]">
              .{' '}
            </span>
          </p>
        </div>
        <Button
          className="w-full"
          onClick={() => {
            setAuthAction(AuthStatus.resetPassword)
          }}
        >
          Got it
        </Button>
      </div>
    </div>
  )
}
