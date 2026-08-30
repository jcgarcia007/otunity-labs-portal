import { getOwnerMetrics } from '@/services/subscriptions'
import { formatPrecio } from '@/lib/utils'
import { CheckCircle, DollarSign } from 'lucide-react'

export async function MetricsBar() {
  const { activas, gastoMensual } = await getOwnerMetrics()

  const metrics = [
    {
      icon: CheckCircle,
      label: 'Soluciones activas',
      value: activas.toString(),
      color: 'text-emerald-600',
    },
    {
      icon: DollarSign,
      label: 'Gasto mensual',
      value: gastoMensual > 0 ? formatPrecio(gastoMensual) + '/mes' : '--',
      color: 'text-brand',
    },
  ]

  if (activas === 0) return null

  return (
    <div className="flex flex-wrap gap-4">
      {metrics.map((m) => (
        <div
          key={m.label}
          className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white px-5 py-3 shadow-sm dark:border-white/8 dark:bg-white/5"
        >
          <m.icon size={18} className={m.color} />
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-500">{m.label}</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{m.value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
