import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

export default function SuccessResetPassword() {
  return (
    <div className="flex h-[calc(100vh-60px)] items-center justify-center px-16 pb-16 pt-6">
      <div className="relative w-[414px] rounded-[28px] bg-white p-6">
        <div className="flex flex-col pt-6">
          <img
            className="mx-auto mb-4 h-[83px] w-[153px]"
            src="/images/forget-password.svg"
            alt="forget-password"
          />
          <div className="space-y-6">
            <h4 className="text-center text-2xl font-medium text-[#4c4c4c]">
              Password Reset Successful
            </h4>
            <p className="text-center text-base text-[#4c4c4c]">
              Your password has been reset.
            </p>
            <Link className="block" to="/auth/sign-in">
              <Button className="w-full">Login to your account</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
