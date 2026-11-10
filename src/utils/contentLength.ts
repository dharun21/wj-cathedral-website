export interface ContentLengthThresholds {
  medium: number
  long: number
  extraLong: number
}

const defaultThresholds: ContentLengthThresholds = {
  medium: 55,
  long: 95,
  extraLong: 150,
}

export function contentLengthClass(value: string, thresholds: ContentLengthThresholds = defaultThresholds) {
  const length = Array.from(value.trim()).length
  if (length > thresholds.extraLong) return 'is-extra-long-title'
  if (length > thresholds.long) return 'is-long-title'
  if (length > thresholds.medium) return 'is-medium-title'
  return ''
}
