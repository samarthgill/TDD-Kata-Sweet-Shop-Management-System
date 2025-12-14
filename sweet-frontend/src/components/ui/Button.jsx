import React from 'react'
import { cn } from '../../lib/utils'
import { Loader2 } from 'lucide-react'

export const Button = React.forwardRef(({
  children,
  className,
  variant = 'default',
  size = 'default',
  isLoading = false,
  disabled,
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
  
  const variants = {
    default: 'bg-primary-600 text-white hover:bg-primary-700',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    outline: 'border border-gray-300 bg-transparent hover:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'hover:bg-gray-100',
  }

  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-8 rounded-md px-3 text-xs',
    lg: 'h-12 rounded-md px-8',
    icon: 'h-10 w-10',
  }

  return (
    <button
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
})

Button.displayName = 'Button'