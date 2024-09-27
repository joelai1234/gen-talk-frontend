import { cn } from '@/lib/utils'
import React, { ReactElement } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'

interface StepProps {
  step: string
  onClick?: () => void
  active?: boolean
  children: React.ReactNode
  disabled?: boolean
  index?: number
}

export const Step: React.FC<StepProps> = ({
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
          'hidden sm:flex size-8 items-center justify-center rounded-full border border-[#9a9a9a] text-center text-base text-[#9a9a9a] ',
          { 'border-none text-white bg-[#6a8f6b]': active }
        )}
      >
        {index}
      </div>
      <div
        className={cn('whitespace-nowrap text-[#9a9a9a] relative', {
          'text-black': active
        })}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type === StepLabel) {
            return child
          }
          return null
        })}
        <div className="absolute -bottom-5">
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child) && child.type === StepDescription) {
              return child
            }
            return null
          })}
        </div>
      </div>
    </div>
  )
}

interface StepLabelProps {
  children: React.ReactNode
}

export const StepLabel: React.FC<StepLabelProps> = ({ children }) => {
  return <p>{children}</p>
}

interface StepDescriptionProps {
  children: React.ReactNode
}

export const StepDescription: React.FC<StepDescriptionProps> = ({
  children
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <p className="max-w-[80px] overflow-hidden text-ellipsis text-sm sm:max-w-[120px]">
            {children}
          </p>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">{children}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
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
        <div className="mx-2 h-px w-full bg-white sm:my-1.5 sm:ml-4 sm:h-5 sm:w-[2px]" />
      )}
    </React.Fragment>
  ))

  return (
    <div className="flex items-center justify-between sm:block">{steps}</div>
  )
}
