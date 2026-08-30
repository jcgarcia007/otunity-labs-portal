'use client'

import { useState } from 'react'
import { signIn } from '@/services/auth'

// Estilos reutilizables del design system de la pantalla de login
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

export function LoginForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
    // Sin error → signIn() hace redirect() internamente
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}
    >
      {/* ── Email ──────────────────────────────── */}
      <div>
        <label htmlFor="login-email" style={labelStyle}>Email</label>
        <input
          id="login-email"
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
        <label htmlFor="login-password" style={labelStyle}>Contraseña</label>
        <input
          id="login-password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
          autoComplete="current-password"
          className="ol-input"
          style={inputStyle}
        />
      </div>

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
        disabled={loading}
        className="ol-btn"
        style={{
          width:          '100%',
          backgroundColor:'var(--culture, #2FD3B8)',
          color:          'var(--void, #05090C)',
          fontFamily:     'var(--font-instrument), system-ui, sans-serif',
          fontWeight:     600,
          fontSize:       '14px',
          borderRadius:   '3px',
          padding:        '13px 20px',
          border:         'none',
          cursor:         loading ? 'not-allowed' : 'pointer',
          opacity:        loading ? 0.65 : 1,
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          gap:            '6px',
          transition:     'background .15s',
          marginTop:      '4px',
        }}
      >
        {loading ? (
          'Entrando...'
        ) : (
          <>
            Iniciar sesión
            <span
              className="ol-arrow"
              style={{ display: 'inline-block', transition: 'transform .2s ease' }}
            >
              →
            </span>
          </>
        )}
      </button>

      {/* ── Enlace a registro ──────────────────── */}
      <p
        style={{
          textAlign:  'center',
          fontSize:   '13px',
          color:      'var(--haze, #8299A2)',
          fontFamily: 'var(--font-instrument), system-ui, sans-serif',
          marginTop:  '4px',
        }}
      >
        ¿No tienes cuenta?{' '}
        <a
          href="/registro"
          style={{
            color:          'var(--culture, #2FD3B8)',
            textDecoration: 'none',
            borderBottom:   '1px solid rgba(47,211,184,.34)',
            paddingBottom:  '1px',
          }}
        >
          Crear una
        </a>
      </p>
    </form>
  )
}
