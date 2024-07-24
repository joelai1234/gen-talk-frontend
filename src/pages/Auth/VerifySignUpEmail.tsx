import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

export default function VerifySignUpEmail() {
  const navigate = useNavigate()
  return (
    <div className="flex h-[calc(100vh-60px)] items-center justify-center px-4 pb-16 pt-6 sm:px-16">
      <div className="relative w-[600px] rounded-[28px] bg-white px-20 py-8">
        <div className="space-y-8">
          <div className="flex items-center gap-2">
            <img src="/images/logo2.svg" alt="logo" />
            <h1 className="text-2xl text-earth-green">GenTalk</h1>
          </div>
          <div className="space-y-5">
            <p className="text-2xl font-medium text-[#666]">
              Verify your email
            </p>
            <p className="text-base text-[#666]">
              Thanks for signing up for GenTalk! Please click the button below
              to confirm your email address.
            </p>
          </div>
          <Button
            className="px-6"
            variant="default"
            onClick={() => navigate('/chatbot?action=verifyEmailSuccess')}
          >
            Verify Email
          </Button>
        </div>
      </div>
    </div>
  )
}
