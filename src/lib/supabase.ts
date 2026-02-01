import { createClient } from '@supabase/supabase-js'
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js'

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

// Real-time subscription helper for winners table
export function subscribeToWinners(
  onWinnerChange: (payload: RealtimePostgresChangesPayload<Winner>) => void
): RealtimeChannel {
  return supabase
    .channel('winners-changes')
    .on(
      'postgres_changes',
      {
        event: '*', // Listen to INSERT, UPDATE, DELETE
        schema: 'public',
        table: 'winners',
      },
      onWinnerChange
    )
    .subscribe()
}

// Unsubscribe helper
export function unsubscribeFromChannel(channel: RealtimeChannel): void {
  supabase.removeChannel(channel)
}
