import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { BookOpenCheck, CalendarClock, Mail, MapPin, Phone, Search, ShieldCheck, UserRound, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { listAdmissionApplications, updateAdmissionApplication } from '../../services/admissionService'
import type { AdmissionApplicationRow, AdmissionApplicationStatus } from '../../types/database'
import { useNotification } from '../context/NotificationContext'

const statusOptions: Array<{ value: AdmissionApplicationStatus; label: string }> = [
  { value: 'new', label: 'New' },
  { value: 'reviewing', label: 'Reviewing' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'closed', label: 'Closed' },
]

const courseLabels: Record<AdmissionApplicationRow['study_interest'], string> = {
  'bachelor-theology': 'B.Th — Bachelor of Theology',
  'certificate-theology': 'C.Th — Certificate of Theology',
  'diploma-music': 'Diploma in Music',
  other: 'Other area of interest',
}

function formatIndiaDate(value: string) {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata',
  }).format(new Date(value))
}

function AdmissionDetail({ application, onClose }: { application: AdmissionApplicationRow; onClose: () => void }) {
  const [status, setStatus] = useState<AdmissionApplicationStatus>(application.status)
  const [ownerNotes, setOwnerNotes] = useState(application.owner_notes)
  const queryClient = useQueryClient()
  const { notify } = useNotification()
  const save = useMutation({
    mutationFn: () => updateAdmissionApplication(application.id, status, ownerNotes),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'admission-applications'] })
      notify('Admission application updated.')
      onClose()
    },
    onError: (error) => notify(error instanceof Error ? error.message : 'The application could not be updated.', 'error'),
  })

  return <div className="admin-editor" role="dialog" aria-modal="true" aria-labelledby="admission-detail-title">
    <button className="admin-editor__backdrop" type="button" onClick={onClose} aria-label="Close admission details" />
    <div className="admin-editor__panel admin-admission-detail">
      <header><div><small>Private admission enquiry</small><h2 id="admission-detail-title">{application.full_name}</h2></div><button type="button" onClick={onClose} aria-label="Close"><X /></button></header>
      <div className="admin-editor__content">
        <div className="admin-admission-detail__submitted"><CalendarClock size={18} /><span><small>Submitted</small><strong>{formatIndiaDate(application.submitted_at)} IST</strong></span></div>
        <section className="admin-admission-detail__section"><h3>Applicant details</h3><div className="admin-admission-facts">
          <div><UserRound size={17} /><span><small>Full name</small><strong>{application.full_name}</strong></span></div>
          <div><Phone size={17} /><span><small>Phone</small><a href={`tel:${application.phone}`}>{application.phone}</a></span></div>
          <div><Mail size={17} /><span><small>Email</small>{application.email ? <a href={`mailto:${application.email}`}>{application.email}</a> : <strong>Not provided</strong>}</span></div>
          <div><MapPin size={17} /><span><small>Town / district</small><strong>{application.town_district}</strong></span></div>
        </div></section>
        <section className="admin-admission-detail__section"><h3>Study enquiry</h3><dl className="admin-admission-copy"><div><dt>Course interest</dt><dd>{courseLabels[application.study_interest]}</dd></div><div><dt>Preferred website language</dt><dd>{application.preferred_language === 'ta' ? 'Tamil' : 'English'}</dd></div><div><dt>Church or ministry experience</dt><dd>{application.ministry_experience || 'Not provided'}</dd></div><div><dt>Why they would like to study</dt><dd>{application.study_statement}</dd></div></dl></section>
        <section className="admin-admission-detail__section admin-admission-review"><h3>Owner review</h3><div className="admin-form-grid"><label><span>Application status</span><select value={status} onChange={(event) => setStatus(event.target.value as AdmissionApplicationStatus)}>{statusOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label><label className="is-full"><span>Private owner notes</span><textarea rows={5} maxLength={3000} value={ownerNotes} onChange={(event) => setOwnerNotes(event.target.value)} placeholder="Record follow-up details here. These notes are never shown publicly." /></label></div></section>
        <div className="admin-admission-consent"><ShieldCheck size={18} /><p>Applicant consent recorded on {formatIndiaDate(application.consent_at)} IST. Treat this information as private and use it only for admission follow-up.</p></div>
      </div>
      <footer><button type="button" className="admin-secondary-button" onClick={onClose}>Cancel</button><span /><button type="button" className="admin-primary-button" disabled={save.isPending} onClick={() => save.mutate()}>{save.isPending ? 'Saving…' : 'Save review'}</button></footer>
    </div>
  </div>
}

export function AdmissionsPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<'all' | AdmissionApplicationStatus>('all')
  const [selected, setSelected] = useState<AdmissionApplicationRow | null>(null)
  const query = useQuery({ queryKey: ['admin', 'admission-applications'], queryFn: listAdmissionApplications })
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return (query.data ?? []).filter((application) => {
      const matchesStatus = status === 'all' || application.status === status
      const matchesSearch = !term || [application.full_name, application.phone, application.email ?? '', application.town_district, courseLabels[application.study_interest]].some((value) => value.toLowerCase().includes(term))
      return matchesStatus && matchesSearch
    })
  }, [query.data, search, status])

  return <section className="admin-admissions-page">
    <div className="admin-page-heading"><div><p>Administration</p><h1>Admission Applications</h1><span>Review enquiries submitted through the Academics page. Times are shown in India Standard Time.</span></div></div>
    <div className="admin-private-notice"><ShieldCheck size={20} /><div><strong>Owner-only private information</strong><p>These applications contain personal contact details. Editors and public visitors cannot access this module.</p></div></div>
    <div className="admin-toolbar admin-admission-toolbar"><label><Search size={17} /><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, phone, place or course" /></label><select aria-label="Filter application status" value={status} onChange={(event) => setStatus(event.target.value as 'all' | AdmissionApplicationStatus)}><option value="all">All statuses</option>{statusOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select><span>{filtered.length} application{filtered.length === 1 ? '' : 's'}</span></div>
    {query.isLoading ? <div className="admin-record-skeletons"><i /><i /><i /></div> : query.isError ? <div className="admin-empty-state"><BookOpenCheck size={34} /><h2>Applications could not be loaded</h2><p>{query.error instanceof Error ? query.error.message : 'Check the Supabase connection and admission migration.'}</p></div> : filtered.length ? <div className="admin-admission-list">{filtered.map((application) => <article key={application.id} className="admin-admission-card"><div className="admin-admission-card__identity"><span>{application.full_name.slice(0, 1).toUpperCase()}</span><div><strong>{application.full_name}</strong><small>{application.town_district}</small></div></div><div className="admin-admission-card__detail"><small>Course interest</small><strong>{courseLabels[application.study_interest]}</strong></div><div className="admin-admission-card__detail"><small>Submitted</small><strong>{formatIndiaDate(application.submitted_at)} IST</strong></div><div className="admin-admission-card__actions"><span className={`admin-status admin-status--admission-${application.status}`}>{application.status}</span><button type="button" className="admin-secondary-button" onClick={() => setSelected(application)}>View application</button></div></article>)}</div> : <div className="admin-empty-state"><BookOpenCheck size={34} /><h2>No applications found</h2><p>{query.data?.length ? 'Try changing the search or status filter.' : 'New enquiries submitted from the Academics page will appear here.'}</p></div>}
    {selected && <AdmissionDetail application={selected} onClose={() => setSelected(null)} />}
  </section>
}
