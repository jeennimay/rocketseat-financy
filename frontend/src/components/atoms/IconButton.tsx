import { type ButtonHTMLAttributes } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode
  variant?: 'default' | 'danger'
}

const variants = {
  default: 'text-gray-400 hover:border-blue-200 hover:text-blue-500',
  danger:  'text-gray-400 hover:border-red-200 hover:text-red-500',
}

export function IconButton({ icon, variant = 'default', className = '', ...rest }: Props) {
  return (
    <button
      className={`rounded-lg border border-gray-200 p-1.5 transition-colors ${variants[variant]} ${className}`}
      {...rest}
    >
      {icon}
    </button>
  )
}
