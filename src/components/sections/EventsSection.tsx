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
  const activeAnnouncements = announcements.data ?? []
  const cards = activeAnnouncements.length
    ? activeAnnouncements.map((item) => ({ id: item.id, title: language === 'ta' ? item.title_ta : item.title_en, message: language === 'ta' ? item.description_ta : item.description_en }))
    : !isSupabaseConfigured ? [{ id: 'fallback', title: localize(eventsState.title), message: localize(eventsState.message) }] : []
  return (
    <section id="events" className="section section--sand">
      <div className="container">
        <SectionHeading eyebrow={t('events.eyebrow')} title={t('events.title')} />
        {cards.length > 0 && <div className="announcement-grid">{cards.map((card, index) => <Reveal className="announcement-card" key={card.id} delay={(index % 4) * .04}>
          <div className="announcement-card__icon"><BellRing size={23} aria-hidden="true" /></div>
          <div className="announcement-card__copy"><h3>{card.title}</h3><p>{card.message}</p></div>
          <a className="button button--navy" href={`tel:${churchInfo.phone}`}><Phone size={16} aria-hidden="true" /> {t('events.contactCta')} <ArrowRight size={16} aria-hidden="true" /></a>
        </Reveal>)}</div>}
        {isSupabaseConfigured && !announcements.isLoading && !cards.length && <p className="section-empty-note">{language === 'ta' ? 'புதிய அங்கீகரிக்கப்பட்ட அறிவிப்புகள் வெளியிடப்பட்டதும் இங்கே தோன்றும்.' : 'New approved announcements will appear here after publication.'}</p>}
      </div>
    </section>
  )
}

