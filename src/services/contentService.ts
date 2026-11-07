import type { SupabaseClient } from '@supabase/supabase-js'
import { requireSupabase } from '../lib/supabase'
import type {
  AnnouncementRow,
  ContentReviewRequestRow,
  DailyBibleVerseRow,
  CmsTableName,
  EventRow,
  GalleryAlbumRow,
  GalleryImageRow,
  HeroSlideRow,
  MinistryRow,
  PageContentRow,
  SiteSettingsRow,
  VideoRow,
  WorshipServiceRow,
} from '../types/database'

function genericClient(): SupabaseClient {
  return requireSupabase() as unknown as SupabaseClient
}

function throwIfError(error: { message: string } | null) {
  if (error) throw new Error(error.message)
}

export async function fetchPublishedTranslations() {
  const { data, error } = await requireSupabase()
    .from('page_content')
    .select('*')
    .eq('status', 'published')
    .order('display_order')
  throwIfError(error)
  return (data ?? []) as PageContentRow[]
}

export async function fetchPublishedHeroSlides(scope: HeroSlideRow['scope']) {
  const { data, error } = await requireSupabase()
    .from('hero_slides')
    .select('*')
    .eq('scope', scope)
    .eq('status', 'published')
    .eq('enabled', true)
    .order('display_order')
  throwIfError(error)
  return (data ?? []) as HeroSlideRow[]
}

export async function fetchDailyBibleVerse(indiaDate: string) {
  const { data, error } = await requireSupabase().rpc('get_daily_bible_verse', { p_date: indiaDate } as never)
  throwIfError(error)
  return ((data ?? []) as DailyBibleVerseRow[])[0] ?? null
}

export async function fetchPublishedAnnouncements() {
  const now = new Date().toISOString()
  const { data, error } = await requireSupabase()
    .from('announcements')
    .select('*')
    .eq('status', 'published')
    .or(`publish_at.is.null,publish_at.lte.${now}`)
    .or(`expires_at.is.null,expires_at.gt.${now}`)
    .order('featured', { ascending: false })
    .order('publish_at', { ascending: false })
  throwIfError(error)
  return (data ?? []) as AnnouncementRow[]
}

export async function fetchPublishedEvents() {
  const { data, error } = await requireSupabase()
    .from('events')
    .select('*')
    .eq('status', 'published')
    .order('starts_at')
  throwIfError(error)
  return (data ?? []) as EventRow[]
}

export async function fetchPublishedVideos() {
  const { data, error } = await requireSupabase()
    .from('videos')
    .select('*')
    .eq('status', 'published')
    .order('featured', { ascending: false })
    .order('display_order')
  throwIfError(error)
  return (data ?? []) as VideoRow[]
}

export async function fetchPublishedWorshipServices() {
  const { data, error } = await requireSupabase()
    .from('worship_services')
    .select('*')
    .eq('status', 'published')
    .eq('active', true)
    .eq('verified', true)
    .order('display_order')
  throwIfError(error)
  return (data ?? []) as WorshipServiceRow[]
}

export async function fetchPublishedMinistries(groupKey: MinistryRow['group_key']) {
  const { data, error } = await requireSupabase()
    .from('ministries')
    .select('*')
    .eq('group_key', groupKey)
    .eq('status', 'published')
    .order('display_order')
  throwIfError(error)
  return (data ?? []) as MinistryRow[]
}

export async function fetchPublishedGallery() {
  const [albumsResult, imagesResult] = await Promise.all([
    requireSupabase().from('gallery_albums').select('*').eq('status', 'published').order('display_order'),
    requireSupabase().from('gallery_images').select('*').eq('status', 'published').order('display_order'),
  ])
  throwIfError(albumsResult.error)
  throwIfError(imagesResult.error)
  return {
    albums: (albumsResult.data ?? []) as GalleryAlbumRow[],
    images: (imagesResult.data ?? []) as GalleryImageRow[],
  }
}

export async function fetchPublishedSiteSettings() {
  const { data, error } = await requireSupabase()
    .from('site_settings')
    .select('*')
    .eq('singleton_key', 'default')
    .eq('status', 'published')
    .maybeSingle()
  throwIfError(error)
  return data as SiteSettingsRow | null
}

export interface AdminListOptions {
  orderBy?: string
  ascending?: boolean
  limit?: number
}

export async function listAdminRecords<Row extends Record<string, unknown>>(table: CmsTableName, options: AdminListOptions = {}) {
  let query = genericClient().from(table).select('*')
  if (options.orderBy) query = query.order(options.orderBy, { ascending: options.ascending ?? true })
  if (options.limit) query = query.limit(options.limit)
  const { data, error } = await query
  throwIfError(error)
  return (data ?? []) as Row[]
}

export async function listPendingApprovalRecords<Row extends Record<string, unknown>>(table: CmsTableName) {
  const { data, error } = await genericClient()
    .from(table)
    .select('*')
    .eq('status', 'pending_review')
    .order('updated_at', { ascending: false })
  throwIfError(error)
  return (data ?? []) as Row[]
}

export async function listPendingMediaApprovalRecords<Row extends Record<string, unknown>>() {
  const { data, error } = await genericClient()
    .from('media_assets')
    .select('*')
    .eq('approval_status', 'pending')
    .order('created_at', { ascending: false })
  throwIfError(error)
  return (data ?? []) as Row[]
}

export async function listContentReviewRequests() {
  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60_000).toISOString()
  const { data, error } = await requireSupabase()
    .from('content_review_requests')
    .select('*')
    .or(`resolution.eq.pending,resolved_at.gte.${cutoff}`)
    .order('submitted_at', { ascending: false })
  throwIfError(error)
  return (data ?? []) as ContentReviewRequestRow[]
}

export function subscribeToContentReviewRequests(callback: () => void) {
  const client = requireSupabase()
  const channel = client
    .channel('content-review-activity')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'content_review_requests',
    }, callback)
    .subscribe()
  return () => { void client.removeChannel(channel) }
}

export async function saveAdminRecord<Row extends Record<string, unknown>>(table: CmsTableName, values: Row, id?: string) {
  const query = id
    ? genericClient().from(table).update(values as never).eq('id', id).select().single()
    : genericClient().from(table).insert(values as never).select().single()
  const { data, error } = await query
  throwIfError(error)
  return data as Row
}

export async function deleteAdminRecord(table: CmsTableName, id: string) {
  const { error } = await genericClient().from(table).delete().eq('id', id)
  throwIfError(error)
}

export async function reorderAdminRecords(table: CmsTableName, orderedIds: string[]) {
  const updates = orderedIds.map((id, index) => genericClient().from(table).update({ display_order: index }).eq('id', id))
  const results = await Promise.all(updates)
  const failed = results.find((result) => result.error)
  throwIfError(failed?.error ?? null)
}

export async function fetchDashboardCounts() {
  const client = genericClient()
  const count = async (table: CmsTableName, filters: Record<string, string> = {}) => {
    let query = client.from(table).select('*', { count: 'exact', head: true })
    for (const [column, value] of Object.entries(filters)) query = query.eq(column, value)
    const { count: total, error } = await query
    throwIfError(error)
    return total ?? 0
  }
  const now = new Date().toISOString()
  const [announcements, events, gallery, slides, videos, verses, draftGroups, pendingGroups, pendingMedia] = await Promise.all([
    count('announcements', { status: 'published' }),
    client.from('events').select('*', { count: 'exact', head: true }).eq('status', 'published').gte('starts_at', now),
    count('gallery_images', { status: 'published' }),
    count('hero_slides', { status: 'published', enabled: 'true' }),
    count('videos', { status: 'published' }),
    count('daily_bible_verses', { status: 'published', active: 'true' }),
    Promise.all(['announcements', 'events', 'gallery_albums', 'gallery_images', 'hero_slides', 'videos', 'worship_services', 'ministries', 'page_content', 'daily_bible_verses'].map((table) => count(table as CmsTableName, { status: 'draft' }))),
    Promise.all(['announcements', 'events', 'gallery_albums', 'gallery_images', 'hero_slides', 'videos', 'worship_services', 'ministries', 'page_content', 'daily_bible_verses'].map((table) => count(table as CmsTableName, { status: 'pending_review' }))),
    count('media_assets', { approval_status: 'pending' }),
  ])
  throwIfError(events.error)
  return {
    announcements,
    upcomingEvents: events.count ?? 0,
    gallery,
    slides,
    videos,
    verses,
    drafts: draftGroups.reduce((sum, value) => sum + value, 0),
    pendingApprovals: pendingGroups.reduce((sum, value) => sum + value, 0) + pendingMedia,
  }
}
