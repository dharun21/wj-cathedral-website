// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { maxImageBytes, validateImageFile } from './mediaService'

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
})
