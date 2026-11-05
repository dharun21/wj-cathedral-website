import useEmblaCarousel from 'embla-carousel-react'
import { ArrowLeft, ArrowRight, ArrowUpRight, ImageIcon, Pause, Play } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { heroSlides } from '../../data/heroSlides'
import { useLanguage } from '../../context/LanguageContext'

export function HeroSection() {
  const { localize, t, language } = useLanguage()
  const reducedMotion = useReducedMotion()
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: reducedMotion ? 0 : 28 })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [autoplay, setAutoplay] = useState(!reducedMotion)
  const hoverPause = useRef(false)

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
    if (!emblaApi || !autoplay || reducedMotion) return undefined
    const timer = window.setInterval(() => {
      if (!hoverPause.current && !document.hidden) emblaApi.scrollNext()
    }, 7000)
    return () => window.clearInterval(timer)
  }, [emblaApi, autoplay, reducedMotion])

  const activeSlide = heroSlides[selectedIndex] ?? heroSlides[0]

  return (
    <section
      id="home"
      className="hero"
      aria-roledescription="carousel"
      aria-label={t('a11y.heroCarousel')}
      onMouseEnter={() => { hoverPause.current = true }}
      onMouseLeave={() => { hoverPause.current = false }}
      onFocusCapture={() => { hoverPause.current = true }}
      onBlurCapture={() => { hoverPause.current = false }}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft') emblaApi?.scrollPrev()
        if (event.key === 'ArrowRight') emblaApi?.scrollNext()
      }}
    >
      <div className="hero__viewport" ref={emblaRef}>
        <div className="hero__container">
          {heroSlides.map((slide, index) => (
            <article className="hero-slide" key={slide.id} aria-hidden={selectedIndex !== index}>
              <img className="hero-slide__image" src={slide.image} alt={localize(slide.imageAlt)} fetchPriority={index === 0 ? 'high' : 'auto'} />
              <div className="hero-slide__overlay" aria-hidden="true" />
              <div className="container hero-slide__content">
                {selectedIndex === index && (
                  <motion.div
                    key={`${slide.id}-${language}`}
                    className="hero-slide__copy"
                    initial={reducedMotion ? false : { opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <p className="hero-slide__eyebrow">{localize(slide.eyebrow)}</p>
                    <h1>{localize(slide.title)}</h1>
                    <p className="hero-slide__description">{localize(slide.description)}</p>
                    <div className="hero-slide__actions">
                      <a className="button button--gold" href={slide.cta.href}>{localize(slide.cta.label)} <ArrowRight size={18} aria-hidden="true" /></a>
                      {slide.secondaryCta && (
                        <a className="button button--glass" href={slide.secondaryCta.href}>{localize(slide.secondaryCta.label)} <ArrowUpRight size={17} aria-hidden="true" /></a>
                      )}
                    </div>
                    <span className="hero-slide__media-note"><ImageIcon size={14} aria-hidden="true" /> {t('hero.photoPending')}</span>
                  </motion.div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="container hero__controls">
        <div className="hero__arrows">
          <button type="button" onClick={() => emblaApi?.scrollPrev()} aria-label={t('a11y.previousSlide')}><ArrowLeft aria-hidden="true" /></button>
          <button type="button" onClick={() => emblaApi?.scrollNext()} aria-label={t('a11y.nextSlide')}><ArrowRight aria-hidden="true" /></button>
        </div>
        <div className="hero__dots" aria-label={t('a11y.slideSelection')}>
          {heroSlides.map((slide, index) => (
            <button
              type="button"
              key={slide.id}
              className={selectedIndex === index ? 'is-active' : ''}
              onClick={() => emblaApi?.scrollTo(index)}
              aria-label={`${t('a11y.goToSlide')} ${index + 1}`}
              aria-current={selectedIndex === index ? 'true' : undefined}
            ><span /></button>
          ))}
        </div>
        {!reducedMotion && (
          <button type="button" className="hero__autoplay" onClick={() => setAutoplay((current) => !current)} aria-label={autoplay ? t('a11y.pauseSlides') : t('a11y.playSlides')}>
            {autoplay ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
          </button>
        )}
        <p className="hero__count"><strong>0{selectedIndex + 1}</strong><span>/ 0{heroSlides.length}</span></p>
      </div>
      {activeSlide && <span className="sr-only" aria-live="polite">{localize(activeSlide.title)}</span>}
    </section>
  )
}

