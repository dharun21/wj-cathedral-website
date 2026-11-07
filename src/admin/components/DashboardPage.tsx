import { useQuery } from '@tanstack/react-query'
import { BellRing, BookHeart, CalendarDays, CirclePlay, FileClock, Images, PanelsTopLeft, Plus, ShieldCheck } from 'lucide-react'
import { fetchDashboardCounts, listAdminRecords } from '../../services/contentService'
import type { CmsTableName } from '../../types/database'

const cards = [
  ['announcements', 'Published announcements', BellRing],
  ['upcomingEvents', 'Upcoming events', CalendarDays],
  ['gallery', 'Published photos', Images],
  ['slides', 'Active slides', PanelsTopLeft],
  ['videos', 'Published videos', CirclePlay],
  ['verses', 'Active daily verses', BookHeart],
  ['drafts', 'Draft content', FileClock],
  ['pendingApprovals', 'Awaiting owner approval', ShieldCheck],
] as const

const actions = [
  ['announcements', 'Publish announcement'], ['media-library', 'Upload photos'], ['slides', 'Change homepage banner'],
  ['events', 'Add event'], ['videos', 'Add YouTube video'], ['verses', 'Add Bible verse'],
] as const

export function DashboardPage() {
  const counts = useQuery({ queryKey: ['admin', 'dashboard-counts'], queryFn: fetchDashboardCounts })
  const recent = useQuery({
    queryKey: ['admin', 'recent-content'],
    queryFn: async () => {
      const tables: CmsTableName[] = ['announcements', 'events', 'hero_slides', 'videos', 'gallery_images']
      const groups = await Promise.all(tables.map(async (table) => (await listAdminRecords<Record<string, unknown>>(table, { orderBy: 'updated_at', ascending: false, limit: 3 })).map((row) => ({ ...row, table }))))
      return (groups.flat() as Array<Record<string, unknown> & { table: CmsTableName }>).sort((a, b) => String(b.updated_at).localeCompare(String(a.updated_at))).slice(0, 6)
    },
  })
  const navigate = (route: string) => { window.location.hash = `#/admin/${route}` }
  return <section className="admin-dashboard">
    <div className="admin-page-heading"><div><p>Overview</p><h1>Dashboard</h1><span>A live summary of published and draft website content.</span></div></div>
    <div className="admin-stat-grid">{cards.map(([key, label, Icon]) => <article key={key}><span><Icon /></span><div><strong>{counts.isLoading ? '—' : counts.data?.[key] ?? 0}</strong><p>{label}</p></div></article>)}</div>
    <div className="admin-dashboard-grid">
      <section className="admin-panel"><header><div><p>Start here</p><h2>Quick actions</h2></div></header><div className="admin-quick-actions">{actions.map(([route, label]) => <button key={route} onClick={() => navigate(route)}><Plus size={18} /><span>{label}</span></button>)}</div></section>
      <section className="admin-panel"><header><div><p>Latest changes</p><h2>Recently updated</h2></div></header>{recent.isLoading ? <div className="admin-record-skeletons"><i /><i /><i /></div> : recent.data?.length ? <div className="admin-recent-list">{recent.data.map((item, index) => <button key={`${item.table}-${String(item.id)}-${index}`} onClick={() => navigate(item.table === 'hero_slides' ? 'slides' : item.table === 'gallery_images' ? 'gallery-images' : item.table)}><span>{String(item.title_en ?? item.caption_en ?? item.name_en ?? 'Content item')}</span><small>{item.table.replaceAll('_', ' ')} · {item.status === 'published' ? 'Published' : item.status === 'pending_review' ? 'Pending approval' : 'Draft'}</small></button>)}</div> : <p className="admin-panel-empty">No content changes yet.</p>}</section>
    </div>
  </section>
}
