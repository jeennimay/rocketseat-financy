interface Props {
  lines?:    number   // quantas linhas renderizar (padrão 1)
  height?:   string   // classe Tailwind ou valor CSS — ex: 'h-4' ou '16px'
  width?:    string   // classe Tailwind ou valor CSS — ex: 'w-full' ou '200px'
  radius?:   string   // classe Tailwind — ex: 'rounded-md', 'rounded-full'
  gap?:      string   // espaçamento entre linhas — ex: 'gap-2', 'gap-3'
  className?: string
}

function isTailwind(value: string) {
  return /^[a-z]/.test(value)
}

export function Skeleton({
  lines     = 1,
  height    = 'h-4',
  width     = 'w-full',
  radius    = 'rounded-md',
  gap       = 'gap-2',
  className = '',
}: Props) {
  const heightClass = isTailwind(height) ? height : ''
  const heightStyle = isTailwind(height) ? undefined : height
  const widthClass  = isTailwind(width)  ? width  : ''
  const widthStyle  = isTailwind(width)  ? undefined : width

  const bar = (key: number) => (
    <div
      key={key}
      className={`animate-pulse bg-gray-200 ${heightClass} ${widthClass} ${radius} ${className}`}
      style={{
        ...(heightStyle ? { height: heightStyle } : {}),
        ...(widthStyle  ? { width:  widthStyle  } : {}),
      }}
    />
  )

  if (lines === 1) return bar(0)

  return (
    <div className={`flex flex-col ${gap}`}>
      {Array.from({ length: lines }, (_, i) => bar(i))}
    </div>
  )
}
