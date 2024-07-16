import { FaUserCircle } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle
} from './ui/alert-dialog'
import { useState } from 'react'
import { IoMdClose } from 'react-icons/io'
import { MdOutlineEmail } from 'react-icons/md'
import { MdOutlineAccountCircle } from 'react-icons/md'
import { MdOutlinePassword } from 'react-icons/md'
import { cn } from '@/lib/utils'

export default function Header() {
  const [authAction, setAuthAction] = useState<
    | 'none'
    | 'login'
    | 'signUp'
    | 'verifyEmail'
    | 'forgetPassword'
    | 'forgetPasswordResetEmail'
  >('none')
  const isLogin = false

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
              if (authAction === 'login') {
                setAuthAction('none')
              } else {
                setAuthAction('login')
              }
            }}
          >
            Login
          </Button>
          <Button
            className="w-[120px]"
            onClick={() => {
              if (authAction === 'signUp') {
                setAuthAction('none')
              } else {
                setAuthAction('signUp')
              }
            }}
          >
            Sign up
          </Button>
          <AlertDialog
            open={authAction !== 'none'}
            onOpenChange={(isOpen) => {
              if (!isOpen) {
                setAuthAction('none')
              } else {
                setAuthAction('signUp')
              }
            }}
          >
            <AlertDialogContent
              className={cn('w-[414px]', {
                'p-0 hidden': authAction === 'none'
              })}
            >
              <AlertDialogHeader className="hidden">
                <AlertDialogTitle></AlertDialogTitle>
              </AlertDialogHeader>
              {authAction === 'signUp' && (
                <div className="flex flex-col">
                  <button
                    className="ml-auto flex size-8 items-center justify-center rounded-full border border-[#EBEBEB]"
                    onClick={() => {
                      setAuthAction('none')
                    }}
                  >
                    <IoMdClose />
                  </button>
                  <img
                    className="mx-auto mb-4 w-[153px]"
                    src="/images/sign-up.svg"
                    alt=""
                  />
                  <div className="space-y-6">
                    <h4 className="text-center text-2xl font-medium text-[#4c4c4c]">
                      Sign Up
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
                          <MdOutlineAccountCircle className=" text-2xl text-[#4C4C4C]" />
                        </div>
                        <input
                          className="w-full rounded-lg border border-[#ebebeb] px-3 py-2 pl-11 text-base outline-none disabled:bg-[#ebebeb] disabled:text-[#9A9A9A]"
                          type="text"
                          placeholder="Username"
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
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => {
                        setAuthAction('verifyEmail')
                      }}
                    >
                      Continue
                    </Button>
                  </div>
                  <p className="mt-6 text-center text-base">
                    <span className="text-[#4c4c4c]">
                      Already have an account?{' '}
                    </span>
                    <span
                      className="cursor-pointer text-earth-green"
                      onClick={() => {
                        setAuthAction('login')
                      }}
                    >
                      Login
                    </span>
                  </p>
                </div>
              )}
              {authAction === 'login' && (
                <div className="flex flex-col">
                  <button
                    className="ml-auto flex size-8 items-center justify-center rounded-full border border-[#EBEBEB]"
                    onClick={() => {
                      setAuthAction('none')
                    }}
                  >
                    <IoMdClose />
                  </button>
                  <img
                    className="mx-auto mb-4 w-[153px]"
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
                        <p
                          className=" inline-block cursor-pointer text-sm text-earth-green"
                          onClick={() => {
                            setAuthAction('forgetPassword')
                          }}
                        >
                          Forgot Password?
                        </p>
                      </div>
                    </div>
                    <Button className="w-full">Login</Button>
                  </div>
                  <p className="mt-6 text-center text-base">
                    <span className="text-[#4c4c4c]">
                      Already have an account?{' '}
                    </span>
                    <span
                      className="cursor-pointer text-earth-green"
                      onClick={() => {
                        setAuthAction('signUp')
                      }}
                    >
                      Sign up
                    </span>
                  </p>
                </div>
              )}
              {authAction === 'verifyEmail' && (
                <div className="flex flex-col">
                  <button
                    className="ml-auto flex size-8 items-center justify-center rounded-full border border-[#EBEBEB]"
                    onClick={() => {
                      setAuthAction('none')
                    }}
                  >
                    <IoMdClose />
                  </button>
                  <img
                    className="mx-auto mb-4 w-[153px]"
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
                          All new sign-ups need to be verified for security
                          purposes. A verification email has been sent to{' '}
                        </span>
                        <span className="w-[366px] shrink-0 grow-0 self-stretch text-center text-base font-bold text-[#4c4c4c]">
                          john@email.com
                        </span>
                        <span className="w-[366px] shrink-0 grow-0 self-stretch text-center text-base text-[#4c4c4c]">
                          .{' '}
                        </span>
                      </p>
                    </div>
                    <Button className="w-full">
                      Resend verification email
                    </Button>
                  </div>
                </div>
              )}
              {authAction === 'forgetPassword' && (
                <div className="flex flex-col">
                  <button
                    className="ml-auto flex size-8 items-center justify-center rounded-full border border-[#EBEBEB]"
                    onClick={() => {
                      setAuthAction('none')
                    }}
                  >
                    <IoMdClose />
                  </button>
                  <img
                    className="mx-auto mb-4 w-[153px]"
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
                          setAuthAction('forgetPasswordResetEmail')
                        }}
                      >
                        Continue
                      </Button>
                      <Button
                        className="w-full"
                        variant="white"
                        onClick={() => {
                          setAuthAction('login')
                        }}
                      >
                        Back
                      </Button>
                    </div>
                  </div>
                  <p className="mt-6 text-center text-base">
                    <span className="text-[#4c4c4c]">
                      Already have an account?{' '}
                    </span>
                    <span
                      className="cursor-pointer text-earth-green"
                      onClick={() => {
                        setAuthAction('signUp')
                      }}
                    >
                      Sign up
                    </span>
                  </p>
                </div>
              )}
              {authAction === 'forgetPasswordResetEmail' && (
                <div className="flex flex-col">
                  <button
                    className="ml-auto flex size-8 items-center justify-center rounded-full border border-[#EBEBEB]"
                    onClick={() => {
                      setAuthAction('none')
                    }}
                  >
                    <IoMdClose />
                  </button>
                  <img
                    className="mx-auto mb-4 w-[153px]"
                    src="/images/forget-password.svg"
                    alt="forget-password"
                  />
                  <div className="space-y-6">
                    <h4 className="text-center text-2xl font-medium text-[#4c4c4c]">
                      Forgot Password
                    </h4>
                    <div>
                      <p className="w-[366px] shrink-0 grow-0 self-stretch text-center text-base text-[#4c4c4c]">
                        <span className="w-[366px] shrink-0 grow-0 self-stretch text-center text-base text-[#4c4c4c]">
                          We’ve sent instructions on how to reset your password
                          to{' '}
                        </span>
                        <span className="w-[366px] shrink-0 grow-0 self-stretch text-center text-base font-bold text-[#4c4c4c]">
                          john@email.com
                        </span>
                        <span className="w-[366px] shrink-0 grow-0 self-stretch text-center text-base text-[#4c4c4c]">
                          .{' '}
                        </span>
                      </p>
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => {
                        setAuthAction('none')
                      }}
                    >
                      Got it
                    </Button>
                  </div>
                </div>
              )}
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
      {isLogin && (
        <button className="flex size-10 items-center justify-center">
          <FaUserCircle className="size-8 text-earth-green" />
        </button>
      )}
    </header>
  )
}
