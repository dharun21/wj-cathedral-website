import { ArrowDown, ArrowUpRight, BookOpenText, Church, HeartHandshake, Network, Phone, ShieldAlert, Sprout, Users, UsersRound } from 'lucide-react'
import { Reveal } from '../components/common/Reveal'
import { SectionHeading } from '../components/common/SectionHeading'
import { useLanguage } from '../context/LanguageContext'
import { churchInfo } from '../data/churchInfo'
import { equippingMinistries, generationMinistries, type ChurchMinistryIcon } from '../data/churchMinistries'

const ministryIcons: Record<ChurchMinistryIcon, typeof Church> = {
  children: UsersRound,
  youth: Users,
  family: HeartHandshake,
  planting: Sprout,
  leaders: Network,
  gospel: BookOpenText,
}

const allMinistries = [...generationMinistries, ...equippingMinistries]

export function ChurchPage() {
  const { t, localize } = useLanguage()

  return (
    <main id="main-content" className="church-page" tabIndex={-1}>
      <section id="church" className="church-hero">
        <div className="church-hero__pattern" aria-hidden="true"><span /><span /><span /></div>
        <div className="container church-hero__layout">
          <Reveal className="church-hero__copy">
            <p className="church-hero__eyebrow"><Church size={18} aria-hidden="true" /> {t('churchPage.hero.eyebrow')}</p>
            <h1>{t('churchPage.hero.title')}</h1>
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
            {generationMinistries.map((ministry, index) => {
              const Icon = ministryIcons[ministry.icon]
              return (
                <Reveal className={`ministry-journey__item ${index % 2 ? 'is-reversed' : ''}`} key={ministry.id}>
                  <div className="ministry-journey__number"><small>{ministry.number}</small><span><Icon size={28} aria-hidden="true" /></span></div>
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
            {equippingMinistries.map((ministry, index) => {
              const Icon = ministryIcons[ministry.icon]
              return (
                <Reveal className="equipping-panel" key={ministry.id} delay={index * 0.06}>
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
