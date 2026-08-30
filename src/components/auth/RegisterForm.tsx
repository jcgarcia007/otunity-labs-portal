'use client'

import { useRef, useState } from 'react'
import { signUp } from '@/services/auth'
import InvisibleCaptcha, {
  type InvisibleCaptchaHandle,
} from '@/components/InvisibleCaptcha'

const labelStyle: React.CSSProperties = {
  display:       'block',
  fontFamily:    'var(--font-mono), monospace',
  fontSize:      '10.5px',
  fontWeight:    400,
  color:         '#8299A2',
  textTransform: 'uppercase',
  letterSpacing: '.13em',
  marginBottom:  '7px',
}

const inputStyle: React.CSSProperties = {
  width:           '100%',
  backgroundColor: 'rgba(255,255,255,.04)',
  border:          '1px solid #1E2A30',
  borderRadius:    '6px',
  padding:         '11px 14px',
  color:           '#E9F2F3',
  fontSize:        '14px',
  fontFamily:      'system-ui, sans-serif',
  transition:      'border-color .15s',
  boxSizing:       'border-box' as const,
}

export function RegisterForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const captchaRef = useRef<InvisibleCaptchaHandle>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validaciones locales
    const formData = new FormData(e.currentTarget)
    const password = formData.get('password') as string
    const confirm  = formData.get('confirm')  as string

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

    // 1. Obtener token de CAPTCHA antes de llamar a auth
    const captcha =
      (await captchaRef.current?.getToken()) ?? { status: 'disabled' as const }

    if (captcha.status === 'failed') {
      setError('Verificación de seguridad fallida. Intenta de nuevo.')
      setLoading(false)
      return
    }

    // 2. Añadir token al FormData y llamar a la Server Action
    if (captcha.status === 'ok') formData.set('captchaToken', captcha.token)

    const result = await signUp(formData)

    if (result?.error) {
      setError(
        result.error.includes('already registered')
          ? 'Este email ya tiene una cuenta. ¿Quieres iniciar sesión?'
          : result.error
      )
      setLoading(false)
    }
    // Sin error → signUp() hace redirect() internamente
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="reg-nombre" style={labelStyle}>Nombre completo</label>
        <input
          id="reg-nombre"
          name="nombre"
          type="text"
          placeholder="Juan García"
          required
          autoComplete="name"
          className="ol-input"
          style={inputStyle}
        />
      </div>

      <div>
        <label htmlFor="reg-email" style={labelStyle}>Email</label>
        <input
          id="reg-email"
          name="email"
          type="email"
          placeholder="tu@empresa.com"
          required
          autoComplete="email"
          className="ol-input"
          style={inputStyle}
        />
      </div>

      <div>
        <label htmlFor="reg-password" style={labelStyle}>Contraseña</label>
        <input
          id="reg-password"
          name="password"
          type="password"
          placeholder="Mín. 8 caracteres"
          required
          autoComplete="new-password"
          className="ol-input"
          style={inputStyle}
        />
      </div>

      <div>
        <label htmlFor="reg-confirm" style={labelStyle}>Confirmar contraseña</label>
        <input
          id="reg-confirm"
          name="confirm"
          type="password"
          placeholder="Repite tu contraseña"
          required
          autoComplete="new-password"
          className="ol-input"
          style={inputStyle}
        />
      </div>

      {/* hCaptcha invisible */}
      <InvisibleCaptcha ref={captchaRef} />

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-1 w-full rounded-xl bg-brand py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? 'Creando cuenta...' : 'Crear cuenta'}
      </button>

      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        ¿Ya tienes cuenta?{' '}
        <a href="/login" className="font-medium text-brand hover:underline">
          Inicia sesión
        </a>
      </p>
    </form>
  )
}
