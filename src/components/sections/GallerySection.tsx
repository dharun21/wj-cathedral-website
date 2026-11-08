import { ArrowRight, Camera, ChevronLeft, ChevronRight, ImageIcon, Maximize2, X } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { galleryItems, prayerGalleryItems, vacationBibleSchoolItems } from '../../data/gallery'
import { useLanguage } from '../../context/LanguageContext'
import type { GalleryItem } from '../../types/content'
import { Reveal } from '../common/Reveal'
import { SectionHeading } from '../common/SectionHeading'
import { usePublishedGallery } from '../../hooks/usePublishedContent'
import { isSupabaseConfigured } from '../../lib/env'

type GalleryStatus = 'approved' | 'pending' | 'prayer' | 'vbs'

interface ActiveGallery {
  items: GalleryItem[]
  index: number
  status: GalleryStatus
}

function Lightbox({ items, index, status, onClose, onChange }: ActiveGallery & { onClose: () => void; onChange: (index: number) => void }) {
  const { t, localize } = useLanguage()
  const reducedMotion = useReducedMotion()
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const item = items[index] ?? items[0]
  const statusLabel = status === 'vbs'
    ? t('gallery.vbsYear')
    : status === 'prayer'
      ? t('gallery.prayerCollection')
      : status === 'approved'
        ? t('gallery.approvedPhoto')
        : t('gallery.pending')

  useEffect(() => {
    closeButtonRef.current?.focus()
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft') onChange((index - 1 + items.length) % items.length)
      if (event.key === 'ArrowRight') onChange((index + 1) % items.length)
    }
    document.body.classList.add('lightbox-open')
    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.classList.remove('lightbox-open')
      window.removeEventListener('keydown', handleKey)
    }
  }, [index, items, onChange, onClose])

  if (!item) return null

  return createPortal(
    <motion.div className="lightbox" role="dialog" aria-modal="true" aria-label={localize(item.category)} initial={reducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <button type="button" className="lightbox__backdrop" onClick={onClose} aria-label={t('a11y.closeDialog')} />
      <div className="lightbox__panel">
        <button ref={closeButtonRef} type="button" className="lightbox__close" onClick={onClose} aria-label={t('a11y.closeDialog')}><X aria-hidden="true" /></button>
        <img src={item.src} alt={localize(item.alt)} />
        <div className="lightbox__caption"><span>{localize(item.category)}</span><strong>{statusLabel}</strong></div>
        {items.length > 1 && <button type="button" className="lightbox__prev" onClick={() => onChange((index - 1 + items.length) % items.length)} aria-label={t('a11y.previousImage')}><ChevronLeft aria-hidden="true" /></button>}
        {items.length > 1 && <button type="button" className="lightbox__next" onClick={() => onChange((index + 1) % items.length)} aria-label={t('a11y.nextImage')}><ChevronRight aria-hidden="true" /></button>}
      </div>
    </motion.div>,
    document.body,
  )
}

export function GallerySection() {
  const { t, localize } = useLanguage()
  const [activeGallery, setActiveGallery] = useState<ActiveGallery | null>(null)
  const published = usePublishedGallery(galleryItems)
  const featuredItems = isSupabaseConfigured
    ? [...new Map(published.data.map((item) => [item.category.en, item])).values()].slice(0, 3)
    : galleryItems
  const closeLightbox = useCallback(() => setActiveGallery(null), [])
  const changeLightbox = useCallback((index: number) => {
    setActiveGallery((current) => current ? { ...current, index } : null)
  }, [])
  const openGallery = useCallback((items: GalleryItem[], index: number, status: GalleryStatus) => {
    setActiveGallery({ items, index, status })
  }, [])

  return (
    <section id="gallery" className="section section--sand gallery-section">
      <div className="container">
        <SectionHeading eyebrow={t('gallery.eyebrow')} title={t('gallery.title')} description={t('gallery.intro')} />
        <div className={`gallery-grid gallery-grid--${featuredItems.length}`}>
          {featuredItems.map((item, index) => (
            <Reveal key={item.id} className={`gallery-item gallery-item--${index + 1}`} delay={index * 0.06}>
              <button
                type="button"
                onClick={() => {
                  if (!isSupabaseConfigured && item.id === 'vbs') {
                    openGallery(vacationBibleSchoolItems, 0, 'vbs')
                  } else if (!isSupabaseConfigured && item.id === 'prayer') {
                    openGallery(prayerGalleryItems, 2, 'prayer')
                  } else {
                    const albumItems = published.data.filter((candidate) => candidate.category.en === item.category.en)
                    openGallery(albumItems.length ? albumItems : [item], 0, item.approved ? 'approved' : 'pending')
                  }
                }}
                aria-label={`${t('gallery.open')}: ${localize(item.category)}`}
              >
                <img src={item.src} alt={localize(item.alt)} loading="lazy" />
                <span className="gallery-item__overlay" />
                {item.approved
                  ? <span className="gallery-item__pending gallery-item__pending--approved"><Camera size={15} aria-hidden="true" /> {item.id === 'vbs' ? t('gallery.vbsPhotos') : item.id === 'prayer' ? t('gallery.prayerPhotos') : t('gallery.approvedPhoto')}</span>
                  : <span className="gallery-item__pending"><ImageIcon size={15} aria-hidden="true" /> {t('gallery.pending')}</span>}
                <span className="gallery-item__label">{localize(item.category)} <Maximize2 size={18} aria-hidden="true" /></span>
              </button>
            </Reveal>
          ))}
        </div>
        <div className="gallery-section__actions">
          <a className="button button--navy" href="#gallery">{t('gallery.viewAll')} <ArrowRight size={17} aria-hidden="true" /></a>
        </div>
      </div>
      <AnimatePresence>
        {activeGallery && <Lightbox {...activeGallery} onClose={closeLightbox} onChange={changeLightbox} />}
      </AnimatePresence>
    </section>
  )
}

