import { Header } from '@/components/dashboard/Header'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard — Otunity Labs',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
