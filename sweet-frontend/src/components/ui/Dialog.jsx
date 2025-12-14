import React from 'react'
import { cn } from '../../lib/utils'
import { X } from 'lucide-react'

export const Dialog = ({
  open,
  onOpenChange,
  children,
  className
}) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50" 
        onClick={() => onOpenChange?.(false)}
      />
      <div className={cn(
        'fixed z-50 w-full max-w-lg rounded-lg bg-white p-6 shadow-lg',
        'animate-in fade-in-0 zoom-in-95',
        className
      )}>
        {children}
      </div>
    </div>
  )
}

export const DialogContent = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn('relative', className)}
      {...props}
    >
      {children}
    </div>
  )
})

DialogContent.displayName = 'DialogContent'

export const DialogHeader = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)}
      {...props}
    >
      {children}
    </div>
  )
})

DialogHeader.displayName = 'DialogHeader'

export const DialogTitle = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => {
  return (
    <h2
      ref={ref}
      className={cn('text-lg font-semibold leading-none tracking-tight', className)}
      {...props}
    >
      {children}
    </h2>
  )
})

DialogTitle.displayName = 'DialogTitle'

export const DialogDescription = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => {
  return (
    <p
      ref={ref}
      className={cn('text-sm text-gray-500', className)}
      {...props}
    >
      {children}
    </p>
  )
})

DialogDescription.displayName = 'DialogDescription'

export const DialogClose = React.forwardRef(({
  className,
  children,
  onClick,
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        'absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity',
        'hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children || <X className="h-4 w-4" />}
    </button>
  )
})

DialogClose.displayName = 'DialogClose'