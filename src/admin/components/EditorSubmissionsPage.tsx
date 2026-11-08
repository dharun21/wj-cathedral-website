import { ArrowRight, CheckCircle2, Clock3, FileClock, RotateCcw, Send, XCircle } from 'lucide-react'
import type { ContentReviewRequestRow, ReviewResolution } from '../../types/database'
import { useReviewActivity } from '../hooks/useReviewActivity'

const reviewModules: Record<ContentReviewRequestRow['table_name'], { label: string; route: string }> = {
  hero_slides: { label: 'Carousel Slides', route: 'slides' },
  daily_bible_verses: { label: 'Daily Bible Verses', route: 'verses' },
  announcements: { label: 'Announcements', route: 'announcements' },
  worship_services: { label: 'Worship Times', route: 'services' },
  events: { label: 'Events', route: 'events' },
  videos: { label: 'YouTube & Media', route: 'videos' },
  audio_albums: { label: 'Audio Albums', route: 'audio-albums' },
  audio_tracks: { label: 'Audio Tracks', route: 'audio-library' },
  ministries: { label: 'Ministries', route: 'ministries' },
  page_content: { label: 'Page Copy', route: 'page-content' },
  gallery_albums: { label: 'Gallery Albums', route: 'albums' },
  gallery_images: { label: 'Gallery Photos', route: 'gallery-images' },
  media_assets: { label: 'Media Library', route: 'media-library' },
}

const resolutionDetails: Record<ReviewResolution, { label: string; className: string; Icon: typeof Clock3 }> = {
  pending: { label: 'Awaiting owner approval', className: 'is-pending', Icon: Clock3 },
  approved: { label: 'Approved & published', className: 'is-approved', Icon: CheckCircle2 },
  returned: { label: 'Returned to draft', className: 'is-returned', Icon: RotateCcw },
  rejected: { label: 'Not approved', className: 'is-rejected', Icon: XCircle },
}

function formatIndiaDate(value: string | null) {
  if (!value) return ''
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata',
  }).format(new Date(value))
}

function SubmissionCard({ request }: { request: ContentReviewRequestRow }) {
  const module = reviewModules[request.table_name]
  const status = resolutionDetails[request.resolution]
  const StatusIcon = status.Icon
  const continueEditing = () => {
    const parameters = new URLSearchParams({ status: 'draft', open: request.record_id })
    window.location.hash = `#/admin/${module.route}?${parameters}`
  }
  return <article className="admin-submission-card">
    <span className={`admin-submission-card__status ${status.className}`}><StatusIcon size={16} /> {status.label}</span>
    <div className="admin-submission-card__copy"><small>{module.label}</small><h2>{request.title_snapshot}</h2><p><Send size={13} /> Sent {formatIndiaDate(request.submitted_at)}</p>{request.resolved_at && <p><FileClock size={13} /> Decision {formatIndiaDate(request.resolved_at)}</p>}</div>
    {request.resolution === 'returned' && request.table_name !== 'media_assets' && <button type="button" className="admin-secondary-button" onClick={continueEditing}>Continue editing <ArrowRight size={15} /></button>}
  </article>
}

export function EditorSubmissionsPage() {
  const activity = useReviewActivity()
  const pending = (activity.data ?? []).filter((item) => item.resolution === 'pending')
  const history = (activity.data ?? []).filter((item) => item.resolution !== 'pending')

  return <section className="admin-module-page">
    <div className="admin-page-heading"><div><p>Editor workflow</p><h1>Pending Approval</h1><span>Track everything you have sent to the owner for review.</span></div><div className="admin-approval-count"><strong>{pending.length}</strong><small>waiting for owner</small></div></div>
    <div className="admin-private-notice"><Clock3 size={20} /><div><strong>Your submitted items are locked while awaiting review</strong><p>When the owner approves an item, its status changes here automatically. Decisions remain in Recent History for 30 days and then disappear.</p></div></div>
    {activity.isLoading ? <div className="admin-record-skeletons"><i /><i /><i /></div>
      : activity.isError ? <div className="admin-empty-state"><FileClock /><h2>Submission activity could not be loaded</h2><p>Check the Supabase connection and try again.</p><button className="admin-secondary-button" onClick={() => void activity.refetch()}>Try again</button></div>
      : <>
        <section className="admin-review-section"><header><div><p>Waiting for review</p><h2>Sent to owner</h2></div><span>{pending.length}</span></header>{pending.length ? <div className="admin-submission-list">{pending.map((request) => <SubmissionCard request={request} key={request.id} />)}</div> : <div className="admin-empty-state admin-empty-state--compact"><CheckCircle2 /><h2>Nothing waiting</h2><p>You have no submissions awaiting owner approval.</p></div>}</section>
        <section className="admin-review-section"><header><div><p>Last 30 days</p><h2>Recent History</h2></div><span>{history.length}</span></header>{history.length ? <div className="admin-submission-list">{history.map((request) => <SubmissionCard request={request} key={request.id} />)}</div> : <div className="admin-empty-state admin-empty-state--compact"><FileClock /><h2>No recent decisions</h2><p>Approved, returned or rejected submissions will remain here for 30 days.</p></div>}</section>
      </>}
  </section>
}
