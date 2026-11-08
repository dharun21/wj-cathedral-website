import type { Sermon } from '../types/content'

function mediaItem(id: string, videoId: string, title: string, descriptionEn: string, descriptionTa: string, mediaType: 'video' | 'live-session'): Sermon {
  return {
    id,
    videoId,
    title: { en: title, ta: title },
    description: { en: descriptionEn, ta: descriptionTa },
    verification: 'public-source',
    mediaType,
  }
}

const liveDescription = {
  en: 'A church live-session recording from the official WJ Cathedral Nannilam YouTube channel.',
  ta: 'அதிகாரப்பூர்வ WJ Cathedral Nannilam YouTube சேனலின் திருச்சபை நேரலைப் பதிவு.',
}

const videoDescription = {
  en: 'An official video from the WJ Cathedral Nannilam YouTube channel.',
  ta: 'அதிகாரப்பூர்வ WJ Cathedral Nannilam YouTube சேனலின் காணொளி.',
}

export const sermons: Sermon[] = [
  mediaItem('sunday-service-2026-11-08', '8yLNqfqYa90', 'Sunday Service | 08-Nov-2026 | Tamil Christian Message | WJ Cathedral Nannilam', liveDescription.en, liveDescription.ta, 'live-session'),
  mediaItem('sunday-service-2026-10-11', 'yGO76A0DVkk', 'Sunday Service | 11-Oct-2026 | Tamil Christian Message | WJ Cathedral Nannilam', liveDescription.en, liveDescription.ta, 'live-session'),
  mediaItem('night-prayer-2026-09-25', 'Rc40JjZwdxI', 'Night Prayer | 25-Sep-2026 | Tamil Christian Message | WJ Cathedral Nannilam', liveDescription.en, liveDescription.ta, 'live-session'),
  mediaItem('sunday-service-2026-09-20', 'n_hTLKBX0Dc', 'Sunday Service | 20-Sep-2026 | Tamil Christian Message | WJ Cathedral Nannilam', liveDescription.en, liveDescription.ta, 'live-session'),
  mediaItem('good-friday-service-2026', 'ul8G9GUBCXA', 'Good Friday Service | 03-Apr-2026 | Tamil Christian Message | WJ Cathedral Nannilam', liveDescription.en, liveDescription.ta, 'live-session'),
  mediaItem('sunday-service-2025-08-10', 'Zgd1Oxj7HiA', 'Sunday Service | 10-Aug-2025 | Tamil Christian Message | WJ Cathedral Nannilam', liveDescription.en, liveDescription.ta, 'live-session'),
  mediaItem('enna-marakala-song', 'aYlDedVM1us', 'Enna Marakala / என்ன மறக்கல | Aaron Jebaraj | Tamil Christian Song', videoDescription.en, videoDescription.ta, 'video'),
  mediaItem('morning-devotion-06', 'neStPykiPUE', '06 காலை வேத தியானம் | Tamil Christian Morning Devotion | Pr. Zeehan Paul', videoDescription.en, videoDescription.ta, 'video'),
  mediaItem('elshadai-enthan-thunai-neere', '1t1sBeO2sPA', 'எல்ஷடாய் எந்தன் துணை நீரே | Zeehan Paul & Christy Zeehan | Tamil Christian Song', videoDescription.en, videoDescription.ta, 'video'),
  mediaItem('enakaga-yesu-piranthare', 'lPpKKqVshaQ', 'Enakaga Yesu Piranthare | Aaron Jebaraj | Tamil Christian Song', videoDescription.en, videoDescription.ta, 'video'),
  mediaItem('ithaiyathai-kollaikondavare', 'j926cuMGwNY', 'Ithaiyathai Kollaikondavare | Aaron Jebaraj | Tamil Christian Song', videoDescription.en, videoDescription.ta, 'video'),
  mediaItem('en-ithaiyathai-kollaikondavare', 'KJd46k2KLZY', 'En Ithaiyathai Kollaikondavare | Aaron Jebaraj | Tamil Christian Song', videoDescription.en, videoDescription.ta, 'video'),
  mediaItem('morning-devotion-11', 'EYF7dgKcXxQ', '11 காலை வேத தியானம் | Tamil Christian Morning Devotion | Pr. Zeehan Paul', videoDescription.en, videoDescription.ta, 'video'),
]

export const youtubeChannelUrl = 'https://www.youtube.com/@wjcathedralnannilam1376'
