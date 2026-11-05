import { ArrowUpRight, MapPin, Phone, SquarePlay } from 'lucide-react'
import { churchInfo, navItems } from '../../data/churchInfo'
import { sermons } from '../../data/sermons'
import { useLanguage } from '../../context/LanguageContext'
import { LogoMark } from '../common/LogoMark'

const currentYear = new Date().getFullYear()

export function Footer() {
  const { t, localize } = useLanguage()
  return (
    <footer className="site-footer">
      <div className="footer-glow" aria-hidden="true" />
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="footer-brand__title">
            <LogoMark />
            <div><strong>WJ Cathedral</strong><span>{localize(churchInfo.locationShort)}</span></div>
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
            <a href={churchInfo.mapsUrl} target="_blank" rel="noreferrer">
              <MapPin size={17} aria-hidden="true" />
              <span>{localize(churchInfo.address)}</span>
            </a>
            <a href={`tel:${churchInfo.phone}`}>
              <Phone size={17} aria-hidden="true" />
              <span>{churchInfo.phoneDisplay}</span>
            </a>
          </address>
        </div>
        <div>
          <h3>{t('footer.follow')}</h3>
          <a className="footer-youtube" href={`https://www.youtube.com/watch?v=${sermons[0]?.videoId ?? ''}`} target="_blank" rel="noreferrer">
            <SquarePlay size={19} aria-hidden="true" />
            {t('footer.youtubeVideos')}
            <ArrowUpRight size={15} aria-hidden="true" />
          </a>
          <p className="footer-muted">{t('footer.socialPending')}</p>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>© {currentYear} WJ Cathedral. {t('footer.rights')}</p>
        <a href="#home">{t('a11y.backToTop')} <ArrowUpRight size={15} aria-hidden="true" /></a>
      </div>
    </footer>
  )
}

