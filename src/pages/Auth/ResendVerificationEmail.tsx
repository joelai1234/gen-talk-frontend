import { Button } from '@/components/ui/button'

export default function ResendVerificationEmail() {
  return (
    <div className="flex h-[calc(100vh-60px)] items-center justify-center px-4 pb-16 pt-6 sm:px-16">
      <div className="relative w-[414px] rounded-[28px] bg-white p-6">
        <div className="flex flex-col pt-6">
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
            <Button className="w-full">Resend verification email</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
