// Tipos manuales alineados con el schema de Supabase.
// Cuando Supabase genere tipos automáticos, reemplazar con: npx supabase gen types typescript

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
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
        Update: Partial<Database['public']['Tables']['solutions']['Insert']>
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
        Update: Partial<Database['public']['Tables']['subscriptions']['Insert']>
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
        Update: Partial<Database['public']['Tables']['app_links']['Insert']>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

// Tipos de conveniencia
export type Owner = Database['public']['Tables']['owners']['Row']
export type Solution = Database['public']['Tables']['solutions']['Row']
export type Subscription = Database['public']['Tables']['subscriptions']['Row']
export type AppLink = Database['public']['Tables']['app_links']['Row']

// Solution con su subscription (si existe)
export type SolutionWithSubscription = Solution & {
  subscription: Subscription | null
}
