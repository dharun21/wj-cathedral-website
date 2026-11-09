import type { QueryClient, QueryKey } from '@tanstack/react-query'
import type { CmsTableName } from '../types/database'

const channelName = 'wj-cathedral-published-content-v1'
const storageKey = 'wj-cathedral-published-content-change'

const publicKeysByTable: Partial<Record<CmsTableName, readonly QueryKey[]>> = {
  site_settings: [['public', 'site-settings']],
  page_content: [['public', 'page-content']],
  hero_slides: [['public', 'hero-slides']],
  academic_settings: [['public', 'academic-settings']],
  academic_courses: [['public', 'academic-courses']],
  gallery_albums: [['public', 'gallery']],
  gallery_images: [['public', 'gallery']],
  announcements: [['public', 'announcements']],
  events: [['public', 'events']],
  videos: [['public', 'videos'], ['public', 'video-rows']],
  audio_albums: [['public', 'audio-library'], ['public', 'audio-album-summary']],
  audio_tracks: [['public', 'audio-library'], ['public', 'audio-album-summary']],
  worship_services: [['public', 'worship-services']],
  ministries: [['public', 'ministries']],
  daily_bible_verses: [['public', 'daily-bible-verse']],
}

function keysFor(table: CmsTableName) {
  return publicKeysByTable[table] ?? []
}

async function invalidateLocal(queryClient: QueryClient, table: CmsTableName) {
  await Promise.all(keysFor(table).map((queryKey) => queryClient.invalidateQueries({ queryKey })))
}

function broadcast(table: CmsTableName) {
  if (typeof window === 'undefined') return
  if (typeof BroadcastChannel === 'function') {
    const channel = new BroadcastChannel(channelName)
    channel.postMessage(table)
    channel.close()
    return
  }
  try {
    window.localStorage.setItem(storageKey, JSON.stringify({ table, changedAt: Date.now() }))
  } catch {
    // Cross-tab freshness is a progressive enhancement when browser storage is unavailable.
  }
}

export function invalidatePublishedContent(queryClient: QueryClient, table: CmsTableName) {
  const invalidation = invalidateLocal(queryClient, table)
  broadcast(table)
  return invalidation
}

function isCmsTableName(value: unknown): value is CmsTableName {
  return typeof value === 'string' && value in publicKeysByTable
}

export function subscribeToPublishedContentChanges(queryClient: QueryClient) {
  if (typeof window === 'undefined') return () => undefined
  if (typeof BroadcastChannel === 'function') {
    const channel = new BroadcastChannel(channelName)
    channel.onmessage = (event: MessageEvent<unknown>) => {
      if (isCmsTableName(event.data)) void invalidateLocal(queryClient, event.data)
    }
    return () => channel.close()
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key !== storageKey || !event.newValue) return
    try {
      const value = JSON.parse(event.newValue) as { table?: unknown }
      if (isCmsTableName(value.table)) void invalidateLocal(queryClient, value.table)
    } catch {
      // Ignore malformed or unrelated local storage values.
    }
  }
  window.addEventListener('storage', handleStorage)
  return () => window.removeEventListener('storage', handleStorage)
}

