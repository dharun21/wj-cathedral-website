import type { Service } from '../types/content'

export const services: Service[] = [
  {
    id: 'sunday-worship',
    name: { en: 'Sunday Worship', ta: 'ஞாயிறு ஆராதனை' },
    day: { en: 'Every Sunday', ta: 'ஒவ்வொரு ஞாயிற்றுக்கிழமையும்' },
    time: { en: '7:30 AM – 11:30 AM', ta: 'காலை 7:30 – 11:30' },
    description: {
      en: 'A time of worship, prayer and hearing God’s word together.',
      ta: 'ஒன்றிணைந்து ஆராதித்து, ஜெபித்து, தேவ வார்த்தையைக் கேட்கும் நேரம்.',
    },
    icon: 'sun',
    verification: 'supplied-needs-confirmation',
  },
  {
    id: 'night-prayer',
    name: { en: 'Night Prayer', ta: 'இரவு ஜெபம்' },
    day: { en: 'Day to be confirmed', ta: 'நாள் உறுதிப்படுத்தப்பட வேண்டும்' },
    time: { en: '9:00 PM – 12:00 AM', ta: 'இரவு 9:00 – 12:00' },
    description: {
      en: 'Please call the church to confirm the day before planning your visit.',
      ta: 'வருகையைத் திட்டமிடுவதற்கு முன் நாளைத் தொலைபேசியில் உறுதிப்படுத்துங்கள்.',
    },
    icon: 'moon',
    verification: 'supplied-needs-confirmation',
  },
]

