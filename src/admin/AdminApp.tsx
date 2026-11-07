import { Suspense } from 'react'
import { AdminLogin, ForgotPassword, ResetPassword, SupabaseSetupRequired, UnauthorizedAdmin } from './components/AdminAuthScreens'
import { AdminGuidePage } from './components/AdminGuidePage'
import { AdmissionsPage } from './components/AdmissionsPage'
import { AdminLayout } from './components/AdminLayout'
import { CollectionPage } from './components/CollectionPage'
import { DashboardPage } from './components/DashboardPage'
import { MediaLibraryPage } from './components/MediaLibraryPage'
import { SettingsPage } from './components/SettingsPage'
import { TeamAccessPage } from './components/TeamAccessPage'
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext'
import { NotificationProvider } from './context/NotificationContext'
import { moduleDefinitions } from './moduleDefinitions'
import './admin.css'

function AdminRouter({ hash }: { hash: string }) {
  const auth = useAdminAuth(); const route = hash.replace(/^#\/admin\/?/, '').split('/')[0] || 'dashboard'
  if (!auth.configured) return <SupabaseSetupRequired />
  if (route === 'forgot-password') return <ForgotPassword />
  if (route === 'reset-password') return <ResetPassword />
  if (auth.loading) return <main className="admin-loading"><span>Checking secure session…</span></main>
  if (!auth.user) return <AdminLogin />
  if (!auth.authorized) return <UnauthorizedAdmin />
  const content = route === 'dashboard' ? <DashboardPage /> : route === 'media-library' ? <MediaLibraryPage /> : route === 'admissions' ? (auth.isOwner ? <AdmissionsPage /> : <DashboardPage />) : route === 'team-access' ? (auth.isOwner ? <TeamAccessPage /> : <DashboardPage />) : route === 'settings' && auth.isOwner ? <SettingsPage /> : route === 'guide' ? <AdminGuidePage /> : moduleDefinitions[route] ? <CollectionPage definition={moduleDefinitions[route]} /> : <DashboardPage />
  return <AdminLayout route={route}><Suspense fallback={<main className="admin-loading"><span>Loading…</span></main>}>{content}</Suspense></AdminLayout>
}

export function AdminApp({ hash }: { hash: string }) {
  return <AdminAuthProvider><NotificationProvider><AdminRouter hash={hash} /></NotificationProvider></AdminAuthProvider>
}
