import { NextResponse, type NextRequest } from 'next/server'
import type { EmailOtpType } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'

/**
 * Canje de enlace de un solo uso → sesión del portal.
 *
 * Lo usa Tab POS para "entregar" al portal una sesión creada en su propio
 * dominio: su servidor genera un magic link (admin.generateLink) y redirige
 * aquí con `token_hash`. Al verificarlo, @supabase/ssr escribe la cookie de
 * sesión en ESTE dominio y el middleware ya deja pasar a /dashboard.
 *
 *   /auth/confirm?token_hash=…&type=magiclink&next=/dashboard?from=tab-pos
 *
 * `next` solo admite rutas relativas del portal (nunca URLs externas).
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const tokenHash = searchParams.get('token_hash')
  const type      = searchParams.get('type') as EmailOtpType | null
  const rawNext   = searchParams.get('next') ?? '/dashboard'
  const next      = rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/dashboard'

  if (tokenHash && type) {
    const supabase = await createClient()
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash })
    if (!error) {
      return NextResponse.redirect(new URL(next, request.url))
    }
    console.error('[auth/confirm] verifyOtp:', error.message)
  }

  return NextResponse.redirect(new URL('/login?error=enlace', request.url))
}
