import { Zap } from 'lucide-react'
import { RegisterForm } from '@/components/auth/RegisterForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Crear cuenta — Otunity Labs',
}

export default function RegistroPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-gray-950">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand shadow-lg shadow-brand/30">
            <Zap size={22} className="text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Otunity Labs
            </h1>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Crea tu cuenta de negocio
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-white/8 dark:bg-white/5">
          <h2 className="mb-5 text-lg font-semibold text-gray-900 dark:text-white">
            Crear cuenta
          </h2>
          <RegisterForm />
        </div>
      </div>
    </main>
  )
}
