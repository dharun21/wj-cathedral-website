import { isSupabaseConfigured } from '../lib/env'
import { requireSupabase } from '../lib/supabase'
import { indiaDateKey } from '../utils/indiaDate'

const visitorIdKey = 'wj-cathedral-anonymous-visitor-v1'
const recordedDayKey = 'wj-cathedral-last-recorded-visit-day'
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export interface OwnerVisitorSummary {
  today: number
  thisWeek: number
  thisMonth: number
}

export interface VisitorTrendPoint {
  date: string
  visitors: number
}

function anonymousVisitorId() {
  try {
    const existing = window.localStorage.getItem(visitorIdKey)
    if (existing && uuidPattern.test(existing)) return existing
    const created = window.crypto.randomUUID()
    window.localStorage.setItem(visitorIdKey, created)
    return created
  } catch {
    return null
  }
}

export async function recordPublicVisit() {
  if (!isSupabaseConfigured || typeof window === 'undefined' || navigator.doNotTrack === '1') return
  const visitedOn = indiaDateKey()
  try {
    if (window.localStorage.getItem(recordedDayKey) === visitedOn) return
    const visitorId = anonymousVisitorId()
    if (!visitorId) return
    const { error } = await requireSupabase().rpc(
      'record_public_visit',
      { p_visitor_id: visitorId } as never,
    )
    if (error) throw error
    window.localStorage.setItem(recordedDayKey, visitedOn)
  } catch (error) {
    // Analytics must never interrupt or degrade the public website.
    console.warn('Anonymous visitor count could not be recorded.', error)
  }
}

export async function fetchOwnerVisitorSummary(): Promise<OwnerVisitorSummary> {
  const { data, error } = await requireSupabase().rpc('get_owner_visitor_summary', {} as never)
  if (error) throw error
  const row = (
    data as unknown as Array<{ today: number; this_week: number; this_month: number }> | null
  )?.[0]
  return {
    today: Number(row?.today ?? 0),
    thisWeek: Number(row?.this_week ?? 0),
    thisMonth: Number(row?.this_month ?? 0),
  }
}

export async function fetchOwnerVisitorTrend(from: string, to: string): Promise<VisitorTrendPoint[]> {
  const { data, error } = await requireSupabase().rpc(
    'get_owner_visitor_trend',
    { p_from: from, p_to: to } as never,
  )
  if (error) throw error
  return ((data ?? []) as unknown as Array<{ visited_on: string; visitors: number }>).map((point) => ({
    date: point.visited_on,
    visitors: Number(point.visitors),
  }))
}
