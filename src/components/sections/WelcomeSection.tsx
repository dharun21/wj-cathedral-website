import { ArrowUpRight, HeartHandshake, MapPin, Phone } from 'lucide-react'
import { churchInfo } from '../../data/churchInfo'
import { useLanguage } from '../../context/LanguageContext'
import { Reveal } from '../common/Reveal'
import { SectionHeading } from '../common/SectionHeading'

export function WelcomeSection() {
  const { t, localize } = useLanguage()
  return (
    <section id="about" className="section section--ivory">
      <div className="container welcome-grid">
        <Reveal className="welcome-copy">
          <SectionHeading eyebrow={t('about.eyebrow')} title={t('about.title')} />
          <p>{t('about.body1')}</p>
          <p>{t('about.body2')}</p>
          <div className="welcome-copy__actions">
            <a className="text-link" href={churchInfo.mapsUrl} target="_blank" rel="noreferrer">
              {t('common.getDirections')} <ArrowUpRight size={17} aria-hidden="true" />
            </a>
            <a className="text-link text-link--muted" href={`tel:${churchInfo.phone}`}>
              {t('common.callChurch')} <Phone size={16} aria-hidden="true" />
            </a>
          </div>
        </Reveal>

        <Reveal className="welcome-panel" delay={0.1}>
          <div className="welcome-panel__glow" aria-hidden="true" />
          <div className="welcome-panel__location">
            <span className="icon-disc"><MapPin size={22} aria-hidden="true" /></span>
            <div><small>{t('about.locationLabel')}</small><strong>{localize(churchInfo.locationShort)}</strong></div>
          </div>
          <div className="welcome-panel__illustration" aria-hidden="true">
            <span className="window window--one" /><span className="window window--two" /><span className="window window--three" />
            <span className="cross-line cross-line--vertical" /><span className="cross-line cross-line--horizontal" />
          </div>
          <div className="welcome-panel__visit">
            <HeartHandshake size={24} aria-hidden="true" />
            <div><h3>{t('about.firstVisit')}</h3><p>{t('about.firstVisitBody')}</p></div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

