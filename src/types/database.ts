export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]
export type ContentStatus = 'draft' | 'pending_review' | 'published' | 'archived'
export type ApprovalStatus = 'pending' | 'approved' | 'rejected'
export type AdmissionApplicationStatus = 'new' | 'reviewing' | 'contacted' | 'closed'
export type ReviewResolution = 'pending' | 'approved' | 'returned' | 'rejected'

export interface AdminMembershipRow {
  user_id: string
  role: 'owner' | 'editor'
  display_name: string | null
  email: string | null
  is_active: boolean
  created_at: string
  revoked_at: string | null
  revoked_by: string | null
}

export interface SiteSettingsRow {
  id: string
  singleton_key: string
  display_name: string
  short_name: string
  logo_media_id: string | null
  phone: string | null
  public_email: string | null
  address_en: string | null
  address_ta: string | null
  maps_url: string | null
  instagram_url: string | null
  facebook_url: string | null
  youtube_url: string | null
  footer_en: string | null
  footer_ta: string | null
  prayer_247_confirmed: boolean
  giving_account_name: string | null
  giving_bank_name: string | null
  giving_bank_branch: string | null
  giving_account_number: string | null
  giving_ifsc: string | null
  giving_gpay_number: string | null
  giving_gpay_name: string | null
  giving_upi_id: string | null
  giving_qr_url: string | null
  giving_note_en: string | null
  giving_note_ta: string | null
  giving_payment_verified: boolean
  status: ContentStatus
  updated_at: string
  updated_by: string | null
}

export interface PageContentRow {
  id: string
  page_key: string
  content_key: string
  content_en: string
  content_ta: string
  metadata: Json
  status: ContentStatus
  display_order: number
  created_at: string
  updated_at: string
  updated_by: string | null
}

export interface MediaAssetRow {
  id: string
  storage_bucket: string
  storage_path: string
  public_url: string | null
  original_name: string
  mime_type: string
  file_size: number
  width: number | null
  height: number | null
  alt_en: string
  alt_ta: string
  approval_status: ApprovalStatus
  created_at: string
  created_by: string | null
}

export interface HeroSlideRow {
  id: string
  scope: 'home' | 'academics' | 'community'
  eyebrow_en: string
  eyebrow_ta: string
  title_en: string
  title_ta: string
  description_en: string
  description_ta: string
  image_media_id: string | null
  image_url: string | null
  image_alt_en: string
  image_alt_ta: string
  cta_label_en: string
  cta_label_ta: string
  cta_href: string
  secondary_cta_label_en: string | null
  secondary_cta_label_ta: string | null
  secondary_cta_href: string | null
  enabled: boolean
  status: ContentStatus
  display_order: number
  created_at: string
  updated_at: string
  updated_by: string | null
}

export interface GalleryAlbumRow {
  id: string
  slug: string
  title_en: string
  title_ta: string
  description_en: string | null
  description_ta: string | null
  status: ContentStatus
  display_order: number
  created_at: string
  updated_at: string
}

export interface GalleryImageRow {
  id: string
  album_id: string
  media_asset_id: string | null
  image_url: string | null
  caption_en: string
  caption_ta: string
  alt_en: string
  alt_ta: string
  featured: boolean
  status: ContentStatus
  display_order: number
  created_at: string
  updated_at: string
  updated_by: string | null
}

export interface AnnouncementRow {
  id: string
  title_en: string
  title_ta: string
  description_en: string
  description_ta: string
  image_media_id: string | null
  publish_at: string | null
  expires_at: string | null
  featured: boolean
  status: ContentStatus
  created_at: string
  updated_at: string
  updated_by: string | null
}

export interface EventRow {
  id: string
  title_en: string
  title_ta: string
  description_en: string
  description_ta: string
  image_media_id: string | null
  starts_at: string
  ends_at: string | null
  venue_en: string
  venue_ta: string
  contact: string | null
  category: string
  featured: boolean
  registration_url: string | null
  status: ContentStatus
  created_at: string
  updated_at: string
  updated_by: string | null
}

export interface VideoRow {
  id: string
  youtube_id: string
  youtube_url: string
  title_en: string
  title_ta: string
  description_en: string
  description_ta: string
  category: string
  featured: boolean
  live_status: 'recorded' | 'scheduled' | 'live_confirmed'
  status: ContentStatus
  display_order: number
  created_at: string
  updated_at: string
  updated_by: string | null
}

export interface AudioAlbumRow {
  id: string
  title_en: string
  title_ta: string
  description_en: string
  description_ta: string
  cover_image_url: string | null
  status: ContentStatus
  display_order: number
  created_at: string
  updated_at: string
  updated_by: string | null
}

export interface AudioTrackRow {
  id: string
  album_id: string
  media_asset_id: string
  title_en: string
  title_ta: string
  description_en: string
  description_ta: string
  duration_seconds: number | null
  status: ContentStatus
  display_order: number
  created_at: string
  updated_at: string
  updated_by: string | null
}

export interface WorshipServiceRow {
  id: string
  name_en: string
  name_ta: string
  day_en: string
  day_ta: string
  start_time: string | null
  end_time: string | null
  time_display_en: string
  time_display_ta: string
  description_en: string
  description_ta: string
  location_en: string | null
  location_ta: string | null
  active: boolean
  verified: boolean
  status: ContentStatus
  display_order: number
  created_at: string
  updated_at: string
  updated_by: string | null
}

export interface MinistryRow {
  id: string
  slug: string
  group_key: 'church' | 'community' | 'academics' | 'homepage'
  title_en: string
  title_ta: string
  eyebrow_en: string | null
  eyebrow_ta: string | null
  description_en: string
  description_ta: string
  image_media_id: string | null
  image_url: string | null
  icon_key: string | null
  metadata: Json
  featured: boolean
  status: ContentStatus
  display_order: number
  created_at: string
  updated_at: string
  updated_by: string | null
}

export interface AdmissionApplicationRow {
  id: string
  full_name: string
  phone: string
  email: string | null
  town_district: string
  study_interest: 'bachelor-theology' | 'certificate-theology' | 'diploma-music' | 'other'
  ministry_experience: string | null
  study_statement: string
  preferred_language: 'en' | 'ta'
  consent_at: string
  submitted_at: string
  status: AdmissionApplicationStatus
  owner_notes: string
  reviewed_at: string | null
  reviewed_by: string | null
  updated_at: string
}

export interface DailyBibleVerseRow {
  id: string
  verse_en: string
  verse_ta: string
  reference_en: string
  reference_ta: string
  translation_en: string | null
  translation_ta: string | null
  background_image_url: string | null
  scheduled_date: string | null
  active: boolean
  status: ContentStatus
  display_order: number
  created_at: string
  updated_at: string
  updated_by: string | null
}

export interface ContentReviewRequestRow {
  id: string
  table_name: 'page_content' | 'hero_slides' | 'gallery_albums' | 'gallery_images' | 'announcements' | 'events' | 'videos' | 'worship_services' | 'ministries' | 'daily_bible_verses' | 'media_assets' | 'audio_albums' | 'audio_tracks'
  record_id: string
  title_snapshot: string
  submitted_by: string | null
  submitted_by_name: string
  submitted_by_email: string
  submitted_at: string
  resolution: ReviewResolution
  resolved_at: string | null
  resolved_by: string | null
}

type TableDefinition<Row, Insert = Partial<Row>, Update = Partial<Row>> = {
  Row: Row
  Insert: Insert
  Update: Update
  Relationships: []
}

export interface Database {
  public: {
    Tables: {
      admin_memberships: TableDefinition<AdminMembershipRow>
      site_settings: TableDefinition<SiteSettingsRow>
      page_content: TableDefinition<PageContentRow>
      media_assets: TableDefinition<MediaAssetRow>
      hero_slides: TableDefinition<HeroSlideRow>
      gallery_albums: TableDefinition<GalleryAlbumRow>
      gallery_images: TableDefinition<GalleryImageRow>
      announcements: TableDefinition<AnnouncementRow>
      events: TableDefinition<EventRow>
      videos: TableDefinition<VideoRow>
      audio_albums: TableDefinition<AudioAlbumRow>
      audio_tracks: TableDefinition<AudioTrackRow>
      worship_services: TableDefinition<WorshipServiceRow>
      ministries: TableDefinition<MinistryRow>
      admission_applications: TableDefinition<AdmissionApplicationRow>
      daily_bible_verses: TableDefinition<DailyBibleVerseRow>
      content_review_requests: TableDefinition<ContentReviewRequestRow>
    }
    Views: Record<string, never>
    Functions: {
      is_admin: { Args: Record<PropertyKey, never>; Returns: boolean }
      is_owner: { Args: Record<PropertyKey, never>; Returns: boolean }
      is_editor: { Args: Record<PropertyKey, never>; Returns: boolean }
      media_reference_count: { Args: { asset_id: string }; Returns: number }
      submit_admission_application: {
        Args: {
          p_city: string
          p_consent: boolean
          p_email: string
          p_experience: string
          p_full_name: string
          p_language: string
          p_phone: string
          p_statement: string
          p_study_interest: string
          p_website: string
        }
        Returns: string
      }
      get_daily_bible_verse: {
        Args: { p_date: string }
        Returns: DailyBibleVerseRow[]
      }
    }
    Enums: {
      content_status: ContentStatus
      approval_status: ApprovalStatus
    }
    CompositeTypes: Record<string, never>
  }
}

export type CmsTableName = keyof Database['public']['Tables']
