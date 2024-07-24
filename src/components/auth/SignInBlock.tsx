import { AuthStatus } from '@/enum/auth'
import { IoMdClose } from 'react-icons/io'
import { MdOutlineEmail, MdOutlinePassword } from 'react-icons/md'
import { Button } from '../ui/button'

interface SignInBlockProps {
  setAuthAction: (action: AuthStatus) => void
  onSubmit: () => void
}

export default function SignInBlock({
  setAuthAction,
  onSubmit
}: SignInBlockProps) {
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
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MdOutlineEmail className=" text-2xl text-[#4C4C4C]" />
            </div>
            <input
              className="w-full rounded-lg border border-[#ebebeb] px-3 py-2 pl-11 text-base outline-none disabled:bg-[#ebebeb] disabled:text-[#9A9A9A]"
              type="text"
              placeholder="Email"
            />
          </div>
          <div className="relative">
            <div className=" pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MdOutlinePassword className=" text-2xl text-[#4C4C4C]" />
            </div>
            <input
              className="w-full rounded-lg border border-[#ebebeb] px-3 py-2 pl-11 text-base outline-none disabled:bg-[#ebebeb] disabled:text-[#9A9A9A]"
              type="password"
              placeholder="Password"
            />
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
        <Button
          className="w-full"
          onClick={() => {
            onSubmit()
            setAuthAction(AuthStatus.none)
          }}
        >
          Login
        </Button>
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
