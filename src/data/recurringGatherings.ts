import type { Service } from '../types/content'

export const recurringGatherings: Service[] = [
  {
    id: 'sunday-service',
    name: { en: 'Sunday Service', ta: 'ஞாயிறு ஆராதனை' },
    day: { en: 'Every Sunday', ta: 'ஒவ்வொரு ஞாயிற்றுக்கிழமையும்' },
    time: { en: 'Time to be confirmed', ta: 'நேரம் உறுதிப்படுத்தப்பட வேண்டும்' },
    description: {
      en: 'A weekly gathering for worship, prayer, fellowship and hearing God’s Word together.',
      ta: 'ஆராதனை, ஜெபம், ஐக்கியம் மற்றும் தேவ வார்த்தையைக் கேட்பதற்கான வாராந்திர கூடுகை.',
    },
    icon: 'sun', verification: 'supplied-needs-confirmation',
  },
  {
    id: 'promise-service',
    name: { en: 'Promise Service', ta: 'வாக்குத்தத்த ஆராதனை' },
    day: { en: 'Schedule to be confirmed', ta: 'அட்டவணை உறுதிப்படுத்தப்பட வேண்டும்' },
    time: { en: 'Time to be confirmed', ta: 'நேரம் உறுதிப்படுத்தப்பட வேண்டும்' },
    description: {
      en: 'A worship and prayer gathering centred on the promises of God and encouragement from Scripture.',
      ta: 'தேவனுடைய வாக்குத்தத்தங்களையும் வேதாகம ஊக்கத்தையும் மையமாகக் கொண்ட ஆராதனை மற்றும் ஜெபக் கூடுகை.',
    },
    icon: 'sun', verification: 'supplied-needs-confirmation',
  },
  {
    id: 'sunday-school',
    name: { en: 'Sunday School', ta: 'ஞாயிறு பள்ளி' },
    day: { en: 'Schedule to be confirmed', ta: 'அட்டவணை உறுதிப்படுத்தப்பட வேண்டும்' },
    time: { en: 'Time to be confirmed', ta: 'நேரம் உறுதிப்படுத்தப்பட வேண்டும்' },
    description: {
      en: 'Bible-centred learning that helps children understand faith, prayer and Christian living.',
      ta: 'சிறுவர்கள் விசுவாசம், ஜெபம் மற்றும் கிறிஸ்தவ வாழ்க்கையைப் புரிந்துகொள்ள உதவும் வேதாகம மையக் கற்றல்.',
    },
    icon: 'sun', verification: 'supplied-needs-confirmation',
  },
  {
    id: 'night-prayers',
    name: { en: 'Night Prayers', ta: 'இரவு ஜெபங்கள்' },
    day: { en: 'Schedule to be confirmed', ta: 'அட்டவணை உறுதிப்படுத்தப்பட வேண்டும்' },
    time: { en: 'Time to be confirmed', ta: 'நேரம் உறுதிப்படுத்தப்பட வேண்டும்' },
    description: {
      en: 'A focused time of united prayer, worship and intercession during the night.',
      ta: 'இரவு நேரத்தில் ஒருமித்த ஜெபம், ஆராதனை மற்றும் பரிந்துரை ஜெபத்திற்காக ஒதுக்கப்பட்ட நேரம்.',
    },
    icon: 'moon', verification: 'supplied-needs-confirmation',
  },
  {
    id: 'fasting-prayers',
    name: { en: 'Fasting Prayers', ta: 'உபவாச ஜெபங்கள்' },
    day: { en: 'Schedule to be confirmed', ta: 'அட்டவணை உறுதிப்படுத்தப்பட வேண்டும்' },
    time: { en: 'Time to be confirmed', ta: 'நேரம் உறுதிப்படுத்தப்பட வேண்டும்' },
    description: {
      en: 'A time set apart for fasting, Scripture, prayer and intercession for the church and community.',
      ta: 'திருச்சபைக்கும் சமூகத்திற்கும் உபவாசம், வேதாகம தியானம், ஜெபம் மற்றும் பரிந்துரைக்காக ஒதுக்கப்பட்ட நேரம்.',
    },
    icon: 'sun', verification: 'supplied-needs-confirmation',
  },
  {
    id: 'chain-prayer',
    name: { en: 'Chain Prayer', ta: 'சங்கிலி ஜெபம்' },
    day: { en: 'Schedule to be confirmed', ta: 'அட்டவணை உறுதிப்படுத்தப்பட வேண்டும்' },
    time: { en: 'Time to be confirmed', ta: 'நேரம் உறுதிப்படுத்தப்பட வேண்டும்' },
    description: {
      en: 'A coordinated prayer fellowship in which participants pray across assigned periods with a shared purpose.',
      ta: 'ஒரே நோக்கத்துடன் பங்கேற்பாளர்கள் ஒதுக்கப்பட்ட நேரங்களில் தொடர்ந்து ஜெபிக்கும் ஒருங்கிணைந்த ஜெப ஐக்கியம்.',
    },
    icon: 'moon', verification: 'supplied-needs-confirmation',
  },
]
