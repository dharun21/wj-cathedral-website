import { ExternalLink, Play, SquarePlay } from 'lucide-react'
import { useState } from 'react'
import { sermons, youtubeChannelUrl } from '../../data/sermons'
import { useLanguage } from '../../context/LanguageContext'
import { Reveal } from '../common/Reveal'
import { SectionHeading } from '../common/SectionHeading'
import { usePublishedVideos } from '../../hooks/usePublishedContent'

function VideoCard({ videoId, title, description }: { videoId: string; title: string; description: string }) {
  const [loaded, setLoaded] = useState(false)
  const { t } = useLanguage()
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`
  return (
    <article className="video-card">
      <div className="video-card__media">
        {loaded ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <button type="button" onClick={() => setLoaded(true)} aria-label={`${t('sermons.play')}: ${title}`}>
            <img src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`} alt="" loading="lazy" />
            <span className="video-card__shade" />
            <span className="video-card__play"><Play fill="currentColor" aria-hidden="true" /><b>{t('sermons.play')}</b></span>
            <span className="video-card__youtube"><SquarePlay size={18} aria-hidden="true" /> YouTube</span>
          </button>
        )}
      </div>
      <div className="video-card__body">
        <div><h3>{title}</h3><p>{description}</p></div>
        <a href={watchUrl} target="_blank" rel="noreferrer">{t('sermons.youtube')} <ExternalLink size={16} aria-hidden="true" /></a>
      </div>
    </article>
  )
}

export function SermonsSection() {
  const { t, localize } = useLanguage()
  const published = usePublishedVideos(sermons)
  return (
    <section id="sermons" className="section section--ivory sermons-section">
      <div className="container">
        <SectionHeading eyebrow={t('sermons.eyebrow')} title={t('sermons.title')} description={t('sermons.intro')} />
        <div className="video-grid">
          {published.data.map((sermon, index) => (
            <Reveal key={sermon.id} delay={index * 0.08}>
              <VideoCard videoId={sermon.videoId} title={localize(sermon.title)} description={localize(sermon.description)} />
            </Reveal>
          ))}
        </div>
        <div className="channel-note channel-note--verified">
          <SquarePlay size={20} aria-hidden="true" />
          <p>{t('sermons.channelPending')}</p>
          <a href={youtubeChannelUrl} target="_blank" rel="noreferrer">
            {t('sermons.channelCta')} <ExternalLink size={15} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}

