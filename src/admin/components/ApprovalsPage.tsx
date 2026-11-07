import { useQuery } from '@tanstack/react-query'
import { ArrowRight, CheckCircle2, Clock3, RotateCcw, ShieldCheck, XCircle } from 'lucide-react'
import { listPendingApprovalRecords, listPendingMediaApprovalRecords } from '../../services/contentService'
import type { CmsTableName, ContentReviewRequestRow } from '../../types/database'
import { useReviewActivity } from '../hooks/useReviewActivity'

const approvalModules = [
  { table: 'hero_slides', route: 'slides', label: 'Carousel Slides' },
  { table: 'daily_bible_verses', route: 'verses', label: 'Daily Bible Verses' },
  { table: 'announcements', route: 'announcements', label: 'Announcements' },
  { table: 'worship_services', route: 'services', label: 'Worship Times' },
  { table: 'events', route: 'events', label: 'Events' },
  { table: 'videos', route: 'videos', label: 'YouTube & Media' },
  { table: 'ministries', route: 'ministries', label: 'Ministries' },
  { table: 'page_content', route: 'page-content', label: 'Page Copy' },
  { table: 'gallery_albums', route: 'albums', label: 'Gallery Albums' },
  { table: 'gallery_images', route: 'gallery-images', label: 'Gallery Photos' },
] as const satisfies ReadonlyArray<{ table: CmsTableName; route: string; label: string }>

interface ApprovalItem extends Record<string, unknown> {
  id: string
  table: CmsTableName
  route: string
  moduleLabel: string
}

function itemTitle(item: ApprovalItem) {
  return String(item.title_en ?? item.name_en ?? item.caption_en ?? item.content_en ?? item.verse_en ?? item.original_name ?? 'Untitled submission')
}

function formatSubmitted(value: unknown) {
  if (!value) return 'Recently submitted'
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata',
  }).format(new Date(String(value)))
}

export function ApprovalsPage() {
  const reviewActivity = useReviewActivity()
  const approvals = useQuery({
    queryKey: ['admin', 'pending-approvals'],
    queryFn: async () => {
      const groups = await Promise.all(approvalModules.map(async (module) => {
        const rows = await listPendingApprovalRecords<Record<string, unknown>>(module.table)
        return rows.map((row) => ({
          ...row,
          id: String(row.id),
          table: module.table,
          route: module.route,
          moduleLabel: module.label,
        }))
      }))
      const media = (await listPendingMediaApprovalRecords<Record<string, unknown>>()).map((row) => ({
        ...row,
        id: String(row.id),
        table: 'media_assets' as const,
        route: 'media-library',
        moduleLabel: 'Media Library',
        updated_at: row.created_at,
      }))
      return ([...groups.flat(), ...media] as ApprovalItem[]).sort((a, b) => String(b.updated_at ?? '').localeCompare(String(a.updated_at ?? '')))
    },
  })

  const review = (item: ApprovalItem) => {
    if (item.route === 'media-library') {
      window.location.hash = '#/admin/media-library'
      return
    }
    const parameters = new URLSearchParams({ status: 'pending_review', open: item.id })
    window.location.hash = `#/admin/${item.route}?${parameters}`
  }

  const recentDecisions = (reviewActivity.data ?? []).filter((item) => item.resolution !== 'pending')
  const requestFor = (item: ApprovalItem) => (reviewActivity.data ?? []).find((request) => request.table_name === item.table && request.record_id === item.id && request.resolution === 'pending')
  const decisionIcon = (request: ContentReviewRequestRow) => request.resolution === 'approved' ? CheckCircle2 : request.resolution === 'returned' ? RotateCcw : XCircle
  const decisionLabel = (request: ContentReviewRequestRow) => request.resolution === 'approved' ? 'Approved & published' : request.resolution === 'returned' ? 'Returned to draft' : 'Not approved'

  return <section className="admin-module-page">
    <div className="admin-page-heading"><div><p>Owner review</p><h1>Attention Required</h1><span>Review editor submissions before anything becomes public.</span></div><div className="admin-approval-count"><strong>{approvals.data?.length ?? 0}</strong><small>awaiting review</small></div></div>
    <div className="admin-private-notice"><ShieldCheck size={20} /><div><strong>Nothing is public until you approve it</strong><p>Open each submission, verify the English and Tamil wording, facts, links, images and dates, then choose Approve &amp; Publish. Save Draft returns it for more work without publishing.</p></div></div>
    {approvals.isLoading ? <div className="admin-record-skeletons"><i /><i /><i /></div>
      : approvals.isError ? <div className="admin-empty-state"><ShieldCheck /><h2>Approvals could not be loaded</h2><p>Check the Supabase connection and retry.</p><button className="admin-secondary-button" onClick={() => void approvals.refetch()}>Try again</button></div>
      : approvals.data?.length ? <div className="admin-approval-list">{approvals.data.map((item) => { const request = requestFor(item); return <article key={`${item.table}-${item.id}`}>
        <span className="admin-approval-list__icon"><Clock3 size={19} /></span>
        <div><small>{item.moduleLabel}</small><h2>{itemTitle(item)}</h2><p>{request ? `Submitted by ${request.submitted_by_name} · ${formatSubmitted(request.submitted_at)}` : `Submitted ${formatSubmitted(item.updated_at)}`}</p></div>
        <button type="button" className="admin-primary-button" onClick={() => review(item)}>Review submission <ArrowRight size={16} /></button>
      </article> })}</div>
      : <div className="admin-empty-state"><CheckCircle2 /><h2>All caught up</h2><p>There are no editor submissions waiting for owner approval.</p></div>}
    <section className="admin-review-section"><header><div><p>Last 30 days</p><h2>Recent Decisions</h2></div><span>{recentDecisions.length}</span></header>{recentDecisions.length ? <div className="admin-submission-list">{recentDecisions.map((request) => { const Icon = decisionIcon(request); return <article className="admin-submission-card" key={request.id}><span className={`admin-submission-card__status is-${request.resolution}`}><Icon size={16} /> {decisionLabel(request)}</span><div className="admin-submission-card__copy"><small>{approvalModules.find((module) => module.table === request.table_name)?.label ?? (request.table_name === 'media_assets' ? 'Media Library' : request.table_name.replaceAll('_', ' '))}</small><h2>{request.title_snapshot}</h2><p>Submitted by {request.submitted_by_name} · {formatSubmitted(request.submitted_at)}</p><p>Decision {formatSubmitted(request.resolved_at)}</p></div></article> })}</div> : <div className="admin-empty-state admin-empty-state--compact"><Clock3 /><h2>No recent decisions</h2><p>Approval decisions will remain here for 30 days.</p></div>}</section>
  </section>
}
