export function eventContactHref(value: string | null | undefined) {
  const contact = value?.trim()
  if (!contact) return null
  if (/^(https:\/\/|tel:|mailto:)/i.test(contact)) return contact
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) return `mailto:${contact}`

  const phone = contact.replace(/[^\d+]/g, '')
  return phone ? `tel:${phone}` : null
}

export function opensInNewTab(value: string) {
  return /^https:\/\//i.test(value)
}
