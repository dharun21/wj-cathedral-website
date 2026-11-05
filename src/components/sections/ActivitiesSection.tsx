import { CircleEllipsis, HandHeart, Video } from 'lucide-react'
import { verifiedActivities } from '../../data/ministries'
import { useLanguage } from '../../context/LanguageContext'
import { Reveal } from '../common/Reveal'
import { SectionHeading } from '../common/SectionHeading'

export function ActivitiesSection() {
  const { t, localize } = useLanguage()
  return (
    <section className="section section--ivory activities-section" aria-labelledby="activities-title">
      <div className="container">
        <div id="activities-title"><SectionHeading eyebrow={t('activities.eyebrow')} title={t('activities.title')} description={t('activities.intro')} /></div>
        <div className="activities-grid">
          {verifiedActivities.map((activity, index) => {
            const Icon = activity.icon === 'hands' ? HandHeart : Video
            return (
              <Reveal className="activity-card" key={activity.id} delay={index * 0.08}>
                <span><Icon size={27} aria-hidden="true" /></span>
                <h3>{localize(activity.title)}</h3>
                <p>{localize(activity.description)}</p>
              </Reveal>
            )
          })}
          <Reveal className="activity-card activity-card--pending" delay={0.16}>
            <span><CircleEllipsis size={27} aria-hidden="true" /></span>
            <h3>{t('activities.pendingTitle')}</h3>
            <p>{t('activities.pendingBody')}</p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

