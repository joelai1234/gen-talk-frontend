import { AuthStatus } from '@/enum/auth'
import { IoMdClose } from 'react-icons/io'
import { Button } from '../ui/button'

interface ResendSignUpVerificationEmailBlockProps {
  setAuthAction: (action: AuthStatus) => void
}

export default function ResendSignUpVerificationEmailBlock({
  setAuthAction
}: ResendSignUpVerificationEmailBlockProps) {
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
        className="mx-auto

mb-4 h-[83px] w-[153px]"
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
              All new sign-ups need to be verified for security purposes. A
              verification email has been sent to{' '}
            </span>
            <span className="w-[366px] shrink-0 grow-0 self-stretch text-center text-base font-bold text-[#4c4c4c]">
              john@email.com
            </span>
            <span className="w-[366px] shrink-0 grow-0 self-stretch text-center text-base text-[#4c4c4c]">
              .{' '}
            </span>
          </p>
        </div>
        <Button
          className="w-full"
          onClick={() => {
            setAuthAction(AuthStatus.none)
          }}
        >
          Resend verification email
        </Button>
      </div>
    </div>
  )
}
