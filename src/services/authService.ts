import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js'
import { requireSupabase } from '../lib/supabase'
import type { AdminMembershipRow } from '../types/database'

export async function signInAdmin(email: string, password: string) {
  const { data, error } = await requireSupabase().auth.signInWithPassword({ email: email.trim(), password })
  if (error) throw error
  return data
}

export async function signOutAdmin() {
  const { error } = await requireSupabase().auth.signOut()
  if (error) throw error
}

export async function requestPasswordReset(email: string) {
  const redirectTo = `${window.location.origin}${window.location.pathname}#/admin/reset-password`
  const { error } = await requireSupabase().auth.resetPasswordForEmail(email.trim(), { redirectTo })
  if (error) throw error
}

export async function updateAdminPassword(password: string) {
  const { error } = await requireSupabase().auth.updateUser({ password })
  if (error) throw error
}

export async function getCurrentSession(): Promise<Session | null> {
  const { data, error } = await requireSupabase().auth.getSession()
  if (error) throw error
  return data.session
}

export async function checkAdminMembership(user: User) {
  const { data, error } = await requireSupabase()
    .from('admin_memberships')
    .select('user_id, role, display_name, email, is_active')
    .eq('user_id', user.id)
    .maybeSingle()
  if (error) throw error
  return data as unknown as Pick<AdminMembershipRow, 'user_id' | 'role' | 'display_name' | 'email' | 'is_active'> | null
}

export function subscribeToAuth(callback: (event: AuthChangeEvent, session: Session | null) => void) {
  return requireSupabase().auth.onAuthStateChange(callback).data.subscription
}

export function subscribeToOwnMembership(userId: string, callback: () => void) {
  const client = requireSupabase()
  const channel = client
    .channel(`admin-membership-${userId}`)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'admin_memberships',
      filter: `user_id=eq.${userId}`,
    }, callback)
    .subscribe()
  return () => { void client.removeChannel(channel) }
}
