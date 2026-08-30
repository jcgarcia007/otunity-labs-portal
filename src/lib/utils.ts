import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Formatea centavos a pesos: 9900 → "$99" */
export function formatPrecio(centavos: number): string {
  return `$${Math.floor(centavos / 100)}`
}
