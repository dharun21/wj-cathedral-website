import useEmblaCarousel from 'embla-carousel-react'
import { ArrowLeft, ArrowRight, ArrowUpRight, HandHeart, HeartPulse, Pause, Play, TreePine } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { communityHeroSlides } from '../../data/communityCare'
import { usePublishedHeroRows } from '../../hooks/usePublishedContent'

const heroIcons = {
  tree: TreePine,
  heart: HandHeart,
  health: HeartPulse,
} as const

export function CommunityHeroCarousel() {
  const { t, localize, language } = useLanguage()
  const reduceMotion = useReducedMotion()
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: reduceMotion ? 0 : 28 })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [autoplay, setAutoplay] = useState(!reduceMotion)
  const paused = useRef(false)
  const managed = usePublishedHeroRows('community').data ?? []
  const slides = managed.length ? managed.map((row, index) => {
    const frame = communityHeroSlides[index % communityHeroSlides.length]!
    return { ...frame, eyebrow: { en: row.eyebrow_en, ta: row.eyebrow_ta }, title: { en: row.title_en, ta: row.title_ta }, description: { en: row.description_en, ta: row.description_ta }, ctaLabel: { en: row.cta_label_en, ta: row.cta_label_ta }, ctaHref: row.cta_href as `#${string}` }
  }) : communityHeroSlides

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
      id="community-care"
      className="community-hero"
      aria-roledescription="carousel"
      aria-label={t('community.heroCarousel')}
      onMouseEnter={() => { paused.current = true }}
      onMouseLeave={() => { paused.current = false }}
      onFocusCapture={() => { paused.current = true }}
      onBlurCapture={() => { paused.current = false }}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft') emblaApi?.scrollPrev()
        if (event.key === 'ArrowRight') emblaApi?.scrollNext()
      }}
    >
      <div className="community-hero__viewport" ref={emblaRef}>
        <div className="community-hero__container">
          {slides.map((slide, index) => {
            const Icon = heroIcons[slide.icon]
            return (
              <article className={`community-hero__slide community-hero__slide--${slide.id}`} key={slide.id} aria-hidden={selectedIndex !== index}>
                <div className="community-hero__pattern" aria-hidden="true"><span /><span /><span /></div>
                <div className="container community-hero__content">
                  {selectedIndex === index && (
                    <motion.div
                      className="community-hero__copy"
                      key={`${slide.id}-${language}`}
                      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p className="community-hero__eyebrow"><Icon size={18} aria-hidden="true" /> {localize(slide.eyebrow)}</p>
                      <h1>{localize(slide.title)}</h1>
                      <p className="community-hero__description">{localize(slide.description)}</p>
                      <a className="button button--gold" href={slide.ctaHref}>{localize(slide.ctaLabel)} <ArrowUpRight size={18} aria-hidden="true" /></a>
                    </motion.div>
                  )}
                  <div className="community-hero__emblem" aria-hidden="true">
                    <div><span /><span /><span /><Icon size={68} /></div>
                    <small>WJ</small>
                    <strong>{t('nav.communityCare')}</strong>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>

      <div className="container community-hero__controls">
        <div className="community-hero__arrows">
          <button type="button" onClick={() => emblaApi?.scrollPrev()} aria-label={t('community.previousSlide')}><ArrowLeft aria-hidden="true" /></button>
          <button type="button" onClick={() => emblaApi?.scrollNext()} aria-label={t('community.nextSlide')}><ArrowRight aria-hidden="true" /></button>
        </div>
        <div className="community-hero__dots">
          {slides.map((slide, index) => (
            <button
              type="button"
              key={slide.id}
              className={selectedIndex === index ? 'is-active' : ''}
              onClick={() => emblaApi?.scrollTo(index)}
              aria-label={`${t('community.goToSlide')} ${index + 1}`}
              aria-current={selectedIndex === index ? 'true' : undefined}
            ><span /></button>
          ))}
        </div>
        {!reduceMotion && (
          <button type="button" className="community-hero__autoplay" onClick={() => setAutoplay((current) => !current)} aria-label={autoplay ? t('a11y.pauseSlides') : t('a11y.playSlides')}>
            {autoplay ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
          </button>
        )}
        <p className="community-hero__count"><strong>0{selectedIndex + 1}</strong><span>/ 0{slides.length}</span></p>
      </div>
    </section>
  )
}
