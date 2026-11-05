import { ArrowUpRight, CalendarDays, MapPin, MoonStar, ShieldAlert, SunMedium } from 'lucide-react'
import { churchInfo } from '../../data/churchInfo'
import { services } from '../../data/services'
import { useLanguage } from '../../context/LanguageContext'
import { Reveal } from '../common/Reveal'
import { SectionHeading } from '../common/SectionHeading'

export function WorshipSection() {
  const { t, localize } = useLanguage()
  return (
    <section id="worship" className="section section--navy">
      <div className="container">
        <SectionHeading eyebrow={t('worship.eyebrow')} title={t('worship.title')} description={t('worship.intro')} />
        <div className="service-grid">
          {services.map((service, index) => {
            const Icon = service.icon === 'sun' ? SunMedium : MoonStar
            return (
              <Reveal className="service-card" key={service.id} delay={index * 0.08}>
                <div className="service-card__top">
                  <span className="service-card__icon"><Icon size={28} aria-hidden="true" /></span>
                  <span className="service-card__status"><ShieldAlert size={14} aria-hidden="true" /> {t('common.confirmationRequired')}</span>
                </div>
                <h3>{localize(service.name)}</h3>
                <div className="service-card__schedule">
                  <p><CalendarDays size={18} aria-hidden="true" /><span>{localize(service.day)}</span></p>
                  <strong>{localize(service.time)}</strong>
                </div>
                <p className="service-card__description">{localize(service.description)}</p>
              </Reveal>
            )
          })}
          <Reveal className="service-directions" delay={0.16}>
            <MapPin size={32} aria-hidden="true" />
            <div><small>{t('about.locationLabel')}</small><h3>{localize(churchInfo.locationShort)}</h3><p>{localize(churchInfo.address)}</p></div>
            <a href={churchInfo.mapsUrl} target="_blank" rel="noreferrer" aria-label={t('common.getDirections')}><ArrowUpRight aria-hidden="true" /></a>
          </Reveal>
        </div>
        <div className="verification-banner"><ShieldAlert size={20} aria-hidden="true" /><p>{t('worship.note')}</p></div>
      </div>
    </section>
  )
}

