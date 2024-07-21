import { FaUserCircle } from 'react-icons/fa'
import { Link, useSearchParams } from 'react-router-dom'
import { Button } from './ui/button'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle
} from './ui/alert-dialog'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/services/useAuth'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { FaRegUser } from 'react-icons/fa'
import { MdLogout } from 'react-icons/md'
import { AuthStatus } from '@/enum/auth'
import SignInBlock from './auth/SignInBlock'
import SignUpBlock from './auth/SignUpBlock'
import ResendSignUpVerificationEmailBlock from './auth/ResendSignUpVerificationEmailBlock'
import ForgetPasswordBlock from './auth/ForgetPasswordBlock'
import ForgetPasswordSentEmailBlock from './auth/ForgetPasswordSentEmailBlock'
import VerifyEmailSuccessBlock from './auth/VerifyEmailSuccessBlock'
import ResendVerifyEmailBlock from './auth/ResendVerifyEmailBlock'

export default function Header() {
  const { isLogin, signIn, signOut } = useAuth()
  const [searchParams] = useSearchParams()
  const action = searchParams.get('action') as AuthStatus
  const [authAction, setAuthAction] = useState<AuthStatus>(
    action || AuthStatus.none
  )

  return (
    <header className="flex items-center justify-between px-6 py-2">
      <Link to="/chatbot">
        <div className="flex items-center gap-2">
          <img src="/images/logo.png" alt="logo" />
          <h1 className=" text-2xl text-earth-green">GenTalk</h1>
        </div>
      </Link>
      {!isLogin && (
        <div className="space-x-2">
          <Button
            className="w-[120px]"
            variant="white"
            onClick={() => {
              if (authAction === AuthStatus.login) {
                setAuthAction(AuthStatus.none)
              } else {
                setAuthAction(AuthStatus.login)
              }
            }}
          >
            Login
          </Button>
          <Button
            className="w-[120px]"
            onClick={() => {
              if (authAction === AuthStatus.signUp) {
                setAuthAction(AuthStatus.none)
              } else {
                setAuthAction(AuthStatus.signUp)
              }
            }}
          >
            Sign up
          </Button>
          <AlertDialog
            open={authAction !== AuthStatus.none}
            onOpenChange={(isOpen) => {
              if (!isOpen) {
                setAuthAction(AuthStatus.none)
              } else {
                setAuthAction(AuthStatus.signUp)
              }
            }}
          >
            <AlertDialogContent
              className={cn('w-[414px]', {
                'p-0 hidden': authAction === AuthStatus.none
              })}
            >
              <AlertDialogHeader className="hidden">
                <AlertDialogTitle></AlertDialogTitle>
              </AlertDialogHeader>
              {authAction === AuthStatus.signUp && (
                <SignUpBlock
                  setAuthAction={setAuthAction}
                  onSubmit={() => {}}
                />
              )}
              {authAction === AuthStatus.login && (
                <SignInBlock setAuthAction={setAuthAction} onSubmit={signIn} />
              )}
              {authAction === AuthStatus.resendSignUpVerificationEmail && (
                <ResendSignUpVerificationEmailBlock
                  setAuthAction={setAuthAction}
                />
              )}
              {authAction === AuthStatus.forgetPassword && (
                <ForgetPasswordBlock setAuthAction={setAuthAction} />
              )}
              {authAction === AuthStatus.forgetPasswordSentEmail && (
                <ForgetPasswordSentEmailBlock setAuthAction={setAuthAction} />
              )}
              {authAction === AuthStatus.verifyEmailSuccess && (
                <VerifyEmailSuccessBlock setAuthAction={setAuthAction} />
              )}
              {authAction === AuthStatus.resendVerifyEmail && (
                <ResendVerifyEmailBlock setAuthAction={setAuthAction} />
              )}
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
      {isLogin && (
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex size-10 items-center justify-center">
              <FaUserCircle className="size-8 text-earth-green" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="mr-6 w-[200px] p-0">
            <div className="flex items-center gap-4 px-4 pt-4">
              <div>
                <FaUserCircle className="size-8 text-earth-green" />
              </div>
              <div>
                <p className="text-base text-[#4c4c4c]">Username</p>
                <p className="text-sm text-[#4c4c4c]">xxxxx@email.com</p>
              </div>
            </div>
            <div className="mx-4 my-[10px] h-px w-full bg-[#EBEBEB]"></div>
            <div className="pb-4">
              <div className="relative flex cursor-pointer items-center gap-3 px-6 py-1 hover:bg-[#ebebeb]">
                <FaRegUser />
                <p className="text-base text-[#4c4c4c]">Settings</p>
              </div>
              <div
                className="relative flex cursor-pointer items-center gap-3 px-6 py-1 hover:bg-[#ebebeb]"
                onClick={() => {
                  signOut()
                }}
              >
                <MdLogout />
                <p className="text-base text-[#4c4c4c]">Logout</p>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </header>
  )
}
