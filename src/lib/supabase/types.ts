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
      profiles: {
        Row: {
          id: string
          first_name: string | null
          last_name: string | null
          avatar_url: string | null
          email: string | null
          phone: string | null
          shipping_address: Json | null
          billing_address: Json | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id: string
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          email?: string | null
          phone?: string | null
          shipping_address?: Json | null
          billing_address?: Json | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          email?: string | null
          phone?: string | null
          shipping_address?: Json | null
          billing_address?: Json | null
          created_at?: string
          updated_at?: string | null
        }
      }
      orders: {
        Row: {
          id: number
          user_id: string
          status: string
          total: number
          items: Json[]
          shipping_address: Json | null
          billing_address: Json | null
          payment_intent: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: number
          user_id: string
          status: string
          total: number
          items: Json[]
          shipping_address?: Json | null
          billing_address?: Json | null
          payment_intent?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: number
          user_id?: string
          status?: string
          total?: number
          items?: Json[]
          shipping_address?: Json | null
          billing_address?: Json | null
          payment_intent?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}