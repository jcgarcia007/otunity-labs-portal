import { signOut } from '@/services/auth'
import { createClient } from '@/lib/supabase/server'
import { LogOut, Zap } from 'lucide-react'
import type { Owner } from '@/lib/types'

export async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Obtener nombre del dueño
  let owner: Pick<Owner, 'nombre'> | null = null
  if (user) {
    const { data } = await supabase
      .from('owners')
      .select('nombre')
      .eq('id', user.id)
      .single()
    owner = data as Pick<Owner, 'nombre'> | null
  }

  const initials = owner?.nombre
    ? owner.nombre.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : (user?.email?.[0] ?? 'O').toUpperCase()

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-100 bg-white/80 px-6 backdrop-blur-sm dark:border-white/8 dark:bg-gray-950/80">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand">
          <Zap size={16} className="text-white" />
        </div>
        <span className="text-base font-semibold text-gray-900 dark:text-white">
          Otunity Labs
        </span>
      </div>

      {/* Avatar + logout */}
      <div className="flex items-center gap-3">
        <span className="hidden text-sm text-gray-500 sm:block dark:text-gray-400">
          {owner?.nombre || user?.email}
        </span>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-xs font-semibold text-white">
          {initials}
        </div>
        <form action={signOut}>
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/10 dark:hover:text-white"
            title="Cerrar sesión"
          >
            <LogOut size={16} />
          </button>
        </form>
      </div>
    </header>
  )
}
