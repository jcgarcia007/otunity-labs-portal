'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function signIn(formData: FormData) {
  const email          = formData.get('email')        as string
  const password       = formData.get('password')     as string
  const captchaToken   = (formData.get('captchaToken') as string | null) ?? undefined

  const supabase = await createClient()

  // Usamos data.user de signInWithPassword directamente — no getUser().
  // getUser() justo después del login en un Server Action puede devolver null
  // porque la sesión aún no está en las cookies del servidor en ese instante.
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
    options: { captchaToken },
  })

  if (error) {
    return { error: error.message }
  }

  // Asegurar fila en otunity.owners para usuarios existentes de JChat
  // que entran al portal por primera vez. ignoreDuplicates evita sobreescribir
  // si ya existe (p.ej. registro previo por el portal).
  const user = data.user
  if (user) {
    const nombre =
      (user.user_metadata?.nombre as string | undefined)
      ?? (user.user_metadata?.full_name as string | undefined)
      ?? (user.user_metadata?.name as string | undefined)
      ?? ''
    const { error: ownerErr } = await supabase
      .schema('otunity')
      .from('owners')
      .upsert(
        { id: user.id, email: user.email!, nombre },
        { onConflict: 'id', ignoreDuplicates: true },
      )
    // Loguear si falla — visible en Vercel logs para diagnóstico.
    // No bloqueamos el login; el nombre queda vacío y se edita en el portal.
    if (ownerErr) console.error('[signIn] otunity.owners upsert:', ownerErr.message)
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signUp(formData: FormData) {
  const email        = formData.get('email')        as string
  const password     = formData.get('password')     as string
  const nombre       = formData.get('nombre')       as string
  const captchaToken = (formData.get('captchaToken') as string | null) ?? undefined

  const supabase = await createClient()

  // Mandamos el nombre en los tres campos que leen distintos sistemas:
  //   • nombre     → leído por el portal Otunity
  //   • full_name  → leído por el trigger de JChat (handle_new_auth_user)
  //   • name       → fallback del mismo trigger
  // Así un registro único puebla ambos mundos correctamente.
  const { data: { user }, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { nombre, full_name: nombre, name: nombre },
      captchaToken,
      // confirmación de email desactivada en Fase 1
    },
  })

  if (error) {
    return { error: error.message }
  }

  // Crear fila en otunity.owners. Se usa upsert con ignoreDuplicates por
  // robustez (no debería existir, pero evita error si hubiera race condition).
  if (user) {
    const { error: ownerError } = await supabase
      .schema('otunity')
      .from('owners')
      .upsert(
        { id: user.id, email: user.email!, nombre },
        { onConflict: 'id', ignoreDuplicates: true },
      )

    if (ownerError) {
      // En Fase 1 logueamos pero no bloqueamos al usuario — puede continuar
      // y el nombre quedará vacío hasta que lo edite.
      console.error('[signUp] Error creando otunity.owners:', ownerError.message)
    }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
