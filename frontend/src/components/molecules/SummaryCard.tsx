interface Props {
  label: string
  value: string | number
  icon: React.ReactNode
  /** Classe de fundo do container do ícone. Passe "" para exibir o ícone sem container. */
  iconBg?: string
  /** Formato do container — 'rounded-full' (círculo) ou 'rounded-lg' (quadrado arredondado). */
  iconShape?: 'rounded-full' | 'rounded-lg'
}

export function SummaryCard({
  label,
  value,
  icon,
  iconBg = 'bg-gray-100',
  iconShape = 'rounded-full',
}: Props) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex items-center gap-3">
        {iconBg ? (
          <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center ${iconShape} ${iconBg}`}>
            {icon}
          </div>
        ) : (
          <span className="flex-shrink-0">{icon}</span>
        )}
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</span>
      </div>
      <p className="mt-4 text-3xl font-bold text-gray-900">{value}</p>
    </div>
  )
}
