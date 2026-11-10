import type { SupabaseClient } from '@supabase/supabase-js'
import { requireSupabase } from '../lib/supabase'
import type {
  AcademicCourseRow,
  AcademicSettingsRow,
  AudioAlbumRow,
  AudioTrackRow,
  AnnouncementRow,
  ContentReviewRequestRow,
  DailyBibleVerseRow,
  CmsTableName,
  EventRow,
  GalleryAlbumRow,
  GalleryImageRow,
  HeroSlideRow,
  MediaAssetRow,
  MinistryRow,
  PageContentRow,
  SiteSettingsRow,
  VideoRow,
  WorshipServiceRow,
} from '../types/database'

export interface PublishedAudioTrack extends AudioTrackRow {
  audio_url: string
  mime_type: string
}

export interface PublishedAudioAlbum extends AudioAlbumRow {
  tracks: PublishedAudioTrack[]
}

export interface PublishedAudioAlbumSummary {
  id: string
  title_en: string
  title_ta: string
  cover_image_url: string | null
  display_order: number
  trackCount: number
}

function genericClient(): SupabaseClient {
  return requireSupabase() as unknown as SupabaseClient
}

function throwIfError(error: { message: string } | null) {
  if (error) throw new Error(error.message)
}

export async function fetchPublishedTranslations() {
  const { data, error } = await requireSupabase()
    .from('page_content')
    .select('content_key, content_en, content_ta')
    .eq('status', 'published')
    .order('display_order')
  throwIfError(error)
  return (data ?? []) as PageContentRow[]
}

export async function fetchPublishedHeroSlides(scope: HeroSlideRow['scope']) {
  const { data, error } = await requireSupabase()
    .from('hero_slides')
    // Keep wildcard compatibility until the protected default/custom slide migration is deployed remotely.
    .select('*')
    .eq('scope', scope)
    .eq('status', 'published')
    .eq('enabled', true)
    .order('display_order')
  throwIfError(error)
  return (data ?? []) as HeroSlideRow[]
}

export async function fetchPublishedAcademicSettings() {
  const { data, error } = await requireSupabase()
    .from('academic_settings')
    .select('id, college_name, affiliation, established, founder, principal, address_en, address_ta, phone_primary, phone_secondary, admissions_open')
    .eq('singleton_key', 'default')
    .eq('status', 'published')
    .maybeSingle()
  throwIfError(error)
  return data as AcademicSettingsRow | null
}

export async function fetchPublishedAcademicCourses() {
  const { data, error } = await requireSupabase()
    .from('academic_courses')
    .select('id, slug, short_name, title_en, title_ta, duration_en, duration_ta, display_order')
    .eq('status', 'published')
    .order('display_order')
  throwIfError(error)
  return (data ?? []) as AcademicCourseRow[]
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
    .select('id, title_en, title_ta, description_en, description_ta, publish_at')
    .eq('status', 'published')
    .or(`publish_at.is.null,publish_at.lte.${now}`)
    .or(`expires_at.is.null,expires_at.gt.${now}`)
    .order('publish_at', { ascending: false })
  throwIfError(error)
  return (data ?? []) as AnnouncementRow[]
}

export async function fetchPublishedEvents() {
  const { data, error } = await requireSupabase()
    .from('events')
    .select('id, title_en, title_ta, description_en, description_ta, starts_at, ends_at, venue_en, venue_ta, category')
    .eq('status', 'published')
    .order('starts_at')
  throwIfError(error)
  return (data ?? []) as EventRow[]
}

export async function fetchPublishedVideos() {
  const { data, error } = await requireSupabase()
    .from('videos')
    .select('id, youtube_id, title_en, title_ta, description_en, description_ta, category, live_status, display_order, created_at')
    .eq('status', 'published')
    .order('display_order')
  throwIfError(error)
  return (data ?? []) as VideoRow[]
}

export async function fetchPublishedAudioLibrary(): Promise<PublishedAudioAlbum[]> {
  const client = genericClient()
  const [albumsResult, tracksResult] = await Promise.all([
    client.from('audio_albums').select('id, title_en, title_ta, description_en, description_ta, cover_image_url, display_order').eq('status', 'published').order('display_order'),
    client.from('audio_tracks').select('id, album_id, media_asset_id, title_en, title_ta, description_en, description_ta, duration_seconds, display_order').eq('status', 'published').order('display_order'),
  ])
  throwIfError(albumsResult.error)
  throwIfError(tracksResult.error)
  const albums = (albumsResult.data ?? []) as AudioAlbumRow[]
  const tracks = (tracksResult.data ?? []) as AudioTrackRow[]
  const mediaIds = [...new Set(tracks.map((track) => track.media_asset_id))]
  if (!mediaIds.length) return albums.map((album) => ({ ...album, tracks: [] }))
  const { data: media, error } = await client
    .from('media_assets')
    .select('id, public_url, mime_type')
    .in('id', mediaIds)
    .eq('approval_status', 'approved')
  throwIfError(error)
  const mediaById = new Map((media ?? []).map((asset) => [asset.id, asset]))
  return albums.map((album) => ({
    ...album,
    tracks: tracks
      .filter((track) => track.album_id === album.id)
      .flatMap((track) => {
        const asset = mediaById.get(track.media_asset_id)
        return asset?.public_url ? [{ ...track, audio_url: asset.public_url, mime_type: asset.mime_type }] : []
      }),
  }))
}

export async function fetchPublishedAudioAlbumSummary(): Promise<PublishedAudioAlbumSummary[]> {
  const client = genericClient()
  const [albumsResult, tracksResult] = await Promise.all([
    client.from('audio_albums').select('id, title_en, title_ta, cover_image_url, display_order').eq('status', 'published').order('display_order'),
    client.from('audio_tracks').select('album_id').eq('status', 'published'),
  ])
  throwIfError(albumsResult.error)
  throwIfError(tracksResult.error)
  const trackCounts = new Map<string, number>()
  for (const track of tracksResult.data ?? []) trackCounts.set(String(track.album_id), (trackCounts.get(String(track.album_id)) ?? 0) + 1)
  return (albumsResult.data ?? []).map((album) => ({ ...album, trackCount: trackCounts.get(String(album.id)) ?? 0 })) as PublishedAudioAlbumSummary[]
}

export async function fetchPublishedWorshipServices() {
  const { data, error } = await requireSupabase()
    .from('worship_services')
    .select('id, name_en, name_ta, day_en, day_ta, time_display_en, time_display_ta, description_en, description_ta, display_order')
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
    .select('id, slug, group_key, title_en, title_ta, eyebrow_en, eyebrow_ta, description_en, description_ta, image_url, icon_key, featured, display_order')
    .eq('group_key', groupKey)
    .eq('status', 'published')
    .order('display_order')
  throwIfError(error)
  return (data ?? []) as MinistryRow[]
}

export async function fetchPublishedGallery(pageScope: GalleryAlbumRow['page_scope'] = 'gallery') {
  const client = requireSupabase()
  const albumsResult = await client.from('gallery_albums').select('id, title_en, title_ta, display_order').eq('status', 'published').eq('page_scope', pageScope).order('display_order')
  throwIfError(albumsResult.error)
  const albums = (albumsResult.data ?? []) as GalleryAlbumRow[]
  if (!albums.length) return { albums, images: [] as GalleryImageRow[] }
  const imagesResult = await client.from('gallery_images').select('id, album_id, image_url, alt_en, alt_ta, display_order').eq('status', 'published').in('album_id', albums.map((album) => album.id)).order('display_order')
  throwIfError(imagesResult.error)
  return {
    albums,
    images: (imagesResult.data ?? []) as GalleryImageRow[],
  }
}

export async function listAdminGalleryImages<Row extends Record<string, unknown>>(pageScope: GalleryAlbumRow['page_scope']) {
  const client = genericClient()
  const albumsResult = await client.from('gallery_albums').select('id').eq('page_scope', pageScope)
  throwIfError(albumsResult.error)
  const albumIds = (albumsResult.data ?? []).map((album) => album.id)
  if (!albumIds.length) return [] as Row[]
  const { data, error } = await client.from('gallery_images').select('*').in('album_id', albumIds).order('display_order')
  throwIfError(error)
  return (data ?? []) as Row[]
}

export async function fetchPublishedSiteSettings() {
  const { data, error } = await requireSupabase()
    .from('site_settings')
    .select('id, display_name, short_name, phone, public_email, address_en, address_ta, maps_url, instagram_url, facebook_url, youtube_url, whatsapp_channel_enabled, whatsapp_channel_title_en, whatsapp_channel_title_ta, whatsapp_channel_url, whatsapp_qr_url, whatsapp_qr_media_id, whatsapp_blog_url, footer_en, footer_ta, prayer_247_confirmed, daily_verse_background_url, daily_verse_background_media_id, giving_account_name, giving_bank_name, giving_bank_branch, giving_account_number, giving_ifsc, giving_gpay_number, giving_gpay_name, giving_upi_id, giving_qr_url, giving_note_en, giving_note_ta, giving_payment_verified')
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
  filters?: Readonly<Record<string, string>>
  excludeFilters?: Readonly<Record<string, string>>
}

export async function listAdminRecords<Row extends Record<string, unknown>>(table: CmsTableName, options: AdminListOptions = {}) {
  let query = genericClient().from(table).select('*')
  for (const [column, value] of Object.entries(options.filters ?? {})) query = query.eq(column, value)
  for (const [column, value] of Object.entries(options.excludeFilters ?? {})) query = query.neq(column, value)
  if (options.orderBy) query = query.order(options.orderBy, { ascending: options.ascending ?? true })
  if (options.limit) query = query.limit(options.limit)
  const { data, error } = await query
  throwIfError(error)
  return (data ?? []) as Row[]
}

export async function listAdminMediaAssets(kind: 'image' | 'audio', approvedOnly = false) {
  let query = genericClient()
    .from('media_assets')
    .select('*')
    .like('mime_type', `${kind}/%`)
    .order('created_at', { ascending: false })
  if (approvedOnly) query = query.eq('approval_status', 'approved').not('public_url', 'is', null)
  const { data, error } = await query
  throwIfError(error)
  return (data ?? []) as MediaAssetRow[]
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
    let query = client.from(table).select('id', { count: 'exact', head: true })
    for (const [column, value] of Object.entries(filters)) query = query.eq(column, value)
    const { count: total, error } = await query
    throwIfError(error)
    return total ?? 0
  }
  const now = new Date().toISOString()
  const [announcements, events, gallery, slides, videos, verses, draftGroups, pendingGroups, pendingMedia] = await Promise.all([
    count('announcements', { status: 'published' }),
    client.from('events').select('id', { count: 'exact', head: true }).eq('status', 'published').or(`starts_at.gte.${now},ends_at.gte.${now}`),
    count('gallery_images', { status: 'published' }),
    count('hero_slides', { status: 'published', enabled: 'true' }),
    count('videos', { status: 'published' }),
    count('daily_bible_verses', { status: 'published', active: 'true' }),
    Promise.all(['announcements', 'events', 'gallery_albums', 'gallery_images', 'hero_slides', 'videos', 'audio_albums', 'audio_tracks', 'worship_services', 'ministries', 'page_content', 'daily_bible_verses', 'academic_settings', 'academic_courses'].map((table) => count(table as CmsTableName, { status: 'draft' }))),
    Promise.all(['announcements', 'events', 'gallery_albums', 'gallery_images', 'hero_slides', 'videos', 'audio_albums', 'audio_tracks', 'worship_services', 'ministries', 'page_content', 'daily_bible_verses', 'academic_settings', 'academic_courses'].map((table) => count(table as CmsTableName, { status: 'pending_review' }))),
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
