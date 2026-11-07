import { z } from 'zod'

const optionalUrl = z.string().url().optional()
const optionalKey = z.string().min(20).optional()

const environmentSchema = z.object({
  VITE_SUPABASE_URL: optionalUrl,
  VITE_SUPABASE_ANON_KEY: optionalKey,
})

const parsed = environmentSchema.safeParse({
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || undefined,
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || undefined,
})

if (!parsed.success) {
  console.warn('Supabase environment variables are invalid. The website will use its local content fallback.')
}

export const environment = parsed.success ? parsed.data : {}
export const isSupabaseConfigured = Boolean(environment.VITE_SUPABASE_URL && environment.VITE_SUPABASE_ANON_KEY)
