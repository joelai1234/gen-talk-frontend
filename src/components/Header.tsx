import { FaUserCircle } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from './ui/alert-dialog'
import { useState } from 'react'
import { IoMdClose } from 'react-icons/io'
import { MdOutlineEmail } from 'react-icons/md'
import { MdOutlineAccountCircle } from 'react-icons/md'
import { MdOutlinePassword } from 'react-icons/md'

export default function Header() {
  const [openSignUpDialog, setOpenSignUpDialog] = useState(false)
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
          <Button className="w-[120px]" variant="white">
            Login
          </Button>
          <AlertDialog
            open={openSignUpDialog}
            onOpenChange={setOpenSignUpDialog}
          >
            <AlertDialogTrigger asChild>
              <Button className="w-[120px]">Sign up</Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="w-[414px]">
              <AlertDialogHeader className="hidden">
                <AlertDialogTitle>Delete Persona</AlertDialogTitle>
              </AlertDialogHeader>
              <div className="flex flex-col">
                <button
                  className="ml-auto flex size-8 items-center justify-center rounded-full border border-[#EBEBEB]"
                  onClick={() => {
                    setOpenSignUpDialog(false)
                  }}
                >
                  <IoMdClose />
                </button>
                <img
                  className="mx-auto w-[153px]"
                  src="/public/images/sign-up.svg"
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
                  <Button className="w-full">Continue</Button>
                </div>
                <p className="mt-6 text-center text-base">
                  <span className="text-[#4c4c4c]">
                    Already have an account?{' '}
                  </span>
                  <span className="cursor-pointer text-earth-green">Login</span>
                </p>
              </div>
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
