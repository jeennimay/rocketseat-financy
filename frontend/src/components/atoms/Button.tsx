import { type ButtonHTMLAttributes } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost'
  loading?: boolean
}

const variants = {
  primary: 'bg-green-700 text-white hover:bg-green-800 disabled:opacity-60',
  outline: 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-60',
  ghost:   'text-gray-500 hover:text-gray-800 hover:bg-gray-50 disabled:opacity-60',
}

export function Button({ variant = 'primary', loading, children, disabled, className = '', ...rest }: Props) {
  return (
    <button
      disabled={disabled || loading}
      className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${variants[variant]} ${className}`}
      {...rest}
    >
      {loading ? 'Carregando...' : children}
    </button>
  )
}
