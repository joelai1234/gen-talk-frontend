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
          'bg-earth-green text-white hover:bg-[#4D674E] disabled:bg-[#7E907E] disabled:text-[#C9C9C9]',
        secondary:
          'bg-transparent text-[#4C4C4C] hover:bg-[#EBEBEB] disabled:bg-transparent disabled:text-[#9A9A9A]',
        warning:
          'text-slate-900 underline-offset-4 hover:underline dark:text-slate-50',
        'waring-secondary':
          'text-slate-900 underline-offset-4 hover:underline dark:text-slate-50'
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
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
