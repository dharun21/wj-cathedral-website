export type Language = 'en' | 'ta'

export type LocalizedText = Record<Language, string>

export type VerificationStatus = 'supplied-needs-confirmation' | 'public-source' | 'placeholder'

export interface NavItem {
  id: string
  href: `#${string}`
  labelKey: string
}

export interface HeroSlide {
  id: string
  eyebrow: LocalizedText
  title: LocalizedText
  description: LocalizedText
  image: string
  imageAlt: LocalizedText
  cta: { href: `#${string}`; label: LocalizedText }
  secondaryCta?: { href: `#${string}`; label: LocalizedText }
  mediaStatus: 'placeholder-awaiting-approved-photo'
}

export interface Service {
  id: string
  name: LocalizedText
  day: LocalizedText
  time: LocalizedText
  description: LocalizedText
  icon: 'sun' | 'moon'
  verification: VerificationStatus
}

export interface Sermon {
  id: string
  videoId: string
  title: LocalizedText
  description: LocalizedText
  verification: VerificationStatus
}

export interface GalleryItem {
  id: string
  src: string
  alt: LocalizedText
  category: LocalizedText
  approved: boolean
}

