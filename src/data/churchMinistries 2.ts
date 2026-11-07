import type { LocalizedText } from '../types/content'

export type ChurchMinistryIcon = 'children' | 'youth' | 'family' | 'planting' | 'leaders' | 'gospel'

export interface ChurchMinistry {
  id: string
  number: string
  icon: ChurchMinistryIcon
  eyebrow: LocalizedText
  title: LocalizedText
  description: LocalizedText
  focus: readonly LocalizedText[]
}

export const generationMinistries: ChurchMinistry[] = [
  {
    id: 'children-ministry',
    number: '01',
    icon: 'children',
    eyebrow: { en: 'Belong · Learn · Grow', ta: 'இணைதல் · கற்றல் · வளர்தல்' },
    title: { en: 'Children’s Ministry', ta: 'சிறுவர் ஊழியம்' },
    description: {
      en: 'A caring, age-appropriate ministry where children can discover biblical truth, learn to pray and grow within the life of the church.',
      ta: 'சிறுவர்கள் வேதாகமச் சத்தியத்தை அறிந்து, ஜெபிக்கக் கற்று, திருச்சபை வாழ்க்கையில் வளர உதவும் அன்பான வயதுக்கேற்ற ஊழியம்.',
    },
    focus: [
      { en: 'Bible-centred learning', ta: 'வேதாகமத்தை மையமாகக் கொண்ட கற்றல்' },
      { en: 'Prayer and worship', ta: 'ஜெபமும் ஆராதனையும்' },
      { en: 'Safe, caring fellowship', ta: 'பாதுகாப்பான அன்பான ஐக்கியம்' },
    ],
  },
  {
    id: 'youth-ministry',
    number: '02',
    icon: 'youth',
    eyebrow: { en: 'Faith · Friendship · Purpose', ta: 'விசுவாசம் · நட்பு · நோக்கம்' },
    title: { en: 'Youth Ministry', ta: 'வாலிபர் ஊழியம்' },
    description: {
      en: 'A place for young people to deepen their faith, build healthy friendships and discover how they can serve Christ with courage and purpose.',
      ta: 'இளைஞர்கள் விசுவாசத்தில் ஆழமடைந்து, நல்ல நட்புகளை உருவாக்கி, தைரியத்துடனும் நோக்கத்துடனும் கிறிஸ்துவைச் சேவிப்பதை அறியும் இடம்.',
    },
    focus: [
      { en: 'Spiritual formation', ta: 'ஆவிக்குரிய உருவாக்கம்' },
      { en: 'Healthy fellowship', ta: 'ஆரோக்கியமான ஐக்கியம்' },
      { en: 'Service and leadership', ta: 'சேவையும் தலைமைத்துவமும்' },
    ],
  },
  {
    id: 'family-counselling',
    number: '03',
    icon: 'family',
    eyebrow: { en: 'Listen · Encourage · Restore', ta: 'செவிகொடுத்தல் · ஊக்குதல் · புதுப்பித்தல்' },
    title: { en: 'Family Counselling', ta: 'குடும்ப ஆலோசனை' },
    description: {
      en: 'Confidential pastoral listening and biblical encouragement for individuals, couples and families seeking prayerful guidance through difficult seasons.',
      ta: 'சிரமமான காலங்களில் ஜெபத்தோடு வழிகாட்டுதலை நாடும் தனிநபர்கள், தம்பதிகள் மற்றும் குடும்பங்களுக்கு இரகசியமான மேய்ப்புப் பராமரிப்பும் வேதாகம ஊக்கமும்.',
    },
    focus: [
      { en: 'Respectful listening', ta: 'மரியாதையான செவிகொடுத்தல்' },
      { en: 'Biblical encouragement', ta: 'வேதாகம ஊக்கம்' },
      { en: 'Prayerful next steps', ta: 'ஜெபத்துடன் அடுத்த படிகள்' },
    ],
  },
]

export const equippingMinistries: ChurchMinistry[] = [
  {
    id: 'church-planting-seminar',
    number: '04',
    icon: 'planting',
    eyebrow: { en: 'Prepare · Plant · Nurture', ta: 'ஆயத்தம் · நிறுவுதல் · வளர்த்தல்' },
    title: { en: 'Church Planting Seminar', ta: 'திருச்சபை நிறுவுதல் கருத்தரங்கு' },
    description: {
      en: 'Focused biblical and practical preparation for those exploring the calling and responsibility of nurturing new worshipping communities.',
      ta: 'புதிய ஆராதனைச் சமூகங்களை உருவாக்கும் அழைப்பையும் பொறுப்பையும் ஆராய்வோருக்கான வேதாகம மற்றும் நடைமுறை ஆயத்தம்.',
    },
    focus: [
      { en: 'Gospel foundations', ta: 'சுவிசேஷ அடித்தளங்கள்' },
      { en: 'Local church formation', ta: 'உள்ளூர் திருச்சபை உருவாக்கம்' },
      { en: 'Sustainable pastoral care', ta: 'நிலையான மேய்ப்புப் பராமரிப்பு' },
    ],
  },
  {
    id: 'leaders-seminar',
    number: '05',
    icon: 'leaders',
    eyebrow: { en: 'Character · Wisdom · Service', ta: 'நற்குணம் · ஞானம் · சேவை' },
    title: { en: 'Leaders’ Seminar', ta: 'தலைவர்கள் கருத்தரங்கு' },
    description: {
      en: 'Biblical formation for pastors, ministry leaders and emerging servants who desire to lead with humility, integrity and wisdom.',
      ta: 'பணிவு, நேர்மை மற்றும் ஞானத்துடன் வழிநடத்த விரும்பும் போதகர்கள், ஊழியத் தலைவர்கள் மற்றும் வளர்ந்து வரும் ஊழியர்களுக்கான வேதாகம உருவாக்கம்.',
    },
    focus: [
      { en: 'Servant leadership', ta: 'ஊழியத் தலைமைத்துவம்' },
      { en: 'Integrity and accountability', ta: 'நேர்மையும் பொறுப்புணர்வும்' },
      { en: 'Healthy ministry teams', ta: 'ஆரோக்கியமான ஊழியக் குழுக்கள்' },
    ],
  },
  {
    id: 'gospel-ministries',
    number: '06',
    icon: 'gospel',
    eyebrow: { en: 'Pray · Go · Share', ta: 'ஜெபம் · செல்லுதல் · பகிர்தல்' },
    title: { en: 'Gospel Ministries', ta: 'சுவிசேஷ ஊழியங்கள்' },
    description: {
      en: 'Prayerful Gospel outreach that seeks to share the message of Jesus Christ clearly, compassionately and faithfully.',
      ta: 'இயேசு கிறிஸ்துவின் செய்தியைத் தெளிவாகவும் இரக்கத்துடனும் உண்மையுடனும் பகிர விரும்பும் ஜெபமுள்ள சுவிசேஷப் பணி.',
    },
    focus: [
      { en: 'Prayerful outreach', ta: 'ஜெபத்துடன் கூடிய வெளிப்பணி' },
      { en: 'Scripture sharing', ta: 'வேதாகமப் பகிர்வு' },
      { en: 'Compassionate witness', ta: 'இரக்கமுள்ள சாட்சி' },
    ],
  },
]
