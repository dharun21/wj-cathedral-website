import { ArrowDown, ArrowRight, BookOpenCheck, Church, HeartHandshake, MapPin, Quote, Sparkles, UsersRound } from 'lucide-react'
import { Reveal } from '../components/common/Reveal'
import { churchInfo } from '../data/churchInfo'
import {
  churchGrowthIntro,
  churchHistoryFinal,
  churchHistoryLocations,
  churchOrigin,
  churchVision,
} from '../data/churchHistory'
import { useLanguage } from '../context/LanguageContext'

const values = [
  { icon: Church, title: 'aboutPage.values.jesusTitle', body: 'aboutPage.values.jesusBody' },
  { icon: Sparkles, title: 'aboutPage.values.prayerTitle', body: 'aboutPage.values.prayerBody' },
  { icon: BookOpenCheck, title: 'aboutPage.values.wordTitle', body: 'aboutPage.values.wordBody' },
  { icon: HeartHandshake, title: 'aboutPage.values.serviceTitle', body: 'aboutPage.values.serviceBody' },
] as const

export function AboutUsPage() {
  const { t, localize } = useLanguage()

  return (
    <main id="main-content" tabIndex={-1} className="about-page">
      <section className="about-hero">
        <div className="about-hero__glow" aria-hidden="true"><span /><span /><span /></div>
        <div className="container about-hero__layout">
          <Reveal className="about-hero__copy">
            <p>{t('aboutPage.hero.eyebrow')}</p>
            <h1>{t('aboutPage.hero.title')}</h1>
            <span>{t('aboutPage.hero.intro')}</span>
            <div className="about-hero__actions">
              <a className="button button--gold" href="#about-founder">{t('aboutPage.hero.founderCta')} <ArrowDown size={18} aria-hidden="true" /></a>
              <a className="button button--outline-light" href={churchInfo.mapsUrl} target="_blank" rel="noreferrer">{t('aboutPage.hero.visitCta')} <MapPin size={17} aria-hidden="true" /></a>
            </div>
          </Reveal>
          <Reveal className="about-hero__portrait" delay={0.08}>
            <img src="./about/one-church-one-story.jpg" alt={t('aboutPage.hero.imageAlt')} />
            <div><small>{churchInfo.shortName}</small><strong>{localize(churchInfo.locationShort)}</strong></div>
          </Reveal>
        </div>
      </section>

      <section className="section about-story">
        <div className="container about-story__layout">
          <Reveal className="about-story__heading">
            <p className="eyebrow">{t('aboutPage.story.eyebrow')}</p>
            <h2>{t('aboutPage.story.title')}</h2>
          </Reveal>
          <Reveal className="about-story__copy" delay={0.08}>
            <p>{t('aboutPage.story.body1')}</p>
            <p>{t('aboutPage.story.body2')}</p>
            <div><UsersRound size={21} aria-hidden="true" /><span>{t('aboutPage.story.note')}</span></div>
          </Reveal>
        </div>
      </section>

      <section id="about-founder" className="section about-founder">
        <div className="about-founder__pattern" aria-hidden="true" />
        <div className="container about-founder__layout">
          <Reveal className="about-founder__media">
            <div className="about-founder__frame"><img src="./academics/faculty/paulraj.jpg" alt={t('aboutPage.founder.imageAlt')} /></div>
            <span>{t('aboutPage.founder.role')}</span>
          </Reveal>
          <Reveal className="about-founder__copy" delay={0.08}>
            <p className="about-founder__eyebrow">{t('aboutPage.founder.eyebrow')}</p>
            <h2>{t('aboutPage.founder.name')}</h2>
            <strong>{t('aboutPage.founder.statement')}</strong>
            <p>{t('aboutPage.founder.body1')}</p>
            <p>{t('aboutPage.founder.body2')}</p>
            <a href="#academics" className="about-founder__link">{t('aboutPage.founder.academicsCta')} <ArrowRight size={17} aria-hidden="true" /></a>
          </Reveal>
        </div>
      </section>

      <section id="about-history" className="section about-history">
        <div className="container">
          <Reveal className="about-section-heading">
            <p className="eyebrow">{localize({ en: 'Origin and growth', ta: 'தோற்றமும் வளர்ச்சியும்' })}</p>
            <h2>{localize({ en: 'From a Sunday school to a family of churches.', ta: 'ஞாயிறு பள்ளியிலிருந்து திருச்சபைகளின் குடும்பமாக.' })}</h2>
            <span>{localize({ en: 'The complete account below follows the historical record supplied by Worship to Jesus Cathedral.', ta: 'கீழேயுள்ள முழுமையான பதிவு இயேசுவுக்கே ஆராதனை திருச்சபை வழங்கிய வரலாற்று ஆவணத்தைப் பின்பற்றுகிறது.' })}</span>
          </Reveal>

          <div className="about-history__foundations">
            <Reveal className="about-history__foundation">
              <span>{churchOrigin.number}</span>
              <p className="about-history__label">{localize({ en: 'The beginning', ta: 'தொடக்கம்' })}</p>
              <h3>{localize(churchOrigin.title)}</h3>
              <div>{churchOrigin.paragraphs.map((paragraph, index) => <p key={index}>{localize(paragraph)}</p>)}</div>
            </Reveal>

            <Reveal className="about-history__foundation about-history__foundation--vision" delay={0.08}>
              <span>{churchVision.number}</span>
              <p className="about-history__label">{localize({ en: 'The founding vision', ta: 'நிறுவன தரிசனம்' })}</p>
              <h3>{localize(churchVision.title)}</h3>
              <Quote size={26} aria-hidden="true" />
              <blockquote>{localize(churchVision.quote)}</blockquote>
              <div>{churchVision.paragraphs.map((paragraph, index) => <p key={index}>{localize(paragraph)}</p>)}</div>
            </Reveal>
          </div>

          <Reveal className="about-history__growth-heading">
            <div>
              <p className="eyebrow">{localize({ en: 'Growth, challenges and church shifting', ta: 'வளர்ச்சி, சவால்கள் மற்றும் இடமாற்றங்கள்' })}</p>
              <h2>{localize({ en: 'Eight temporary locations. One enduring calling.', ta: 'எட்டு தற்காலிக இடங்கள். நிலைத்த ஒரே அழைப்பு.' })}</h2>
            </div>
            <span>{localize(churchGrowthIntro)}</span>
          </Reveal>

          <div className="about-history__locations">
            {churchHistoryLocations.map((location, index) => (
              <Reveal className="about-history__location" delay={(index % 3) * 0.03} key={location.number}>
                <span>{location.number}</span>
                <article className={location.image ? `has-image${location.imagePosition === 'left' ? ' is-image-left' : ''}` : undefined}>
                  <div className="about-history__location-copy">
                    <h3>{localize(location.title)}</h3>
                    <div>{location.paragraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{localize(paragraph)}</p>)}</div>
                  </div>
                  {location.image ? <img src={location.image} alt={localize(location.title)} loading="lazy" /> : null}
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal className="about-history__final">
            <span>{churchHistoryFinal.number}</span>
            <div>
              <p>{localize({ en: 'Final milestone', ta: 'இறுதி மைல்கல்' })}</p>
              <h2>{localize(churchHistoryFinal.title)}</h2>
              {churchHistoryFinal.paragraphs.map((paragraph, index) => <span key={index}>{localize(paragraph)}</span>)}
              {churchHistoryFinal.image ? <img src={churchHistoryFinal.image} alt={localize(churchHistoryFinal.title)} loading="lazy" /> : null}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section about-values">
        <div className="container">
          <Reveal className="about-section-heading about-section-heading--light">
            <p className="eyebrow">{t('aboutPage.values.eyebrow')}</p>
            <h2>{t('aboutPage.values.title')}</h2>
            <span>{t('aboutPage.values.intro')}</span>
          </Reveal>
          <div className="about-values__grid">
            {values.map((item, index) => { const Icon = item.icon; return <Reveal className="about-value-card" delay={index * 0.05} key={item.title}><span><Icon size={23} aria-hidden="true" /></span><h3>{t(item.title)}</h3><p>{t(item.body)}</p></Reveal> })}
          </div>
        </div>
      </section>

      <section className="section about-visit">
        <div className="container">
          <Reveal className="about-visit__card">
            <MapPin size={30} aria-hidden="true" />
            <div><p>{t('aboutPage.visit.eyebrow')}</p><h2>{t('aboutPage.visit.title')}</h2><span>{localize(churchInfo.address)}</span></div>
            <a className="button button--gold" href="#contact">{t('aboutPage.visit.cta')} <ArrowRight size={18} aria-hidden="true" /></a>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
