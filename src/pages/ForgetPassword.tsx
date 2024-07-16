import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { MdOutlinePassword } from 'react-icons/md'

export default function ForgetPassword() {
  const [authAction, setAuthAction] = useState<
    'verifyEmail' | 'resetPassword' | 'success'
  >('verifyEmail')
  console.log(setAuthAction)
  return (
    <div className="flex h-[calc(100vh-56px)] items-center justify-center px-16 pb-16 pt-6">
      {authAction === 'verifyEmail' && (
        <div className="relative h-[422px] w-[414px] rounded-[28px] bg-white p-6"></div>
      )}
      {authAction === 'resetPassword' && (
        <div className="relative h-[422px] w-[414px] rounded-[28px] bg-white p-6">
          <div className="flex flex-col pt-6">
            <img
              className="mx-auto mb-4 w-[153px]"
              src="/public/images/forget-password.svg"
              alt=""
            />
            <div className="space-y-6">
              <h4 className="text-center text-2xl font-medium text-[#4c4c4c]">
                Reset Password
              </h4>
              <div className="space-y-3">
                <div className="relative">
                  <div className=" pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <MdOutlinePassword className=" text-2xl text-[#4C4C4C]" />
                  </div>
                  <input
                    className="w-full rounded-lg border border-[#ebebeb] px-3 py-2 pl-11 text-base outline-none disabled:bg-[#ebebeb] disabled:text-[#9A9A9A]"
                    type="password"
                    placeholder="New password"
                  />
                </div>
                <div className="relative">
                  <div className=" pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <MdOutlinePassword className=" text-2xl text-[#4C4C4C]" />
                  </div>
                  <input
                    className="w-full rounded-lg border border-[#ebebeb] px-3 py-2 pl-11 text-base outline-none disabled:bg-[#ebebeb] disabled:text-[#9A9A9A]"
                    type="password"
                    placeholder="Confirm password"
                  />
                </div>
              </div>
              <Button className="w-full">Update password</Button>
            </div>
          </div>
        </div>
      )}
      {authAction === 'success' && <div></div>}
    </div>
  )
}
