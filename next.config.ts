import type { NextConfig } from 'next'

// ─────────────────────────────────────────────────────────────────────────────
// Otunity Labs Portal — Security Headers + CSP
// ─────────────────────────────────────────────────────────────────────────────

// Supabase del PORTAL (distinto al de JChat — no mezclar)
const SUPABASE    = 'https://mnhwjrbzmowvsuigcnen.supabase.co'
const SUPABASE_WS = 'wss://mnhwjrbzmowvsuigcnen.supabase.co'

// ── Toggle de modo ────────────────────────────────────────────────────────────
// true  = Content-Security-Policy-Report-Only (observa y reporta, NO bloquea)
//         Dejar en true hasta validar en preview/producción sin violaciones.
// false = Content-Security-Policy (enforce — bloquea activamente)
//         Cambiar a false SOLO tras confirmar que los logs no muestran
//         violaciones legítimas en /api/csp-report.
const CSP_REPORT_ONLY = true

// ── CSP calibrado para el portal ─────────────────────────────────────────────
// Fuentes: Instrument Sans + IBM Plex Mono cargadas con next/font/google.
// next/font las descarga en build time y las sirve desde 'self' →
// NO se necesitan fonts.googleapis.com ni fonts.gstatic.com.
// Agregar Maps/Stripe cuando entren en Fase 2 (no antes).
const csp = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://hcaptcha.com https://*.hcaptcha.com`,
  `style-src 'self' 'unsafe-inline' https://hcaptcha.com https://*.hcaptcha.com`,
  `img-src 'self' data: blob: ${SUPABASE}`,
  `font-src 'self' data:`,
  `connect-src 'self' ${SUPABASE} ${SUPABASE_WS} https://hcaptcha.com https://*.hcaptcha.com`,
  `frame-src 'self' https://hcaptcha.com https://*.hcaptcha.com`,
  `worker-src 'self' blob:`,
  `object-src 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `frame-ancestors 'none'`,
  `report-uri /api/csp-report`,
].join('; ')

// ── Headers de seguridad ──────────────────────────────────────────────────────
// El CSP puede ser Report-Only (ver toggle arriba).
// El resto son seguros en enforce desde el primer día.
const securityHeaders = [
  {
    key:   CSP_REPORT_ONLY
      ? 'Content-Security-Policy-Report-Only'
      : 'Content-Security-Policy',
    value: csp,
  },
  {
    key:   'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  { key: 'X-Frame-Options',         value: 'DENY' },
  { key: 'X-Content-Type-Options',  value: 'nosniff' },
  { key: 'Referrer-Policy',         value: 'strict-origin-when-cross-origin' },
  {
    key:   'Permissions-Policy',
    // geolocation y payment deshabilitados — el portal no los usa.
    // Agregar cuando entren Maps (geolocation=self) y Stripe (payment=self).
    value: 'camera=(), microphone=(), geolocation=(), payment=()',
  },
  { key: 'X-DNS-Prefetch-Control',  value: 'on' },
]

// ─────────────────────────────────────────────────────────────────────────────

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source:  '/:path*',
        headers: securityHeaders,
      },
    ]
  },
}

export default nextConfig
