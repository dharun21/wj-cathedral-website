import { ArrowUpRight, MapPin, Phone, SquarePlay } from 'lucide-react'
import { churchInfo, navItems } from '../../data/churchInfo'
import { sermons, youtubeChannelUrl } from '../../data/sermons'
import { useLanguage } from '../../context/LanguageContext'
import { LogoMark } from '../common/LogoMark'
import { usePublishedSiteSettings } from '../../hooks/usePublishedContent'

const currentYear = new Date().getFullYear()

export function Footer() {
  const { t, localize } = useLanguage()
  const settings = usePublishedSiteSettings().data
  const name = settings?.display_name || 'WJ Cathedral'
  const phone = settings?.phone || churchInfo.phone
  const address = settings ? { en: settings.address_en || churchInfo.address.en, ta: settings.address_ta || churchInfo.address.ta } : churchInfo.address
  const mapsUrl = settings?.maps_url || churchInfo.mapsUrl
  return (
    <footer className="site-footer">
      <div className="footer-glow" aria-hidden="true" />
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="footer-brand__title">
            <LogoMark />
            <div><strong>{name}</strong><span>{localize(churchInfo.locationShort)}</span></div>
          </div>
          <p>{t('about.body1')}</p>
          <p className="footer-review-note">{t('footer.localReview')}</p>
        </div>
        <div>
          <h3>{t('footer.quickLinks')}</h3>
          <ul>
            {navItems.slice(0, 6).map((item) => (
              <li key={item.id}><a href={item.href}>{t(item.labelKey as Parameters<typeof t>[0])}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h3>{t('footer.visit')}</h3>
          <address>
            <a href={mapsUrl} target="_blank" rel="noreferrer">
              <MapPin size={17} aria-hidden="true" />
              <span>{localize(address)}</span>
            </a>
            <a href={`tel:${phone}`}>
              <Phone size={17} aria-hidden="true" />
              <span>{phone}</span>
            </a>
          </address>
        </div>
        <div>
          <h3>{t('footer.follow')}</h3>
          <a className="footer-youtube" href={settings?.youtube_url || youtubeChannelUrl || `https://www.youtube.com/watch?v=${sermons[0]?.videoId ?? ''}`} target="_blank" rel="noreferrer">
            <SquarePlay size={19} aria-hidden="true" />
            {t('footer.youtubeVideos')}
            <ArrowUpRight size={15} aria-hidden="true" />
          </a>
          <p className="footer-muted">{t('footer.socialPending')}</p>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>© {currentYear} {name}. {t('footer.rights')}</p>
        <a href="#home">{t('a11y.backToTop')} <ArrowUpRight size={15} aria-hidden="true" /></a>
      </div>
    </footer>
  )
}

