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

export function editorFunctionConnectionMessage(error: { message?: string; context?: Response }) {
  if (error.context?.status === 404) return 'Editor management is not active yet. Deploy the “manage-editor” Supabase Edge Function, then try again.'
  if (/failed to send (a )?request to (the )?edge function/i.test(error.message ?? '')) {
    return 'Editor management could not reach Supabase. The “manage-editor” Edge Function may not be deployed, or the network connection may be unavailable.'
  }
  return error.message || 'The editor access request failed.'
}

async function invokeEditorFunction<T>(body: Record<string, unknown>) {
  const { data, error } = await requireSupabase().functions.invoke('manage-editor', { body })
  if (error) {
    let message = editorFunctionConnectionMessage(error as { message?: string; context?: Response })
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
