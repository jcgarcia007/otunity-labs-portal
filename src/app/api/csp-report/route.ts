// ─────────────────────────────────────────────────────────────────────────────
// CSP Report endpoint
// Recibe las violaciones del Content-Security-Policy-Report-Only y las loguea.
// En Vercel: visibles en el panel de Logs (Runtime Logs) bajo la ruta
// POST /api/csp-report.
//
// Cuando el CSP pase a enforce (CSP_REPORT_ONLY = false en next.config.ts),
// este endpoint seguirá recibiendo violaciones reales para monitoreo continuo.
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.warn('[CSP-VIOLATION]', JSON.stringify(body, null, 2))
  } catch {
    // Cuerpo vacío o malformado — ignorar silenciosamente
  }

  // 204 No Content: el navegador no espera respuesta del endpoint de reportes
  return new Response(null, { status: 204 })
}
