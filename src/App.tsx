import { lazy, Suspense, useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { BackToTop } from './components/common/BackToTop'
import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
import { useLanguage } from './context/LanguageContext'
import { subscribeToPublishedContentChanges } from './lib/contentCache'
import { HomePage } from './pages/HomePage'
import { recordPublicVisit } from './services/analyticsService'

const AcademicsPage = lazy(() => import('./pages/AcademicsPage').then((module) => ({ default: module.AcademicsPage })))
const ChurchPage = lazy(() => import('./pages/ChurchPage').then((module) => ({ default: module.ChurchPage })))
const CommunityCarePage = lazy(() => import('./pages/CommunityCarePage').then((module) => ({ default: module.CommunityCarePage })))
const PrayerHelplinePage = lazy(() => import('./pages/PrayerHelplinePage').then((module) => ({ default: module.PrayerHelplinePage })))
const AboutUsPage = lazy(() => import('./pages/AboutUsPage').then((module) => ({ default: module.AboutUsPage })))
const EventsPage = lazy(() => import('./pages/EventsPage').then((module) => ({ default: module.EventsPage })))
const MediaPage = lazy(() => import('./pages/MediaPage').then((module) => ({ default: module.MediaPage })))
const GalleryPage = lazy(() => import('./pages/GalleryPage').then((module) => ({ default: module.GalleryPage })))
const GivePage = lazy(() => import('./pages/GivePage').then((module) => ({ default: module.GivePage })))
const AdminApp = lazy(() => import('./admin/AdminApp').then((module) => ({ default: module.AdminApp })))

function App() {
  const { t } = useLanguage()
  const queryClient = useQueryClient()
  const [hash, setHash] = useState(() => window.location.hash || '#home')
  const isAdmin = hash.startsWith('#/admin')
  const currentPage = hash.startsWith('#academics')
    ? 'academics'
    : hash.startsWith('#church')
      ? 'church'
    : hash.startsWith('#community-care') || hash.startsWith('#care-')
      ? 'community-care'
    : hash.startsWith('#prayer-helpline')
      ? 'prayer-helpline'
    : hash.startsWith('#about')
      ? 'about'
    : hash.startsWith('#events')
      ? 'events'
    : hash.startsWith('#media') || hash.startsWith('#sermons')
      ? 'media'
    : hash.startsWith('#gallery')
      ? 'gallery'
    : hash.startsWith('#give')
      ? 'give'
      : 'home'

  useEffect(() => {
    const handleHashChange = () => setHash(window.location.hash || '#home')
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  useEffect(() => subscribeToPublishedContentChanges(queryClient), [queryClient])

  useEffect(() => {
    if (!isAdmin) void recordPublicVisit()
  }, [isAdmin])

  useEffect(() => {
    if (isAdmin) return undefined
    const frame = window.requestAnimationFrame(() => {
      const target = document.querySelector(hash)
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      else window.scrollTo({ top: 0, behavior: 'smooth' })
    })
    return () => window.cancelAnimationFrame(frame)
  }, [currentPage, hash, isAdmin])

  if (isAdmin) return <Suspense fallback={<main className="route-loading"><span>Loading administration…</span></main>}><AdminApp hash={hash} /></Suspense>

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
          : currentPage === 'about'
            ? <AboutUsPage />
          : currentPage === 'events'
            ? <EventsPage />
          : currentPage === 'media'
            ? <MediaPage />
          : currentPage === 'gallery'
            ? <GalleryPage />
          : currentPage === 'give'
            ? <GivePage />
            : <HomePage />}
      </Suspense>
      <Footer />
      <BackToTop />
    </>
  )
}

export default App

