import type { LocalizedText } from '../types/content'

export const churchInfo = {
  name: 'Worship to Jesus Cathedral',
  shortName: 'WJ Cathedral',
  locationShort: { en: 'Nannilam, Tamil Nadu', ta: 'நன்னிலம், தமிழ்நாடு' } satisfies LocalizedText,
  address: {
    en: 'Near Telephone Exchange, Sothakudi Road, Nannilam, Tamil Nadu',
    ta: 'தொலைபேசி நிலையம் அருகில், சோத்தக்குடி சாலை, நன்னிலம், தமிழ்நாடு',
  } satisfies LocalizedText,
  phone: '+919788056467',
  phoneDisplay: '+91 97880 56467',
  mapsUrl: 'https://maps.app.goo.gl/Dc9ohp6aNdBD265K9?g_st=ic',
  verificationNote: {
    en: 'Address, phone number and recurring times were supplied as public details and require final church confirmation before launch.',
    ta: 'முகவரி, தொலைபேசி எண் மற்றும் வழக்கமான நேரங்கள் பொது விவரங்களாக வழங்கப்பட்டவை. வெளியீட்டிற்கு முன் திருச்சபையின் இறுதி உறுதிப்படுத்தல் தேவை.',
  } satisfies LocalizedText,
} as const

export const navItems = [
  { id: 'home', href: '#home', labelKey: 'nav.home' },
  { id: 'about', href: '#about', labelKey: 'nav.about' },
  { id: 'worship', href: '#worship', labelKey: 'nav.worship' },
  { id: 'events', href: '#events', labelKey: 'nav.events' },
  { id: 'sermons', href: '#sermons', labelKey: 'nav.sermons' },
  { id: 'gallery', href: '#gallery', labelKey: 'nav.gallery' },
  { id: 'contact', href: '#contact', labelKey: 'nav.contact' },
] as const

