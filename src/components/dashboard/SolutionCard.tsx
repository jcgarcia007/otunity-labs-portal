'use client'

import { useState } from 'react'
import {
  MapPin, Sparkles, Users, Calculator, Box, Globe,
  CheckCircle2, type LucideIcon,
} from 'lucide-react'
import { formatPrecio } from '@/lib/utils'
import { createSubscription } from '@/services/subscriptions'
import type { SolutionWithSubscription } from '@/lib/types'

/* ── Iconos ───────────────────────────────────────────────────── */
const ICON_MAP: Record<string, LucideIcon> = {
  'map-pin':   MapPin,
  sparkles:    Sparkles,
  users:       Users,
  calculator:  Calculator,
  box:         Box,
  globe:       Globe,
}

/* ── Acento por categoría ─────────────────────────────────────── */
const CAT_COLOR: Record<string, string> = {
  Comunidad:     '#2FD3B8',  // culture/teal
  Productividad: '#9B5EE8',  // purple
  Ventas:        '#5C7CFA',  // brand blue
  Finanzas:      '#D97706',  // gold
  Operaciones:   '#FF6A3D',  // reagent/orange
  Marketing:     '#1D9E75',  // success/green
}

/* ── Componente ───────────────────────────────────────────────── */
export function SolutionCard({ solution }: { solution: SolutionWithSubscription }) {
  const [loading,      setLoading]      = useState(false)
  const [error,        setError]        = useState<string | null>(null)
  const [jchatMessage, setJchatMessage] = useState(false)

  const Icon     = ICON_MAP[solution.icono] ?? Globe
  const isJChat  = solution.nombre.toLowerCase() === 'jchat'
  // JChat activo si: dueño de JChat (puente) O tiene suscripción de Otunity
  const isActive = isJChat
    ? !!(solution.jchatOwner || solution.subscription?.estado === 'active')
    : solution.subscription?.estado === 'active'
  const accent   = CAT_COLOR[solution.categoria] ?? '#5C7CFA'

  function handleGestionarJChat() {
    window.open('https://jchat.cloud/dashboard', '_blank', 'noopener,noreferrer')
  }

  async function handleContratar() {
    // JChat no se contrata desde Otunity — los usuarios sociales ven un mensaje
    if (isJChat) {
      setJchatMessage(true)
      return
    }
    setLoading(true)
    setError(null)
    const result = await createSubscription(solution.id)
    if (result?.error) setError(result.error)
    setLoading(false)
  }

  return (
    <div
      style={{
        position:        'relative',
        display:         'flex',
        flexDirection:   'column',
        backgroundColor: 'var(--chamber)',
        border:          `1px solid ${isActive ? 'rgba(47,211,184,.45)' : 'var(--line)'}`,
        borderRadius:    '6px',
        padding:         '20px',
        transition:      'border-color .2s, box-shadow .2s',
        boxShadow:       isActive
          ? '0 0 0 1px rgba(47,211,184,.1), 0 4px 20px rgba(47,211,184,.06)'
          : 'none',
      }}
    >
      {/* Badge "Destacada" */}
      {solution.destacada && !isActive && (
        <div style={{
          position:        'absolute',
          top:             '-1px',
          right:           '18px',
          backgroundColor: accent,
          color:           '#05090C',
          fontSize:        '9px',
          fontFamily:      'monospace',
          fontWeight:      700,
          textTransform:   'uppercase',
          letterSpacing:   '.12em',
          padding:         '3px 10px',
          borderRadius:    '0 0 5px 5px',
        }}>
          Destacada
        </div>
      )}

      {/* ── Cabecera ────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '12px' }}>

        {/* Ícono con color de categoría */}
        <div style={{
          width:           '40px',
          height:          '40px',
          borderRadius:    '8px',
          backgroundColor: `${accent}18`,
          border:          `1px solid ${accent}35`,
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'center',
          flexShrink:      0,
        }}>
          <Icon size={18} style={{ color: accent }} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '2px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--clear)', margin: 0 }}>
              {solution.nombre}
            </h3>
            {isActive && (
              <span style={{
                display:         'inline-flex',
                alignItems:      'center',
                gap:             '4px',
                fontSize:        '10px',
                fontFamily:      'monospace',
                textTransform:   'uppercase',
                letterSpacing:   '.08em',
                color:           'var(--culture)',
                backgroundColor: 'rgba(47,211,184,.1)',
                border:          '1px solid rgba(47,211,184,.25)',
                borderRadius:    '3px',
                padding:         '2px 7px',
              }}>
                <CheckCircle2 size={9} />
                Activa
              </span>
            )}
          </div>
          <span style={{
            fontSize:      '10.5px',
            fontFamily:    'monospace',
            textTransform: 'uppercase',
            letterSpacing: '.1em',
            color:         accent,
            opacity:       0.85,
          }}>
            {solution.categoria}
          </span>
        </div>
      </div>

      {/* ── Descripción ─────────────────────────── */}
      <p style={{
        fontSize:    '13px',
        lineHeight:  1.65,
        color:       'var(--haze)',
        margin:      '0 0 16px',
        flex:        1,
      }}>
        {solution.descripcion}
      </p>

      {/* ── Footer: precio + CTA ─────────────────── */}
      <div style={{
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'space-between',
        gap:             '12px',
        paddingTop:      '14px',
        borderTop:       '1px solid var(--line)',
      }}>
        <div>
          <span style={{ fontSize: '22px', fontWeight: 700, color: 'var(--clear)', letterSpacing: '-.02em' }}>
            {formatPrecio(solution.precio_mensual)}
          </span>
          <span style={{ fontSize: '12px', color: 'var(--dim)', marginLeft: '2px' }}>/mes</span>
        </div>

        {isActive ? (
          // JChat activo → enlace real al dashboard; otras soluciones → placeholder
          isJChat ? (
            <button
              onClick={handleGestionarJChat}
              style={{
                fontSize:        '11.5px',
                fontFamily:      'monospace',
                textTransform:   'uppercase',
                letterSpacing:   '.1em',
                color:           'var(--culture)',
                background:      'rgba(47,211,184,.08)',
                border:          '1px solid rgba(47,211,184,.22)',
                borderRadius:    '4px',
                padding:         '7px 14px',
                cursor:          'pointer',
              }}
            >
              Gestionar →
            </button>
          ) : (
            <button
              disabled
              style={{
                fontSize:        '11.5px',
                fontFamily:      'monospace',
                textTransform:   'uppercase',
                letterSpacing:   '.1em',
                color:           'var(--culture)',
                background:      'rgba(47,211,184,.08)',
                border:          '1px solid rgba(47,211,184,.22)',
                borderRadius:    '4px',
                padding:         '7px 14px',
                cursor:          'default',
              }}
            >
              Gestionar →
            </button>
          )
        ) : (
          <button
            onClick={handleContratar}
            disabled={loading}
            style={{
              fontSize:        '13px',
              fontWeight:      600,
              color:           '#05090C',
              backgroundColor: loading ? 'rgba(47,211,184,.65)' : 'var(--culture)',
              border:          'none',
              borderRadius:    '4px',
              padding:         '8px 18px',
              cursor:          loading ? 'not-allowed' : 'pointer',
              transition:      'background .15s',
              display:         'flex',
              alignItems:      'center',
              gap:             '5px',
            }}
          >
            {loading ? 'Procesando...' : 'Contratar →'}
          </button>
        )}
      </div>

      {/* Mensaje para usuarios sociales que hacen clic en JChat */}
      {jchatMessage && (
        <p style={{ marginTop: '10px', fontSize: '12.5px', color: 'var(--haze)', lineHeight: 1.55 }}>
          Tu perfil de JChat está en la app móvil.{' '}
          <span style={{ color: 'var(--culture)' }}>Descárgala para gestionarlo.</span>
        </p>
      )}

      {error && (
        <p style={{ marginTop: '8px', fontSize: '12px', color: 'var(--reagent)' }}>
          {error}
        </p>
      )}
    </div>
  )
}
