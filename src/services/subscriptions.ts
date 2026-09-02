'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Solution, Subscription, SolutionWithSubscription } from '@/lib/types'

/**
 * Obtiene todas las soluciones con el estado de suscripción del dueño actual.
 * Todas las tablas viven en el schema `otunity` del Supabase de JChat.
 */
export async function getSolutionsWithSubscriptions(): Promise<SolutionWithSubscription[]> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data: solutions, error: solError } = await supabase
    .schema('otunity')
    .from('solutions')
    .select('*')
    .eq('activa', true)
    .order('precio_mensual', { ascending: false })

  if (solError || !solutions) return []

  const { data: subs } = await supabase
    .schema('otunity')
    .from('subscriptions')
    .select('*')
    .eq('owner_id', user.id)

  const subsBySolutionId = new Map(
    ((subs ?? []) as Subscription[]).map((s) => [s.solution_id, s])
  )

  return (solutions as Solution[]).map((sol) => ({
    ...sol,
    subscription: subsBySolutionId.get(sol.id) ?? null,
  }))
}

/**
 * Obtiene el resumen de métricas del dueño.
 */
export async function getOwnerMetrics(): Promise<{ activas: number; gastoMensual: number }> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { activas: 0, gastoMensual: 0 }

  const { data: subs } = await supabase
    .schema('otunity')
    .from('subscriptions')
    .select('solution_id, estado')
    .eq('owner_id', user.id)
    .eq('estado', 'active')

  const activeSubs = (subs ?? []) as Pick<Subscription, 'solution_id' | 'estado'>[]
  if (activeSubs.length === 0) return { activas: 0, gastoMensual: 0 }

  const solutionIds = activeSubs.map((s) => s.solution_id)
  const { data: solutions } = await supabase
    .schema('otunity')
    .from('solutions')
    .select('id, precio_mensual')
    .in('id', solutionIds)

  const gastoMensual = ((solutions ?? []) as Pick<Solution, 'id' | 'precio_mensual'>[]).reduce(
    (acc, sol) => acc + sol.precio_mensual,
    0
  )

  return { activas: activeSubs.length, gastoMensual }
}

/**
 * Contrata una solución (Fase 1: sin Stripe, inserta subscription 'active').
 */
export async function createSubscription(
  solutionId: string
): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { error } = await supabase
    .schema('otunity')
    .from('subscriptions')
    .insert({
      owner_id: user.id,
      solution_id: solutionId,
      estado: 'active',
    })

  if (error) {
    if (error.code === '23505') {
      return { error: 'Ya tienes esta solución activa' }
    }
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}
