const youtubeIdPattern = /^[a-zA-Z0-9_-]{11}$/

export function extractYouTubeId(value: string): string | null {
  const trimmed = value.trim()
  if (youtubeIdPattern.test(trimmed)) return trimmed

  try {
    const url = new URL(trimmed)
    const host = url.hostname.replace(/^www\./, '')
    if (host === 'youtu.be') {
      const id = url.pathname.split('/').filter(Boolean)[0]
      return id && youtubeIdPattern.test(id) ? id : null
    }
    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'music.youtube.com') {
      const pathParts = url.pathname.split('/').filter(Boolean)
      const id = url.searchParams.get('v')
        ?? (['live', 'shorts', 'embed'].includes(pathParts[0] ?? '') ? pathParts[1] : null)
      return id && youtubeIdPattern.test(id) ? id : null
    }
  } catch {
    return null
  }
  return null
}

export function canonicalYouTubeUrl(videoId: string) {
  return `https://www.youtube.com/watch?v=${videoId}`
}
