// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { maxAudioBytes, maxImageBytes, validateAudioFile, validateImageFile } from './mediaService'
import { maxSourceImageBytes, validateOptimizedImage } from '../utils/imageOptimization'

describe('media upload validation', () => {
  it('accepts approved browser image formats within the size limit', () => {
    const file = new File(['image'], 'church.webp', { type: 'image/webp' })
    expect(() => validateImageFile(file)).not.toThrow()
  })

  it('rejects unsafe file types', () => {
    const file = new File(['<svg onload=alert(1)>'], 'unsafe.svg', { type: 'image/svg+xml' })
    expect(() => validateImageFile(file)).toThrow(/never converted to WebP/)
  })

  it('allows a large source image to proceed to optimization', () => {
    const file = { name: 'large.jpg', type: 'image/jpeg', size: maxImageBytes + 1 } as File
    expect(() => validateImageFile(file)).not.toThrow()
  })

  it('rejects a source image too large to process safely', () => {
    const file = { name: 'huge.jpg', type: 'image/jpeg', size: maxSourceImageBytes + 1 } as File
    expect(() => validateImageFile(file)).toThrow(/smaller than 50 MB/)
  })

  it('enforces the final two-megabyte upload limit', () => {
    const file = { name: 'optimized.webp', type: 'image/webp', size: maxImageBytes + 1 } as File
    expect(() => validateOptimizedImage(file)).toThrow(/larger than 2 MB/)
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
