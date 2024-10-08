import { FaUserCircle } from 'react-icons/fa'
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams
} from 'react-router-dom'
import { Button } from './ui/button'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle
} from './ui/alert-dialog'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  Popover,
  PopoverClose,
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
import { SettingModalType } from '@/enum/settings'
import { IoMdClose } from 'react-icons/io'
import { LuUpload } from 'react-icons/lu'
import { IoMdEyeOff } from 'react-icons/io'
import { IoMdEye } from 'react-icons/io'
import { MdOutlineEdit } from 'react-icons/md'
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5'
import { MdConveyorBelt } from 'react-icons/md'
import { useAuth } from '@/services/auth/hooks/useAuth'
import { MdArrowDropDown } from 'react-icons/md'
import ResetPasswordBlock from './auth/ResetPasswordBlock'
import UpdatePasswordBlock from './auth/UpdatePasswordBlock'
import { getMeData } from '@/apis/auth'
import { useQuery } from '@tanstack/react-query'

const getNavTitle = (pathname: string) => {
  if (pathname.includes('/persona')) return 'Chat'

  switch (pathname) {
    case '/chatbot':
      return 'Chat'
    case '/rewrite':
      return 'Rewrite'
    case '/conversation':
      return 'Conversation'
    default:
      return 'Chat'
  }
}

export default function Header() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { isLogin, signOut, userData } = useAuth()
  const [searchParams] = useSearchParams()
  const action = searchParams.get('action') as AuthStatus
  const [authAction, setAuthAction] = useState<AuthStatus>(
    action || AuthStatus.none
  )
  const [settingModalType, setSettingModalType] = useState<SettingModalType>(
    SettingModalType.none
  )

  const { authAxios } = useAuth()

  const { data: meData } = useQuery({
    queryKey: ['getMeData'],
    queryFn: getMeData(authAxios!),
    enabled: !!authAxios
  })

  const [showPassword, setShowPassword] = useState(false)

  return (
    <header className="flex h-[60px] items-center justify-between px-4 py-2 sm:px-6">
      <Link to="/chatbot">
        <div className="flex items-center gap-2">
          <img className="size-8" src="/images/logo.png" alt="logo" />
          <h1 className="hidden text-2xl text-earth-green sm:inline">
            GenTalk
          </h1>
        </div>
      </Link>
      <div className="block sm:hidden">
        <Popover>
          <PopoverTrigger asChild>
            <button className="ml-6 flex items-center gap-2 rounded-xl bg-white px-2.5 py-1.5 text-earth-green sm:ml-0">
              <IoChatbubbleEllipsesOutline />
              <span>{getNavTitle(pathname)}</span>
              <MdArrowDropDown className="ml-auto text-xl" />
            </button>
          </PopoverTrigger>
          <PopoverContent className=" flex w-[180px] flex-col gap-1 rounded-xl px-3 py-2">
            <PopoverClose>
              <button
                className={cn(
                  'flex w-full items-center gap-2 rounded-xl bg-white px-2.5 py-1.5 text-black hover:text-earth-green hover:bg-pale-green transition',
                  { 'text-earth-green bg-pale-green': pathname === '/chatbot' }
                )}
                onClick={() => {
                  navigate('/chatbot')
                }}
              >
                <IoChatbubbleEllipsesOutline />
                <span>Chat</span>
              </button>
            </PopoverClose>
            <PopoverClose>
              <button
                className={cn(
                  'flex w-full items-center gap-2 rounded-xl bg-white px-2.5 py-1.5 text-black hover:text-earth-green hover:bg-pale-green transition',
                  { 'text-earth-green bg-pale-green': pathname === '/rewrite' }
                )}
                onClick={() => {
                  navigate('/rewrite')
                }}
              >
                <MdOutlineEdit />
                <span>Rewrite</span>
              </button>
            </PopoverClose>
            <PopoverClose>
              <button
                className={cn(
                  'flex w-full items-center gap-2 rounded-xl bg-white px-2.5 py-1.5 text-black hover:text-earth-green hover:bg-pale-green transition',
                  {
                    'text-earth-green bg-pale-green':
                      pathname === '/conversation'
                  }
                )}
                onClick={() => {
                  navigate('/conversation')
                }}
              >
                <MdConveyorBelt />
                <span>Conversation</span>
              </button>
            </PopoverClose>
          </PopoverContent>
        </Popover>
      </div>
      <div className="hidden gap-6 sm:flex">
        <Link
          to="/chatbot"
          className={cn(
            'flex items-center gap-2 rounded-xl px-2.5 py-1 text-[#9a9a9a] transition hover:bg-white hover:text-earth-green',
            { 'bg-white text-earth-green': pathname === '/chatbot' }
          )}
        >
          <IoChatbubbleEllipsesOutline />
          <span>Chat</span>
        </Link>
        <Link
          to="/rewrite"
          className={cn(
            'flex items-center gap-2 rounded-xl px-2.5 py-1 text-[#9a9a9a] transition hover:bg-white hover:text-earth-green',
            { 'bg-white text-earth-green': pathname === '/rewrite' }
          )}
        >
          <MdOutlineEdit />
          <span>Rewrite</span>
        </Link>
        <Link
          to="/conversation"
          className={cn(
            'flex items-center gap-2 rounded-xl px-2.5 py-1 text-[#9a9a9a] transition hover:bg-white hover:text-earth-green',
            { 'bg-white text-earth-green': pathname === '/conversation' }
          )}
        >
          <MdConveyorBelt />
          <span>Conversation</span>
        </Link>
      </div>
      {!isLogin && (
        <div className="space-x-2">
          <Button
            className="hidden w-[100px] sm:inline-block sm:w-[120px]"
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
            className="h-9 w-[100px] sm:h-auto sm:w-[120px]"
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
                <SignInBlock setAuthAction={setAuthAction} />
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
              {authAction === AuthStatus.resetPassword && (
                <ResetPasswordBlock setAuthAction={setAuthAction} />
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
                  <p className="w-[125px] overflow-hidden text-ellipsis text-base text-[#4c4c4c]">
                    {meData?.data.name}
                  </p>
                  <p className="w-[125px] overflow-hidden text-ellipsis text-sm text-[#4c4c4c]">
                    {userData?.me?.email}
                  </p>
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
              className={cn('w-[368px] sm:w-[414px]', {
                'p-0 hidden': settingModalType === SettingModalType.none
              })}
            >
              <AlertDialogHeader className="hidden">
                <AlertDialogTitle></AlertDialogTitle>
              </AlertDialogHeader>
              {settingModalType === SettingModalType.setting && (
                <div className="flex flex-1 flex-col overflow-hidden">
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
                          <p className="w-[100px] shrink-0 text-base text-[#9a9a9a]">
                            Username
                          </p>
                          <p className="text-base text-[#4c4c4c]">
                            {meData?.data.name}
                          </p>
                        </div>
                      </div>
                      <div className="my-6 h-px w-full bg-[#ebebeb]" />
                      <div>
                        <div className="flex items-center ">
                          <p className="w-[100px] shrink-0 text-base text-[#9a9a9a]">
                            Email
                          </p>
                          <p className="text-base text-[#4c4c4c]">
                            {userData?.me.email}
                          </p>
                        </div>
                      </div>
                      <div className="my-6 h-px w-full bg-[#ebebeb]" />
                      <div>
                        <div className="flex items-center">
                          <p className="w-[100px] shrink-0 text-base text-[#9a9a9a]">
                            Password
                          </p>
                          <div className="flex w-full items-center justify-between">
                            <p className="text-base text-[#4c4c4c]">
                              {showPassword ? 'Test1234.(dev)' : '********'}
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
                <UpdatePasswordBlock
                  setSettingModalType={setSettingModalType}
                />
              )}
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </header>
  )
}
