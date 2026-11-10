import { ArrowUpRight, Church, Compass, HeartHandshake, MapPin, Phone, ShieldAlert, Sparkles, Stethoscope, UsersRound } from 'lucide-react'
import { Reveal } from '../components/common/Reveal'
import { SectionHeading } from '../components/common/SectionHeading'
import { useLanguage } from '../context/LanguageContext'
import { churchInfo } from '../data/churchInfo'
import { usePublishedSiteSettings } from '../hooks/usePublishedContent'

const prayerNeeds = [
  { id: 'family', titleKey: 'prayerPage.family.title', bodyKey: 'prayerPage.family.body', icon: UsersRound },
  { id: 'health', titleKey: 'prayerPage.health.title', bodyKey: 'prayerPage.health.body', icon: Stethoscope },
  { id: 'guidance', titleKey: 'prayerPage.guidance.title', bodyKey: 'prayerPage.guidance.body', icon: Compass },
  { id: 'ministry', titleKey: 'prayerPage.ministry.title', bodyKey: 'prayerPage.ministry.body', icon: Church },
] as const

export function PrayerHelplinePage() {
  const { t, localize } = useLanguage()
  const settings = usePublishedSiteSettings().data
  const confirmed247 = true
  const phone = settings?.phone || churchInfo.phone
  const contacts = [
    { ...churchInfo.contacts[0], phone, display: phone === churchInfo.phone ? churchInfo.contacts[0].display : phone },
    churchInfo.contacts[1],
  ]
  const translate = (key: string) => t(key as Parameters<typeof t>[0])

  return (
    <main id="main-content" className="prayer-page" tabIndex={-1}>
      <section id="prayer-helpline" className="prayer-support-hero">
        <div className="prayer-support-hero__glow" aria-hidden="true"><span /><span /><span /></div>
        <div className="container prayer-support-hero__layout">
          <Reveal className="prayer-support-hero__copy">
            <p className="prayer-support-hero__eyebrow"><HeartHandshake size={19} aria-hidden="true" /> {confirmed247 ? t('prayerPage.eyebrow') : localize({ en: 'Prayer support', ta: 'ஜெப உதவி' })}</p>
            <h1>{t('prayerPage.title')}</h1>
            <p>{t('prayerPage.intro')}</p>
            <span className="prayer-support-hero__availability"><Sparkles size={16} aria-hidden="true" /> {confirmed247 ? t('prayerPage.availability') : localize({ en: 'Contact the church for prayer support', ta: 'ஜெப உதவிக்காக திருச்சபையைத் தொடர்புகொள்ளுங்கள்' })}</span>
          </Reveal>

          <Reveal className="prayer-contact-card" delay={0.08}>
            <div className="prayer-contact-card__icon"><Phone size={30} aria-hidden="true" /></div>
            <small>{t('prayerPage.contactLabel')}</small>
            <div className="prayer-contact-card__contacts">{contacts.map((contact) => <a href={`tel:${contact.phone}`} key={contact.id}><small>{contact.name}</small><strong>{contact.display}</strong></a>)}</div>
            <a className="button button--gold" href={`tel:${phone}`}><Phone size={18} aria-hidden="true" /> {t('prayerPage.callNow')}</a>
            <div className="prayer-contact-card__location">
              <MapPin size={19} aria-hidden="true" />
              <p><small>{t('prayerPage.addressLabel')}</small><span>{localize(churchInfo.address)}</span></p>
            </div>
            <a className="prayer-contact-card__directions" href={churchInfo.mapsUrl} target="_blank" rel="noreferrer">{t('prayerPage.directions')} <ArrowUpRight size={16} aria-hidden="true" /></a>
          </Reveal>
        </div>
        <div className="container prayer-support-hero__notice"><ShieldAlert size={18} aria-hidden="true" /><p>{t('prayerPage.supportNote')}</p></div>
      </section>

      <section className="section section--ivory prayer-needs">
        <div className="container">
          <SectionHeading eyebrow={t('prayerPage.needs.eyebrow')} title={t('prayerPage.needs.title')} description={t('prayerPage.needs.intro')} />
          <div className="prayer-needs__grid">
            {prayerNeeds.map((item, index) => {
              const Icon = item.icon
              return (
                <Reveal className="prayer-need-card" key={item.id} delay={index * 0.05}>
                  <span><Icon size={25} aria-hidden="true" /></span>
                  <h3>{translate(item.titleKey)}</h3>
                  <p>{translate(item.bodyKey)}</p>
                </Reveal>
              )
            })}
          </div>
          <Reveal className="prayer-needs__cta">
            <div><h3>{t('prayerPage.ctaTitle')}</h3><p>{t('prayerPage.ctaBody')}</p></div>
            <a className="button button--navy" href={`tel:${phone}`}><Phone size={18} aria-hidden="true" /> {t('prayerPage.callNow')}</a>
          </Reveal>
        </div>
      </section>
    </main>
  )
}

