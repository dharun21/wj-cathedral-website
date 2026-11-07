import { useEffect, useState } from 'react'
import { ArrowDown, ArrowUpRight, BookOpenText, ChevronLeft, ChevronRight, Church, HeartHandshake, Network, Phone, ShieldAlert, Sprout, Users, UsersRound } from 'lucide-react'
import { Reveal } from '../components/common/Reveal'
import { SectionHeading } from '../components/common/SectionHeading'
import { useLanguage } from '../context/LanguageContext'
import { churchInfo } from '../data/churchInfo'
import { equippingMinistries, generationMinistries, type ChurchMinistryIcon } from '../data/churchMinistries'
import { usePublishedGallery, usePublishedMinistries } from '../hooks/usePublishedContent'

const youthMinistryPhotos = [
  {
    src: '/church/youth-ministry/youth-ministry-01.jpg',
    alt: { en: 'Young men gathered for Youth Ministry at WJ Cathedral', ta: 'WJ Cathedral வாலிபர் ஊழியத்தில் ஒன்றுகூடிய இளைஞர்கள்' },
  },
  {
    src: '/church/youth-ministry/youth-ministry-02.jpg',
    alt: { en: 'Young women and church leaders gathered at WJ Cathedral', ta: 'WJ Cathedral-ல் ஒன்றுகூடிய இளம் பெண்களும் திருச்சபைத் தலைவர்களும்' },
  },
  {
    src: '/church/youth-ministry/youth-ministry-03.jpg',
    alt: { en: 'Youth Ministry group gathered with church leaders', ta: 'திருச்சபைத் தலைவர்களுடன் ஒன்றுகூடிய வாலிபர் ஊழியக் குழு' },
  },
  {
    src: '/church/youth-ministry/youth-ministry-04.jpg',
    alt: { en: 'Young people gathered for a Youth Ministry sports activity', ta: 'வாலிபர் ஊழிய விளையாட்டு நிகழ்வில் ஒன்றுகூடிய இளைஞர்கள்' },
  },
] as const

interface MinistryPhoto {
  src: string
  alt: { en: string; ta: string }
}

function MinistryPhotoDisplay({
  images,
  title,
  previousLabel,
  nextLabel,
}: {
  images: readonly MinistryPhoto[]
  title: string
  previousLabel: string
  nextLabel: string
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (images.length < 2 || paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = window.setInterval(() => setActiveIndex((current) => (current + 1) % images.length), 4500)
    return () => window.clearInterval(timer)
  }, [images.length, paused])

  const firstImage = images[0]
  if (!firstImage) return null

  if (images.length === 1) {
    return (
      <figure className="ministry-journey__visual">
        <img src={firstImage.src} alt={firstImage.alt.en} loading="lazy" decoding="async" />
      </figure>
    )
  }

  const safeIndex = activeIndex % images.length
  const previous = () => setActiveIndex((current) => ((current % images.length) - 1 + images.length) % images.length)
  const next = () => setActiveIndex((current) => (current + 1) % images.length)

  return (
    <figure
      className="ministry-journey__visual ministry-journey__visual--carousel"
      aria-label={title}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false)
      }}
    >
      <div className="ministry-photo-carousel__track" style={{ transform: `translateX(-${safeIndex * 100}%)` }}>
        {images.map((image) => (
          <img key={image.src} src={image.src} alt={image.alt.en} loading="lazy" decoding="async" />
        ))}
      </div>
      <button className="ministry-photo-carousel__arrow is-previous" type="button" onClick={previous} aria-label={previousLabel}>
        <ChevronLeft size={20} aria-hidden="true" />
      </button>
      <button className="ministry-photo-carousel__arrow is-next" type="button" onClick={next} aria-label={nextLabel}>
        <ChevronRight size={20} aria-hidden="true" />
      </button>
      <div className="ministry-photo-carousel__dots" aria-label={`${safeIndex + 1} / ${images.length}`}>
        {images.map((image, index) => (
          <button
            className={index === safeIndex ? 'is-active' : ''}
            type="button"
            key={image.src}
            onClick={() => setActiveIndex(index)}
            aria-label={`${title} ${index + 1}`}
            aria-current={index === safeIndex ? 'true' : undefined}
          />
        ))}
      </div>
    </figure>
  )
}

const ministryIcons: Record<ChurchMinistryIcon, typeof Church> = {
  children: UsersRound,
  youth: Users,
  family: HeartHandshake,
  planting: Sprout,
  leaders: Network,
  gospel: BookOpenText,
}

export function ChurchPage() {
  const { t, localize, language } = useLanguage()
  const managedRows = usePublishedMinistries('church').data ?? []
  const managedGallery = usePublishedGallery([]).data
  const managedYouthPhotos = managedGallery
    .filter((item) => item.category.en === 'Youth Ministry')
    .map((item) => ({ src: item.src, alt: item.alt }))
  const applyManaged = <T extends (typeof generationMinistries)[number] | (typeof equippingMinistries)[number]>(item: T): T => {
    const managed = managedRows.find((row) => row.slug === item.id)
    return managed ? { ...item, title: { en: managed.title_en, ta: managed.title_ta }, eyebrow: { en: managed.eyebrow_en || item.eyebrow.en, ta: managed.eyebrow_ta || item.eyebrow.ta }, description: { en: managed.description_en, ta: managed.description_ta } } : item
  }
  const generationContent = generationMinistries.map(applyManaged)
  const equippingContent = equippingMinistries.map(applyManaged)
  const allMinistries = [...generationContent, ...equippingContent]

  return (
    <main id="main-content" className="church-page" tabIndex={-1}>
      <section id="church" className="church-hero">
        <div className="church-hero__pattern" aria-hidden="true"><span /><span /><span /></div>
        <div className="container church-hero__layout">
          <Reveal className="church-hero__copy">
            <p className="church-hero__eyebrow"><Church size={18} aria-hidden="true" /> {t('churchPage.hero.eyebrow')}</p>
            <h1>{language === 'en'
              ? <><span>Forming disciples.</span><span>Strengthening families.</span><span>Equipping</span><span>the Church.</span></>
              : t('churchPage.hero.title')}</h1>
            <p>{t('churchPage.hero.intro')}</p>
            <div className="church-hero__actions">
              <a className="button button--gold" href="#church-generations">{t('churchPage.hero.explore')} <ArrowDown size={18} aria-hidden="true" /></a>
              <a className="button button--outline-light" href={`tel:${churchInfo.phone}`}><Phone size={17} aria-hidden="true" /> {t('common.callChurch')}</a>
            </div>
          </Reveal>

          <Reveal className="church-ministry-map" delay={0.08}>
            <div className="church-ministry-map__centre">
              <span><Church size={32} aria-hidden="true" /></span>
              <strong>{t('churchPage.hero.centre')}</strong>
              <small>{t('churchPage.hero.oneChurch')}</small>
            </div>
            <ol>
              {allMinistries.map((ministry) => {
                const Icon = ministryIcons[ministry.icon]
                return <li key={ministry.id}><Icon size={17} aria-hidden="true" /><span>{localize(ministry.title)}</span></li>
              })}
            </ol>
          </Reveal>
        </div>
        <div className="container church-hero__footer"><span>06</span><p>{t('churchPage.hero.pathways')}</p><i /></div>
      </section>

      <section id="church-generations" className="section church-generations">
        <div className="container">
          <div className="church-generations__intro">
            <SectionHeading eyebrow={t('churchPage.generations.eyebrow')} title={t('churchPage.generations.title')} />
            <p>{t('churchPage.generations.intro')}</p>
          </div>

          <div className="ministry-journey">
            <span className="ministry-journey__line" aria-hidden="true" />
            {generationContent.map((ministry, index) => {
              const Icon = ministryIcons[ministry.icon]
              const managed = managedRows.find((row) => row.slug === ministry.id)
              const fallbackImages = ministry.id === 'children-ministry'
                ? [{ src: '/church/children-ministry.jpg', alt: ministry.title }]
                : ministry.id === 'youth-ministry'
                  ? youthMinistryPhotos
                  : ministry.id === 'family-counselling'
                    ? [{
                        src: '/church/family-counselling.jpg',
                        alt: {
                          en: 'Church leaders and family ministry members gathered together',
                          ta: 'ஒன்றுகூடிய திருச்சபைத் தலைவர்களும் குடும்ப ஊழிய உறுப்பினர்களும்',
                        },
                      }]
                    : []
              const ministryImages = ministry.id === 'youth-ministry' && managedYouthPhotos.length
                ? managedYouthPhotos
                : managed?.image_url
                  ? [{ src: managed.image_url, alt: ministry.title }]
                  : fallbackImages
              return (
                <Reveal className={`ministry-journey__item ${index % 2 ? 'is-reversed' : ''} ${ministryImages.length ? 'has-visual' : ''}`} key={ministry.id}>
                  <div className="ministry-journey__number"><small>{ministry.number}</small><span><Icon size={28} aria-hidden="true" /></span></div>
                  <MinistryPhotoDisplay
                    images={ministryImages.map((image) => ({ ...image, alt: { en: localize(image.alt), ta: localize(image.alt) } }))}
                    title={localize(ministry.title)}
                    previousLabel={language === 'ta' ? 'முந்தைய படம்' : 'Previous photo'}
                    nextLabel={language === 'ta' ? 'அடுத்த படம்' : 'Next photo'}
                  />
                  <article>
                    <p>{localize(ministry.eyebrow)}</p>
                    <h3>{localize(ministry.title)}</h3>
                    <div className="ministry-journey__rule" />
                    <p>{localize(ministry.description)}</p>
                    <ul>{ministry.focus.map((focus) => <li key={focus.en}>{localize(focus)}</li>)}</ul>
                    {ministry.id === 'family-counselling' && <small className="ministry-journey__notice"><ShieldAlert size={16} aria-hidden="true" /> {t('churchPage.counsellingNote')}</small>}
                  </article>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      <section id="church-equipping" className="section church-equipping">
        <div className="church-equipping__glow" aria-hidden="true" />
        <div className="container">
          <SectionHeading eyebrow={t('churchPage.equipping.eyebrow')} title={t('churchPage.equipping.title')} description={t('churchPage.equipping.intro')} />
          <div className="church-equipping__grid">
            {equippingContent.map((ministry, index) => {
              const Icon = ministryIcons[ministry.icon]
              const managed = managedRows.find((row) => row.slug === ministry.id)
              const fallbackImage = ministry.id === 'church-planting-seminar'
                ? '/church/church-planting-seminar.jpg'
                : ministry.id === 'leaders-seminar'
                  ? '/church/leaders-seminar.jpg'
                  : ministry.id === 'gospel-ministries'
                    ? '/church/gospel-ministries.jpg'
                    : null
              const backgroundImage = managed?.image_url || fallbackImage
              return (
                <Reveal className={`equipping-panel ${backgroundImage ? 'has-background-image' : ''}`} key={ministry.id} delay={index * 0.06}>
                  {backgroundImage && <img className="equipping-panel__background" src={backgroundImage} alt="" aria-hidden="true" loading="lazy" decoding="async" />}
                  <div className="equipping-panel__top"><span>{ministry.number}</span><Icon size={29} aria-hidden="true" /></div>
                  <p className="equipping-panel__eyebrow">{localize(ministry.eyebrow)}</p>
                  <h3>{localize(ministry.title)}</h3>
                  <p>{localize(ministry.description)}</p>
                  <ul>{ministry.focus.map((focus) => <li key={focus.en}>{localize(focus)}</li>)}</ul>
                </Reveal>
              )
            })}
          </div>

          <Reveal className="church-equipping__cta">
            <div><strong>{t('churchPage.cta.title')}</strong><p>{t('churchPage.cta.body')}</p></div>
            <a className="button button--gold" href={`tel:${churchInfo.phone}`}>{t('churchPage.cta.button')} <ArrowUpRight size={17} aria-hidden="true" /></a>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
