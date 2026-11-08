import useEmblaCarousel from 'embla-carousel-react'
import { ArrowLeft, ArrowRight, ArrowUpRight, BadgeCheck, BookOpenText, GraduationCap, Pause, Play } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { academicHeroSlides } from '../../data/academics'
import { useLanguage } from '../../context/LanguageContext'
import { usePublishedHeroRows } from '../../hooks/usePublishedContent'
import type { LocalizedText } from '../../types/content'

const slideIcons = {
  admissions: BookOpenText,
  licence: BadgeCheck,
  graduation: GraduationCap,
} as const

interface AcademicCarouselSlide {
  id: string
  frame: keyof typeof slideIcons | 'custom'
  eyebrow: LocalizedText
  title: LocalizedText
  description: LocalizedText
  ctaLabel?: LocalizedText
  ctaHref?: `#${string}`
  imageUrl?: string | null
}

export function AcademicHeroCarousel({ admissionsOpen = true }: { admissionsOpen?: boolean }) {
  const { t, localize, language } = useLanguage()
  const reduceMotion = useReducedMotion()
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: reduceMotion ? 0 : 28 })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [autoplay, setAutoplay] = useState(!reduceMotion)
  const paused = useRef(false)
  const managed = usePublishedHeroRows('academics').data ?? []
  const slides: AcademicCarouselSlide[] = (managed.length ? managed.map((row): AcademicCarouselSlide => {
    const builtIn = row.slide_kind === 'default' && row.default_key
      ? academicHeroSlides.find((slide) => slide.id === row.default_key)
      : undefined
    if (builtIn) return {
      id: row.id,
      frame: builtIn.id,
      eyebrow: builtIn.eyebrow,
      title: { en: row.title_en, ta: row.title_ta },
      description: { en: row.description_en, ta: row.description_ta },
      ctaLabel: builtIn.ctaLabel,
      ctaHref: builtIn.ctaHref,
    }
    return {
      id: row.id,
      frame: 'custom',
      eyebrow: { en: 'WJ Academics', ta: 'WJ கல்வி' },
      title: { en: row.title_en, ta: row.title_ta },
      description: { en: row.description_en, ta: row.description_ta },
      imageUrl: row.image_url,
    }
  }) : academicHeroSlides.map((slide) => ({ ...slide, frame: slide.id })))
    .filter((slide) => admissionsOpen || slide.frame !== 'admissions')

  const onSelect = useCallback(() => {
    if (emblaApi) setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return undefined
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi, onSelect])

  useEffect(() => {
    if (!emblaApi || !autoplay || reduceMotion) return undefined
    const timer = window.setInterval(() => {
      if (!paused.current && !document.hidden) emblaApi.scrollNext()
    }, 6500)
    return () => window.clearInterval(timer)
  }, [autoplay, emblaApi, reduceMotion])

  return (
    <section
      id="academics"
      className="academic-hero"
      aria-roledescription="carousel"
      aria-label={t('academics.heroCarousel')}
      onMouseEnter={() => { paused.current = true }}
      onMouseLeave={() => { paused.current = false }}
      onFocusCapture={() => { paused.current = true }}
      onBlurCapture={() => { paused.current = false }}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft') emblaApi?.scrollPrev()
        if (event.key === 'ArrowRight') emblaApi?.scrollNext()
      }}
    >
      <div className="academic-hero__viewport" ref={emblaRef}>
        <div className="academic-hero__container">
          {slides.map((slide, index) => {
            const Icon = slide.frame === 'custom' ? GraduationCap : slideIcons[slide.frame]
            const customBackground = slide.frame === 'custom' && slide.imageUrl
              ? { backgroundImage: `linear-gradient(90deg, rgba(5, 21, 33, .9), rgba(5, 21, 33, .45)), url("${slide.imageUrl.replaceAll('"', '%22')}")` }
              : undefined
            return (
              <article className={`academic-hero__slide academic-hero__slide--${slide.frame}`} style={customBackground} key={slide.id} aria-hidden={selectedIndex !== index}>
                <div className="academic-hero__pattern" aria-hidden="true"><span /><span /><span /></div>
                <div className="container academic-hero__content">
                  {selectedIndex === index && (
                    <motion.div
                      className="academic-hero__copy"
                      key={`${slide.id}-${language}`}
                      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p className="academic-hero__eyebrow"><Icon size={18} aria-hidden="true" /> {localize(slide.eyebrow)}</p>
                      <h1>{localize(slide.title)}</h1>
                      <p className="academic-hero__description">{localize(slide.description)}</p>
                      {slide.ctaHref && slide.ctaLabel && <a className="button button--gold" href={slide.ctaHref}>{localize(slide.ctaLabel)} <ArrowUpRight size={18} aria-hidden="true" /></a>}
                    </motion.div>
                  )}
                  <div className="academic-hero__emblem" aria-hidden="true">
                    <span><Icon size={62} /></span>
                    <small>WJ</small>
                    <strong>Academics</strong>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>

      <div className="container academic-hero__controls">
        <div className="academic-hero__arrows">
          <button type="button" onClick={() => emblaApi?.scrollPrev()} aria-label={t('academics.previousSlide')}><ArrowLeft aria-hidden="true" /></button>
          <button type="button" onClick={() => emblaApi?.scrollNext()} aria-label={t('academics.nextSlide')}><ArrowRight aria-hidden="true" /></button>
        </div>
        <div className="academic-hero__dots">
          {slides.map((slide, index) => (
            <button
              type="button"
              key={slide.id}
              className={selectedIndex === index ? 'is-active' : ''}
              onClick={() => emblaApi?.scrollTo(index)}
              aria-label={`${t('academics.goToSlide')} ${index + 1}`}
              aria-current={selectedIndex === index ? 'true' : undefined}
            ><span /></button>
          ))}
        </div>
        {!reduceMotion && (
          <button type="button" className="academic-hero__autoplay" onClick={() => setAutoplay((current) => !current)} aria-label={autoplay ? t('a11y.pauseSlides') : t('a11y.playSlides')}>
            {autoplay ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
          </button>
        )}
        <p className="academic-hero__count"><strong>0{selectedIndex + 1}</strong><span>/ 0{slides.length}</span></p>
      </div>
    </section>
  )
}

