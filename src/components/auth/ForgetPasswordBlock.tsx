import { AuthStatus } from '@/enum/auth'
import { IoMdClose } from 'react-icons/io'
import { Button } from '../ui/button'
import { MdOutlineEmail } from 'react-icons/md'

interface ForgetPasswordBlockProps {
  setAuthAction: (action: AuthStatus) => void
}

export default function ForgetPasswordBlock({
  setAuthAction
}: ForgetPasswordBlockProps) {
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
            />
          </div>
        </div>
        <div className="space-y-1">
          <Button
            className="w-full"
            onClick={() => {
              setAuthAction(AuthStatus.forgetPasswordSentEmail)
            }}
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
      </div>
    </div>
  )
}
