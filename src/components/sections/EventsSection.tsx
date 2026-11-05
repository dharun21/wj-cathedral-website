import { ArrowRight, BellRing, CalendarCheck2, Phone } from 'lucide-react'
import { churchInfo } from '../../data/churchInfo'
import { eventsState } from '../../data/events'
import { useLanguage } from '../../context/LanguageContext'
import { Reveal } from '../common/Reveal'
import { SectionHeading } from '../common/SectionHeading'

export function EventsSection() {
  const { t, localize } = useLanguage()
  return (
    <section id="events" className="section section--sand">
      <div className="container">
        <SectionHeading eyebrow={t('events.eyebrow')} title={t('events.title')} />
        <Reveal className="announcement-card">
          <div className="announcement-card__icon"><BellRing size={30} aria-hidden="true" /></div>
          <div className="announcement-card__copy">
            <span className="announcement-card__label"><CalendarCheck2 size={16} aria-hidden="true" /> {t('events.verifiedOnly')}</span>
            <h3>{localize(eventsState.title)}</h3>
            <p>{localize(eventsState.message)}</p>
          </div>
          <a className="button button--navy" href={`tel:${churchInfo.phone}`}>
            <Phone size={17} aria-hidden="true" /> {t('events.contactCta')} <ArrowRight size={17} aria-hidden="true" />
          </a>
        </Reveal>
      </div>
    </section>
  )
}

