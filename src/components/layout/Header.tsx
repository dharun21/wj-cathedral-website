import {
  ArrowUpRight,
  CalendarDays,
  ChevronDown,
  Church as ChurchIcon,
  CirclePlay,
  HeartHandshake,
  Images,
  Menu,
  Phone,
  X,
} from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'
import { churchInfo, headerNavItems } from '../../data/churchInfo'
import { youtubeChannelUrl } from '../../data/sermons'
import { useLanguage } from '../../context/LanguageContext'
import { LanguageSwitcher } from '../common/LanguageSwitcher'
import { LogoMark } from '../common/LogoMark'
import { WhatsAppIcon } from '../common/WhatsAppIcon'
import { usePublishedSiteSettings } from '../../hooks/usePublishedContent'
import { whatsappChannelDefaults } from '../../data/whatsappChannel'

const ministryIcons = {
  church: ChurchIcon,
  events: CalendarDays,
  media: CirclePlay,
  gallery: Images,
  prayer: HeartHandshake,
} as const

function YoutubeIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="5.5" width="20" height="13" rx="4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M10 9v6l5-3-5-3Z" fill="currentColor" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.4" cy="6.7" r="1" fill="currentColor" />
    </svg>
  )
}

export function Header({ currentPage = 'home' }: { currentPage?: 'home' | 'about' | 'events' | 'media' | 'gallery' | 'academics' | 'prayer-helpline' | 'community-care' | 'church' | 'give' }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [ministriesOpen, setMinistriesOpen] = useState(false)
  const [mobileMinistriesOpen, setMobileMinistriesOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { t, localize } = useLanguage()
  const reduceMotion = useReducedMotion()
  const settings = usePublishedSiteSettings().data
  const publicPhone = settings?.phone || churchInfo.phone
  const displayName = settings?.display_name || 'WJ Cathedral'
  const youtubeUrl = settings?.youtube_url || youtubeChannelUrl
  const instagramUrl = settings?.instagram_url || churchInfo.instagramUrl
  const whatsappEnabled = settings?.whatsapp_channel_enabled ?? whatsappChannelDefaults.enabled
  const whatsappUrl = settings?.whatsapp_channel_url || whatsappChannelDefaults.channelUrl
  const whatsappLabel = localize({ en: 'Follow WJ Cathedral on WhatsApp', ta: 'WhatsApp-ல் WJ Cathedral-ஐ பின்தொடருங்கள்' })
  const ministriesActive = currentPage === 'prayer-helpline' || currentPage === 'church' || currentPage === 'events' || currentPage === 'media' || currentPage === 'gallery'
  const translate = (key: string) => t(key as Parameters<typeof t>[0])
  const isMinistryChildActive = (childId: string) => (
    childId === 'prayer-helpline'
      ? currentPage === 'prayer-helpline'
      : childId === 'church'
        ? currentPage === 'church'
        : childId === 'events'
          ? currentPage === 'events'
        : childId === 'sermons'
          ? currentPage === 'media'
        : childId === 'gallery' && currentPage === 'gallery'
  )
  const isTopLevelActive = (itemId: string) => (
    itemId === 'about'
      ? currentPage === 'about'
      : itemId === 'academics'
      ? currentPage === 'academics'
      : itemId === 'community-care'
        ? currentPage === 'community-care'
      : itemId === 'give'
        ? currentPage === 'give'
        : itemId === 'home' && currentPage === 'home'
  )

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen && !ministriesOpen) return undefined
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        setMinistriesOpen(false)
        setMobileMinistriesOpen(false)
      }
    }
    if (menuOpen) document.body.classList.add('menu-open')
    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.classList.remove('menu-open')
      window.removeEventListener('keydown', handleKey)
    }
  }, [menuOpen, ministriesOpen])

  const closeMenu = () => {
    setMenuOpen(false)
    setMinistriesOpen(false)
    setMobileMinistriesOpen(false)
  }

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="header-shell">
        <a className="brand" href="#home" aria-label={`${churchInfo.shortName} home`} onClick={closeMenu}>
          <LogoMark />
          <span className="brand__text">
            <strong>{displayName}</strong>
            <small>Nannilam</small>
          </span>
        </a>

        <nav className="desktop-nav" aria-label={t('a11y.primaryNavigation')}>
          {headerNavItems.map((item) => {
            if ('children' in item) {
              const prayerItem = item.children[4]
              return (
                <div
                  key={item.id}
                  className="desktop-nav__item desktop-nav__item--dropdown"
                  onMouseEnter={() => setMinistriesOpen(true)}
                  onMouseLeave={() => setMinistriesOpen(false)}
                  onFocusCapture={() => setMinistriesOpen(true)}
                  onBlurCapture={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setMinistriesOpen(false)
                  }}
                >
                  <button
                    type="button"
                    className={`desktop-nav__trigger ${ministriesActive ? 'is-active' : ''}`}
                    onClick={() => setMinistriesOpen((current) => !current)}
                    aria-expanded={ministriesOpen}
                    aria-controls="ministries-mega-menu"
                  >
                    {translate(item.labelKey)}
                    <ChevronDown size={15} aria-hidden="true" />
                  </button>

                  <AnimatePresence>
                    {ministriesOpen && (
                      <motion.div
                        id="ministries-mega-menu"
                        className="mega-menu"
                        initial={reduceMotion ? false : { opacity: 0, y: -8, scale: 0.985 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.99 }}
                        transition={{ duration: 0.18 }}
                      >
                        <div className="mega-menu__main">
                          <p className="mega-menu__eyebrow">{t('nav.exploreMinistries')}</p>
                          <div className="mega-menu__links">
                            {item.children.slice(0, -1).map((child) => {
                              const Icon = ministryIcons[child.icon]
                              return (
                                <a
                                  key={child.id}
                                  href={child.href}
                                  className={isMinistryChildActive(child.id) ? 'is-active' : ''}
                                  onClick={closeMenu}
                                >
                                  <span className="mega-menu__icon"><Icon size={21} aria-hidden="true" /></span>
                                  <span>
                                    <strong>{translate(child.labelKey)}</strong>
                                    <small>{translate(child.descriptionKey)}</small>
                                  </span>
                                </a>
                              )
                            })}
                          </div>
                        </div>

                        <a className={`mega-menu__prayer ${currentPage === 'prayer-helpline' ? 'is-active' : ''}`} href={prayerItem.href} onClick={closeMenu}>
                          <span className="mega-menu__prayer-icon"><HeartHandshake size={25} aria-hidden="true" /></span>
                          <span>
                            <small>{t('nav.exploreMinistries')}</small>
                            <strong>{translate(prayerItem.labelKey)}</strong>
                            <b>{translate(prayerItem.descriptionKey)}</b>
                          </span>
                          <ArrowUpRight size={19} aria-hidden="true" />
                        </a>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            }

            return (
              <a
                key={item.id}
                href={item.href}
                className={`desktop-nav__link ${item.id === 'give' ? 'desktop-nav__link--give' : ''} ${isTopLevelActive(item.id) ? 'is-active' : ''}`}
                onClick={closeMenu}
              >
                {translate(item.labelKey)}
              </a>
            )
          })}
        </nav>

        <div className="header-actions">
          <div className="header-social" aria-label={t('header.socialLinks')}>
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={t('header.youtube')}
              title={t('header.youtube')}
            >
              <YoutubeIcon />
            </a>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={t('header.instagram')}
              title={t('header.instagram')}
            >
              <InstagramIcon />
            </a>
            {whatsappEnabled && <a href={whatsappUrl} target="_blank" rel="noreferrer" aria-label={whatsappLabel} title={whatsappLabel}><WhatsAppIcon size={17} /></a>}
          </div>
          <LanguageSwitcher />
          <a className="header-call" href={`tel:${publicPhone}`} aria-label={`${t('common.callChurch')} ${publicPhone}`}>
            <Phone size={17} aria-hidden="true" />
            <span>{t('common.callChurch')}</span>
          </a>
          <button
            type="button"
            className="menu-button"
            onClick={() => {
              setMenuOpen((current) => !current)
              setMinistriesOpen(false)
            }}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? t('a11y.closeMenu') : t('a11y.openMenu')}
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-navigation"
            className="mobile-menu"
            initial={reduceMotion ? false : { opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <nav className="mobile-nav" aria-label={t('a11y.mobileNavigation')}>
              {headerNavItems.map((item) => {
                if ('children' in item) {
                  return (
                    <div className="mobile-nav__group" key={item.id}>
                      <button
                        type="button"
                        className={`mobile-nav__trigger ${ministriesActive ? 'is-active' : ''}`}
                        onClick={() => setMobileMinistriesOpen((current) => !current)}
                        aria-expanded={mobileMinistriesOpen}
                        aria-controls="mobile-ministries-menu"
                      >
                        {translate(item.labelKey)}
                        <ChevronDown size={18} aria-hidden="true" />
                      </button>
                      <AnimatePresence initial={false}>
                        {mobileMinistriesOpen && (
                          <motion.div
                            id="mobile-ministries-menu"
                            className="mobile-nav__submenu"
                            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            {item.children.map((child) => {
                              const Icon = ministryIcons[child.icon]
                              return (
                                <a key={child.id} href={child.href} onClick={closeMenu} className={isMinistryChildActive(child.id) ? 'is-active' : ''}>
                                  <Icon size={19} aria-hidden="true" />
                                  <span><strong>{translate(child.labelKey)}</strong><small>{translate(child.descriptionKey)}</small></span>
                                </a>
                              )
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                }

                return (
                  <a key={item.id} href={item.href} onClick={closeMenu} className={`mobile-nav__link ${item.id === 'give' ? 'mobile-nav__link--give' : ''} ${isTopLevelActive(item.id) ? 'is-active' : ''}`}>
                    {translate(item.labelKey)}
                  </a>
                )
              })}
            </nav>
            <div className="mobile-menu__footer">
              <LanguageSwitcher mobile />
              <a href={`tel:${publicPhone}`} onClick={closeMenu}>
                <Phone size={19} aria-hidden="true" />
                {publicPhone}
              </a>
            </div>
            <div className="mobile-menu__socials" aria-label={t('header.socialLinks')}>
              <a href={youtubeUrl} target="_blank" rel="noreferrer" aria-label={t('header.youtube')} title={t('header.youtube')} onClick={closeMenu}><YoutubeIcon /></a>
              <a href={instagramUrl} target="_blank" rel="noreferrer" aria-label={t('header.instagram')} title={t('header.instagram')} onClick={closeMenu}><InstagramIcon /></a>
              {whatsappEnabled && <a href={whatsappUrl} target="_blank" rel="noreferrer" aria-label={whatsappLabel} title={whatsappLabel} onClick={closeMenu}><WhatsAppIcon size={18} /></a>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
