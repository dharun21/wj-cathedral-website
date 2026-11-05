import type { HeroSlide } from '../types/content'

export const heroSlides: HeroSlide[] = [
  {
    id: 'welcome',
    eyebrow: { en: 'A place to worship, pray and belong', ta: 'ஆராதிக்கவும், ஜெபிக்கவும், ஒன்றிணையவும் ஓர் இடம்' },
    title: { en: 'Welcome to WJ Cathedral', ta: 'WJ Cathedral-க்கு அன்புடன் வரவேற்கிறோம்' },
    description: {
      en: 'Worship to Jesus Cathedral welcomes families, neighbours and first-time visitors in Nannilam.',
      ta: 'நன்னிலத்தில் உள்ள குடும்பங்கள், அயலார்கள் மற்றும் முதன்முறையாக வருகை தருபவர்கள் அனைவரையும் Worship to Jesus Cathedral அன்புடன் வரவேற்கிறது.',
    },
    image: './banners/welcome.svg',
    imageAlt: {
      en: 'Decorative blue and gold artwork reserved for an approved WJ Cathedral welcome photograph',
      ta: 'அங்கீகரிக்கப்பட்ட WJ Cathedral வரவேற்புப் புகைப்படத்திற்கான நீலம் மற்றும் தங்க நிற அலங்காரப் படம்',
    },
    cta: { href: '#contact', label: { en: 'Plan your visit', ta: 'உங்கள் வருகையைத் திட்டமிடுங்கள்' } },
    secondaryCta: { href: '#sermons', label: { en: 'Watch sermons', ta: 'செய்திகளைக் காணுங்கள்' } },
    mediaStatus: 'placeholder-awaiting-approved-photo',
  },
  {
    id: 'sunday',
    eyebrow: { en: 'Gather with us', ta: 'எங்களோடு இணைந்திடுங்கள்' },
    title: { en: 'Come as you are this Sunday', ta: 'இந்த ஞாயிறு அப்படியே வாருங்கள்' },
    description: {
      en: 'A simple invitation to worship, hear God’s word and share fellowship with the church family.',
      ta: 'ஆராதிக்கவும், தேவ வார்த்தையைக் கேட்கவும், திருச்சபைக் குடும்பத்தோடு ஐக்கியப்படவும் அன்புடன் அழைக்கிறோம்.',
    },
    image: './banners/worship.svg',
    imageAlt: {
      en: 'Decorative warm artwork reserved for an approved Sunday worship photograph',
      ta: 'அங்கீகரிக்கப்பட்ட ஞாயிறு ஆராதனைப் புகைப்படத்திற்கான அலங்காரப் படம்',
    },
    cta: { href: '#worship', label: { en: 'See worship timings', ta: 'ஆராதனை நேரங்களைப் பாருங்கள்' } },
    mediaStatus: 'placeholder-awaiting-approved-photo',
  },
  {
    id: 'prayer',
    eyebrow: { en: 'Prayer and fellowship', ta: 'ஜெபமும் ஐக்கியமும்' },
    title: { en: 'You are not alone', ta: 'நீங்கள் தனியாக இல்லை' },
    description: {
      en: 'Find a welcoming place to pause, pray and connect with people in your community.',
      ta: 'அமைதியாய் நின்று, ஜெபித்து, உங்கள் சமூக மக்களோடு இணைய அன்பான ஓர் இடம்.',
    },
    image: './banners/prayer.svg',
    imageAlt: {
      en: 'Decorative midnight artwork reserved for an approved prayer gathering photograph',
      ta: 'அங்கீகரிக்கப்பட்ட ஜெபக் கூடுகைப் புகைப்படத்திற்கான இரவுநேர அலங்காரப் படம்',
    },
    cta: { href: '#contact', label: { en: 'Contact the church', ta: 'திருச்சபையைத் தொடர்புகொள்ளுங்கள்' } },
    mediaStatus: 'placeholder-awaiting-approved-photo',
  },
]

