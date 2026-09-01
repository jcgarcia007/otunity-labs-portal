import type { Metadata } from 'next'
import { Instrument_Sans, IBM_Plex_Mono } from 'next/font/google'
import { RegisterForm } from '@/components/auth/RegisterForm'

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-instrument',
  display: 'swap',
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Crear cuenta — Otunity Labs',
}

export default function RegistroPage() {
  return (
    <>
      {/* Estilos de interacción y animaciones para la pantalla de registro */}
      <style>{`
        @keyframes ol-pulse {
          0%, 100% { box-shadow: 0 0 0 3px rgba(47,211,184,.16); }
          50%       { box-shadow: 0 0 0 6px rgba(47,211,184,.06); }
        }

        .ol-input::placeholder { color: #748890; }

        .ol-input:focus {
          border-color: #2FD3B8 !important;
          background: rgba(47,211,184,.05) !important;
          outline: none;
        }

        .ol-btn:hover:not(:disabled) { background: #4eead0 !important; }
        .ol-btn:hover:not(:disabled) .ol-arrow { transform: translateX(3px); }

        @media (prefers-reduced-motion: reduce) {
          .ol-dot, .ol-status-dot { animation: none !important; }
          .ol-arrow { transition: none !important; }
        }
      `}</style>

      <main
        className={`${instrumentSans.variable} ${ibmPlexMono.variable}`}
        style={{
          /* Tokens de la marca */
          '--culture': '#2FD3B8',
          '--reagent': '#FF6A3D',
          '--void':    '#05090C',
          '--chamber': '#0A1116',
          '--line':    '#1B282F',
          '--haze':    '#8299A2',
          '--clear':   '#E9F2F3',
          '--dim':     '#748890',
          /* Layout */
          minHeight: '100svh',
          backgroundColor: 'var(--void)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 16px',
          fontFamily: 'var(--font-instrument), system-ui, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        } as React.CSSProperties}
      >

        {/* ── Fondo: grid de líneas con máscara radial ─────────── */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(#1B282F 1px, transparent 1px),' +
              'linear-gradient(90deg, #1B282F 1px, transparent 1px)',
            backgroundSize: '56px 56px',
            opacity: 0.28,
            WebkitMaskImage:
              'radial-gradient(ellipse 80% 70% at 50% 30%, #000 20%, transparent 85%)',
            maskImage:
              'radial-gradient(ellipse 80% 70% at 50% 30%, #000 20%, transparent 85%)',
            pointerEvents: 'none',
          }}
        />

        {/* ── Tarjeta de registro ───────────────────────────────── */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '400px',
            backgroundColor: 'var(--chamber)',
            border: '1px solid var(--line)',
            borderRadius: '4px',
            padding: '36px 32px 28px',
          }}
        >

          {/* ── Logo: punto + Otunity Labs ─────────────────────── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '28px' }}>
            <span
              className="ol-dot"
              style={{
                display:         'inline-block',
                width:           '9px',
                height:          '9px',
                borderRadius:    '50%',
                backgroundColor: 'var(--culture)',
                boxShadow:       '0 0 0 3px rgba(47,211,184,.16)',
                animation:       'ol-pulse 2.6s ease-in-out infinite',
                flexShrink:      0,
              }}
            />
            <span style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
              <span
                style={{
                  fontFamily:    'var(--font-instrument), system-ui',
                  fontWeight:    700,
                  fontSize:      '15px',
                  color:         'var(--clear)',
                  letterSpacing: '-.01em',
                }}
              >
                Otunity
              </span>
              <span
                style={{
                  fontFamily:    'var(--font-mono), monospace',
                  fontWeight:    400,
                  fontSize:      '11px',
                  color:         'var(--culture)',
                  textTransform: 'uppercase',
                  letterSpacing: '.12em',
                }}
              >
                Labs
              </span>
            </span>
          </div>

          {/* ── Etiqueta mono "REGISTRO · NUEVO CULTIVO" ──────── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <span
              style={{
                display:         'inline-block',
                width:           '15px',
                height:          '1px',
                backgroundColor: 'var(--culture)',
                flexShrink:      0,
              }}
            />
            <span
              style={{
                fontFamily:    'var(--font-mono), monospace',
                fontSize:      '10.5px',
                color:         'var(--culture)',
                textTransform: 'uppercase',
                letterSpacing: '.2em',
              }}
            >
              REGISTRO · NUEVO CULTIVO
            </span>
          </div>

          {/* ── Título ────────────────────────────────────────── */}
          <h1
            style={{
              fontFamily:    'var(--font-instrument), system-ui',
              fontSize:      '27px',
              fontWeight:    600,
              letterSpacing: '-.03em',
              color:         'var(--clear)',
              lineHeight:    1.15,
              marginBottom:  '8px',
            }}
          >
            Crea tu{' '}
            <span style={{ color: 'var(--culture)' }}>laboratorio</span>
          </h1>

          {/* ── Subtítulo ─────────────────────────────────────── */}
          <p
            style={{
              fontSize:     '13.5px',
              color:        'var(--haze)',
              lineHeight:   1.5,
              marginBottom: '28px',
            }}
          >
            Una cuenta para todas tus soluciones.
          </p>

          {/* ── Formulario de registro ────────────────────────── */}
          <RegisterForm />

          {/* ── Pie: OL-PORTAL | Activo ───────────────────────── */}
          <div
            style={{
              marginTop:     '28px',
              paddingTop:    '16px',
              borderTop:     '1px solid var(--line)',
              display:       'flex',
              alignItems:    'center',
              justifyContent:'space-between',
            }}
          >
            <span
              style={{
                fontFamily:    'var(--font-mono), monospace',
                fontSize:      '10px',
                color:         'var(--dim)',
                textTransform: 'uppercase',
                letterSpacing: '.1em',
              }}
            >
              OL-PORTAL
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                className="ol-status-dot"
                style={{
                  display:         'inline-block',
                  width:           '6px',
                  height:          '6px',
                  borderRadius:    '50%',
                  backgroundColor: 'var(--culture)',
                  boxShadow:       '0 0 0 2px rgba(47,211,184,.16)',
                  animation:       'ol-pulse 2.6s ease-in-out infinite',
                  animationDelay:  '1.3s',
                }}
              />
              <span
                style={{
                  fontFamily:    'var(--font-mono), monospace',
                  fontSize:      '10px',
                  color:         'var(--culture)',
                  textTransform: 'uppercase',
                  letterSpacing: '.1em',
                }}
              >
                Activo
              </span>
            </div>
          </div>

        </div>
      </main>
    </>
  )
}
