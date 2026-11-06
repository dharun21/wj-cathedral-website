import { lazy, Suspense, useEffect, useState } from 'react'
import { BackToTop } from './components/common/BackToTop'
import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
import { useLanguage } from './context/LanguageContext'
import { HomePage } from './pages/HomePage'

const AcademicsPage = lazy(() => import('./pages/AcademicsPage').then((module) => ({ default: module.AcademicsPage })))
const ChurchPage = lazy(() => import('./pages/ChurchPage').then((module) => ({ default: module.ChurchPage })))
const CommunityCarePage = lazy(() => import('./pages/CommunityCarePage').then((module) => ({ default: module.CommunityCarePage })))
const PrayerHelplinePage = lazy(() => import('./pages/PrayerHelplinePage').then((module) => ({ default: module.PrayerHelplinePage })))

function App() {
  const { t } = useLanguage()
  const [hash, setHash] = useState(() => window.location.hash || '#home')
  const currentPage = hash.startsWith('#academics')
    ? 'academics'
    : hash.startsWith('#church')
      ? 'church'
    : hash.startsWith('#community-care') || hash.startsWith('#care-')
      ? 'community-care'
    : hash.startsWith('#prayer-helpline')
      ? 'prayer-helpline'
      : 'home'

  useEffect(() => {
    const handleHashChange = () => setHash(window.location.hash || '#home')
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const target = document.querySelector(hash)
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      else window.scrollTo({ top: 0, behavior: 'smooth' })
    })
    return () => window.cancelAnimationFrame(frame)
  }, [currentPage, hash])

  return (
    <>
      <a
        className="skip-link"
        href="#main-content"
        onClick={(event) => {
          event.preventDefault()
          const main = document.getElementById('main-content')
          main?.focus()
          main?.scrollIntoView({ block: 'start' })
        }}
      >{t('a11y.skip')}</a>
      <Header currentPage={currentPage} />
      <Suspense fallback={<main id="main-content" className="route-loading" tabIndex={-1}><span>{t('common.loading')}</span></main>}>
        {currentPage === 'academics'
          ? <AcademicsPage />
          : currentPage === 'church'
            ? <ChurchPage />
          : currentPage === 'community-care'
            ? <CommunityCarePage />
          : currentPage === 'prayer-helpline'
            ? <PrayerHelplinePage />
            : <HomePage />}
      </Suspense>
      <Footer />
      <BackToTop />
    </>
  )
}

export default App

