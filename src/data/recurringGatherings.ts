import type { Service } from '../types/content'

export const recurringGatherings: Service[] = [
  {
    id: 'sunday-service',
    name: { en: 'Sunday Service', ta: 'ஞாயிறு ஆராதனை' },
    day: { en: 'Every Sunday', ta: 'ஒவ்வொரு ஞாயிற்றுக்கிழமையும்' },
    time: { en: '8:00 AM – 11:00 PM', ta: 'காலை 8:00 – இரவு 11:00' },
    description: {
      en: 'The cathedral family gathers for worship, prayer, fellowship and the ministry of God’s Word.',
      ta: 'ஆராதனை, ஜெபம், ஐக்கியம் மற்றும் தேவ வார்த்தையின் ஊழியத்திற்காக திருச்சபைக் குடும்பம் ஒன்றுகூடுகிறது.',
    },
    icon: 'sun', verification: 'public-source',
  },
  {
    id: 'church-fasting-prayer',
    name: { en: 'Church Fasting Prayer', ta: 'திருச்சபை உபவாச ஜெபம்' },
    day: { en: 'Thursday', ta: 'வியாழக்கிழமை' },
    time: { en: '10:00 AM – 12:00 PM', ta: 'காலை 10:00 – மதியம் 12:00' },
    description: {
      en: 'A dedicated time of fasting, Scripture meditation and united intercession for the church and community.',
      ta: 'திருச்சபைக்கும் சமூகத்திற்கும் உபவாசம், வேதாகம தியானம் மற்றும் ஒருமித்த பரிந்துரை ஜெபத்திற்கான சிறப்பு நேரம்.',
    },
    icon: 'sun', verification: 'public-source',
  },
  {
    id: 'preparation-prayer',
    name: { en: 'Preparation Prayer', ta: 'ஆயத்த ஜெபம்' },
    day: { en: 'Saturday', ta: 'சனிக்கிழமை' },
    time: { en: '6:00 PM – 7:00 PM', ta: 'மாலை 6:00 – 7:00' },
    description: {
      en: 'A prayer gathering that prepares hearts and ministry teams for Sunday worship and service.',
      ta: 'ஞாயிறு ஆராதனை மற்றும் ஊழியத்திற்காக இருதயங்களையும் ஊழியக் குழுக்களையும் ஆயத்தப்படுத்தும் ஜெபக் கூடுகை.',
    },
    icon: 'moon', verification: 'public-source',
  },
  {
    id: 'night-prayer',
    name: { en: 'Night Prayer', ta: 'இரவு ஜெபம்' },
    day: { en: 'During the last week of every month', ta: 'ஒவ்வொரு மாதத்தின் கடைசி வாரத்தில்' },
    time: { en: 'Time to be confirmed', ta: 'நேரம் உறுதிப்படுத்தப்பட வேண்டும்' },
    description: {
      en: 'A monthly night of worship, united prayer and intercession. Please contact the church for that month’s confirmed date and time.',
      ta: 'மாதாந்திர இரவு ஆராதனை, ஒருமித்த ஜெபம் மற்றும் பரிந்துரை நேரம். அந்த மாதத்தின் உறுதிப்படுத்தப்பட்ட நாள் மற்றும் நேரத்திற்கு திருச்சபையைத் தொடர்புகொள்ளுங்கள்.',
    },
    icon: 'moon', verification: 'public-source',
  },
  {
    id: 'chain-prayer',
    name: { en: 'Chain Prayer', ta: 'சங்கிலி ஜெபம்' },
    day: { en: 'One day every month', ta: 'ஒவ்வொரு மாதமும் ஒரு நாள்' },
    time: { en: 'Time to be confirmed', ta: 'நேரம் உறுதிப்படுத்தப்பட வேண்டும்' },
    description: {
      en: 'A coordinated day of continuous prayer across assigned periods. The monthly date and timings will be confirmed by the church.',
      ta: 'ஒதுக்கப்பட்ட நேரங்களில் தொடர்ச்சியாக நடைபெறும் ஒருங்கிணைந்த ஜெப நாள். மாதாந்திர நாளும் நேரங்களும் திருச்சபையால் உறுதிப்படுத்தப்படும்.',
    },
    icon: 'moon', verification: 'public-source',
  },
  {
    id: 'early-morning-promise-worship',
    name: { en: 'Early Morning Promise Worship Service', ta: 'அதிகாலை வாக்குத்தத்த ஆராதனை' },
    day: { en: 'First day of every month', ta: 'ஒவ்வொரு மாதத்தின் முதல் நாள்' },
    time: { en: '5:00 AM – 6:30 AM', ta: 'அதிகாலை 5:00 – காலை 6:30' },
    description: {
      en: 'Begin each month in worship and prayer, receiving biblical encouragement for the days ahead.',
      ta: 'ஒவ்வொரு மாதத்தையும் ஆராதனை மற்றும் ஜெபத்துடன் தொடங்கி, வரவிருக்கும் நாட்களுக்கு வேதாகம ஊக்கத்தைப் பெறும் நேரம்.',
    },
    icon: 'sun', verification: 'public-source',
  },
  {
    id: 'wj-pastors-family-gathering',
    name: { en: 'Family Gathering of WJ Pastors', ta: 'WJ போதகர்களின் குடும்பக் கூடுகை' },
    day: { en: 'First Monday of every month', ta: 'ஒவ்வொரு மாதத்தின் முதல் திங்கட்கிழமை' },
    time: { en: 'Time to be confirmed', ta: 'நேரம் உறுதிப்படுத்தப்பட வேண்டும்' },
    description: {
      en: 'A monthly time of fellowship, encouragement and prayer for WJ pastors and their families.',
      ta: 'WJ போதகர்களும் அவர்களின் குடும்பங்களும் ஐக்கியம், ஊக்கம் மற்றும் ஜெபத்திற்காக மாதந்தோறும் ஒன்றுகூடும் நேரம்.',
    },
    icon: 'sun', verification: 'public-source',
  },
]
