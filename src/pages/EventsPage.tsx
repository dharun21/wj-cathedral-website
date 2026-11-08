import { BookOpenText, CalendarDays, Church, Clock3, HeartHandshake, Link2, MapPin, MoonStar, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { recurringGatherings } from '../data/recurringGatherings'
import { usePublishedEvents, usePublishedWorship } from '../hooks/usePublishedContent'

const gatheringIcons = [Church, Sparkles, BookOpenText, MoonStar, HeartHandshake, Link2] as const

export function EventsPage() {
  const { language, localize } = useLanguage()
  const eventsQuery = usePublishedEvents()
  const gatheringsQuery = usePublishedWorship(recurringGatherings)
  const [now] = useState(() => Date.now())
  const events = eventsQuery.data ?? []
  const currentAndUpcoming = events.filter((event) => {
    const startsAt = new Date(event.starts_at).getTime()
    const endsAt = event.ends_at ? new Date(event.ends_at).getTime() : startsAt
    return startsAt >= now || endsAt >= now
  })
  const past = events.filter((event) => {
    const startsAt = new Date(event.starts_at).getTime()
    const endsAt = event.ends_at ? new Date(event.ends_at).getTime() : startsAt
    return endsAt < now
  }).reverse()

  const format = (value: string) => new Intl.DateTimeFormat(language === 'ta' ? 'ta-IN' : 'en-IN', {
    dateStyle: 'long', timeStyle: 'short', timeZone: 'Asia/Kolkata',
  }).format(new Date(value))

  const eventCard = (event: typeof events[number]) => {
    const startsAt = new Date(event.starts_at).getTime()
    const endsAt = event.ends_at ? new Date(event.ends_at).getTime() : startsAt
    const isHappeningNow = startsAt <= now && endsAt >= now

    return <article className="event-page-card" key={event.id}>
      <span>{isHappeningNow ? localize({ en: 'Happening now', ta: 'இப்போது நடைபெறுகிறது' }) : event.category}</span>
      <h2>{language === 'ta' ? event.title_ta : event.title_en}</h2>
      <p>{language === 'ta' ? event.description_ta : event.description_en}</p>
      <dl>
        <div><CalendarDays /><dt>{format(event.starts_at)}</dt></div>
        <div><MapPin /><dt>{language === 'ta' ? event.venue_ta : event.venue_en}</dt></div>
        {event.ends_at && <div><Clock3 /><dt>{format(event.ends_at)}</dt></div>}
      </dl>
    </article>
  }

  return (
    <main id="main-content" tabIndex={-1} className="inner-page events-page">
      <section className="inner-hero">
        <div className="container">
          <p>{localize({ en: 'Worship · prayer · fellowship', ta: 'ஆராதனை · ஜெபம் · ஐக்கியம்' })}</p>
          <h1>{localize({ en: 'Church Gatherings & Events', ta: 'திருச்சபைக் கூடுகைகளும் நிகழ்வுகளும்' })}</h1>
          <span>{localize({
            en: 'Discover regular opportunities to worship, learn and pray together, along with confirmed upcoming church events.',
            ta: 'ஒன்றாக ஆராதிக்கவும், கற்கவும், ஜெபிக்கவும் நடைபெறும் வழக்கமான கூடுகைகளையும் உறுதிப்படுத்தப்பட்ட வரவிருக்கும் திருச்சபை நிகழ்வுகளையும் அறிந்துகொள்ளுங்கள்.',
          })}</span>
        </div>
      </section>

      <section className="section recurring-gatherings">
        <div className="container">
          <div className="page-section-heading page-section-heading--split">
            <div>
              <p className="eyebrow">{localize({ en: 'Life of the church', ta: 'திருச்சபை வாழ்க்கை' })}</p>
              <h2>{localize({ en: 'Cathedral Worship & Prayer Schedule', ta: 'பேராலய ஆராதனை மற்றும் ஜெப அட்டவணை' })}</h2>
            </div>
            <p>{localize({
              en: 'Please confirm the latest day and time with the church before planning your visit.',
              ta: 'உங்கள் வருகையைத் திட்டமிடுவதற்கு முன் தற்போதைய நாள் மற்றும் நேரத்தை திருச்சபையுடன் உறுதிப்படுத்துங்கள்.',
            })}</p>
          </div>

          {gatheringsQuery.isLoading ? <div className="public-loading">{localize({ en: 'Loading gatherings…', ta: 'கூடுகைகள் ஏற்றப்படுகின்றன…' })}</div> : (
            <div className="gathering-grid">
              {gatheringsQuery.data.map((gathering, index) => {
                const Icon = gatheringIcons[index % gatheringIcons.length] ?? Church
                return (
                  <article className="gathering-card" key={gathering.id}>
                    <div className="gathering-card__top"><span>0{index + 1}</span><i><Icon aria-hidden="true" /></i></div>
                    <h2>{localize(gathering.name)}</h2>
                    <p>{localize(gathering.description)}</p>
                    <div className="gathering-card__schedule">
                      <CalendarDays aria-hidden="true" />
                      <span><small>{localize(gathering.day)}</small><strong>{localize(gathering.time)}</strong></span>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <section className="section section--sand">
        <div className="container">
          <div className="page-section-heading"><p className="eyebrow">{localize({ en: 'Calendar', ta: 'நிகழ்ச்சி நிரல்' })}</p><h2>{localize({ en: 'Current & Upcoming Events', ta: 'தற்போதைய மற்றும் வரவிருக்கும் நிகழ்வுகள்' })}</h2></div>
          {eventsQuery.isLoading ? <div className="public-loading">{localize({ en: 'Loading events…', ta: 'நிகழ்வுகள் ஏற்றப்படுகின்றன…' })}</div> : currentAndUpcoming.length ? <div className="event-page-grid">{currentAndUpcoming.map(eventCard)}</div> : <div className="public-empty"><CalendarDays /><h2>{localize({ en: 'No current or upcoming dated events yet', ta: 'தற்போதைய அல்லது வரவிருக்கும் தேதியிட்ட நிகழ்வுகள் இன்னும் இல்லை' })}</h2><p>{localize({ en: 'New approved events will appear here after publication.', ta: 'புதிய அங்கீகரிக்கப்பட்ட நிகழ்வுகள் வெளியிடப்பட்டதும் இங்கே தோன்றும்.' })}</p></div>}
          {past.length > 0 && <><div className="page-section-heading page-section-heading--spaced"><h2>{localize({ en: 'Past Events', ta: 'கடந்த நிகழ்வுகள்' })}</h2></div><div className="event-page-grid">{past.map(eventCard)}</div></>}
        </div>
      </section>
    </main>
  )
}
