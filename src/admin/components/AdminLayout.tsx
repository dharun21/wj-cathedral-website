import { BellRing, BookHeart, BookOpenCheck, CalendarDays, ChevronRight, CirclePlay, Clock3, FileClock, GalleryHorizontalEnd, GraduationCap, Headphones, Images, LayoutDashboard, LogOut, Menu, MessageCircle, PanelsTopLeft, Settings, ShieldCheck, UserCog, UserRoundCheck, X, type LucideIcon } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useLayoutEffect, useState, type ReactNode } from 'react'
import { LogoMark } from '../../components/common/LogoMark'
import { fetchNewAdmissionApplicationCount } from '../../services/admissionService'
import { useAdminAuth } from '../context/AdminAuthContext'
import { useReviewActivity } from '../hooks/useReviewActivity'

interface AdminNavigationItem { path: string; label: string; icon: LucideIcon; ownerOnly?: boolean; editorOnly?: boolean }
interface AdminNavigationSection { group: string; items: AdminNavigationItem[] }

const navigation: AdminNavigationSection[] = [
  { group: 'Overview', items: [{ path: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }, { path: 'submissions', label: 'Pending Approval', icon: FileClock, editorOnly: true }, { path: 'approvals', label: 'Attention Required', icon: ShieldCheck, ownerOnly: true }, { path: 'admissions', label: 'Admission Applications', icon: UserRoundCheck, ownerOnly: true }] },
  { group: 'Homepage', items: [{ path: 'slides', label: 'Carousel Slides', icon: PanelsTopLeft }, { path: 'verses', label: 'Daily Bible Verses', icon: BookHeart }, { path: 'announcements', label: 'Announcements', icon: BellRing }, { path: 'services', label: 'Worship Times', icon: Clock3 }] },
  { group: 'Church Content', items: [{ path: 'events', label: 'Events', icon: CalendarDays }, { path: 'videos', label: 'YouTube Videos & Live', icon: CirclePlay }, { path: 'audio-albums', label: 'Audio Albums', icon: Headphones }, { path: 'audio-library', label: 'Audio Uploads', icon: Headphones }] },
  { group: 'Academics', items: [{ path: 'academic-settings', label: 'College Details', icon: GraduationCap, ownerOnly: true }, { path: 'academic-carousel', label: 'Admission Carousel', icon: PanelsTopLeft }, { path: 'academic-courses', label: 'Courses', icon: BookOpenCheck }, { path: 'academics', label: 'Faculty Photos', icon: GraduationCap }, { path: 'academic-gallery', label: 'Graduation Photos', icon: Images }] },
  { group: 'Gallery Page', items: [{ path: 'albums', label: 'Albums', icon: GalleryHorizontalEnd }, { path: 'gallery-images', label: 'Photos', icon: Images }] },
  { group: 'Uploads', items: [{ path: 'media-library', label: 'Upload Library', icon: Images }] },
  { group: 'Administration', items: [{ path: 'team-access', label: 'Team & Access', icon: UserCog, ownerOnly: true }] },
  { group: 'Configuration', items: [{ path: 'whatsapp-channel', label: 'WhatsApp Channel', icon: MessageCircle, ownerOnly: true }, { path: 'settings', label: 'Website Settings', icon: Settings, ownerOnly: true }, { path: 'guide', label: 'Admin Guide', icon: BookOpenCheck }] },
]

export function AdminLayout({ route, children }: { route: string; children: ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { profile, logout, isOwner } = useAdminAuth()
  const reviewActivity = useReviewActivity()
  const pendingReviewCount = (reviewActivity.data ?? []).filter((item) => item.resolution === 'pending' && item.table_name !== 'page_content').length
  const newAdmissions = useQuery({
    queryKey: ['admin', 'admission-applications', 'new-count'],
    queryFn: fetchNewAdmissionApplicationCount,
    enabled: isOwner,
    staleTime: 2 * 60_000,
    refetchInterval: 5 * 60_000,
    refetchIntervalInBackground: false,
  })
  const navigate = (path: string) => { setDrawerOpen(false); window.location.hash = `#/admin/${path}` }
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
    document.querySelector<HTMLElement>('.admin-workspace')?.scrollTo(0, 0)
  }, [route])
  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar ${drawerOpen ? 'is-open' : ''}`}>
        <div className="admin-sidebar__brand"><LogoMark compact /><div><strong>WJ Cathedral CMS</strong><small>Content administration</small></div><button type="button" onClick={() => setDrawerOpen(false)} aria-label="Close navigation"><X /></button></div>
        <nav aria-label="Admin navigation">
          {navigation.map((section) => { const visibleItems = section.items.filter((item) => (isOwner ? !item.editorOnly : !item.ownerOnly)); return visibleItems.length > 0 && <div className="admin-nav-group" key={section.group}><p>{section.group}</p>{visibleItems.map((item) => { const Icon = item.icon; const active = route === item.path; const showsReviewCount = item.path === 'approvals' || item.path === 'submissions'; return <button type="button" className={active ? 'is-active' : ''} key={item.path} onClick={() => navigate(item.path)}><Icon size={18} /><span>{item.label}</span><span className="admin-nav-item__meta">{showsReviewCount && <span className="admin-nav-badge" aria-label={`${pendingReviewCount} items pending approval`}>{reviewActivity.isLoading ? '…' : pendingReviewCount}</span>}{item.path === 'admissions' && <span className="admin-nav-badge" aria-label={`${newAdmissions.data ?? 0} new admission applications`}>{newAdmissions.isLoading ? '…' : newAdmissions.data ?? 0}</span>}{active && <ChevronRight size={15} />}</span></button> })}</div> })}
        </nav>
        <div className="admin-sidebar__footer"><a href="#home" target="_blank" rel="noreferrer">Open public website</a><button type="button" onClick={() => void logout()}><LogOut size={17} /> Sign out</button></div>
      </aside>
      {drawerOpen && <button type="button" className="admin-drawer-backdrop" onClick={() => setDrawerOpen(false)} aria-label="Close navigation" />}
      <div className="admin-workspace">
        <header className="admin-topbar"><button type="button" className="admin-menu-button" onClick={() => setDrawerOpen(true)} aria-label="Open admin navigation"><Menu /></button><div className="admin-topbar__spacer" /><div className="admin-user"><span>{profile?.displayName.slice(0, 1).toUpperCase()}</span><div><strong>{profile?.displayName}</strong><small>{profile?.role}</small></div></div></header>
        <div className="admin-page">{children}</div>
      </div>
    </div>
  )
}
