import { describe, expect, it } from 'vitest'
import { indiaDateKey, millisecondsUntilNextIndiaDay } from './indiaDate'

describe('India daily rotation clock', () => {
  it('changes the calendar date at India midnight', () => {
    expect(indiaDateKey(new Date('2026-11-07T18:29:59.000Z'))).toBe('2026-11-07')
    expect(indiaDateKey(new Date('2026-11-07T18:30:00.000Z'))).toBe('2026-11-08')
  })

  it('calculates the delay to the next India midnight', () => {
    expect(millisecondsUntilNextIndiaDay(new Date('2026-11-07T18:29:00.000Z'))).toBe(60_000)
    expect(millisecondsUntilNextIndiaDay(new Date('2026-11-07T12:30:00.000Z'))).toBe(6 * 60 * 60_000)
  })
})
