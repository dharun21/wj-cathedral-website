import { ArrowUpRight, CalendarClock, MapPin, Navigation, Phone, ShieldCheck } from 'lucide-react'
import { churchInfo } from '../../data/churchInfo'
import { services } from '../../data/services'
import { useLanguage } from '../../context/LanguageContext'
import { Reveal } from '../common/Reveal'
import { SectionHeading } from '../common/SectionHeading'
import { usePublishedSiteSettings, usePublishedWorship } from '../../hooks/usePublishedContent'

export function ContactSection() {
  const { t, localize } = useLanguage()
  const primaryService = usePublishedWorship(services).data[0]
  const settings = usePublishedSiteSettings().data
  const phone = settings?.phone || churchInfo.phone
  const contacts = [
    { ...churchInfo.contacts[0], phone, display: phone === churchInfo.phone ? churchInfo.contacts[0].display : phone },
    churchInfo.contacts[1],
  ]
  const address = settings ? { en: settings.address_en || churchInfo.address.en, ta: settings.address_ta || churchInfo.address.ta } : churchInfo.address
  const mapsUrl = settings?.maps_url || churchInfo.mapsUrl
  return (
    <section id="contact" className="section section--contact">
      <div className="container contact-grid">
        <Reveal className="contact-copy">
          <SectionHeading eyebrow={t('contact.eyebrow')} title={t('contact.title')} description={t('contact.intro')} />
          <div className="contact-details">
            <div><span><MapPin size={20} aria-hidden="true" /></span><p><small>{t('contact.address')}</small><strong>{localize(address)}</strong></p></div>
            <div><span><Phone size={20} aria-hidden="true" /></span><p><small>{t('contact.phone')}</small>{contacts.map((contact) => <a href={`tel:${contact.phone}`} key={contact.id}>{contact.name} · {contact.display}</a>)}</p></div>
            {primaryService && <div><span><CalendarClock size={20} aria-hidden="true" /></span><p><small>{t('contact.timings')}</small><strong>{localize(primaryService.time)} · {localize(primaryService.day)}</strong></p></div>}
          </div>
          <div className="contact-actions">
            <a className="button button--gold" href={mapsUrl} target="_blank" rel="noreferrer"><Navigation size={18} aria-hidden="true" /> {t('common.getDirections')}</a>
            <a className="button button--outline-light" href={`tel:${phone}`}><Phone size={18} aria-hidden="true" /> {t('common.callChurch')}</a>
          </div>
          <p className="contact-no-form"><ShieldCheck size={17} aria-hidden="true" /> {t('contact.noForm')}</p>
        </Reveal>

        <Reveal className="map-card" delay={0.1}>
          <div className="map-card__pattern" aria-hidden="true"><span className="map-road map-road--one" /><span className="map-road map-road--two" /><span className="map-road map-road--three" /><span className="map-pin"><MapPin size={30} fill="currentColor" /></span></div>
          <div className="map-card__content"><small>{localize(churchInfo.locationShort)}</small><h3>{t('contact.mapTitle')}</h3><p>{t('contact.mapBody')}</p><a href={mapsUrl} target="_blank" rel="noreferrer">Google Maps <ArrowUpRight size={17} aria-hidden="true" /></a></div>
        </Reveal>
      </div>
    </section>
  )
}

