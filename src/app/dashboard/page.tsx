import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { getSolutionsWithSubscriptions } from '@/services/subscriptions'
import { MetricsBar } from '@/components/dashboard/MetricsBar'
import { SolutionCard } from '@/components/dashboard/SolutionCard'
import type { Owner } from '@/lib/types'

/** Solución de hostelería rebrandeada — Tab POS llega aquí con ?from=tab-pos */
const isTabPos = (nombre: string) => nombre.toLowerCase() === 'tab pos'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>
}) {
  const { from } = await searchParams
  const fromTabPos = from === 'tab-pos'

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Nombre de bienvenida (solo primer nombre)
  let firstName = 'dueño'
  if (user) {
    const { data } = await supabase
      .schema('otunity')
      .from('owners')
      .select('nombre')
      .eq('id', user.id)
      .single()
    const nombre = (data as Pick<Owner, 'nombre'> | null)?.nombre
    firstName = nombre?.split(' ')[0] ?? user.email?.split('@')[0] ?? 'dueño'
  }

  const fetched   = await getSolutionsWithSubscriptions()
  // Viniendo de Tab POS, su tarjeta va primero y resaltada
  const solutions = fromTabPos
    ? [...fetched].sort((a, b) => Number(isTabPos(b.nombre)) - Number(isTabPos(a.nombre)))
    : fetched
  const activas   = solutions.filter(s => s.subscription?.estado === 'active').length

  return (
    <div style={{ maxWidth: '860px' }}>

      {/* ── Bienvenida ─────────────────────────── */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <span style={{ display: 'inline-block', width: '14px', height: '1px', backgroundColor: 'var(--culture)' }} />
          <span style={{
            fontFamily:    'monospace',
            fontSize:      '10px',
            color:         'var(--culture)',
            textTransform: 'uppercase',
            letterSpacing: '.2em',
          }}>
            OL-PORTAL · ACTIVO
          </span>
        </div>

        <h1 style={{
          fontSize:      '28px',
          fontWeight:    600,
          color:         'var(--clear)',
          letterSpacing: '-.02em',
          margin:        '0 0 8px',
          lineHeight:    1.2,
        }}>
          Hola, {firstName}
        </h1>

        <p style={{ fontSize: '14px', color: 'var(--haze)', margin: 0, lineHeight: 1.5 }}>
          {activas === 0
            ? 'Activa tus primeras soluciones y empieza a crecer tu negocio.'
            : `${activas} solución${activas !== 1 ? 'es activas' : ' activa'} en tu negocio.`
          }
        </p>
      </div>

      {/* ── Bienvenida desde Tab POS ───────────── */}
      {fromTabPos && (
        <div style={{
          display:         'flex',
          alignItems:      'center',
          gap:             '12px',
          padding:         '14px 16px',
          marginBottom:    '24px',
          border:          '1px solid rgba(255,106,61,.35)',
          backgroundColor: 'rgba(255,106,61,.06)',
          borderRadius:    '6px',
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--reagent)', flexShrink: 0 }} />
          <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--clear)', lineHeight: 1.5 }}>
            Tu cuenta Otunity ya está lista.{' '}
            <span style={{ color: 'var(--haze)' }}>
              Tab POS aparece destacada abajo — actívala cuando quieras; la misma cuenta sirve para todas las soluciones.
            </span>
          </p>
        </div>
      )}

      {/* ── Métricas ───────────────────────────── */}
      <Suspense fallback={null}>
        <MetricsBar />
      </Suspense>

      {/* ── Catálogo ───────────────────────────── */}
      <div style={{
        display:     'flex',
        alignItems:  'center',
        gap:         '14px',
        margin:      '36px 0 20px',
      }}>
        <span style={{ display: 'inline-block', width: '12px', height: '1px', backgroundColor: 'var(--line)' }} />
        <span style={{
          fontFamily:    'monospace',
          fontSize:      '9.5px',
          color:         'var(--dim)',
          textTransform: 'uppercase',
          letterSpacing: '.18em',
          whiteSpace:    'nowrap',
        }}>
          CATÁLOGO DE SOLUCIONES
        </span>
        <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--line)' }} />
        <span style={{ fontFamily: 'monospace', fontSize: '9.5px', color: 'var(--dim)', whiteSpace: 'nowrap' }}>
          {solutions.length} disponibles
        </span>
      </div>

      {solutions.length === 0 ? (
        <p style={{ fontSize: '14px', color: 'var(--haze)', textAlign: 'center', padding: '64px' }}>
          No hay soluciones disponibles.
        </p>
      ) : (
        <div style={{
          display:             'grid',
          gap:                 '16px',
          gridTemplateColumns: 'repeat(auto-fill, minmax(370px, 1fr))',
        }}>
          {solutions.map((sol) => (
            <SolutionCard
              key={sol.id}
              solution={sol}
              highlight={fromTabPos && isTabPos(sol.nombre)}
            />
          ))}
        </div>
      )}

      {/* ── Footer ─────────────────────────────── */}
      <div style={{
        marginTop:     '48px',
        paddingTop:    '20px',
        borderTop:     '1px solid var(--line)',
        display:       'flex',
        alignItems:    'center',
        justifyContent:'space-between',
      }}>
        <span style={{ fontFamily: 'monospace', fontSize: '9.5px', color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: '.12em' }}>
          OL-PORTAL
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'var(--culture)', display: 'inline-block' }} />
          <span style={{ fontFamily: 'monospace', fontSize: '9.5px', color: 'var(--culture)', textTransform: 'uppercase', letterSpacing: '.1em' }}>
            Sistema operativo
          </span>
        </div>
      </div>

    </div>
  )
}
