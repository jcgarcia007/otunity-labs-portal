'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function signIn(formData: FormData) {
  const email          = formData.get('email')        as string
  const password       = formData.get('password')     as string
  const captchaToken   = (formData.get('captchaToken') as string | null) ?? undefined

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
    options: { captchaToken },
  })

  if (error) {
    return { error: error.message }
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
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { nombre },
      captchaToken,
      // confirmación de email desactivada en Fase 1
    },
  })

  if (error) {
    return { error: error.message }
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
