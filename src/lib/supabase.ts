import { createClient } from '@supabase/supabase-js'
import { environment, isSupabaseConfigured } from './env'
import type { Database } from '../types/database'

export const supabase = isSupabaseConfigured
  ? createClient<Database>(environment.VITE_SUPABASE_URL!, environment.VITE_SUPABASE_ANON_KEY!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
      },
      global: {
        headers: { 'x-client-info': 'wj-cathedral-cms' },
      },
    })
  : null

export function requireSupabase() {
  if (!supabase) throw new Error('Supabase is not configured. Add the public project URL and anon key to your local environment.')
  return supabase
}
