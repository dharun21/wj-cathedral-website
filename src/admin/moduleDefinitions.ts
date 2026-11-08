import { canonicalYouTubeUrl, extractYouTubeId } from '../utils/youtube'
import type { AdminModuleDefinition, AdminRecord } from './types'

const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'pending_review', label: 'Pending approval' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
] as const

const bilingualTitleFields = [
  { name: 'title_en', label: 'English title', type: 'text', requiredForPublish: true },
  { name: 'title_ta', label: 'Tamil title', tamilLabel: 'தமிழ் தலைப்பு', type: 'text', requiredForPublish: true },
] as const

const bilingualDescriptionFields = [
  { name: 'description_en', label: 'English description', type: 'textarea', requiredForPublish: true, fullWidth: true },
  { name: 'description_ta', label: 'Tamil description', tamilLabel: 'தமிழ் விளக்கம்', type: 'textarea', requiredForPublish: true, fullWidth: true },
] as const

const galleryPhotoFields = [
  { name: 'album_id', label: 'Gallery album', type: 'select', requiredForPublish: true, options: [] },
  { name: 'image_url', label: 'Approved image URL', type: 'text', requiredForPublish: true, fullWidth: true },
  { name: 'caption_en', label: 'English caption', type: 'text', requiredForPublish: true },
  { name: 'caption_ta', label: 'Tamil caption', tamilLabel: 'தமிழ் விளக்கவரி', type: 'text', requiredForPublish: true },
  { name: 'alt_en', label: 'English alt text', type: 'textarea', requiredForPublish: true, fullWidth: true },
  { name: 'alt_ta', label: 'Tamil alt text', tamilLabel: 'தமிழ் மாற்று உரை', type: 'textarea', requiredForPublish: true, fullWidth: true },
  { name: 'featured', label: 'Featured photo', type: 'boolean' },
  { name: 'status', label: 'Publication status', type: 'select', options: statusOptions },
  { name: 'display_order', label: 'Display order', type: 'number' },
] as const

function normalizeVideo(record: AdminRecord) {
  const url = String(record.youtube_url ?? '')
  const videoId = extractYouTubeId(url)
  if (!videoId) throw new Error('Enter a supported YouTube watch, live, shorts or youtu.be URL.')
  return { ...record, youtube_id: videoId, youtube_url: canonicalYouTubeUrl(videoId) }
}

export const moduleDefinitions: Record<string, AdminModuleDefinition> = {
  verses: {
    key: 'verses', title: 'Daily Bible Verses', singular: 'verse', table: 'daily_bible_verses', orderBy: 'display_order', orderable: true,
    description: 'Build the approved bilingual verse rotation and schedule date-specific verses for special days.', titleField: 'reference_en', subtitleField: 'scheduled_date',
    defaults: { verse_en: '', verse_ta: '', reference_en: '', reference_ta: '', translation_en: '', translation_ta: '', background_image_url: '', scheduled_date: '', active: true, status: 'draft', display_order: 0 },
    fields: [
      { name: 'verse_en', label: 'English verse text', type: 'textarea', requiredForPublish: true, fullWidth: true, help: 'Use church-approved wording and confirm the translation licence.' },
      { name: 'verse_ta', label: 'Tamil verse text', tamilLabel: 'தமிழ் வேதவசனம்', type: 'textarea', requiredForPublish: true, fullWidth: true, help: 'Do not use automatic translation for Scripture.' },
      { name: 'reference_en', label: 'English Bible reference', type: 'text', requiredForPublish: true, placeholder: 'Example: Philippians 4:13' },
      { name: 'reference_ta', label: 'Tamil Bible reference', tamilLabel: 'தமிழ் வேதாகமக் குறிப்பு', type: 'text', requiredForPublish: true },
      { name: 'translation_en', label: 'English translation/version', type: 'text', help: 'Optional, but recommended for attribution.' },
      { name: 'translation_ta', label: 'Tamil translation/version', type: 'text' },
      { name: 'background_image_url', label: 'Optional approved background image', type: 'text', fullWidth: true },
      { name: 'scheduled_date', label: 'Special display date', type: 'date', help: 'Optional. A scheduled verse overrides automatic rotation on this India date.' },
      { name: 'active', label: 'Include in daily display', type: 'boolean' },
      { name: 'status', label: 'Publication status', type: 'select', options: statusOptions },
      { name: 'display_order', label: 'Rotation order', type: 'number' },
    ],
  },
  slides: {
    key: 'slides', title: 'Carousel Slides', singular: 'slide', table: 'hero_slides', orderBy: 'display_order', orderable: true, excludeFilters: { scope: 'academics' },
    description: 'Manage homepage and Community Care carousel slides. Academics has its own protected carousel editor.', titleField: 'title_en', subtitleField: 'scope',
    defaults: { scope: 'home', status: 'draft', enabled: true, display_order: 0, eyebrow_en: '', eyebrow_ta: '', title_en: '', title_ta: '', description_en: '', description_ta: '', image_url: '', image_alt_en: '', image_alt_ta: '', cta_label_en: '', cta_label_ta: '', cta_href: '#home', secondary_cta_label_en: '', secondary_cta_label_ta: '', secondary_cta_href: '' },
    fields: [
      { name: 'scope', label: 'Carousel', type: 'select', requiredForPublish: true, options: [{ value: 'home', label: 'Homepage' }, { value: 'community', label: 'Community Care' }] },
      { name: 'eyebrow_en', label: 'English short label', type: 'text', requiredForPublish: true },
      { name: 'eyebrow_ta', label: 'Tamil short label', tamilLabel: 'தமிழ் குறுந்தலைப்பு', type: 'text', requiredForPublish: true },
      ...bilingualTitleFields, ...bilingualDescriptionFields,
      { name: 'image_url', label: 'Approved image URL', type: 'text', requiredForPublish: true, fullWidth: true, help: 'Select an approved media URL or use an existing local approved asset path.' },
      { name: 'image_alt_en', label: 'English image description', type: 'text', requiredForPublish: true },
      { name: 'image_alt_ta', label: 'Tamil image description', tamilLabel: 'தமிழ் பட விளக்கம்', type: 'text', requiredForPublish: true },
      { name: 'cta_label_en', label: 'English button text', type: 'text', requiredForPublish: true },
      { name: 'cta_label_ta', label: 'Tamil button text', tamilLabel: 'தமிழ் பொத்தான் உரை', type: 'text', requiredForPublish: true },
      { name: 'cta_href', label: 'Button destination', type: 'text', requiredForPublish: true, help: 'Internal destinations only, for example #contact.' },
      { name: 'secondary_cta_label_en', label: 'Second button — English', type: 'text' },
      { name: 'secondary_cta_label_ta', label: 'Second button — Tamil', type: 'text' },
      { name: 'secondary_cta_href', label: 'Second button destination', type: 'text' },
      { name: 'enabled', label: 'Enabled', type: 'boolean' },
      { name: 'status', label: 'Publication status', type: 'select', options: statusOptions },
      { name: 'display_order', label: 'Display order', type: 'number' },
    ],
  },
  announcements: {
    key: 'announcements', title: 'Announcements', singular: 'announcement', table: 'announcements', orderBy: 'updated_at',
    description: 'Publish timely church notices with optional expiry dates.', titleField: 'title_en', subtitleField: 'status',
    defaults: { title_en: '', title_ta: '', description_en: '', description_ta: '', publish_at: '', expires_at: '', featured: false, status: 'draft' },
    fields: [
      ...bilingualTitleFields, ...bilingualDescriptionFields,
      { name: 'publish_at', label: 'Publish date and time', type: 'datetime' },
      { name: 'expires_at', label: 'Expiry date and time', type: 'datetime', help: 'Expired announcements automatically disappear from active public notices.' },
      { name: 'featured', label: 'Feature on homepage', type: 'boolean' },
      { name: 'status', label: 'Publication status', type: 'select', options: statusOptions },
    ],
  },
  events: {
    key: 'events', title: 'Events', singular: 'event', table: 'events', orderBy: 'starts_at',
    description: 'Manage upcoming and past church events in Asia/Kolkata time.', titleField: 'title_en', subtitleField: 'starts_at',
    defaults: { title_en: '', title_ta: '', description_en: '', description_ta: '', starts_at: '', ends_at: '', venue_en: '', venue_ta: '', contact: '', category: 'church', featured: false, registration_url: '', status: 'draft' },
    fields: [
      ...bilingualTitleFields, ...bilingualDescriptionFields,
      { name: 'starts_at', label: 'Start date and time', type: 'datetime', requiredForPublish: true },
      { name: 'ends_at', label: 'End date and time', type: 'datetime' },
      { name: 'venue_en', label: 'Venue — English', type: 'text', requiredForPublish: true },
      { name: 'venue_ta', label: 'Venue — Tamil', tamilLabel: 'இடம் — தமிழ்', type: 'text', requiredForPublish: true },
      { name: 'contact', label: 'Public contact', type: 'text' },
      { name: 'category', label: 'Category', type: 'select', options: [{ value: 'church', label: 'Church gathering' }, { value: 'prayer', label: 'Prayer' }, { value: 'youth', label: 'Youth' }, { value: 'children', label: 'Children' }, { value: 'community', label: 'Community Care' }, { value: 'academics', label: 'Academics' }] },
      { name: 'registration_url', label: 'Optional contact/registration link', type: 'url' },
      { name: 'featured', label: 'Featured event', type: 'boolean' },
      { name: 'status', label: 'Publication status', type: 'select', options: statusOptions },
    ],
  },
  videos: {
    key: 'videos', title: 'YouTube & Media', singular: 'video', table: 'videos', orderBy: 'display_order', orderable: true,
    description: 'Add official YouTube videos without downloading or re-hosting them.', titleField: 'title_en', subtitleField: 'category',
    defaults: { youtube_url: '', youtube_id: '', title_en: '', title_ta: '', description_en: '', description_ta: '', category: 'sermon', featured: false, live_status: 'recorded', status: 'draft', display_order: 0 },
    beforeSave: normalizeVideo,
    fields: [
      { name: 'youtube_url', label: 'YouTube URL', type: 'url', requiredForPublish: true, fullWidth: true },
      ...bilingualTitleFields, ...bilingualDescriptionFields,
      { name: 'category', label: 'Category', type: 'select', options: [{ value: 'sermon', label: 'Sermon' }, { value: 'service', label: 'Service' }, { value: 'worship', label: 'Worship' }, { value: 'song', label: 'Song' }, { value: 'testimony', label: 'Testimony' }, { value: 'live-session', label: 'Church live session' }] },
      { name: 'live_status', label: 'Video status', type: 'select', options: [{ value: 'recorded', label: 'Recorded' }, { value: 'scheduled', label: 'Scheduled' }, { value: 'live_confirmed', label: 'Live — manually confirmed' }] },
      { name: 'featured', label: 'Featured video', type: 'boolean' },
      { name: 'status', label: 'Publication status', type: 'select', options: statusOptions },
      { name: 'display_order', label: 'Display order', type: 'number' },
    ],
  },
  'audio-albums': {
    key: 'audio-albums', title: 'Audio Albums', singular: 'audio album', table: 'audio_albums', orderBy: 'display_order', orderable: true,
    description: 'Organise uploaded church audio messages into bilingual public albums.', titleField: 'title_en', subtitleField: 'status',
    defaults: { title_en: '', title_ta: '', description_en: '', description_ta: '', cover_image_url: '', status: 'draft', display_order: 0 },
    fields: [
      ...bilingualTitleFields,
      ...bilingualDescriptionFields,
      { name: 'cover_image_url', label: 'Optional approved cover image', type: 'text', fullWidth: true, help: 'Choose an approved image or leave blank to use the WJ audio artwork.' },
      { name: 'status', label: 'Publication status', type: 'select', options: statusOptions },
      { name: 'display_order', label: 'Display order', type: 'number' },
    ],
  },
  services: {
    key: 'services', title: 'Worship & Prayer Times', singular: 'service', table: 'worship_services', orderBy: 'display_order', orderable: true,
    description: 'Only verified schedules can be published.', titleField: 'name_en', subtitleField: 'time_display_en',
    defaults: { name_en: '', name_ta: '', day_en: '', day_ta: '', start_time: '', end_time: '', time_display_en: '', time_display_ta: '', description_en: '', description_ta: '', location_en: '', location_ta: '', active: true, verified: false, status: 'draft', display_order: 0 },
    fields: [
      { name: 'name_en', label: 'Service name — English', type: 'text', requiredForPublish: true },
      { name: 'name_ta', label: 'Service name — Tamil', tamilLabel: 'ஆராதனை பெயர் — தமிழ்', type: 'text', requiredForPublish: true },
      { name: 'day_en', label: 'Day — English', type: 'text', requiredForPublish: true },
      { name: 'day_ta', label: 'Day — Tamil', tamilLabel: 'நாள் — தமிழ்', type: 'text', requiredForPublish: true },
      { name: 'start_time', label: 'Start time', type: 'time' },
      { name: 'end_time', label: 'End time', type: 'time' },
      { name: 'time_display_en', label: 'Displayed time — English', type: 'text', requiredForPublish: true },
      { name: 'time_display_ta', label: 'Displayed time — Tamil', type: 'text', requiredForPublish: true },
      ...bilingualDescriptionFields,
      { name: 'location_en', label: 'Location — English', type: 'text' },
      { name: 'location_ta', label: 'Location — Tamil', type: 'text' },
      { name: 'active', label: 'Active service', type: 'boolean' },
      { name: 'verified', label: 'Schedule confirmed by church', type: 'boolean', help: 'Required before publishing.' },
      { name: 'status', label: 'Publication status', type: 'select', options: statusOptions },
      { name: 'display_order', label: 'Display order', type: 'number' },
    ],
  },
  ministries: {
    key: 'ministries', title: 'Ministry Photos', singular: 'ministry photo', table: 'ministries', orderBy: 'display_order', excludeFilters: { group_key: 'academics' }, allowCreate: false, allowDelete: false,
    description: 'Replace the approved image used for each Church ministry.', titleField: 'title_en', subtitleField: 'eyebrow_en',
    defaults: { slug: '', group_key: 'church', title_en: '', title_ta: '', eyebrow_en: '', eyebrow_ta: '', description_en: '', description_ta: '', image_url: '', icon_key: '', featured: false, status: 'draft', display_order: 0, metadata: {} },
    fields: [
      { name: 'image_url', label: 'Approved ministry image', type: 'text', requiredForPublish: true, fullWidth: true, help: 'Choose a replacement from the approved Upload Library.' },
    ],
  },
  academics: {
    key: 'academics', title: 'Academics Faculty Photos', singular: 'faculty photo', table: 'ministries', orderBy: 'display_order', filters: { group_key: 'academics' }, allowCreate: false, allowDelete: false,
    description: 'Manage faculty portraits separately from Church ministry images.', titleField: 'title_en', subtitleField: 'eyebrow_en',
    defaults: { slug: '', group_key: 'academics', title_en: '', title_ta: '', eyebrow_en: '', eyebrow_ta: '', description_en: '', description_ta: '', image_url: '', icon_key: '', featured: false, status: 'draft', display_order: 0, metadata: {} },
    fields: [
      { name: 'image_url', label: 'Approved faculty portrait', type: 'text', requiredForPublish: true, fullWidth: true, help: 'Choose a replacement portrait from the approved Upload Library.' },
    ],
  },
  'academic-courses': {
    key: 'academic-courses', title: 'Academic Courses', singular: 'course', table: 'academic_courses', orderBy: 'display_order', orderable: true,
    description: 'Manage the courses and durations shown on the Academics page.', titleField: 'title_en', subtitleField: 'short_name',
    defaults: { slug: '', short_name: '', title_en: '', title_ta: '', duration_en: '', duration_ta: '', status: 'draft', display_order: 0 },
    fields: [
      { name: 'slug', label: 'Course identifier', type: 'text', requiredForPublish: true, placeholder: 'example: bachelor-theology', help: 'Lowercase letters, numbers and hyphens only.' },
      { name: 'short_name', label: 'Short name', type: 'text', requiredForPublish: true, placeholder: 'Example: B.Th' },
      ...bilingualTitleFields,
      { name: 'duration_en', label: 'Duration — English', type: 'text', requiredForPublish: true, placeholder: 'Example: 3 years' },
      { name: 'duration_ta', label: 'Duration — Tamil', tamilLabel: 'கால அளவு — தமிழ்', type: 'text', requiredForPublish: true, placeholder: 'உதாரணம்: 3 ஆண்டுகள்' },
      { name: 'status', label: 'Publication status', type: 'select', options: statusOptions },
      { name: 'display_order', label: 'Display order', type: 'number' },
    ],
  },
  albums: {
    key: 'albums', title: 'Gallery Page Albums', singular: 'album', table: 'gallery_albums', orderBy: 'display_order', orderable: true, filters: { page_scope: 'gallery' },
    description: 'Create albums only for the public Gallery page.', titleField: 'title_en', subtitleField: 'slug',
    defaults: { slug: '', page_scope: 'gallery', title_en: '', title_ta: '', description_en: '', description_ta: '', status: 'draft', display_order: 0 },
    fields: [
      { name: 'slug', label: 'Album identifier', type: 'text', requiredForPublish: true }, ...bilingualTitleFields, ...bilingualDescriptionFields,
      { name: 'status', label: 'Publication status', type: 'select', options: statusOptions },
      { name: 'display_order', label: 'Display order', type: 'number' },
    ],
  },
  'gallery-images': {
    key: 'gallery-images', title: 'Gallery Page Photos', singular: 'photo', table: 'gallery_images', orderBy: 'display_order', orderable: true, presentation: 'photo-grid', albumScope: 'gallery',
    description: 'Photos shown on the public Gallery page, organised under its albums.', titleField: 'caption_en', subtitleField: 'status',
    defaults: { album_id: '', image_url: '', caption_en: '', caption_ta: '', alt_en: '', alt_ta: '', featured: false, status: 'draft', display_order: 0 },
    fields: galleryPhotoFields,
  },
  'academic-gallery': {
    key: 'academic-gallery', title: 'Graduation Photos', singular: 'graduation photo', table: 'gallery_images', orderBy: 'display_order', orderable: true, presentation: 'photo-grid', albumScope: 'academics',
    description: 'Photos shown only in the Academics graduation section. Albums cannot be created here.', titleField: 'caption_en', subtitleField: 'status',
    defaults: { album_id: '', image_url: '', caption_en: '', caption_ta: '', alt_en: '', alt_ta: '', featured: false, status: 'draft', display_order: 0 },
    fields: galleryPhotoFields,
  },
}
