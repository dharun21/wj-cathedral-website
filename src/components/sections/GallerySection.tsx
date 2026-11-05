import { ChevronLeft, ChevronRight, ImageIcon, Maximize2, X } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { galleryItems } from '../../data/gallery'
import { useLanguage } from '../../context/LanguageContext'
import { Reveal } from '../common/Reveal'
import { SectionHeading } from '../common/SectionHeading'

function Lightbox({ index, onClose, onChange }: { index: number; onClose: () => void; onChange: (index: number) => void }) {
  const { t, localize } = useLanguage()
  const reducedMotion = useReducedMotion()
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const item = galleryItems[index] ?? galleryItems[0]

  useEffect(() => {
    closeButtonRef.current?.focus()
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft') onChange((index - 1 + galleryItems.length) % galleryItems.length)
      if (event.key === 'ArrowRight') onChange((index + 1) % galleryItems.length)
    }
    document.body.classList.add('lightbox-open')
    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.classList.remove('lightbox-open')
      window.removeEventListener('keydown', handleKey)
    }
  }, [index, onChange, onClose])

  if (!item) return null

  return createPortal(
    <motion.div className="lightbox" role="dialog" aria-modal="true" aria-label={localize(item.category)} initial={reducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <button type="button" className="lightbox__backdrop" onClick={onClose} aria-label={t('a11y.closeDialog')} />
      <div className="lightbox__panel">
        <button ref={closeButtonRef} type="button" className="lightbox__close" onClick={onClose} aria-label={t('a11y.closeDialog')}><X aria-hidden="true" /></button>
        <img src={item.src} alt={localize(item.alt)} />
        <div className="lightbox__caption"><span>{localize(item.category)}</span><strong>{t('gallery.pending')}</strong></div>
        <button type="button" className="lightbox__prev" onClick={() => onChange((index - 1 + galleryItems.length) % galleryItems.length)} aria-label={t('a11y.previousImage')}><ChevronLeft aria-hidden="true" /></button>
        <button type="button" className="lightbox__next" onClick={() => onChange((index + 1) % galleryItems.length)} aria-label={t('a11y.nextImage')}><ChevronRight aria-hidden="true" /></button>
      </div>
    </motion.div>,
    document.body,
  )
}

export function GallerySection() {
  const { t, localize } = useLanguage()
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const closeLightbox = useCallback(() => setActiveIndex(null), [])
  const changeLightbox = useCallback((index: number) => setActiveIndex(index), [])

  return (
    <section id="gallery" className="section section--sand gallery-section">
      <div className="container">
        <SectionHeading eyebrow={t('gallery.eyebrow')} title={t('gallery.title')} description={t('gallery.intro')} />
        <div className="gallery-grid">
          {galleryItems.map((item, index) => (
            <Reveal key={item.id} className={`gallery-item gallery-item--${index + 1}`} delay={index * 0.06}>
              <button type="button" onClick={() => setActiveIndex(index)} aria-label={`${t('gallery.open')}: ${localize(item.category)}`}>
                <img src={item.src} alt={localize(item.alt)} loading="lazy" />
                <span className="gallery-item__overlay" />
                <span className="gallery-item__pending"><ImageIcon size={15} aria-hidden="true" /> {t('gallery.pending')}</span>
                <span className="gallery-item__label">{localize(item.category)} <Maximize2 size={18} aria-hidden="true" /></span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {activeIndex !== null && <Lightbox index={activeIndex} onClose={closeLightbox} onChange={changeLightbox} />}
      </AnimatePresence>
    </section>
  )
}

