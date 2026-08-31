'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutGrid, Receipt, Settings, LogOut } from 'lucide-react'
import { signOut } from '@/services/auth'

const NAV = [
  { href: '/dashboard',          icon: LayoutGrid, label: 'Soluciones',   disabled: false },
  { href: '/dashboard/billing',  icon: Receipt,    label: 'Facturación',  disabled: true  },
  { href: '/dashboard/settings', icon: Settings,   label: 'Configuración',disabled: true  },
]

interface SidebarProps {
  displayName: string
  initials:    string
}

export function Sidebar({ displayName, initials }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside style={{
      width:           '216px',
      flexShrink:      0,
      height:          '100dvh',
      backgroundColor: 'var(--chamber)',
      borderRight:     '1px solid var(--line)',
      display:         'flex',
      flexDirection:   'column',
    }}>

      {/* ── Logo ─────────────────────────────── */}
      <div style={{
        padding:       '22px 20px 18px',
        borderBottom:  '1px solid var(--line)',
        display:       'flex',
        alignItems:    'center',
        gap:           '10px',
      }}>
        <span style={{
          width:           '8px',
          height:          '8px',
          borderRadius:    '50%',
          backgroundColor: 'var(--culture)',
          boxShadow:       '0 0 0 3px rgba(47,211,184,.16)',
          flexShrink:      0,
        }} />
        <span style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
          <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--clear)', letterSpacing: '-.01em' }}>
            Otunity
          </span>
          <span style={{ fontFamily: 'monospace', fontWeight: 400, fontSize: '10px', color: 'var(--culture)', textTransform: 'uppercase', letterSpacing: '.12em' }}>
            Labs
          </span>
        </span>
      </div>

      {/* ── Section label ────────────────────── */}
      <div style={{ padding: '20px 20px 8px' }}>
        <span style={{ fontFamily: 'monospace', fontSize: '9px', color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: '.2em' }}>
          PORTAL
        </span>
      </div>

      {/* ── Nav ──────────────────────────────── */}
      <nav style={{ flex: 1, padding: '0 10px' }}>
        {NAV.map(({ href, icon: Icon, label, disabled }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={disabled ? '#' : href}
              style={{
                display:         'flex',
                alignItems:      'center',
                gap:             '9px',
                padding:         '9px 10px',
                borderRadius:    '5px',
                marginBottom:    '2px',
                fontSize:        '13.5px',
                fontWeight:      active ? 500 : 400,
                color:           active ? 'var(--culture)' : disabled ? 'var(--dim)' : 'var(--haze)',
                backgroundColor: active ? 'rgba(47,211,184,.09)' : 'transparent',
                textDecoration:  'none',
                cursor:          disabled ? 'not-allowed' : 'pointer',
                pointerEvents:   disabled ? 'none' : undefined,
                transition:      'background .12s, color .12s',
              }}
            >
              <Icon size={14} style={{ flexShrink: 0, opacity: active ? 1 : 0.7 }} />
              <span style={{ flex: 1 }}>{label}</span>
              {disabled && (
                <span style={{
                  fontFamily:    'monospace',
                  fontSize:      '8.5px',
                  color:         'var(--dim)',
                  textTransform: 'uppercase',
                  letterSpacing: '.1em',
                  border:        '1px solid var(--line)',
                  borderRadius:  '3px',
                  padding:       '1px 5px',
                }}>
                  Soon
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* ── User section ─────────────────────── */}
      <div style={{
        padding:    '14px 10px',
        borderTop:  '1px solid var(--line)',
        display:    'flex',
        alignItems: 'center',
        gap:        '10px',
      }}>
        {/* Avatar */}
        <div style={{
          width:           '30px',
          height:          '30px',
          borderRadius:    '50%',
          backgroundColor: 'rgba(47,211,184,.12)',
          border:          '1px solid rgba(47,211,184,.28)',
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'center',
          flexShrink:      0,
          fontSize:        '11px',
          fontWeight:      600,
          color:           'var(--culture)',
          letterSpacing:   '.05em',
        }}>
          {initials}
        </div>

        {/* Name + role */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--clear)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {displayName}
          </p>
          <p style={{ fontSize: '9.5px', color: 'var(--dim)', margin: 0, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '.1em' }}>
            Dueño
          </p>
        </div>

        {/* Logout */}
        <form action={signOut}>
          <button
            type="submit"
            title="Cerrar sesión"
            style={{
              background:  'none',
              border:      'none',
              padding:     '5px',
              cursor:      'pointer',
              color:       'var(--dim)',
              display:     'flex',
              alignItems:  'center',
              borderRadius:'4px',
            }}
          >
            <LogOut size={13} />
          </button>
        </form>
      </div>
    </aside>
  )
}
