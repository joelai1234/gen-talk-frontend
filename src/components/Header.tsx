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
import { MdLogout, MdOutlinePassword } from 'react-icons/md'
import { AuthStatus } from '@/enum/auth'
import SignInBlock from './auth/SignInBlock'
import SignUpBlock from './auth/SignUpBlock'
import ResendSignUpVerificationEmailBlock from './auth/ResendSignUpVerificationEmailBlock'
import ForgetPasswordBlock from './auth/ForgetPasswordBlock'
import ForgetPasswordSentEmailBlock from './auth/ForgetPasswordSentEmailBlock'
import VerifyEmailSuccessBlock from './auth/VerifyEmailSuccessBlock'
import ResendVerifyEmailBlock from './auth/ResendVerifyEmailBlock'
import { SettingModalType } from '@/enum/settings'
import { IoMdClose } from 'react-icons/io'
import { LuUpload } from 'react-icons/lu'
import { IoMdEyeOff } from 'react-icons/io'
import { IoMdEye } from 'react-icons/io'

export default function Header() {
  const { isLogin, signIn, signOut } = useAuth()
  const [searchParams] = useSearchParams()
  const action = searchParams.get('action') as AuthStatus
  const [authAction, setAuthAction] = useState<AuthStatus>(
    action || AuthStatus.none
  )
  const [settingModalType, setSettingModalType] = useState<SettingModalType>(
    SettingModalType.none
  )

  const [showPassword, setShowPassword] = useState(false)

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
          <AlertDialog open={authAction !== AuthStatus.none}>
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
        <>
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
                <div
                  className="relative flex cursor-pointer items-center gap-3 px-6 py-1 hover:bg-[#ebebeb]"
                  onClick={() => {
                    setSettingModalType(SettingModalType.setting)
                  }}
                >
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
          <AlertDialog open={settingModalType !== SettingModalType.none}>
            <AlertDialogContent
              className={cn('w-[414px]', {
                'p-0 hidden': settingModalType === SettingModalType.none
              })}
            >
              <AlertDialogHeader className="hidden">
                <AlertDialogTitle></AlertDialogTitle>
              </AlertDialogHeader>
              {settingModalType === SettingModalType.setting && (
                <div className="flex flex-col">
                  <button
                    className="ml-auto flex size-8 items-center justify-center rounded-full border border-[#EBEBEB]"
                    onClick={() => {
                      setSettingModalType(SettingModalType.none)
                    }}
                  >
                    <IoMdClose />
                  </button>
                  <div className="flex flex-col gap-4 pb-4">
                    <h4 className="text-center text-2xl font-medium text-[#4c4c4c]">
                      Settings
                    </h4>
                    <div className="flex flex-col items-center gap-2">
                      <FaUserCircle className="size-20 text-earth-green" />
                      <button className="flex items-center gap-2 text-sm text-earth-green">
                        <LuUpload />
                        <span>Upload image</span>
                      </button>
                    </div>
                    <div className="mt-5">
                      <div>
                        <div className="flex items-center ">
                          <p className="w-[108px] shrink-0 text-base text-[#9a9a9a]">
                            Username
                          </p>
                          <p className="text-base text-[#4c4c4c]">John</p>
                        </div>
                      </div>
                      <div className="my-6 h-px w-full bg-[#ebebeb]" />
                      <div>
                        <div className="flex items-center ">
                          <p className="w-[108px] shrink-0 text-base text-[#9a9a9a]">
                            Email
                          </p>
                          <p className="text-base text-[#4c4c4c]">
                            john@email.com
                          </p>
                        </div>
                      </div>
                      <div className="my-6 h-px w-full bg-[#ebebeb]" />
                      <div>
                        <div className="flex items-center">
                          <p className="w-[108px] shrink-0 text-base text-[#9a9a9a]">
                            Password
                          </p>
                          <div className="flex w-full items-center justify-between">
                            <p className="text-base text-[#4c4c4c]">
                              {showPassword ? 'test1234' : '********'}
                            </p>
                            <div className="flex items-center gap-4">
                              <div
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <IoMdEye className="cursor-pointer" />
                                ) : (
                                  <IoMdEyeOff className="cursor-pointer" />
                                )}
                              </div>
                              <button
                                className="text-left text-sm text-earth-green"
                                onClick={() => {
                                  setSettingModalType(
                                    SettingModalType.updatePassword
                                  )
                                }}
                              >
                                Update
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {settingModalType === SettingModalType.updatePassword && (
                <div className="flex flex-col">
                  <button
                    className="ml-auto flex size-8 items-center justify-center rounded-full border border-[#EBEBEB]"
                    onClick={() => {
                      setSettingModalType(SettingModalType.none)
                    }}
                  >
                    <IoMdClose />
                  </button>
                  <div className="flex flex-col gap-4">
                    <h4 className="text-center text-2xl font-medium text-[#4c4c4c]">
                      Update Password
                    </h4>
                    <div className="mt-3 space-y-4">
                      <div className="relative">
                        <div className=" pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <MdOutlinePassword className=" text-2xl text-[#4C4C4C]" />
                        </div>
                        <input
                          className="w-full rounded-lg border border-[#ebebeb] px-3 py-2 pl-11 text-base outline-none disabled:bg-[#ebebeb] disabled:text-[#9A9A9A]"
                          type="password"
                          placeholder="Current password"
                        />
                      </div>
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
                    <div className="ml-auto flex gap-4">
                      <Button
                        className="w-[100px]"
                        variant="waring-secondary"
                        onClick={() => {
                          setSettingModalType(SettingModalType.setting)
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="w-[100px]"
                        onClick={() => {
                          setSettingModalType(SettingModalType.none)
                        }}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </header>
  )
}
