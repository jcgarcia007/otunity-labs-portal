import { getOwnerMetrics } from '@/services/subscriptions'
import { formatPrecio } from '@/lib/utils'

export async function MetricsBar() {
  const { activas, gastoMensual } = await getOwnerMetrics()
  if (activas === 0) return null

  return (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '4px' }}>

      {/* Soluciones activas */}
      <div style={{
        backgroundColor: 'var(--chamber)',
        border:          '1px solid var(--line)',
        borderRadius:    '6px',
        padding:         '14px 22px',
      }}>
        <p style={{
          fontFamily:    'monospace',
          fontSize:      '9px',
          color:         'var(--dim)',
          textTransform: 'uppercase',
          letterSpacing: '.18em',
          margin:        '0 0 6px',
        }}>
          Soluciones activas
        </p>
        <p style={{ fontSize: '26px', fontWeight: 700, color: 'var(--culture)', margin: 0, letterSpacing: '-.03em', lineHeight: 1 }}>
          {activas}
        </p>
      </div>

      {/* Gasto mensual */}
      {gastoMensual > 0 && (
        <div style={{
          backgroundColor: 'var(--chamber)',
          border:          '1px solid var(--line)',
          borderRadius:    '6px',
          padding:         '14px 22px',
        }}>
          <p style={{
            fontFamily:    'monospace',
            fontSize:      '9px',
            color:         'var(--dim)',
            textTransform: 'uppercase',
            letterSpacing: '.18em',
            margin:        '0 0 6px',
          }}>
            Gasto mensual
          </p>
          <p style={{ fontSize: '26px', fontWeight: 700, color: 'var(--clear)', margin: 0, letterSpacing: '-.03em', lineHeight: 1 }}>
            {formatPrecio(gastoMensual)}
            <span style={{ fontSize: '13px', fontWeight: 400, color: 'var(--dim)', marginLeft: '3px' }}>/mes</span>
          </p>
        </div>
      )}

    </div>
  )
}
