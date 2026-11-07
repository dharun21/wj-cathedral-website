import { ArrowDown, ArrowRight, BookOpenCheck, Church, HeartHandshake, MapPin, ShieldAlert, Sparkles, UsersRound } from 'lucide-react'
import { Reveal } from '../components/common/Reveal'
import { churchInfo } from '../data/churchInfo'
import { useLanguage } from '../context/LanguageContext'

const journey = [
  { number: '01', title: 'aboutPage.journey.foundationTitle', body: 'aboutPage.journey.foundationBody' },
  { number: '02', title: 'aboutPage.journey.collegeTitle', body: 'aboutPage.journey.collegeBody' },
  { number: '03', title: 'aboutPage.journey.ministriesTitle', body: 'aboutPage.journey.ministriesBody' },
  { number: '04', title: 'aboutPage.journey.careTitle', body: 'aboutPage.journey.careBody' },
] as const

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
            <img src="./hero/welcome-wj-cathedral.jpg" alt={t('aboutPage.hero.imageAlt')} />
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

      <section className="section about-journey">
        <div className="container">
          <Reveal className="about-section-heading">
            <p className="eyebrow">{t('aboutPage.journey.eyebrow')}</p>
            <h2>{t('aboutPage.journey.title')}</h2>
            <span>{t('aboutPage.journey.intro')}</span>
          </Reveal>
          <div className="about-journey__list">
            {journey.map((item, index) => <Reveal className="about-journey__item" delay={index * 0.05} key={item.number}><span>{item.number}</span><div><h3>{t(item.title)}</h3><p>{t(item.body)}</p></div></Reveal>)}
          </div>
          <Reveal className="about-history-note"><ShieldAlert size={19} aria-hidden="true" /><p>{t('aboutPage.journey.historyNote')}</p></Reveal>
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
