import { Suspense } from 'react'
import { AdminLogin, ForgotPassword, ResetPassword, SupabaseSetupRequired, UnauthorizedAdmin } from './components/AdminAuthScreens'
import { AdminGuidePage } from './components/AdminGuidePage'
import { AcademicCarouselPage } from './components/AcademicCarouselPage'
import { AcademicSettingsPage } from './components/AcademicSettingsPage'
import { HomeCarouselPage } from './components/HomeCarouselPage'
import { AdmissionsPage } from './components/AdmissionsPage'
import { AudioLibraryPage } from './components/AudioLibraryPage'
import { ApprovalsPage } from './components/ApprovalsPage'
import { AdminLayout } from './components/AdminLayout'
import { CollectionPage } from './components/CollectionPage'
import { DashboardPage } from './components/DashboardPage'
import { EditorSubmissionsPage } from './components/EditorSubmissionsPage'
import { MediaLibraryPage } from './components/MediaLibraryPage'
import { SettingsPage } from './components/SettingsPage'
import { TeamAccessPage } from './components/TeamAccessPage'
import { WhatsAppChannelPage } from './components/WhatsAppChannelPage'
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext'
import { NotificationProvider } from './context/NotificationContext'
import { moduleDefinitions } from './moduleDefinitions'
import './admin.css'

function AdminRouter({ hash }: { hash: string }) {
  const auth = useAdminAuth(); const route = hash.replace(/^#\/admin\/?/, '').split('/')[0]?.split('?')[0] || 'dashboard'
  if (!auth.configured) return <SupabaseSetupRequired />
  if (route === 'forgot-password') return <ForgotPassword />
  if (route === 'reset-password') return <ResetPassword />
  if (auth.loading) return <main className="admin-loading"><span>Checking secure session…</span></main>
  if (!auth.user) return <AdminLogin />
  if (!auth.authorized) return <UnauthorizedAdmin />
  const content = route === 'dashboard' ? <DashboardPage /> : route === 'media-library' ? <MediaLibraryPage /> : route === 'audio-library' ? <AudioLibraryPage /> : route === 'slides' ? <HomeCarouselPage /> : route === 'academic-carousel' ? <AcademicCarouselPage /> : route === 'academic-settings' ? (auth.isOwner ? <AcademicSettingsPage /> : <DashboardPage />) : route === 'submissions' ? (!auth.isOwner ? <EditorSubmissionsPage /> : <DashboardPage />) : route === 'approvals' ? (auth.isOwner ? <ApprovalsPage /> : <DashboardPage />) : route === 'admissions' ? (auth.isOwner ? <AdmissionsPage /> : <DashboardPage />) : route === 'team-access' ? (auth.isOwner ? <TeamAccessPage /> : <DashboardPage />) : route === 'whatsapp-channel' ? (auth.isOwner ? <WhatsAppChannelPage /> : <DashboardPage />) : route === 'settings' && auth.isOwner ? <SettingsPage /> : route === 'guide' ? <AdminGuidePage /> : moduleDefinitions[route] ? <CollectionPage key={route} definition={moduleDefinitions[route]} /> : <DashboardPage />
  return <AdminLayout route={route}><Suspense fallback={<main className="admin-loading"><span>Loading…</span></main>}>{content}</Suspense></AdminLayout>
}

export function AdminApp({ hash }: { hash: string }) {
  return <AdminAuthProvider><NotificationProvider><AdminRouter hash={hash} /></NotificationProvider></AdminAuthProvider>
}
