import { AuthStatus } from '@/enum/auth'
import { IoMdClose } from 'react-icons/io'
import { Button } from '../ui/button'
import { useSearchParams } from 'react-router-dom'

interface VerifyEmailSuccessBlockProps {
  setAuthAction: (action: AuthStatus) => void
}

export default function VerifyEmailSuccessBlock({
  setAuthAction
}: VerifyEmailSuccessBlockProps) {
  const [, setSearchParams] = useSearchParams()

  return (
    <div className="flex flex-col">
      <button
        className="ml-auto flex size-8 items-center justify-center rounded-full border border-[#EBEBEB]"
        onClick={() => {
          setAuthAction(AuthStatus.none)
          setSearchParams({})
        }}
      >
        <IoMdClose />
      </button>
      <img
        className="mx-auto mb-4 h-[83px] w-[153px]"
        src="/images/verify-email-success.svg"
        alt="verify-email-success"
      />
      <div className="space-y-6">
        <h4 className="text-center text-2xl font-medium text-[#4c4c4c]">
          Your email has been verified
        </h4>
        <div>
          <p className="w-[366px] shrink-0 grow-0 self-stretch text-center text-base text-[#4c4c4c]">
            <span className="w-[366px] shrink-0 grow-0 self-stretch text-center text-base text-[#4c4c4c]">
              Your email address has been verified. You’re all set to interact
              with the chatbots and customize personas.
            </span>
          </p>
        </div>
        <Button
          className="w-full"
          onClick={() => {
            setAuthAction(AuthStatus.none)
            setSearchParams({})
          }}
        >
          Get Started
        </Button>
      </div>
    </div>
  )
}
