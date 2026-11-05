import type { LocalizedText } from '../types/content'

export const eventsState = {
  hasConfirmedEvents: false,
  title: { en: 'Announcements are shared after confirmation', ta: 'உறுதிப்படுத்தப்பட்ட பின்னரே அறிவிப்புகள் பகிரப்படும்' } satisfies LocalizedText,
  message: {
    en: 'There are no verified upcoming event dates to publish yet. Please contact the church for current announcements.',
    ta: 'வெளியிடுவதற்கு உறுதிப்படுத்தப்பட்ட வரவிருக்கும் நிகழ்ச்சி தேதிகள் தற்போது இல்லை. தற்போதைய அறிவிப்புகளுக்கு திருச்சபையைத் தொடர்புகொள்ளுங்கள்.',
  } satisfies LocalizedText,
}

