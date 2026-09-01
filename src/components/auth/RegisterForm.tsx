'use client'

import { useRef, useState } from 'react'
import { signUp } from '@/services/auth'
import InvisibleCaptcha, {
  type InvisibleCaptchaHandle,
} from '@/components/InvisibleCaptcha'

// Estilos del design system — idénticos al LoginForm
const labelStyle: React.CSSProperties = {
  display:       'block',
  fontFamily:    'var(--font-mono), monospace',
  fontSize:      '10.5px',
  fontWeight:    400,
  color:         'var(--haze, #8299A2)',
  textTransform: 'uppercase',
  letterSpacing: '.13em',
  marginBottom:  '7px',
}

const inputStyle: React.CSSProperties = {
  width:           '100%',
  backgroundColor: 'rgba(255,255,255,.035)',
  border:          '1px solid var(--line, #1B282F)',
  borderRadius:    '3px',
  padding:         '12px 13px',
  color:           'var(--clear, #E9F2F3)',
  fontSize:        '14px',
  fontFamily:      'var(--font-instrument), system-ui, sans-serif',
  transition:      'border-color .15s, background .15s',
  boxSizing:       'border-box' as const,
}

export function RegisterForm() {
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const captchaRef = useRef<InvisibleCaptchaHandle>(null)

  const passwordsMatch    = confirm.length > 0 && password === confirm
  const passwordsMismatch = confirm.length > 0 && password !== confirm

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // Capturar el form ANTES del primer await:
    // React nullifica e.currentTarget cuando el handler cede control al await.
    const formData = new FormData(e.currentTarget)
    setLoading(true)
    setError(null)

    // Defense-in-depth: validar contraseñas aunque la UI ya lo bloquea
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

    // 1. Obtener token de CAPTCHA
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

  // Estilo dinámico del input de confirmación según estado
  const confirmInputStyle: React.CSSProperties = {
    ...inputStyle,
    paddingRight: '38px', // espacio para el checkmark
    ...(passwordsMatch    && { border: '1px solid #2FD3B8' }),
    ...(passwordsMismatch && { border: '1px solid rgba(255,106,61,.6)' }),
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}
    >
      {/* ── Nombre completo ────────────────────── */}
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

      {/* ── Email ──────────────────────────────── */}
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

      {/* ── Contraseña ─────────────────────────── */}
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
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>

      {/* ── Confirmar contraseña ────────────────── */}
      <div>
        <label htmlFor="reg-confirm" style={labelStyle}>Confirmar contraseña</label>
        <div style={{ position: 'relative' }}>
          <input
            id="reg-confirm"
            name="confirm"
            type="password"
            placeholder="Repite tu contraseña"
            required
            autoComplete="new-password"
            className="ol-input"
            style={confirmInputStyle}
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
          />
          {/* Checkmark cuando coinciden */}
          {passwordsMatch && (
            <span
              aria-hidden
              style={{
                position:  'absolute',
                right:     '12px',
                top:       '50%',
                transform: 'translateY(-50%)',
                color:     'var(--culture, #2FD3B8)',
                fontSize:  '14px',
                fontWeight: 600,
                lineHeight: 1,
                pointerEvents: 'none',
              }}
            >
              ✓
            </span>
          )}
        </div>
        {/* Feedback de validación */}
        {passwordsMatch && (
          <p
            style={{
              marginTop:  '5px',
              fontSize:   '11.5px',
              color:      'var(--culture, #2FD3B8)',
              fontFamily: 'var(--font-instrument), system-ui, sans-serif',
            }}
          >
            Las contraseñas coinciden
          </p>
        )}
        {passwordsMismatch && (
          <p
            style={{
              marginTop:  '5px',
              fontSize:   '11.5px',
              color:      'var(--reagent, #FF6A3D)',
              fontFamily: 'var(--font-instrument), system-ui, sans-serif',
            }}
          >
            Las contraseñas no coinciden
          </p>
        )}
      </div>

      {/* ── hCaptcha invisible ─────────────────── */}
      <InvisibleCaptcha ref={captchaRef} />

      {/* ── Error ──────────────────────────────── */}
      {error && (
        <p
          role="alert"
          style={{
            fontSize:        '12.5px',
            color:           'var(--reagent, #FF6A3D)',
            padding:         '10px 12px',
            border:          '1px solid rgba(255,106,61,.2)',
            borderRadius:    '3px',
            backgroundColor: 'rgba(255,106,61,.06)',
            fontFamily:      'var(--font-instrument), system-ui, sans-serif',
          }}
        >
          {error}
        </p>
      )}

      {/* ── Botón ──────────────────────────────── */}
      <button
        type="submit"
        disabled={loading || passwordsMismatch}
        className="ol-btn"
        style={{
          width:           '100%',
          backgroundColor: 'var(--culture, #2FD3B8)',
          color:           'var(--void, #05090C)',
          fontFamily:      'var(--font-instrument), system-ui, sans-serif',
          fontWeight:      600,
          fontSize:        '14px',
          borderRadius:    '3px',
          padding:         '13px 20px',
          border:          'none',
          cursor:          (loading || passwordsMismatch) ? 'not-allowed' : 'pointer',
          opacity:         (loading || passwordsMismatch) ? 0.65 : 1,
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'center',
          gap:             '6px',
          transition:      'background .15s',
          marginTop:       '4px',
        }}
      >
        {loading ? (
          'Creando cuenta...'
        ) : (
          <>
            Crear cuenta
            <span
              className="ol-arrow"
              style={{ display: 'inline-block', transition: 'transform .2s ease' }}
            >
              →
            </span>
          </>
        )}
      </button>

      {/* ── Enlace a login ─────────────────────── */}
      <p
        style={{
          textAlign:  'center',
          fontSize:   '13px',
          color:      'var(--haze, #8299A2)',
          fontFamily: 'var(--font-instrument), system-ui, sans-serif',
          marginTop:  '4px',
        }}
      >
        ¿Ya tienes cuenta?{' '}
        <a
          href="/login"
          style={{
            color:          'var(--culture, #2FD3B8)',
            textDecoration: 'none',
            borderBottom:   '1px solid rgba(47,211,184,.34)',
            paddingBottom:  '1px',
          }}
        >
          Iniciar sesión
        </a>
      </p>
    </form>
  )
}
