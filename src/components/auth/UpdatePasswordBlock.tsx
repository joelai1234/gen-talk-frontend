import { SettingModalType } from '@/enum/settings'

import { Button } from '@/components/ui/button'
import { IoMdClose } from 'react-icons/io'
import { MdOutlinePassword } from 'react-icons/md'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { updatePassword } from '@/apis/auth'
import { useAuth } from '@/services/auth/hooks/useAuth'
import { UpdatePasswordPayload } from '@/apis/model/auth'
import { ErrorResponse } from '@/apis/model/commen'

interface UpdatePasswordBlockProps {
  setSettingModalType: (type: SettingModalType) => void
}

type UpdatePasswordInputs = {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

export default function UpdatePasswordBlock({
  setSettingModalType
}: UpdatePasswordBlockProps) {
  const { authAxios } = useAuth()
  const updatePasswordMutation = useMutation({
    mutationFn: (payload: UpdatePasswordPayload) => {
      return updatePassword(authAxios!)(payload)
    }
  })

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<UpdatePasswordInputs>()

  const onSubmit: SubmitHandler<UpdatePasswordInputs> = async (data) => {
    updatePasswordMutation.mutate(
      {
        new_password: data.newPassword,
        old_password: data.oldPassword
      },
      {
        onSuccess: () => {
          setSettingModalType(SettingModalType.none)
        }
      }
    )
  }

  const errorMessageDetail = (
    updatePasswordMutation.error as unknown as ErrorResponse
  )?.response?.data?.detail

  let errorMessage = ''
  if (typeof errorMessageDetail === 'string') {
    errorMessage = errorMessageDetail
  } else if (
    Array.isArray(errorMessageDetail) &&
    errorMessageDetail.every((item) => typeof item.msg === 'string')
  ) {
    errorMessage = errorMessageDetail[0].msg
  }

  return (
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
              {...register('oldPassword', {
                required: 'Current password is required'
              })}
            />
            <p className="text-sm text-red-500">
              {errors.oldPassword?.message}
            </p>
          </div>

          <div className="relative">
            <div className=" pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MdOutlinePassword className=" text-2xl text-[#4C4C4C]" />
            </div>
            <input
              className="w-full rounded-lg border border-[#ebebeb] px-3 py-2 pl-11 text-base outline-none disabled:bg-[#ebebeb] disabled:text-[#9A9A9A]"
              type="password"
              placeholder="New password"
              {...register('newPassword', {
                required: 'New password is required'
              })}
            />
            <p className="text-sm text-red-500">
              {errors.newPassword?.message}
            </p>
          </div>
          <div className="relative">
            <div className=" pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MdOutlinePassword className=" text-2xl text-[#4C4C4C]" />
            </div>
            <input
              className="w-full rounded-lg border border-[#ebebeb] px-3 py-2 pl-11 text-base outline-none disabled:bg-[#ebebeb] disabled:text-[#9A9A9A]"
              type="password"
              placeholder="Confirm password"
              {...register('confirmPassword', {
                required: 'Confirm password is required'
              })}
            />
            <p className="text-sm text-red-500">
              {errors.confirmPassword?.message}
            </p>
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
            onClick={handleSubmit(onSubmit)}
            isLoading={updatePasswordMutation.isPending}
          >
            Save
          </Button>
        </div>
        <p className="text-red-500">{errorMessage}</p>
      </div>
    </div>
  )
}
