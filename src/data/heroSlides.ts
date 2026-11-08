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
    image: './hero/welcome-wj-cathedral.jpg',
    imageAlt: {
      en: 'WJ Cathedral church building with the congregation gathered outside in Nannilam',
      ta: 'நன்னிலத்தில் உள்ள WJ Cathedral திருச்சபைக் கட்டிடத்தின் முன் ஒன்றுகூடியுள்ள சபையார்',
    },
    cta: { href: '#contact', label: { en: 'Plan your visit', ta: 'உங்கள் வருகையைத் திட்டமிடுங்கள்' } },
    secondaryCta: { href: '#sermons', label: { en: 'Watch sermons', ta: 'செய்திகளைக் காணுங்கள்' } },
    mediaStatus: 'approved-client-supplied',
  },
  {
    id: 'sunday',
    eyebrow: { en: 'Gather with us', ta: 'எங்களோடு இணைந்திடுங்கள்' },
    title: { en: 'Come as you are this Sunday', ta: 'இந்த ஞாயிறு அப்படியே வாருங்கள்' },
    description: {
      en: 'A simple invitation to worship, hear God’s word and share fellowship with the church family.',
      ta: 'ஆராதிக்கவும், தேவ வார்த்தையைக் கேட்கவும், திருச்சபைக் குடும்பத்தோடு ஐக்கியப்படவும் அன்புடன் அழைக்கிறோம்.',
    },
    image: './hero/come-as-you-are-sunday.jpg',
    imageAlt: {
      en: 'A speaker sharing a joyful Sunday message at WJ Cathedral',
      ta: 'WJ Cathedral மேடையில் மகிழ்ச்சியுடன் ஞாயிறு செய்தியைப் பகிரும் பேச்சாளர்',
    },
    cta: { href: '#worship', label: { en: 'See worship timings', ta: 'ஆராதனை நேரங்களைப் பாருங்கள்' } },
    mediaStatus: 'approved-client-supplied',
  },
  {
    id: 'daily-verse',
    eyebrow: { en: 'Today’s Scripture', ta: 'இன்றைய வேதவசனம்' },
    title: { en: 'Today’s Bible verse', ta: 'இன்றைய வேதவசனம்' },
    description: {
      en: 'An approved bilingual verse will appear here after it is published from the church admin panel.',
      ta: 'திருச்சபை நிர்வாகப் பலகையிலிருந்து வெளியிடப்பட்ட பிறகு அங்கீகரிக்கப்பட்ட இருமொழி வேதவசனம் இங்கே தோன்றும்.',
    },
    image: './hero/daily-bible-verse.jpg',
    imageAlt: {
      en: 'An open Bible illuminated against a deep blue Daily Bible Verse background',
      ta: 'ஆழ்ந்த நீல நிற தினசரி வேதவசனப் பின்னணியில் ஒளிரும் திறந்த வேதாகமம்',
    },
    cta: { href: '#prayer-helpline', label: { en: 'Prayer support', ta: 'ஜெப உதவி' } },
    mediaStatus: 'approved-client-supplied',
    variant: 'daily-verse',
  },
  {
    id: 'college-admissions-2027',
    eyebrow: { en: 'Bible college admissions', ta: 'வேதாகமக் கல்லூரி சேர்க்கை' },
    title: { en: '2027 admissions are now open', ta: '2027 சேர்க்கை தொடங்கியுள்ளது' },
    description: {
      en: 'Apply to Worship To Jesus Bible Institute & College. B.Th, C.Th and Diploma in Music classes begin in January 2027.',
      ta: 'Worship To Jesus Bible Institute & College-ல் விண்ணப்பிக்கலாம். B.Th, C.Th மற்றும் இசைப் பட்டயப் படிப்பு வகுப்புகள் ஜனவரி 2027-ல் தொடங்குகின்றன.',
    },
    image: './hero/admissions-2027.jpg',
    imageAlt: {
      en: 'Bible college graduates wearing academic gowns and holding their certificates',
      ta: 'கல்வி அங்கிகளை அணிந்து சான்றிதழ்களை ஏந்தியுள்ள வேதாகமக் கல்லூரிப் பட்டதாரிகள்',
    },
    cta: { href: '#academics-admission', label: { en: 'Apply now', ta: 'இப்போதே விண்ணப்பிக்கவும்' } },
    secondaryCta: { href: '#academics-syllabus', label: { en: 'View courses', ta: 'பாடநெறிகளைப் பாருங்கள்' } },
    mediaStatus: 'approved-client-supplied',
  },
  {
    id: 'ministries-for-every-generation',
    eyebrow: { en: 'Ministries for every generation', ta: 'ஒவ்வொரு தலைமுறைக்குமான ஊழியங்கள்' },
    title: { en: 'Grow in faith. Serve with purpose.', ta: 'விசுவாசத்தில் வளருங்கள். நோக்கத்துடன் சேவை செய்யுங்கள்.' },
    description: {
      en: 'Explore children’s and youth ministry, family counselling, leadership and church-planting seminars, and Gospel ministries.',
      ta: 'சிறுவர் மற்றும் வாலிபர் ஊழியங்கள், குடும்ப ஆலோசனை, தலைமைத்துவ மற்றும் திருச்சபை நிறுவுதல் கருத்தரங்குகள், சுவிசேஷ ஊழியங்கள் ஆகியவற்றை அறியுங்கள்.',
    },
    image: './hero/ministries-leadership.jpg',
    imageAlt: {
      en: 'WJ Cathedral ministry leadership artwork featuring Rev. Pr. A. Paulraj, Pr. Zeehan Paul and Bro. Aaron Jebaraj',
      ta: 'Rev. Pr. A. Paulraj, Pr. Zeehan Paul மற்றும் Bro. Aaron Jebaraj இடம்பெறும் WJ Cathedral ஊழியத் தலைமைப் படம்',
    },
    cta: { href: '#church', label: { en: 'Explore our ministries', ta: 'எங்கள் ஊழியங்களை அறியுங்கள்' } },
    secondaryCta: { href: '#contact', label: { en: 'Connect with the church', ta: 'திருச்சபையுடன் இணையுங்கள்' } },
    mediaStatus: 'approved-client-supplied',
  },
  {
    id: 'community-care-in-action',
    eyebrow: { en: 'Faith expressed through compassionate action', ta: 'இரக்கச் செயல்களில் வெளிப்படும் விசுவாசம்' },
    title: { en: 'Caring for people. Nurturing communities.', ta: 'மக்களுக்கான அக்கறை. சமூகங்களின் வளர்ச்சி.' },
    description: {
      en: 'From tree planting and family relief to hospital care, medical camps, free tuition and school essentials, Community Care turns compassion into practical service.',
      ta: 'மரநடுகை மற்றும் குடும்ப நிவாரணம் முதல் மருத்துவமனை உதவி, மருத்துவ முகாம்கள், இலவச பயிற்சி மற்றும் பள்ளி உபகரணங்கள் வரை, சமூக அக்கறை இரக்கத்தை நடைமுறைச் சேவையாக்குகிறது.',
    },
    image: './hero/community-care-in-action.jpg',
    imageAlt: {
      en: 'A collage of WJ Cathedral Community Care activities including tree planting, children’s programmes and community gatherings',
      ta: 'மரநடுகை, சிறுவர் நிகழ்ச்சிகள் மற்றும் சமூக ஒன்றுகூடல்கள் உள்ளிட்ட WJ Cathedral சமூக அக்கறைப் பணிகளின் படத்தொகுப்பு',
    },
    cta: { href: '#community-care', label: { en: 'Explore Community Care', ta: 'சமூக அக்கறைப் பணிகளை அறியுங்கள்' } },
    secondaryCta: { href: '#give', label: { en: 'Support the mission', ta: 'இந்தப் பணியை ஆதரியுங்கள்' } },
    mediaStatus: 'approved-client-supplied',
  },
]

