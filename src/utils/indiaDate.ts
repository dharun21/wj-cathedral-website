const INDIA_OFFSET_MS = 5.5 * 60 * 60 * 1000

export function indiaDateKey(now = new Date()) {
  const indiaTime = new Date(now.getTime() + INDIA_OFFSET_MS)
  const year = indiaTime.getUTCFullYear()
  const month = String(indiaTime.getUTCMonth() + 1).padStart(2, '0')
  const day = String(indiaTime.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function millisecondsUntilNextIndiaDay(now = new Date()) {
  const indiaTime = new Date(now.getTime() + INDIA_OFFSET_MS)
  const nextMidnightAsUtc = Date.UTC(indiaTime.getUTCFullYear(), indiaTime.getUTCMonth(), indiaTime.getUTCDate() + 1)
  return Math.max(1_000, nextMidnightAsUtc - indiaTime.getTime())
}
