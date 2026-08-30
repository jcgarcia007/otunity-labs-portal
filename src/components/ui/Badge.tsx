import { cn } from '@/lib/utils'
import { HTMLAttributes } from 'react'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'brand' | 'gray' | 'warning'
}

export function Badge({ variant = 'gray', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
        {
          'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400':
            variant === 'success',
          'bg-brand-light text-brand dark:bg-brand/20':
            variant === 'brand',
          'bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300':
            variant === 'gray',
          'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400':
            variant === 'warning',
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
