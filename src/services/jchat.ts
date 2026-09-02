'use server'

import { createClient } from '@/lib/supabase/server'

/**
 * Determina si el usuario autenticado es "dueño de JChat":
 *   - Tiene ≥1 negocio en public.businesses (owner_id = su id), O
 *   - Tiene plan 'business' o 'pro' en public.users (su propia fila).
 *
 * Las queries van SIN .schema() → PostgREST usa `public` por defecto,
 * que es donde viven las tablas de JChat.
 *
 * RLS relevante verificado en prod:
 *   public.businesses → "businesses: public read" (using: true) → lectura libre.
 *   public.users      → "users: select own" (using: auth.uid() = id) →
 *                       solo la fila propia. La query con .eq('id', user.id)
 *                       cumple esa condición exactamente.
 *
 * Planes válidos en JChat: regular | verified | business | pro.
 * Dueños de negocio: business | pro. (regular y verified son perfiles sociales.)
 */
export async function getJChatOwnerStatus(): Promise<boolean> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const [bizResult, userResult] = await Promise.all([
    // ¿tiene negocios? — public read, sin restricción de RLS
    supabase
      .from('businesses')
      .select('id', { count: 'exact', head: true })
      .eq('owner_id', user.id),

    // ¿tiene plan de dueño? — RLS solo permite leer la fila propia
    supabase
      .from('users')
      .select('plan')
      .eq('id', user.id)
      .single(),
  ])

  const tieneNegocio = (bizResult.count ?? 0) >= 1
  const tienePlan    = ['business', 'pro'].includes(
    (userResult.data as { plan?: string } | null)?.plan ?? ''
  )

  return tieneNegocio || tienePlan
}
