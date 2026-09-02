// Tipos manuales alineados con el schema `otunity` del Supabase de JChat (klfsgcfoahdtkojyqspd).
// Cuando Supabase genere tipos automáticos, reemplazar con:
//   npx supabase gen types typescript --schema otunity

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  otunity: {
    Tables: {
      owners: {
        Row: {
          id: string
          email: string
          nombre: string
          created_at: string
        }
        Insert: {
          id: string
          email: string
          nombre?: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          nombre?: string
          created_at?: string
        }
      }
      solutions: {
        Row: {
          id: string
          nombre: string
          descripcion: string
          precio_mensual: number
          categoria: string
          icono: string
          activa: boolean
          destacada: boolean
          created_at: string
        }
        Insert: {
          id?: string
          nombre: string
          descripcion: string
          precio_mensual: number
          categoria: string
          icono: string
          activa?: boolean
          destacada?: boolean
          created_at?: string
        }
        Update: Partial<Database['otunity']['Tables']['solutions']['Insert']>
      }
      subscriptions: {
        Row: {
          id: string
          owner_id: string
          solution_id: string
          estado: 'active' | 'canceled' | 'trialing'
          stripe_sub_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          solution_id: string
          estado?: 'active' | 'canceled' | 'trialing'
          stripe_sub_id?: string | null
          created_at?: string
        }
        Update: Partial<Database['otunity']['Tables']['subscriptions']['Insert']>
      }
      app_links: {
        Row: {
          id: string
          owner_id: string
          solution_id: string
          app_user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          solution_id: string
          app_user_id: string
          created_at?: string
        }
        Update: Partial<Database['otunity']['Tables']['app_links']['Insert']>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

// Tipos de conveniencia
export type Owner        = Database['otunity']['Tables']['owners']['Row']
export type Solution     = Database['otunity']['Tables']['solutions']['Row']
export type Subscription = Database['otunity']['Tables']['subscriptions']['Row']
export type AppLink      = Database['otunity']['Tables']['app_links']['Row']

// Solution con su subscription (si existe)
export type SolutionWithSubscription = Solution & {
  subscription: Subscription | null
}
