'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { signIn } from '@/services/auth'

export function LoginForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await signIn(formData)

    if (result?.error) {
      setError(
        result.error.includes('Invalid login')
          ? 'Email o contraseña incorrectos.'
          : result.error
      )
      setLoading(false)
    }
    // Si no hay error, signIn hace redirect() internamente
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        name="email"
        type="email"
        label="Email"
        placeholder="tu@email.com"
        required
        autoComplete="email"
      />
      <Input
        name="password"
        type="password"
        label="Contraseña"
        placeholder="••••••••"
        required
        autoComplete="current-password"
      />

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </p>
      )}

      <Button type="submit" loading={loading} size="lg" className="mt-1 w-full">
        Iniciar sesión
      </Button>

      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        ¿No tienes cuenta?{' '}
        <a href="/registro" className="font-medium text-brand hover:underline">
          Regístrate gratis
        </a>
      </p>
    </form>
  )
}
