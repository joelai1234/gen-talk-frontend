import { Button } from '@/components/ui/button'
import { MdOutlineEmail, MdOutlinePassword } from 'react-icons/md'
import { Link, useNavigate } from 'react-router-dom'

export default function SignIn() {
  const navigate = useNavigate()

  return (
    <div className="h-[calc(calc(var(--vh)*100-60px)] flex items-center justify-center px-4 pb-16 pt-6 sm:px-16">
      <div className="relative w-[414px] rounded-[28px] bg-white p-6">
        <div className="flex flex-col pt-6">
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
                <div className=" pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
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
              <div className=" flex justify-end">
                <Link to="/auth/forget-password">
                  <p className=" inline-block cursor-pointer text-sm text-earth-green">
                    Forgot Password?
                  </p>
                </Link>
              </div>
            </div>
            <Button
              className="w-full"
              onClick={() => {
                navigate('/')
              }}
            >
              Login
            </Button>
          </div>
          <p className="mt-6 text-center text-base">
            <span className="text-[#4c4c4c]">Already have an account? </span>
            <Link to="/auth/sign-up">
              <span className="cursor-pointer text-earth-green">Sign up</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
