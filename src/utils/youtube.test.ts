import { describe, expect, it } from 'vitest'
import { canonicalYouTubeUrl, extractYouTubeId } from './youtube'

describe('YouTube URL validation', () => {
  it.each([
    ['https://www.youtube.com/live/ul8G9GUBCXA?si=example', 'ul8G9GUBCXA'],
    ['https://youtu.be/aYlDedVM1us?si=example', 'aYlDedVM1us'],
    ['https://www.youtube.com/watch?v=Zgd1Oxj7HiA', 'Zgd1Oxj7HiA'],
    ['https://www.youtube.com/embed/ZeVjCUK8Pbg', 'ZeVjCUK8Pbg'],
    ['Ovj6pE-0KO4', 'Ovj6pE-0KO4'],
  ])('extracts the supported video ID from %s', (url, expected) => expect(extractYouTubeId(url)).toBe(expected))

  it('rejects unsupported hosts and malformed IDs', () => {
    expect(extractYouTubeId('https://example.com/watch?v=ul8G9GUBCXA')).toBeNull()
    expect(extractYouTubeId('javascript:alert(1)')).toBeNull()
    expect(extractYouTubeId('short')).toBeNull()
  })

  it('creates a canonical HTTPS watch URL', () => {
    expect(canonicalYouTubeUrl('ul8G9GUBCXA')).toBe('https://www.youtube.com/watch?v=ul8G9GUBCXA')
  })
})
