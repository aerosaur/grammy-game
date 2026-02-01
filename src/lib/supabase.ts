import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Prediction = {
  id?: string
  username: string
  category: string
  nominee: string
  created_at?: string
}

export type Winner = {
  id?: string
  category: string
  nominee: string
  announced_at?: string
}
