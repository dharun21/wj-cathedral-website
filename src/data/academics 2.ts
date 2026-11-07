import type { LocalizedText } from '../types/content'

export interface AcademicHeroSlide {
  id: 'admissions' | 'licence' | 'graduation'
  eyebrow: LocalizedText
  title: LocalizedText
  description: LocalizedText
  ctaLabel: LocalizedText
  ctaHref: `#${string}`
}

export const academicHeroSlides: AcademicHeroSlide[] = [
  {
    id: 'admissions',
    eyebrow: { en: 'Admissions', ta: 'சேர்க்கை' },
    title: {
      en: 'Begin a journey of biblical learning and faithful service',
      ta: 'வேதாகமக் கற்றலும் உண்மையுள்ள ஊழியமும் நிறைந்த பயணத்தைத் தொடங்குங்கள்',
    },
    description: {
      en: 'Explore a church-rooted learning pathway designed to deepen biblical understanding, spiritual maturity and practical ministry service.',
      ta: 'வேதாகமப் புரிதல், ஆவிக்குரிய முதிர்ச்சி மற்றும் நடைமுறை ஊழியப் பணியை ஆழப்படுத்தும் திருச்சபை சார்ந்த கற்றல் பாதையை அறிந்துகொள்ளுங்கள்.',
    },
    ctaLabel: { en: 'View admission form', ta: 'சேர்க்கைப் படிவத்தைப் பாருங்கள்' },
    ctaHref: '#academics-admission',
  },
  {
    id: 'licence',
    eyebrow: { en: 'Ministry licence pathway', ta: 'ஊழிய உரிமப் பாதை' },
    title: {
      en: 'Clear guidance for responsible ministry preparation',
      ta: 'பொறுப்பான ஊழிய ஆயத்தத்திற்கு தெளிவான வழிகாட்டுதல்',
    },
    description: {
      en: 'Approved eligibility, documentation and licence guidance will be published here after confirmation by the college and church leadership.',
      ta: 'கல்லூரி மற்றும் திருச்சபைத் தலைமையின் உறுதிப்படுத்தலுக்குப் பிறகு அங்கீகரிக்கப்பட்ட தகுதி, ஆவணங்கள் மற்றும் உரிம வழிகாட்டுதல் இங்கே வெளியிடப்படும்.',
    },
    ctaLabel: { en: 'Read the study framework', ta: 'பாடத்திட்ட அமைப்பைப் பாருங்கள்' },
    ctaHref: '#academics-syllabus',
  },
  {
    id: 'graduation',
    eyebrow: { en: 'Joyful graduation', ta: 'மகிழ்வான பட்டமளிப்பு' },
    title: {
      en: 'Celebrating faithful study and a life prepared for service',
      ta: 'உண்மையுள்ள கல்வியையும் ஊழியத்திற்காக ஆயத்தமான வாழ்க்கையையும் கொண்டாடுகிறோம்',
    },
    description: {
      en: 'Graduation honours disciplined learning, spiritual growth and readiness to serve churches and communities with humility.',
      ta: 'ஒழுக்கமான கற்றல், ஆவிக்குரிய வளர்ச்சி மற்றும் பணிவுடன் திருச்சபைகளுக்கும் சமூகங்களுக்கும் சேவை செய்யும் ஆயத்தத்தைப் பட்டமளிப்பு கௌரவிக்கிறது.',
    },
    ctaLabel: { en: 'View graduation gallery', ta: 'பட்டமளிப்புப் படத்தொகுப்பைப் பாருங்கள்' },
    ctaHref: '#academics-graduation',
  },
]

export const academicPillars = [
  {
    id: 'scripture',
    title: { en: 'Scripture-centred learning', ta: 'வேதாகமத்தை மையமாகக் கொண்ட கற்றல்' },
    description: {
      en: 'Learning that begins with Scripture and connects biblical truth with faithful Christian living.',
      ta: 'வேதாகமத்தில் தொடங்கி அதன் சத்தியத்தை உண்மையுள்ள கிறிஸ்தவ வாழ்க்கையோடு இணைக்கும் கற்றல்.',
    },
  },
  {
    id: 'formation',
    title: { en: 'Spiritual formation', ta: 'ஆவிக்குரிய உருவாக்கம்' },
    description: {
      en: 'Study shaped by prayer, character, discipline and a growing relationship with Jesus Christ.',
      ta: 'ஜெபம், நற்குணம், ஒழுக்கம் மற்றும் இயேசு கிறிஸ்துவுடனான வளரும் உறவால் வடிவமைக்கப்படும் கல்வி.',
    },
  },
  {
    id: 'ministry',
    title: { en: 'Practical ministry', ta: 'நடைமுறை ஊழியம்' },
    description: {
      en: 'Preparation that connects classroom understanding with worship, care and service in the local church.',
      ta: 'வகுப்பறைக் கற்றலை உள்ளூர் திருச்சபையின் ஆராதனை, பராமரிப்பு மற்றும் ஊழியத்தோடு இணைக்கும் ஆயத்தம்.',
    },
  },
  {
    id: 'leadership',
    title: { en: 'Servant leadership', ta: 'ஊழியத் தலைமைத்துவம்' },
    description: {
      en: 'Leadership grounded in humility, integrity, responsibility and compassionate care for people.',
      ta: 'பணிவு, நேர்மை, பொறுப்பு மற்றும் மக்கள்மீதான அன்பான அக்கறையில் வேரூன்றிய தலைமைத்துவம்.',
    },
  },
] as const

export const academicModules = [
  {
    id: 'biblical-foundations',
    number: '01',
    title: { en: 'Biblical Foundations', ta: 'வேதாகம அடித்தளங்கள்' },
    description: {
      en: 'A guided introduction to Scripture, its central message and principles for faithful interpretation.',
      ta: 'வேதாகமம், அதன் மையச் செய்தி மற்றும் உண்மையுள்ள விளக்கத்திற்கான கோட்பாடுகள் பற்றிய வழிகாட்டப்பட்ட அறிமுகம்.',
    },
  },
  {
    id: 'faith-doctrine',
    number: '02',
    title: { en: 'Christian Faith & Doctrine', ta: 'கிறிஸ்தவ விசுவாசமும் கோட்பாடும்' },
    description: {
      en: 'Core Christian beliefs explained in relation to discipleship, church life and ministry.',
      ta: 'சீஷத்துவம், திருச்சபை வாழ்க்கை மற்றும் ஊழியத்தோடு தொடர்புபடுத்தி விளக்கப்படும் அடிப்படை கிறிஸ்தவ நம்பிக்கைகள்.',
    },
  },
  {
    id: 'spiritual-formation',
    number: '03',
    title: { en: 'Prayer & Spiritual Formation', ta: 'ஜெபமும் ஆவிக்குரிய உருவாக்கமும்' },
    description: {
      en: 'Practices that nurture prayer, character, personal discipline and a Christ-centred life.',
      ta: 'ஜெபம், நற்குணம், தனிப்பட்ட ஒழுக்கம் மற்றும் கிறிஸ்துவை மையமாகக் கொண்ட வாழ்க்கையை வளர்க்கும் பயிற்சிகள்.',
    },
  },
  {
    id: 'worship-service',
    number: '04',
    title: { en: 'Worship & Church Service', ta: 'ஆராதனையும் திருச்சபைப் பணியும்' },
    description: {
      en: 'Biblical principles for worship, service preparation and responsible participation in church ministry.',
      ta: 'ஆராதனை, ஆராதனை ஆயத்தம் மற்றும் திருச்சபை ஊழியத்தில் பொறுப்பான பங்கேற்புக்கான வேதாகமக் கோட்பாடுகள்.',
    },
  },
  {
    id: 'pastoral-leadership',
    number: '05',
    title: { en: 'Pastoral Care & Servant Leadership', ta: 'மேய்ப்புப் பராமரிப்பும் ஊழியத் தலைமையும்' },
    description: {
      en: 'Foundations for compassionate care, ethical conduct, teamwork and accountable leadership.',
      ta: 'அன்பான பராமரிப்பு, நெறிமுறை நடத்தை, குழுப்பணி மற்றும் பொறுப்புள்ள தலைமைத்துவத்திற்கான அடித்தளங்கள்.',
    },
  },
  {
    id: 'mission-care',
    number: '06',
    title: { en: 'Mission & Community Care', ta: 'சுவிசேஷப் பணியும் சமூக அக்கறையும்' },
    description: {
      en: 'Serving the church’s witness through evangelism, outreach and practical compassion in the community.',
      ta: 'சுவிசேஷ அறிவிப்பு, வெளிச்சேவை மற்றும் சமூகத்தில் நடைமுறை அன்பின் மூலம் திருச்சபையின் சாட்சியைச் சேவித்தல்.',
    },
  },
] as const

export const academicInterestOptions = [
  { value: 'biblical-studies', label: { en: 'Biblical studies', ta: 'வேதாகமக் கல்வி' } },
  { value: 'ministry-formation', label: { en: 'Ministry formation', ta: 'ஊழிய உருவாக்கம்' } },
  { value: 'worship-service', label: { en: 'Worship and church service', ta: 'ஆராதனை மற்றும் திருச்சபைப் பணி' } },
  { value: 'pastoral-care', label: { en: 'Pastoral care and leadership', ta: 'மேய்ப்புப் பராமரிப்பு மற்றும் தலைமைத்துவம்' } },
  { value: 'other', label: { en: 'Other area of interest', ta: 'வேறு ஆர்வப் பகுதி' } },
] as const

