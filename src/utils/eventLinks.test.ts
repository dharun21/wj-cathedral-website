import { describe, expect, it } from 'vitest'
import { eventContactHref, opensInNewTab } from './eventLinks'

describe('event links', () => {
  it('hides a contact action when no contact is provided', () => {
    expect(eventContactHref(null)).toBeNull()
    expect(eventContactHref('   ')).toBeNull()
  })

  it('turns public contact details into usable links', () => {
    expect(eventContactHref('+91 97503 08877')).toBe('tel:+919750308877')
    expect(eventContactHref('events@example.com')).toBe('mailto:events@example.com')
    expect(eventContactHref('https://example.com/contact')).toBe('https://example.com/contact')
  })

  it('opens only web links in a new tab', () => {
    expect(opensInNewTab('https://example.com/register')).toBe(true)
    expect(opensInNewTab('tel:+919750308877')).toBe(false)
  })
})
