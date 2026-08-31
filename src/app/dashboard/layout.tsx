import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/dashboard/Sidebar'
import type { Owner } from '@/lib/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard — Otunity Labs',
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let nombre: string | null = null
  if (user) {
    const { data } = await supabase
      .from('owners')
      .select('nombre')
      .eq('id', user.id)
      .single()
    nombre = (data as Pick<Owner, 'nombre'> | null)?.nombre ?? null
  }

  const displayName = nombre || user?.email || 'Usuario'
  const initials = nombre
    ? nombre.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : (user?.email?.[0] ?? 'U').toUpperCase()

  return (
    <div style={{
      display:         'flex',
      height:          '100dvh',
      backgroundColor: 'var(--void)',
      overflow:        'hidden',
    }}>
      <Sidebar displayName={displayName} initials={initials} />

      <main style={{
        flex:       1,
        overflowY:  'auto',
        padding:    '36px 40px',
      }}>
        {children}
      </main>
    </div>
  )
}
