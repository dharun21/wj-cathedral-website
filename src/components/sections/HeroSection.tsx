import useEmblaCarousel from 'embla-carousel-react'
import { ArrowLeft, ArrowRight, ArrowUpRight, ImageIcon, Pause, Play } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { academicCollege } from '../../data/academics'
import { heroSlides } from '../../data/heroSlides'
import { sermons } from '../../data/sermons'
import { useLanguage } from '../../context/LanguageContext'
import { useDailyBibleVerse, usePublishedAcademicSettings, usePublishedHeroSlides, usePublishedSiteSettings, usePublishedVideoRows } from '../../hooks/usePublishedContent'
import type { HeroSlide } from '../../types/content'
import { contentLengthClass } from '../../utils/contentLength'
import { HOME_LIVE_SLIDE_SLOT_ID } from '../../constants/heroSlides'

const retiredPrayerSlideIds = new Set(['prayer', 'daily-verse', '10000000-0000-4000-8000-000000000003'])

function asCollegeInformationSlide(slide: HeroSlide, college: { name: string; affiliation: string; established: string; principal: string }): HeroSlide {
  const collegeSlide = { ...slide }
  delete collegeSlide.cta
  return {
    ...collegeSlide,
    eyebrow: { en: 'Bible college', ta: 'வேதாகமக் கல்லூரி' },
    title: { en: college.name, ta: college.name },
    description: {
      en: `Affiliated with ${college.affiliation} and established in ${college.established}.`,
      ta: `${college.affiliation}-இன் இணைப்புடன் ${college.established}-ஆம் ஆண்டு நிறுவப்பட்டது.`,
    },
  }
}

export function HeroSection() {
  const { localize, t, language } = useLanguage()
  const reducedMotion = useReducedMotion()
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: reducedMotion ? 0 : 28 })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [autoplay, setAutoplay] = useState(!reducedMotion)
  const hoverPause = useRef(false)
  const publishedSlides = usePublishedHeroSlides('home', heroSlides)
  const academicSettings = usePublishedAcademicSettings()
  const dailyVerse = useDailyBibleVerse()
  const siteSettings = usePublishedSiteSettings()
  const publishedVideos = usePublishedVideoRows()
  const isInitialHeroLoading = publishedSlides.isLoading
  const slides = useMemo(() => {
    if (isInitialHeroLoading) return []
    const row = dailyVerse.data
    const fallback = heroSlides.find((slide) => slide.id === 'daily-verse')!
    const verseSlide: HeroSlide = row ? {
      id: `daily-verse-${row.id}`,
      eyebrow: { en: 'Today’s Scripture', ta: 'இன்றைய வேதவசனம்' },
      title: { en: `“${row.verse_en}”`, ta: `“${row.verse_ta}”` },
      description: {
        en: row.reference_en,
        ta: row.reference_ta,
      },
      image: siteSettings.data?.daily_verse_background_url || './hero/daily-bible-verse.jpg',
      imageAlt: {
        en: 'An open Bible illuminated against a deep blue background accompanying today’s approved verse',
        ta: 'இன்றைய அங்கீகரிக்கப்பட்ட வேதவசனத்துடன் ஆழ்ந்த நீலப் பின்னணியில் ஒளிரும் திறந்த வேதாகமம்',
      },
      cta: { href: '#prayer-helpline', label: { en: 'Prayer support', ta: 'ஜெப உதவி' } },
      mediaStatus: 'approved-client-supplied',
      variant: 'daily-verse',
    } : fallback
    const admissionsOpen = academicSettings.data?.admissions_open ?? true
    const college = {
      name: academicSettings.data?.college_name ?? academicCollege.name,
      affiliation: academicSettings.data?.affiliation ?? academicCollege.affiliation,
      established: academicSettings.data?.established ?? academicCollege.established,
      principal: academicSettings.data?.principal ?? academicCollege.principal,
    }
    const staticSlides = (publishedSlides.isError ? heroSlides : publishedSlides.data)
      .filter((slide) => !retiredPrayerSlideIds.has(slide.id))
      .map((slide): HeroSlide => slide.cta?.href === '#academics-admission' && !admissionsOpen
        ? asCollegeInformationSlide(slide, college)
        : slide)
    staticSlides.splice(Math.min(2, staticSlides.length), 0, verseSlide)
    const managedLive = [...(publishedVideos.data ?? [])]
      .filter((video) => video.category === 'live-session' || video.live_status !== 'recorded')
      .sort((first, second) => second.created_at.localeCompare(first.created_at) || first.display_order - second.display_order)[0]
    const fallbackLive = sermons.find((video) => video.mediaType === 'live-session')
    const liveVideoId = managedLive?.youtube_id ?? fallbackLive?.videoId
    const liveSlotIndex = staticSlides.findIndex((slide) => slide.id === HOME_LIVE_SLIDE_SLOT_ID)
    if (liveVideoId) {
      const liveSlide: HeroSlide = {
        id: `latest-live-${managedLive?.id ?? fallbackLive?.id ?? liveVideoId}`,
        eyebrow: { en: 'Latest church live session', ta: 'சமீபத்திய திருச்சபை நேரலை நிகழ்வு' },
        title: { en: 'Live from WJ Cathedral', ta: 'WJ Cathedral-இலிருந்து நேரலை' },
        description: managedLive
          ? { en: managedLive.title_en, ta: managedLive.title_ta }
          : fallbackLive?.title ?? { en: 'Watch the latest session from WJ Cathedral.', ta: 'WJ Cathedral-இன் சமீபத்திய நிகழ்வைக் காணுங்கள்.' },
        image: `https://i.ytimg.com/vi/${liveVideoId}/maxresdefault.jpg`,
        imageAlt: { en: 'Preview of the latest WJ Cathedral YouTube live session', ta: 'சமீபத்திய WJ Cathedral YouTube நேரலை நிகழ்வின் முன்னோட்டம்' },
        cta: { href: '#media-live', label: { en: 'Watch the latest session', ta: 'சமீபத்திய நிகழ்வைக் காணுங்கள்' } },
        secondaryCta: { href: '#media', label: { en: 'Explore all media', ta: 'அனைத்து ஊடகங்களையும் காணுங்கள்' } },
        mediaStatus: 'approved-client-supplied',
      }
      if (liveSlotIndex >= 0) staticSlides.splice(liveSlotIndex, 1, liveSlide)
      else staticSlides.push(liveSlide)
    } else if (liveSlotIndex >= 0) staticSlides.splice(liveSlotIndex, 1)
    return staticSlides
  }, [academicSettings.data, dailyVerse.data, isInitialHeroLoading, publishedSlides.data, publishedSlides.isError, publishedVideos.data, siteSettings.data?.daily_verse_background_url])

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

  if (isInitialHeroLoading) return (
    <section id="home" className="hero hero--loading" aria-busy="true" aria-label={t('a11y.heroCarousel')}>
      <div className="container hero-loading__content" aria-hidden="true">
        <div className="hero-loading__skeleton">
          <span className="hero-loading__line hero-loading__line--eyebrow" />
          <span className="hero-loading__line hero-loading__line--title" />
          <span className="hero-loading__line hero-loading__line--title-short" />
          <span className="hero-loading__line hero-loading__line--body" />
          <span className="hero-loading__line hero-loading__line--button" />
        </div>
      </div>
      <span className="sr-only">Loading current homepage slides…</span>
    </section>
  )

  const activeSlide = slides[selectedIndex] ?? slides[0]

  return (
    <section
      id="home"
      className="hero"
      aria-busy={isInitialHeroLoading}
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
          {slides.map((slide, index) => (
            <article className={`hero-slide${slide.variant === 'daily-verse' ? ' hero-slide--daily-verse' : ''} ${contentLengthClass(localize(slide.title), slide.variant === 'daily-verse' ? { medium: 100, long: 220, extraLong: 360 } : undefined)}`.trim()} key={slide.id} aria-hidden={selectedIndex !== index}>
              <img className="hero-slide__image" src={slide.image} alt={localize(slide.imageAlt)} loading={index === 0 ? 'eager' : 'lazy'} decoding="async" fetchPriority={index === 0 ? 'high' : 'low'} />
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
                    {(slide.cta || slide.secondaryCta) && <div className="hero-slide__actions">
                      {slide.cta && <a className="button button--gold" href={slide.cta.href}>{localize(slide.cta.label)} <ArrowRight size={18} aria-hidden="true" /></a>}
                      {slide.secondaryCta && (
                        <a className="button button--glass" href={slide.secondaryCta.href}>{localize(slide.secondaryCta.label)} <ArrowUpRight size={17} aria-hidden="true" /></a>
                      )}
                    </div>}
                    {slide.variant !== 'daily-verse' && slide.mediaStatus === 'placeholder-awaiting-approved-photo' && <span className="hero-slide__media-note"><ImageIcon size={14} aria-hidden="true" /> {t('hero.photoPending')}</span>}
                  </motion.div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>

      {!isInitialHeroLoading && slides.length > 1 && <div className="container hero__controls">
        <div className="hero__arrows">
          <button type="button" onClick={() => emblaApi?.scrollPrev()} aria-label={t('a11y.previousSlide')}><ArrowLeft aria-hidden="true" /></button>
          <button type="button" onClick={() => emblaApi?.scrollNext()} aria-label={t('a11y.nextSlide')}><ArrowRight aria-hidden="true" /></button>
        </div>
        <div className="hero__dots" aria-label={t('a11y.slideSelection')}>
          {slides.map((slide, index) => (
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
        <p className="hero__count"><strong>0{selectedIndex + 1}</strong><span>/ 0{slides.length}</span></p>
      </div>}
      {activeSlide && <span className="sr-only" aria-live="polite">{localize(activeSlide.title)}</span>}
    </section>
  )
}

