'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { signUp } from '@/services/auth'

export function RegisterForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)

    const password = formData.get('password') as string
    const confirm = formData.get('confirm') as string
    if (password !== confirm) {
      setError('Las contraseñas no coinciden.')
      setLoading(false)
      return
    }
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.')
      setLoading(false)
      return
    }

    const result = await signUp(formData)

    if (result?.error) {
      setError(
        result.error.includes('already registered')
          ? 'Este email ya tiene una cuenta. ¿Quieres iniciar sesión?'
          : result.error
      )
      setLoading(false)
    }
    // Si no hay error, signUp hace redirect() internamente
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        name="nombre"
        type="text"
        label="Nombre completo"
        placeholder="Juan García"
        required
        autoComplete="name"
      />
      <Input
        name="email"
        type="email"
        label="Email"
        placeholder="tu@empresa.com"
        required
        autoComplete="email"
      />
      <Input
        name="password"
        type="password"
        label="Contraseña"
        placeholder="Mín. 8 caracteres"
        required
        autoComplete="new-password"
      />
      <Input
        name="confirm"
        type="password"
        label="Confirmar contraseña"
        placeholder="Repite tu contraseña"
        required
        autoComplete="new-password"
      />

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </p>
      )}

      <Button type="submit" loading={loading} size="lg" className="mt-1 w-full">
        Crear cuenta
      </Button>

      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        ¿Ya tienes cuenta?{' '}
        <a href="/login" className="font-medium text-brand hover:underline">
          Inicia sesión
        </a>
      </p>
    </form>
  )
}
