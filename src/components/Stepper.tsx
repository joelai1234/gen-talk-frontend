import { cn } from '@/lib/utils'
import React, { ReactElement } from 'react'

interface StepProps {
  step: string
  onClick?: () => void
  active?: boolean
  children: React.ReactNode
  disabled?: boolean
  index?: number
}

export const Step: React.FC<StepProps> = ({
  step,
  onClick,
  disabled,
  active,
  children,
  index
}) => {
  return (
    <div
      className={cn('flex cursor-pointer items-center gap-4', {
        'cursor-default': disabled || onClick === undefined
      })}
      onClick={() => {
        if (disabled) return
        onClick?.()
      }}
    >
      <div
        className={cn(
          'flex size-8 items-center justify-center rounded-full border border-[#9a9a9a] text-center text-base text-[#9a9a9a]',
          { 'border-none text-white bg-[#6a8f6b]': active }
        )}
      >
        {index}
      </div>
      <div className="text-[#9a9a9a]">{children}</div>
    </div>
  )
}

interface StepLabelProps {
  children: React.ReactNode
}

export const StepLabel: React.FC<StepLabelProps> = ({ children }) => {
  return <p>{children}</p>
}

interface StepperProps {
  activeStep: string
  children: ReactElement<StepProps> | ReactElement<StepProps>[]
}

export const Stepper: React.FC<StepperProps> = ({ activeStep, children }) => {
  const steps = React.Children.toArray(children).map((child, index) => (
    <React.Fragment key={index}>
      {React.isValidElement(child) &&
        React.cloneElement(child as ReactElement<StepProps>, {
          active: (child as ReactElement<StepProps>).props.step === activeStep,
          index: index + 1
        })}
      {index < React.Children.count(children) - 1 && (
        <div className="my-1.5 ml-4 h-3 w-[2px] bg-white" />
      )}
    </React.Fragment>
  ))

  return <div>{steps}</div>
}
