// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { maxAudioBytes, maxImageBytes, validateAudioFile, validateImageFile } from './mediaService'

describe('media upload validation', () => {
  it('accepts approved browser image formats within the size limit', () => {
    const file = new File(['image'], 'church.webp', { type: 'image/webp' })
    expect(() => validateImageFile(file)).not.toThrow()
  })

  it('rejects unsafe file types', () => {
    const file = new File(['<svg onload=alert(1)>'], 'unsafe.svg', { type: 'image/svg+xml' })
    expect(() => validateImageFile(file)).toThrow(/JPG, PNG, WebP or AVIF/)
  })

  it('rejects oversized images', () => {
    const file = new File([new Uint8Array(maxImageBytes + 1)], 'large.jpg', { type: 'image/jpeg' })
    expect(() => validateImageFile(file)).toThrow(/8 MB or smaller/)
  })

  it('accepts supported church audio formats', () => {
    const file = new File(['audio'], 'message.mp3', { type: 'audio/mpeg' })
    expect(() => validateAudioFile(file)).not.toThrow()
  })

  it('rejects unsafe audio upload types', () => {
    const file = new File(['script'], 'message.html', { type: 'text/html' })
    expect(() => validateAudioFile(file)).toThrow(/MP3, M4A, WAV or OGG/)
  })

  it('rejects audio larger than 50 MB', () => {
    const file = { name: 'large.mp3', type: 'audio/mpeg', size: maxAudioBytes + 1 } as File
    expect(() => validateAudioFile(file)).toThrow(/50 MB or smaller/)
  })
})
