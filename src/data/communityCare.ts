import type { LocalizedText } from '../types/content'

export type CommunityCareIcon = 'tree' | 'heart' | 'health' | 'family' | 'widow' | 'hospital' | 'camp' | 'tuition' | 'school-kit'
export type CommunityHeroIcon = 'tree' | 'heart' | 'health'

export interface CommunityHeroSlide {
  id: 'stewardship' | 'compassion' | 'opportunity'
  eyebrow: LocalizedText
  title: LocalizedText
  description: LocalizedText
  ctaLabel: LocalizedText
  ctaHref: `#${string}`
  icon: CommunityHeroIcon
}

export interface CommunityProgramme {
  id: string
  title: LocalizedText
  description: LocalizedText
  icon: CommunityCareIcon
}

export const communityHeroSlides: CommunityHeroSlide[] = [
  {
    id: 'stewardship',
    eyebrow: { en: 'Creation care', ta: 'படைப்பைப் பேணுதல்' },
    title: {
      en: 'One crore trees. A living legacy for generations.',
      ta: 'ஒரு கோடி மரங்கள். தலைமுறைகளுக்கான உயிருள்ள பாரம்பரியம்.',
    },
    description: {
      en: 'A long-term tree-planting mission that invites churches, families and neighbourhoods to care for God’s creation together.',
      ta: 'தேவனுடைய படைப்பை ஒன்றிணைந்து பேண திருச்சபைகள், குடும்பங்கள் மற்றும் சுற்றுப்புற மக்களை அழைக்கும் நீண்டகால மரநடுகைப் பணி.',
    },
    ctaLabel: { en: 'Explore the mission', ta: 'இந்தப் பணியை அறியுங்கள்' },
    ctaHref: '#care-environment',
    icon: 'tree',
  },
  {
    id: 'compassion',
    eyebrow: { en: 'Compassion in action', ta: 'செயலில் இரக்கம்' },
    title: {
      en: 'Standing beside families with dignity and hope.',
      ta: 'கண்ணியத்துடனும் நம்பிக்கையுடனும் குடும்பங்களின் அருகில் நிற்கிறோம்.',
    },
    description: {
      en: 'Practical care for families facing hardship, widows who need encouragement and patients receiving hospital treatment.',
      ta: 'சிரமங்களை எதிர்கொள்ளும் குடும்பங்கள், ஆதரவு தேவைப்படும் விதவைகள் மற்றும் மருத்துவமனையில் சிகிச்சை பெறும் நோயாளிகளுக்கான நடைமுறை அக்கறை.',
    },
    ctaLabel: { en: 'See our areas of care', ta: 'எங்கள் அக்கறைப் பணிகளைப் பாருங்கள்' },
    ctaHref: '#care-compassion',
    icon: 'heart',
  },
  {
    id: 'opportunity',
    eyebrow: { en: 'Health and learning', ta: 'நலவாழ்வும் கல்வியும்' },
    title: {
      en: 'Bringing care and opportunity closer to every neighbourhood.',
      ta: 'ஒவ்வொரு பகுதியிலும் அக்கறையையும் வாய்ப்பையும் அருகில் கொண்டு வருகிறோம்.',
    },
    description: {
      en: 'Community medical camps, free neighbourhood tuition and school essentials help people move forward with confidence.',
      ta: 'சமூக மருத்துவ முகாம்கள், இலவச பகுதிநேரப் பயிற்சி மற்றும் பள்ளி உபகரணங்கள் மக்கள் நம்பிக்கையுடன் முன்னேற உதவுகின்றன.',
    },
    ctaLabel: { en: 'View health and education', ta: 'நலவாழ்வு மற்றும் கல்விப் பணிகளைப் பாருங்கள்' },
    ctaHref: '#care-health',
    icon: 'health',
  },
]

export const compassionProgrammes: CommunityProgramme[] = [
  {
    id: 'family-relief',
    title: { en: 'Family Relief & Essential Support', ta: 'குடும்ப நிவாரணமும் அத்தியாவசிய உதவியும்' },
    description: {
      en: 'Compassionate, need-based assistance for low-income families facing difficult seasons, offered with respect and dignity.',
      ta: 'சிரமமான காலங்களை எதிர்கொள்ளும் குறைந்த வருமானக் குடும்பங்களுக்கு மரியாதையுடனும் கண்ணியத்துடனும் தேவைக்கேற்ற அன்பான உதவி.',
    },
    icon: 'family',
  },
  {
    id: 'widow-care',
    title: { en: 'Widow Care & Encouragement', ta: 'விதவைகளுக்கான அக்கறையும் ஊக்கமும்' },
    description: {
      en: 'Pastoral encouragement, practical assistance and a caring church relationship for widows in the community.',
      ta: 'சமூகத்தில் உள்ள விதவைகளுக்கு மேய்ப்புப் பராமரிப்பு, நடைமுறை உதவி மற்றும் அன்பான திருச்சபை உறவு.',
    },
    icon: 'widow',
  },
]

export const healthProgrammes: CommunityProgramme[] = [
  {
    id: 'hospital-care',
    title: { en: 'Hospital Patient Care', ta: 'மருத்துவமனை நோயாளர் பராமரிப்பு' },
    description: {
      en: 'Prayerful visits, encouragement and appropriate practical support for patients and the families caring for them.',
      ta: 'நோயாளிகளுக்கும் அவர்களைப் பராமரிக்கும் குடும்பங்களுக்கும் ஜெபத்துடன் கூடிய சந்திப்பு, ஊக்கம் மற்றும் தேவையான நடைமுறை ஆதரவு.',
    },
    icon: 'hospital',
  },
  {
    id: 'medical-camps',
    title: { en: 'Community Medical Camps', ta: 'சமூக மருத்துவ முகாம்கள்' },
    description: {
      en: 'Locally organised health camps intended to bring basic screening, health awareness and professional guidance closer to the community.',
      ta: 'அடிப்படை பரிசோதனை, சுகாதார விழிப்புணர்வு மற்றும் மருத்துவ வழிகாட்டுதலை சமூகத்திற்கு அருகில் கொண்டுவரும் உள்ளூர் மருத்துவ முகாம்கள்.',
    },
    icon: 'camp',
  },
]

export const educationProgrammes: CommunityProgramme[] = [
  {
    id: 'free-tuition',
    title: { en: 'Free Neighbourhood Tuition', ta: 'இலவச பகுதிநேரப் பயிற்சி மையங்கள்' },
    description: {
      en: 'Free learning support planned across multiple locations in town so children can study closer to home.',
      ta: 'குழந்தைகள் தங்கள் வீட்டிற்கு அருகிலேயே கல்வி உதவி பெற நகரின் பல பகுதிகளில் திட்டமிடப்படும் இலவச பயிற்சி மையங்கள்.',
    },
    icon: 'tuition',
  },
  {
    id: 'student-essentials',
    title: { en: 'Free School Essentials', ta: 'இலவச பள்ளி உபகரணங்கள்' },
    description: {
      en: 'School bags, writing kits and essential stationery supplied free to help students begin their studies prepared and encouraged.',
      ta: 'மாணவர்கள் ஆயத்தமாகவும் ஊக்கத்துடனும் கல்வியைத் தொடங்க பள்ளிப்பைகள், எழுதுபொருள் தொகுப்புகள் மற்றும் அத்தியாவசிய அலுவல் பொருட்கள் இலவசமாக வழங்குதல்.',
    },
    icon: 'school-kit',
  },
]
