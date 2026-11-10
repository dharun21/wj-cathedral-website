import type { LocalizedText } from '../types/content'

export interface SpiritualMentor {
  id: string
  name: LocalizedText
  role: LocalizedText
  description: LocalizedText
  image: string
  imageAlt: LocalizedText
  memorial: boolean
}

export const spiritualMentorsIntro: LocalizedText = {
  en: 'Founder Rev. Pr. A. Paulraj was guided in ministry by two apostolic leaders who served as heads of Worship to Jesus Ministries. Their spiritual leadership holds an honoured place in the ministry’s continuing story.',
  ta: 'நிறுவனர் ரெவ. பாஸ்டர் A. பால்ராஜ், இயேசுவுக்கே ஆராதனை ஊழியங்களின் தலைவர்களாகப் பணியாற்றிய இரண்டு அப்போஸ்தலத் தலைவர்களால் ஊழியத்தில் வழிநடத்தப்பட்டார். அவர்களின் ஆவிக்குரிய தலைமை இந்த ஊழியத்தின் தொடரும் வரலாற்றில் மதிப்பிற்குரிய இடத்தைப் பெற்றுள்ளது.',
}

export const spiritualMentors: SpiritualMentor[] = [
  {
    id: 'apostle-r-titus',
    name: { en: 'Apostle Rev. R. Titus', ta: 'அப்போஸ்தலர் ரெவ. R. டைட்டஸ்' },
    role: {
      en: 'Former Head · Worship to Jesus Ministries',
      ta: 'முன்னாள் தலைவர் · இயேசுவுக்கே ஆராதனை ஊழியங்கள்',
    },
    description: {
      en: 'The late Apostle Rev. R. Titus is remembered with gratitude as a senior spiritual leader and mentor in the ministry journey of founder Rev. Pr. A. Paulraj. His leadership remains part of the heritage carried forward by Worship to Jesus Ministries.',
      ta: 'மறைந்த அப்போஸ்தலர் ரெவ. R. டைட்டஸ், நிறுவனர் ரெவ. பாஸ்டர் A. பால்ராஜின் ஊழியப் பயணத்தில் மூத்த ஆவிக்குரிய தலைவராகவும் ஆசானாகவும் நன்றியுடன் நினைவுகூரப்படுகிறார். அவரது தலைமை இயேசுவுக்கே ஆராதனை ஊழியங்கள் தொடர்ந்து எடுத்துச் செல்லும் பாரம்பரியத்தின் ஒரு பகுதியாக நிலைத்திருக்கிறது.',
    },
    image: './about/spiritual-mentors/apostle-r-titus.jpg',
    imageAlt: {
      en: 'Black-and-white portrait of the late Apostle Rev. R. Titus',
      ta: 'மறைந்த அப்போஸ்தலர் ரெவ. R. டைட்டஸின் கருப்பு-வெள்ளைப் படம்',
    },
    memorial: true,
  },
  {
    id: 'apostle-t-daniel-devadass',
    name: { en: 'Apostle Rev. T. Daniel Devadass', ta: 'அப்போஸ்தலர் ரெவ. T. டேனியல் தேவதாஸ்' },
    role: {
      en: 'Head · Worship to Jesus Ministries',
      ta: 'தலைவர் · இயேசுவுக்கே ஆராதனை ஊழியங்கள்',
    },
    description: {
      en: 'Apostle Rev. T. Daniel Devadass is honoured as a spiritual mentor to founder Rev. Pr. A. Paulraj and as a leader of Worship to Jesus Ministries, providing guidance in the ministry’s continuing work and calling.',
      ta: 'அப்போஸ்தலர் ரெவ. T. டேனியல் தேவதாஸ், நிறுவனர் ரெவ. பாஸ்டர் A. பால்ராஜின் ஆவிக்குரிய ஆசானாகவும் இயேசுவுக்கே ஆராதனை ஊழியங்களின் தலைவராகவும் மதிக்கப்படுகிறார்; ஊழியத்தின் தொடரும் பணிக்கும் அழைப்பிற்கும் வழிகாட்டி வருகிறார்.',
    },
    image: './about/spiritual-mentors/apostle-daniel-devadass.jpg',
    imageAlt: {
      en: 'Portrait of Apostle Rev. T. Daniel Devadass',
      ta: 'அப்போஸ்தலர் ரெவ. T. டேனியல் தேவதாஸின் படம்',
    },
    memorial: false,
  },
]

