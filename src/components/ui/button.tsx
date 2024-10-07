import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-base font-normal transition-colors disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default:
          'bg-earth-green text-white hover:bg-[#4D674E] disabled:bg-[#9A9A9A] disabled:text-white',
        secondary:
          'bg-transparent text-[#4C4C4C] hover:bg-[#EBEBEB] disabled:bg-transparent disabled:text-[#9A9A9A]',
        warning: 'bg-[#EA4663] text-white hover:bg-[#B73149]',
        'waring-secondary': 'bg-[#EBEBEB] text-black hover:bg-[#DFDFDF]',
        white: 'bg-white text-earth-green hover:bg-[#eeeeee]'
      },
      size: {
        default: 'p-[10px]',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'size-10'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      children,
      disabled,
      isLoading,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <>
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          disabled={isLoading || disabled}
          {...props}
        >
          <div className="flex items-center justify-center">
            {isLoading && (
              <svg
                className="-ml-1 mr-3 size-5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            <span>{children}</span>
          </div>
        </Comp>
      </>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
