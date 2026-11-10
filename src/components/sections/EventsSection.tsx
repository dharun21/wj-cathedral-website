import { ArrowRight, BellRing, Phone } from 'lucide-react'
import { churchInfo } from '../../data/churchInfo'
import { eventsState } from '../../data/events'
import { useLanguage } from '../../context/LanguageContext'
import { Reveal } from '../common/Reveal'
import { SectionHeading } from '../common/SectionHeading'
import { usePublishedAnnouncements } from '../../hooks/usePublishedContent'
import { isSupabaseConfigured } from '../../lib/env'

export function EventsSection() {
  const { t, localize, language } = useLanguage()
  const announcements = usePublishedAnnouncements()
  const featured = announcements.data?.[0]
  const title = featured ? (language === 'ta' ? featured.title_ta : featured.title_en) : localize(eventsState.title)
  const message = featured ? (language === 'ta' ? featured.description_ta : featured.description_en) : localize(eventsState.message)
  return (
    <section id="events" className="section section--sand">
      <div className="container">
        <SectionHeading eyebrow={t('events.eyebrow')} title={t('events.title')} />
        <Reveal className="announcement-card">
          <div className="announcement-card__icon"><BellRing size={30} aria-hidden="true" /></div>
          <div className="announcement-card__copy">
            <h3>{title}</h3>
            <p>{message}</p>
          </div>
          <a className="button button--navy" href={`tel:${churchInfo.phone}`}>
            <Phone size={17} aria-hidden="true" /> {t('events.contactCta')} <ArrowRight size={17} aria-hidden="true" />
          </a>
        </Reveal>
        {isSupabaseConfigured && !announcements.isLoading && !featured && <p className="section-empty-note">{language === 'ta' ? 'புதிய அங்கீகரிக்கப்பட்ட அறிவிப்புகள் வெளியிடப்பட்டதும் இங்கே தோன்றும்.' : 'New approved announcements will appear here after publication.'}</p>}
      </div>
    </section>
  )
}

