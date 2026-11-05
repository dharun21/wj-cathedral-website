import { Menu, Phone, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { churchInfo, navItems } from '../../data/churchInfo'
import { useLanguage } from '../../context/LanguageContext'
import { useActiveSection } from '../../hooks/useActiveSection'
import { LanguageSwitcher } from '../common/LanguageSwitcher'
import { LogoMark } from '../common/LogoMark'

const sectionIds = navItems.map((item) => item.id)

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { t } = useLanguage()
  const activeSection = useActiveSection(sectionIds)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) return undefined
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    document.body.classList.add('menu-open')
    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.classList.remove('menu-open')
      window.removeEventListener('keydown', handleKey)
    }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="header-shell">
        <a className="brand" href="#home" aria-label={`${churchInfo.shortName} home`} onClick={closeMenu}>
          <LogoMark />
          <span className="brand__text">
            <strong>WJ Cathedral</strong>
            <small>Nannilam</small>
          </span>
        </a>

        <nav className="desktop-nav" aria-label={t('a11y.primaryNavigation')}>
          {navItems.map((item) => (
            <a key={item.id} href={item.href} className={activeSection === item.id ? 'is-active' : ''}>
              {t(item.labelKey as Parameters<typeof t>[0])}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <LanguageSwitcher />
          <a className="header-call" href={`tel:${churchInfo.phone}`} aria-label={`${t('common.callChurch')} ${churchInfo.phoneDisplay}`}>
            <Phone size={17} aria-hidden="true" />
            <span>{t('common.callChurch')}</span>
          </a>
          <button
            type="button"
            className="menu-button"
            onClick={() => setMenuOpen((current) => !current)}
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
            <nav aria-label={t('a11y.mobileNavigation')}>
              {navItems.map((item) => (
                <a key={item.id} href={item.href} onClick={closeMenu} className={activeSection === item.id ? 'is-active' : ''}>
                  {t(item.labelKey as Parameters<typeof t>[0])}
                </a>
              ))}
            </nav>
            <div className="mobile-menu__footer">
              <LanguageSwitcher mobile />
              <a href={`tel:${churchInfo.phone}`} onClick={closeMenu}>
                <Phone size={19} aria-hidden="true" />
                {churchInfo.phoneDisplay}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

