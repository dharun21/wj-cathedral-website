import type { GalleryItem } from '../types/content'

export const galleryItems: GalleryItem[] = [
  {
    id: 'building-placeholder',
    src: './banners/welcome.svg',
    alt: {
      en: 'Placeholder for an approved exterior photograph of WJ Cathedral',
      ta: 'WJ Cathedral வெளிப்புற அங்கீகரிக்கப்பட்ட புகைப்படத்திற்கான இடம்',
    },
    category: { en: 'Church building', ta: 'திருச்சபைக் கட்டிடம்' },
    approved: false,
  },
  {
    id: 'worship-placeholder',
    src: './banners/worship.svg',
    alt: {
      en: 'Placeholder for an approved WJ Cathedral worship photograph',
      ta: 'WJ Cathedral ஆராதனையின் அங்கீகரிக்கப்பட்ட புகைப்படத்திற்கான இடம்',
    },
    category: { en: 'Worship', ta: 'ஆராதனை' },
    approved: false,
  },
  {
    id: 'prayer-placeholder',
    src: './banners/prayer.svg',
    alt: {
      en: 'Placeholder for an approved WJ Cathedral prayer gathering photograph',
      ta: 'WJ Cathedral ஜெபக் கூடுகையின் அங்கீகரிக்கப்பட்ட புகைப்படத்திற்கான இடம்',
    },
    category: { en: 'Prayer', ta: 'ஜெபம்' },
    approved: false,
  },
]

