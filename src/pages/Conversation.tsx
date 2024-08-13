import { Step, StepLabel, Stepper } from '@/components/Stepper'
import { useState } from 'react'

import { TempPersonaData } from '@/model/persona'

import SelectPersonaRole from '@/components/SelectPersonaRole'

enum ConversationStep {
  Role1 = 'Role1',
  Role2 = 'Role2',
  Scenario = 'Scenario',
  Conversation = 'Conversation'
}

export default function Conversation() {
  const [role1, setRole1] = useState<TempPersonaData | null>(null)
  const [activeStep, setActiveStep] = useState<ConversationStep>(
    ConversationStep.Role1
  )

  console.log('role1', role1)

  return (
    <div className="flex min-h-[calc(var(--vh)*100-60px)] pt-6 sm:px-16 sm:pb-16">
      <div className="mx-auto flex w-full max-w-[898px] gap-[120px]">
        <div className="w-[142px]">
          <Stepper activeStep={activeStep}>
            <Step step={ConversationStep.Role1}>
              <StepLabel>Role 1</StepLabel>
            </Step>
            <Step step={ConversationStep.Role2}>
              <StepLabel>Role 2</StepLabel>
            </Step>
            <Step step={ConversationStep.Scenario}>
              <StepLabel>Scenario</StepLabel>
            </Step>
            <Step step={ConversationStep.Conversation}>
              <StepLabel>Conversation</StepLabel>
            </Step>
          </Stepper>
        </div>
        <div className="flex-1">
          <SelectPersonaRole
            onSubmitted={(persona) => {
              setRole1(persona)
              setActiveStep(ConversationStep.Role2)
            }}
          />
        </div>
      </div>
    </div>
  )
}
