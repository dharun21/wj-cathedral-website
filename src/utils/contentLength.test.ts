import { describe, expect, it } from 'vitest'
import { contentLengthClass } from './contentLength'

describe('content-aware carousel title sizing', () => {
  it('uses progressively smaller tiers as editable titles become longer', () => {
    expect(contentLengthClass('A'.repeat(55))).toBe('')
    expect(contentLengthClass('A'.repeat(56))).toBe('is-medium-title')
    expect(contentLengthClass('A'.repeat(96))).toBe('is-long-title')
    expect(contentLengthClass('A'.repeat(151))).toBe('is-extra-long-title')
  })

  it('supports wider thresholds for full Bible verse text', () => {
    const verseThresholds = { medium: 100, long: 220, extraLong: 360 }
    expect(contentLengthClass('A'.repeat(135), verseThresholds)).toBe('is-medium-title')
    expect(contentLengthClass('A'.repeat(250), verseThresholds)).toBe('is-long-title')
    expect(contentLengthClass('A'.repeat(400), verseThresholds)).toBe('is-extra-long-title')
  })
})
