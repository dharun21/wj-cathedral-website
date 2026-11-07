import { z } from 'zod'
import { requireSupabase } from '../lib/supabase'

export interface ManagedEditor {
  user_id: string
  display_name: string
  email: string
  is_active: boolean
  created_at: string
  revoked_at: string | null
}

export const createEditorSchema = z.object({
  displayName: z.string().trim().min(2).max(100),
  email: z.email().max(254).transform((value) => value.toLowerCase()),
  password: z.string().min(12).max(72).refine((value) => /[A-Za-z]/.test(value) && /[0-9]/.test(value), 'Password must contain letters and numbers.'),
})

async function invokeEditorFunction<T>(body: Record<string, unknown>) {
  const { data, error } = await requireSupabase().functions.invoke('manage-editor', { body })
  if (error) {
    let message = error.message || 'The editor access request failed.'
    const context = (error as { context?: Response }).context
    if (context) {
      try {
        const detail = await context.clone().json() as { error?: string }
        if (detail.error) message = detail.error
      } catch {
        // Keep the safe Functions client message when the response has no JSON body.
      }
    }
    throw new Error(message)
  }
  if (data?.error) throw new Error(String(data.error))
  return data as T
}

export async function listManagedEditors() {
  const data = await invokeEditorFunction<{ editors: ManagedEditor[] }>({ action: 'list' })
  return data.editors
}

export async function createManagedEditor(input: { displayName: string; email: string; password: string }) {
  const values = createEditorSchema.parse(input)
  return invokeEditorFunction<{ editor: ManagedEditor }>({ action: 'create', ...values })
}

export async function changeEditorAccess(editorId: string, action: 'revoke' | 'restore' | 'delete') {
  return invokeEditorFunction<{ success: true }>({ action, editorId })
}
