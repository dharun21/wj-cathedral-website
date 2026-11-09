import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { isSupabaseConfigured } from '../lib/env'
import {
  fetchPublishedAnnouncements,
  fetchPublishedAcademicCourses,
  fetchPublishedAcademicSettings,
  fetchPublishedAudioAlbumSummary,
  fetchPublishedAudioLibrary,
  fetchPublishedEvents,
  fetchDailyBibleVerse,
  fetchPublishedGallery,
  fetchPublishedHeroSlides,
  fetchPublishedMinistries,
  fetchPublishedSiteSettings,
  fetchPublishedTranslations,
  fetchPublishedVideos,
  fetchPublishedWorshipServices,
} from '../services/contentService'
import type { GalleryItem, HeroSlide, LocalizedText, Sermon, Service } from '../types/content'
import type { HeroSlideRow, MinistryRow } from '../types/database'
import { indiaDateKey, millisecondsUntilNextIndiaDay } from '../utils/indiaDate'

const MINUTE = 60_000
const publicCache = {
  timeSensitive: { staleTime: 10 * MINUTE, gcTime: 60 * MINUTE },
  homepage: { staleTime: 25 * MINUTE, gcTime: 2 * 60 * MINUTE },
  media: { staleTime: 30 * MINUTE, gcTime: 2 * 60 * MINUTE },
  churchInfo: { staleTime: 60 * MINUTE, gcTime: 4 * 60 * MINUTE },
} as const

function localized(en: string, ta: string): LocalizedText {
  return { en, ta }
}

function approvedHash(value: string | null, fallback: `#${string}`): `#${string}` {
  return value?.startsWith('#') && /^#[a-z0-9\-/]+$/i.test(value) ? value as `#${string}` : fallback
}

function mapHeroSlide(row: HeroSlideRow): HeroSlide {
  const secondaryHref = row.secondary_cta_href ? approvedHash(row.secondary_cta_href, '#home') : null
  const builtInHomeIds = new Set([
    '10000000-0000-4000-8000-000000000001',
    '10000000-0000-4000-8000-000000000002',
    '10000000-0000-4000-8000-000000000004',
    '10000000-0000-4000-8000-000000000005',
    '10000000-0000-4000-8000-000000000006',
  ])
  const showCta = row.scope !== 'home' || row.slide_kind === 'default' || builtInHomeIds.has(row.id)
  return {
    id: row.id,
    eyebrow: localized(row.eyebrow_en, row.eyebrow_ta),
    title: localized(row.title_en, row.title_ta),
    description: localized(row.description_en, row.description_ta),
    image: row.image_url || './banners/welcome.svg',
    imageAlt: localized(row.image_alt_en, row.image_alt_ta),
    ...(showCta ? { cta: { href: approvedHash(row.cta_href, '#home'), label: localized(row.cta_label_en, row.cta_label_ta) } } : {}),
    ...(showCta && secondaryHref && row.secondary_cta_label_en && row.secondary_cta_label_ta
      ? { secondaryCta: { href: secondaryHref, label: localized(row.secondary_cta_label_en, row.secondary_cta_label_ta) } }
      : {}),
    mediaStatus: row.image_url ? 'approved-client-supplied' : 'placeholder-awaiting-approved-photo',
  }
}

export function usePublishedTranslations() {
  const query = useQuery({
    queryKey: ['public', 'page-content'],
    queryFn: fetchPublishedTranslations,
    enabled: isSupabaseConfigured,
    ...publicCache.homepage,
  })
  const translations = useMemo(() => Object.fromEntries((query.data ?? []).map((item) => [
    item.content_key,
    localized(item.content_en, item.content_ta),
  ])), [query.data]) as Record<string, LocalizedText>
  return { ...query, translations }
}

export function usePublishedHeroSlides(scope: HeroSlideRow['scope'], fallback: HeroSlide[]) {
  const query = useQuery({
    queryKey: ['public', 'hero-slides', scope],
    queryFn: () => fetchPublishedHeroSlides(scope),
    enabled: isSupabaseConfigured,
    select: (rows) => rows.map(mapHeroSlide),
    ...publicCache.homepage,
  })
  return { ...query, data: isSupabaseConfigured ? (query.data ?? []) : fallback, usingFallback: !isSupabaseConfigured }
}

export function usePublishedHeroRows(scope: HeroSlideRow['scope']) {
  return useQuery({
    queryKey: ['public', 'hero-slides', scope],
    queryFn: () => fetchPublishedHeroSlides(scope),
    enabled: isSupabaseConfigured,
    ...publicCache.homepage,
  })
}

export function usePublishedAcademicSettings() {
  return useQuery({
    queryKey: ['public', 'academic-settings'],
    queryFn: fetchPublishedAcademicSettings,
    enabled: isSupabaseConfigured,
    ...publicCache.churchInfo,
  })
}

export function usePublishedAcademicCourses() {
  return useQuery({
    queryKey: ['public', 'academic-courses'],
    queryFn: fetchPublishedAcademicCourses,
    enabled: isSupabaseConfigured,
    ...publicCache.churchInfo,
  })
}

export function useDailyBibleVerse() {
  const [date, setDate] = useState(() => indiaDateKey())

  useEffect(() => {
    const timer = window.setTimeout(() => setDate(indiaDateKey()), millisecondsUntilNextIndiaDay() + 250)
    return () => window.clearTimeout(timer)
  }, [date])

  return useQuery({
    queryKey: ['public', 'daily-bible-verse', date],
    queryFn: () => fetchDailyBibleVerse(date),
    enabled: isSupabaseConfigured,
    staleTime: millisecondsUntilNextIndiaDay(),
    gcTime: 2 * 24 * 60 * 60_000,
  })
}

export function usePublishedWorship(fallback: Service[]) {
  const query = useQuery({
    queryKey: ['public', 'worship-services'],
    queryFn: fetchPublishedWorshipServices,
    enabled: isSupabaseConfigured,
    select: (rows): Service[] => rows.map((row, index) => ({
      id: row.id,
      name: localized(row.name_en, row.name_ta),
      day: localized(row.day_en, row.day_ta),
      time: localized(row.time_display_en, row.time_display_ta),
      description: localized(row.description_en, row.description_ta),
      icon: index === 0 ? 'sun' : 'moon',
      verification: 'public-source',
    })),
    ...publicCache.churchInfo,
  })
  return { ...query, data: isSupabaseConfigured ? (query.data ?? []) : fallback }
}

export function usePublishedAnnouncements() {
  return useQuery({ queryKey: ['public', 'announcements'], queryFn: fetchPublishedAnnouncements, enabled: isSupabaseConfigured, ...publicCache.timeSensitive })
}

export function usePublishedEvents() {
  return useQuery({ queryKey: ['public', 'events'], queryFn: fetchPublishedEvents, enabled: isSupabaseConfigured, ...publicCache.timeSensitive })
}

export function usePublishedVideos(fallback: Sermon[]) {
  const query = useQuery({
    queryKey: ['public', 'videos'],
    queryFn: fetchPublishedVideos,
    enabled: isSupabaseConfigured,
    select: (rows): Sermon[] => rows.map((row) => ({
      id: row.id,
      videoId: row.youtube_id,
      title: localized(row.title_en, row.title_ta),
      description: localized(row.description_en, row.description_ta),
      verification: 'public-source',
    })),
    ...publicCache.media,
  })
  return { ...query, data: isSupabaseConfigured ? (query.data ?? []) : fallback }
}

export function usePublishedVideoRows() {
  return useQuery({
    queryKey: ['public', 'video-rows'],
    queryFn: fetchPublishedVideos,
    enabled: isSupabaseConfigured,
    ...publicCache.media,
  })
}

export function usePublishedAudioLibrary() {
  return useQuery({
    queryKey: ['public', 'audio-library'],
    queryFn: fetchPublishedAudioLibrary,
    enabled: isSupabaseConfigured,
    ...publicCache.media,
  })
}

export function usePublishedAudioAlbumSummary() {
  return useQuery({
    queryKey: ['public', 'audio-album-summary'],
    queryFn: fetchPublishedAudioAlbumSummary,
    enabled: isSupabaseConfigured,
    ...publicCache.media,
  })
}

export function usePublishedGallery(fallback: GalleryItem[], pageScope: 'gallery' | 'academics' = 'gallery') {
  const query = useQuery({
    queryKey: ['public', 'gallery', pageScope],
    queryFn: () => fetchPublishedGallery(pageScope),
    enabled: isSupabaseConfigured,
    select: ({ albums, images }): GalleryItem[] => {
      const albumMap = new Map(albums.map((album) => [album.id, localized(album.title_en, album.title_ta)]))
      return images.map((image) => ({
        id: image.id,
        src: image.image_url || '',
        alt: localized(image.alt_en, image.alt_ta),
        category: albumMap.get(image.album_id) ?? localized('Gallery', 'படத்தொகுப்பு'),
        approved: true,
      })).filter((image) => image.src)
    },
    ...publicCache.media,
  })
  return { ...query, data: isSupabaseConfigured ? (query.data ?? []) : fallback }
}

export function usePublishedMinistries(groupKey: MinistryRow['group_key']) {
  return useQuery({
    queryKey: ['public', 'ministries', groupKey],
    queryFn: () => fetchPublishedMinistries(groupKey),
    enabled: isSupabaseConfigured,
    ...publicCache.churchInfo,
  })
}

export function usePublishedSiteSettings() {
  return useQuery({
    queryKey: ['public', 'site-settings'],
    queryFn: fetchPublishedSiteSettings,
    enabled: isSupabaseConfigured,
    ...publicCache.churchInfo,
  })
}
