import { Button } from '@/components/ui/button'
import { MdOutlinePassword } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

export default function ResetPassword() {
  const navigate = useNavigate()
  return (
    <div className="flex h-[calc(calc(var(--vh)*100-60px)] items-center justify-center px-4 pb-16 pt-6 sm:px-16">
      <div className="relative w-[414px] rounded-[28px] bg-white p-6">
        <div className="flex flex-col pt-6">
          <img
            className="mx-auto mb-4 h-[83px] w-[153px]"
            src="/images/forget-password.svg"
            alt="forget-password"
          />
          <div className="space-y-6">
            <h4 className="text-center text-2xl font-medium text-[#4c4c4c]">
              Reset Password
            </h4>
            <div className="space-y-3">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <MdOutlinePassword className=" text-2xl text-[#4C4C4C]" />
                </div>
                <input
                  className="w-full rounded-lg border border-[#ebebeb] px-3 py-2 pl-11 text-base outline-none disabled:bg-[#ebebeb] disabled:text-[#9A9A9A]"
                  type="password"
                  placeholder="New password"
                />
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <MdOutlinePassword className=" text-2xl text-[#4C4C4C]" />
                </div>
                <input
                  className="w-full rounded-lg border border-[#ebebeb] px-3 py-2 pl-11 text-base outline-none disabled:bg-[#ebebeb] disabled:text-[#9A9A9A]"
                  type="password"
                  placeholder="Confirm password"
                />
              </div>
            </div>
            <Button
              className="w-full"
              onClick={() => {
                navigate('/auth/reset-password/success')
              }}
            >
              Update password
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
