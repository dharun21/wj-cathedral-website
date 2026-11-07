import type { Session, User } from '@supabase/supabase-js'
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { isSupabaseConfigured } from '../../lib/env'
import { checkAdminMembership, getCurrentSession, signInAdmin, signOutAdmin, subscribeToAuth } from '../../services/authService'

interface AdminProfile {
  userId: string
  email: string
  displayName: string
  role: 'owner' | 'editor'
}

interface AdminAuthValue {
  configured: boolean
  loading: boolean
  user: User | null
  session: Session | null
  profile: AdminProfile | null
  authorized: boolean
  isOwner: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

const AdminAuthContext = createContext<AdminAuthValue | null>(null)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<AdminProfile | null>(null)

  const loadSession = useCallback(async (nextSession?: Session | null) => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const activeSession = nextSession === undefined ? await getCurrentSession() : nextSession
      setSession(activeSession)
      if (!activeSession?.user) {
        setProfile(null)
        return
      }
      const membership = await checkAdminMembership(activeSession.user)
      setProfile(membership?.is_active ? {
        userId: activeSession.user.id,
        email: activeSession.user.email ?? '',
        displayName: membership.display_name || activeSession.user.email?.split('@')[0] || 'Administrator',
        role: membership.role,
      } : null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined
    const initialLoad = window.setTimeout(() => void loadSession(), 0)
    const subscription = subscribeToAuth((event, nextSession) => {
      if (event === 'PASSWORD_RECOVERY') window.location.hash = '#/admin/reset-password'
      void loadSession(nextSession)
    })
    return () => { window.clearTimeout(initialLoad); subscription.unsubscribe() }
  }, [loadSession])

  const value = useMemo<AdminAuthValue>(() => ({
    configured: isSupabaseConfigured,
    loading,
    user: session?.user ?? null,
    session,
    profile,
    authorized: Boolean(session?.user && profile),
    isOwner: profile?.role === 'owner',
    login: async (email, password) => {
      const result = await signInAdmin(email, password)
      await loadSession(result.session)
    },
    logout: async () => {
      await signOutAdmin()
      setSession(null)
      setProfile(null)
    },
    refresh: () => loadSession(),
  }), [loadSession, loading, profile, session])

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

// oxlint-disable-next-line react/only-export-components -- Provider and hook form one admin-auth module.
export function useAdminAuth() {
  const value = useContext(AdminAuthContext)
  if (!value) throw new Error('useAdminAuth must be used inside AdminAuthProvider')
  return value
}
