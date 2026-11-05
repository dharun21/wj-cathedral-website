import type { LocalizedText } from '../types/content'

export const verifiedActivities = [
  {
    id: 'worship-prayer',
    title: { en: 'Worship & prayer gatherings', ta: 'ஆராதனை மற்றும் ஜெபக் கூடுகைகள்' } satisfies LocalizedText,
    description: {
      en: 'Public service recordings and the supplied schedule confirm regular worship and prayer gatherings.',
      ta: 'பொது ஆராதனைப் பதிவுகளும் வழங்கப்பட்ட அட்டவணையும் வழக்கமான ஆராதனை மற்றும் ஜெபக் கூடுகைகளை உறுதிப்படுத்துகின்றன.',
    } satisfies LocalizedText,
    icon: 'hands',
  },
  {
    id: 'online-recordings',
    title: { en: 'Online service recordings', ta: 'இணைய வழி ஆராதனைப் பதிவுகள்' } satisfies LocalizedText,
    description: {
      en: 'WJ Cathedral shares public worship videos on YouTube so people can watch from home.',
      ta: 'வீட்டிலிருந்தே காணும் வகையில் WJ Cathedral பொது ஆராதனைக் காணொளிகளை YouTube-ல் பகிர்கிறது.',
    } satisfies LocalizedText,
    icon: 'video',
  },
]

