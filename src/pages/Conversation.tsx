import { Step, StepDescription, StepLabel, Stepper } from '@/components/Stepper'
import { useState } from 'react'

import { TempPersonaData } from '@/model/persona'

import SelectPersonaRole from '@/components/SelectPersonaRole'
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { IoIosArrowDown } from 'react-icons/io'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { GrPowerReset } from 'react-icons/gr'
import ChatRoom from '@/components/chatRoom/ChatRoom'
import { ChatRoomSender } from '@/enum/persona'
import { sendConversations } from '@/apis/persona'
import { useMutation } from '@tanstack/react-query'
import { useAuth } from '@/services/auth/hooks/useAuth'
import { SendConversationsPayload } from '@/apis/model/persona'

enum ConversationStep {
  Role1 = 'Role1',
  Role2 = 'Role2',
  Scenario = 'Scenario',
  Conversation = 'Conversation'
}

export default function Conversation() {
  const { authAxios } = useAuth()
  const [role1, setRole1] = useState<TempPersonaData>()
  const [role2, setRole2] = useState<TempPersonaData>()
  const [round, setRound] = useState(5)
  const [scenario, setScenario] = useState('')
  const [activeStep, setActiveStep] = useState<ConversationStep>(
    ConversationStep.Role1
  )
  const [messages, setMessages] = useState<
    {
      id: number
      sender: ChatRoomSender
      message: string
    }[]
  >([])
  const sendConversationsMutation = useMutation({
    mutationFn: (payload: SendConversationsPayload) => {
      return sendConversations(authAxios!)(payload)
    },
    onSuccess: (data) => {
      const newMessages = data.data.map((item) => ({
        id: item.id,
        sender:
          item.persona_id === role1?.id
            ? ChatRoomSender.User
            : ChatRoomSender.Bot,
        message: item.message
      }))
      setMessages(newMessages)
    }
  })

  return (
    <div className="flex min-h-[calc(var(--vh)*100-60px)] flex-col pt-6 sm:px-16 sm:pb-16">
      <div className="mx-auto flex size-full max-w-[898px] flex-1 flex-col gap-6 sm:flex-row sm:gap-[120px]">
        <div className="px-6 sm:w-[142px] sm:px-0">
          <Stepper activeStep={activeStep}>
            <Step
              step={ConversationStep.Role1}
              onClick={() => {
                setActiveStep(ConversationStep.Role1)
              }}
            >
              <StepLabel>Role 1</StepLabel>
              <StepDescription>{role1?.name}</StepDescription>
            </Step>
            <Step
              step={ConversationStep.Role2}
              onClick={
                !role1
                  ? undefined
                  : () => {
                      setActiveStep(ConversationStep.Role2)
                    }
              }
            >
              <StepLabel>Role 2</StepLabel>
              <StepDescription>{role2?.name}</StepDescription>
            </Step>
            <Step
              step={ConversationStep.Scenario}
              onClick={
                !role1 || !role2
                  ? undefined
                  : () => {
                      setActiveStep(ConversationStep.Scenario)
                    }
              }
            >
              <StepLabel>Scenario</StepLabel>
              {!(!role1 || !role2) && (
                <StepDescription>{round} rounds</StepDescription>
              )}
            </Step>
            <Step
              step={ConversationStep.Conversation}
              onClick={
                !role1 || !role2 || scenario.length === 0
                  ? undefined
                  : () => {
                      setActiveStep(ConversationStep.Conversation)
                    }
              }
            >
              <StepLabel>Conversation</StepLabel>
            </Step>
          </Stepper>
        </div>
        <div className="flex flex-1 flex-col">
          {activeStep === ConversationStep.Role1 && (
            <SelectPersonaRole
              defaultPersona={role1}
              name="role 1"
              onSubmitted={(persona) => {
                setRole1(persona)
                setActiveStep(ConversationStep.Role2)
              }}
            />
          )}
          {activeStep === ConversationStep.Role2 && (
            <SelectPersonaRole
              defaultPersona={role2}
              name="role 2"
              onSubmitted={(persona) => {
                setRole2(persona)
                setActiveStep(ConversationStep.Scenario)
              }}
              onBack={() => {
                setActiveStep(ConversationStep.Role1)
              }}
            />
          )}
          {activeStep === ConversationStep.Scenario && (
            <div className="flex flex-1 flex-col">
              <div className="flex-1 gap-2 rounded-[20px] border border-[#ebebeb] bg-[#F7F7F7] p-4">
                <div className="space-y-6">
                  <div className="space-y-1">
                    <p className="text-[#4c4c4c]">Conversation</p>
                    <Popover>
                      <PopoverTrigger asChild>
                        <div className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#ebebeb] bg-white px-3 py-2">
                          <p className="text-[#4c4c4c]">{round} round</p>
                          <IoIosArrowDown className="ml-auto" />
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="w-[636px] overflow-hidden rounded-[20px] px-0 py-3">
                        <div className="max-h-[430px] overflow-auto">
                          {Array.from({ length: 10 }, (_, i) => i + 1).map(
                            (n) => (
                              <PopoverClose
                                key={n}
                                className={cn(
                                  'flex w-full cursor-pointer items-center gap-2 px-4 py-2 transition hover:bg-[#f7f7f7]',
                                  {
                                    'border-b border-b-[#EDEDED]': n !== 10
                                  }
                                )}
                                onClick={() => {
                                  setRound(n)
                                }}
                              >
                                <p className="text-[#4c4c4c]">round {n}</p>
                              </PopoverClose>
                            )
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[#4c4c4c]">Scenario</p>
                    <textarea
                      className="w-full rounded-lg border border-[#ebebeb] px-3 py-2 text-base outline-none disabled:bg-[#ebebeb] disabled:text-[#9A9A9A]"
                      placeholder="Describe the scenario, background, side characters, and any other relevant details that will help shape the interaction."
                      rows={9}
                      value={scenario}
                      onChange={(e) => {
                        setScenario(e.target.value)
                      }}
                    />
                  </div>
                </div>
                <div className="flex sm:hidden">
                  <button
                    className="mr-auto text-[#4c4c4c] hover:text-earth-green"
                    onClick={() => {
                      setActiveStep(ConversationStep.Role2)
                    }}
                  >
                    Back
                  </button>
                  <Button
                    className="ml-auto mt-4 block px-4"
                    disabled={scenario.length === 0}
                    onClick={() => {
                      if (!role1 || !role2) {
                        return
                      }
                      sendConversationsMutation.mutate(
                        {
                          persona_id1: role1.id!,
                          persona_id2: role2.id!,
                          rounds: round,
                          scenario
                        },
                        {
                          onSuccess: () => {
                            setActiveStep(ConversationStep.Conversation)
                          }
                        }
                      )
                    }}
                    isLoading={sendConversationsMutation.isPending}
                  >
                    Generate Conversation
                  </Button>
                </div>
              </div>
              <div className="hidden sm:flex">
                <button
                  className="mr-auto text-[#4c4c4c] hover:text-earth-green"
                  onClick={() => {
                    setActiveStep(ConversationStep.Role2)
                  }}
                >
                  Back
                </button>
                <Button
                  className="ml-auto mt-4 px-4 sm:inline-block"
                  disabled={scenario.length === 0}
                  onClick={() => {
                    if (!role1 || !role2) {
                      return
                    }
                    sendConversationsMutation.mutate(
                      {
                        persona_id1: role1.id!,
                        persona_id2: role2.id!,
                        rounds: round,
                        scenario
                      },
                      {
                        onSuccess: () => {
                          setActiveStep(ConversationStep.Conversation)
                        }
                      }
                    )
                  }}
                  // isLoading={true}
                  isLoading={sendConversationsMutation.isPending}
                >
                  Generate Conversation
                </Button>
              </div>
            </div>
          )}
          {activeStep === ConversationStep.Conversation && (
            <div className="flex flex-1 flex-col">
              <div className="flex flex-1 flex-col rounded-t-[20px] border border-[#ebebeb] bg-[#F7F7F7] sm:rounded-b-[20px]">
                <div className="flex justify-between border-b border-[#ebebeb] px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-full border border-[#EBEBEB] bg-white text-xl">
                      {role2?.avatar}
                    </div>
                    <p className="text-[#4c4c4c]">{role2?.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-full border border-[#EBEBEB] bg-white text-xl">
                      {role1?.avatar}
                    </div>
                    <p className="text-[#4c4c4c]">{role1?.name}</p>
                  </div>
                </div>
                <div className="my-1 flex flex-1 flex-col">
                  <div className="h-0 grow overflow-auto pb-20 pt-4 sm:pb-4">
                    <ChatRoom
                      messageColor={role1?.messageColor ?? 'white'}
                      botMessageColor={role2?.messageColor}
                      isLoadingAIMessage={false}
                      messages={messages}
                    />
                  </div>
                </div>
              </div>
              <Button
                className="absolute bottom-5 left-1/2 ml-auto mt-4 flex -translate-x-1/2 gap-2 px-4 sm:static sm:translate-x-0"
                disabled={scenario.length === 0}
                onClick={() => {
                  if (!role1 || !role2) {
                    return
                  }
                  sendConversationsMutation.mutate({
                    persona_id1: role1.id!,
                    persona_id2: role2.id!,
                    rounds: round,
                    scenario
                  })
                }}
                isLoading={sendConversationsMutation.isPending}
              >
                <div className="flex items-center gap-2">
                  {!sendConversationsMutation.isPending && <GrPowerReset />}

                  <span>Restart</span>
                </div>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
