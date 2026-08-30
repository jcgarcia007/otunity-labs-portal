import { Suspense } from 'react'
import { getSolutionsWithSubscriptions } from '@/services/subscriptions'
import { MetricsBar } from '@/components/dashboard/MetricsBar'
import { SolutionCard } from '@/components/dashboard/SolutionCard'

export default async function DashboardPage() {
  const solutions = await getSolutionsWithSubscriptions()

  return (
    <div className="flex flex-col gap-8">
      {/* Hero */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
          Una cuenta. Todas las soluciones.
        </h1>
        <p className="mt-2 text-base text-gray-400 dark:text-gray-500">
          Contrata las herramientas que necesita tu negocio y gestiónalas desde un solo lugar.
        </p>
      </div>

      {/* Métricas */}
      <Suspense fallback={null}>
        <MetricsBar />
      </Suspense>

      {/* Catálogo */}
      {solutions.length === 0 ? (
        <p className="text-center text-sm text-gray-400">
          No hay soluciones disponibles en este momento.
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {solutions.map((sol) => (
            <SolutionCard key={sol.id} solution={sol} />
          ))}
        </div>
      )}
    </div>
  )
}
