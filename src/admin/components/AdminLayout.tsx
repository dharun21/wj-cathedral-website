import { BellRing, BookHeart, BookOpenCheck, CalendarDays, ChevronRight, Church, CirclePlay, Clock3, FileClock, FileText, GalleryHorizontalEnd, Headphones, Images, LayoutDashboard, LogOut, Menu, PanelsTopLeft, Settings, ShieldCheck, UserCog, UserRoundCheck, X, type LucideIcon } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { LogoMark } from '../../components/common/LogoMark'
import { useAdminAuth } from '../context/AdminAuthContext'

interface AdminNavigationItem { path: string; label: string; icon: LucideIcon; ownerOnly?: boolean; editorOnly?: boolean }
interface AdminNavigationSection { group: string; items: AdminNavigationItem[] }

const navigation: AdminNavigationSection[] = [
  { group: 'Overview', items: [{ path: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }] },
  { group: 'Homepage', items: [{ path: 'slides', label: 'Carousel Slides', icon: PanelsTopLeft }, { path: 'verses', label: 'Daily Bible Verses', icon: BookHeart }, { path: 'announcements', label: 'Announcements', icon: BellRing }, { path: 'services', label: 'Worship Times', icon: Clock3 }] },
  { group: 'Church Content', items: [{ path: 'events', label: 'Events', icon: CalendarDays }, { path: 'videos', label: 'YouTube Videos & Live', icon: CirclePlay }, { path: 'audio-albums', label: 'Audio Albums', icon: Headphones }, { path: 'audio-library', label: 'Audio Uploads', icon: Headphones }, { path: 'ministries', label: 'Ministries', icon: Church }, { path: 'page-content', label: 'Page Copy', icon: FileText }] },
  { group: 'Photos', items: [{ path: 'media-library', label: 'Media Library', icon: Images }, { path: 'albums', label: 'Gallery Albums', icon: GalleryHorizontalEnd }, { path: 'gallery-images', label: 'Gallery Photos', icon: Images }] },
  { group: 'Workflow', items: [{ path: 'submissions', label: 'Pending Approval', icon: FileClock, editorOnly: true }, { path: 'approvals', label: 'Attention Required', icon: ShieldCheck, ownerOnly: true }] },
  { group: 'Administration', items: [{ path: 'admissions', label: 'Admission Applications', icon: UserRoundCheck, ownerOnly: true }, { path: 'team-access', label: 'Team & Access', icon: UserCog, ownerOnly: true }] },
  { group: 'Configuration', items: [{ path: 'settings', label: 'Website Settings', icon: Settings, ownerOnly: true }, { path: 'guide', label: 'Admin Guide', icon: BookOpenCheck }] },
]

export function AdminLayout({ route, children }: { route: string; children: ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { profile, logout, isOwner } = useAdminAuth()
  const navigate = (path: string) => { setDrawerOpen(false); window.location.hash = `#/admin/${path}` }
  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar ${drawerOpen ? 'is-open' : ''}`}>
        <div className="admin-sidebar__brand"><LogoMark compact /><div><strong>Cathedral CMS</strong><small>Content administration</small></div><button type="button" onClick={() => setDrawerOpen(false)} aria-label="Close navigation"><X /></button></div>
        <nav aria-label="Admin navigation">
          {navigation.map((section) => { const visibleItems = section.items.filter((item) => (isOwner ? !item.editorOnly : !item.ownerOnly)); return visibleItems.length > 0 && <div className="admin-nav-group" key={section.group}><p>{section.group}</p>{visibleItems.map((item) => { const Icon = item.icon; const active = route === item.path; return <button type="button" className={active ? 'is-active' : ''} key={item.path} onClick={() => navigate(item.path)}><Icon size={18} /><span>{item.label}</span>{active && <ChevronRight size={15} />}</button> })}</div> })}
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
