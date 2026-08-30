'use client'

import { useState } from 'react'
import {
  MapPin, Sparkles, Users, Calculator, Box, Globe,
  CheckCircle2, Settings, type LucideIcon,
} from 'lucide-react'
import { cn, formatPrecio } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { createSubscription } from '@/services/subscriptions'
import type { SolutionWithSubscription } from '@/lib/types'

// Mapa de nombres de ícono (DB) → componente Lucide
const ICON_MAP: Record<string, LucideIcon> = {
  'map-pin': MapPin,
  sparkles: Sparkles,
  users: Users,
  calculator: Calculator,
  box: Box,
  globe: Globe,
}

interface SolutionCardProps {
  solution: SolutionWithSubscription
}

export function SolutionCard({ solution }: SolutionCardProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const Icon = ICON_MAP[solution.icono] ?? Globe
  const isActive = solution.subscription?.estado === 'active'

  async function handleContratar() {
    setLoading(true)
    setError(null)
    const result = await createSubscription(solution.id)
    if (result?.error) setError(result.error)
    setLoading(false)
  }

  return (
    <div
      className={cn(
        'relative flex flex-col rounded-2xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:bg-white/5',
        solution.destacada
          ? 'border-brand dark:border-brand'
          : 'border-gray-100 dark:border-white/8'
      )}
    >
      {/* Badge "Destacada" */}
      {solution.destacada && (
        <div className="absolute -top-3 left-5">
          <Badge variant="brand">⭐ Destacada</Badge>
        </div>
      )}

      {/* Cabecera: ícono + nombre + categoría */}
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-light dark:bg-brand/20">
          <Icon size={22} className="text-brand" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              {solution.nombre}
            </h3>
            {isActive && (
              <Badge variant="success">
                <CheckCircle2 size={11} />
                Activa
              </Badge>
            )}
          </div>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {solution.categoria}
          </span>
        </div>
      </div>

      {/* Descripción */}
      <p className="mt-3 text-sm leading-relaxed text-gray-500 dark:text-gray-400 flex-1">
        {solution.descripcion}
      </p>

      {/* Precio + acción */}
      <div className="mt-4 flex items-center justify-between gap-3">
        <div>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatPrecio(solution.precio_mensual)}
          </span>
          <span className="text-sm text-gray-400">/mes</span>
        </div>

        {isActive ? (
          <Button variant="outline" size="sm" disabled>
            <Settings size={14} />
            Gestionar
          </Button>
        ) : (
          <Button size="sm" loading={loading} onClick={handleContratar}>
            Contratar
          </Button>
        )}
      </div>

      {error && (
        <p className="mt-2 text-xs text-red-500">{error}</p>
      )}
    </div>
  )
}
