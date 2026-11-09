import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Save, School } from 'lucide-react'
import { useState } from 'react'
import { invalidatePublishedContent } from '../../lib/contentCache'
import { listAdminRecords, saveAdminRecord } from '../../services/contentService'
import type { AcademicSettingsRow } from '../../types/database'
import { useNotification } from '../context/NotificationContext'

type AcademicSettingsDraft = Partial<AcademicSettingsRow> & Record<string, unknown>

const fallback: AcademicSettingsDraft = {
  singleton_key: 'default',
  college_name: 'Worship To Jesus Bible Institute & College',
  affiliation: 'National Theological Association (NTA)',
  established: '2015',
  founder: 'Rev. Pr. A. Paulraj',
  principal: 'Pr. A. George Edward',
  address_en: 'Worship to Jesus Cathedral, Near Telephone Exchange, Nannilam 610105, Thiruvarur District, Tamil Nadu.',
  address_ta: 'Worship to Jesus Cathedral, தொலைபேசி நிலையம் அருகில், நன்னிலம் 610105, திருவாரூர் மாவட்டம், தமிழ்நாடு.',
  phone_primary: '9750308877',
  phone_secondary: '9788056467',
  admissions_open: true,
  status: 'published',
}

function AcademicSettingsForm({ initial }: { initial: AcademicSettingsDraft }) {
  const queryClient = useQueryClient()
  const { notify } = useNotification()
  const [record, setRecord] = useState(initial)
  const update = (name: string, value: unknown) => setRecord((current) => ({ ...current, [name]: value }))
  const save = useMutation({
    mutationFn: () => saveAdminRecord('academic_settings', {
      college_name: String(record.college_name ?? '').trim(),
      affiliation: String(record.affiliation ?? '').trim(),
      established: String(record.established ?? '').trim(),
      founder: String(record.founder ?? '').trim(),
      principal: String(record.principal ?? '').trim(),
      address_en: String(record.address_en ?? '').trim(),
      address_ta: String(record.address_ta ?? '').trim(),
      phone_primary: String(record.phone_primary ?? '').trim(),
      phone_secondary: String(record.phone_secondary ?? '').trim() || null,
      admissions_open: record.admissions_open === true,
      singleton_key: 'default',
      status: 'published',
    }, record.id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'academic_settings'] })
      void queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard-counts'] })
      void invalidatePublishedContent(queryClient, 'academic_settings')
      notify('College details and admission availability updated.')
    },
    onError: (error) => notify(error instanceof Error ? error.message : 'Academic settings could not be saved.', 'error'),
  })
  const incomplete = ['college_name', 'affiliation', 'established', 'founder', 'principal', 'address_en', 'address_ta', 'phone_primary'].some((key) => !String(record[key] ?? '').trim())

  return <section className="admin-module-page">
    <div className="admin-page-heading"><div><p>Academics</p><h1>College Details</h1><span>Control the institute information and whether admissions are currently open.</span></div></div>
    <div className="admin-settings-card academic-settings-card">
      <header className="academic-settings-card__header"><span><School size={22} /></span><div><small>Public institute profile</small><h2>Worship To Jesus Bible Institute &amp; College</h2></div></header>
      <div className="admin-form-grid">
        <label className="is-full"><span>Institute name</span><input value={String(record.college_name ?? '')} onChange={(event) => update('college_name', event.target.value)} placeholder="Worship To Jesus Bible Institute & College" /></label>
        <label><span>Affiliation</span><input value={String(record.affiliation ?? '')} onChange={(event) => update('affiliation', event.target.value)} placeholder="National Theological Association (NTA)" /></label>
        <label><span>Established year</span><input value={String(record.established ?? '')} onChange={(event) => update('established', event.target.value)} placeholder="2015" /></label>
        <label><span>Founder</span><input value={String(record.founder ?? '')} onChange={(event) => update('founder', event.target.value)} placeholder="Rev. Pr. A. Paulraj" /></label>
        <label><span>Principal</span><input value={String(record.principal ?? '')} onChange={(event) => update('principal', event.target.value)} placeholder="Pr. A. George Edward" /></label>
        <label className="is-full"><span>Address — English</span><textarea rows={3} value={String(record.address_en ?? '')} onChange={(event) => update('address_en', event.target.value)} placeholder="Enter the complete institute address" /></label>
        <label className="is-full"><span>Address — Tamil <small lang="ta">முகவரி — தமிழ்</small></span><textarea rows={3} lang="ta" value={String(record.address_ta ?? '')} onChange={(event) => update('address_ta', event.target.value)} placeholder="முழு முகவரியை உள்ளிடவும்" /></label>
        <label><span>Primary phone</span><input value={String(record.phone_primary ?? '')} onChange={(event) => update('phone_primary', event.target.value)} placeholder="9750308877" /></label>
        <label><span>Secondary phone</span><input value={String(record.phone_secondary ?? '')} onChange={(event) => update('phone_secondary', event.target.value)} placeholder="Optional" /></label>
        <label className="is-full academic-admission-control"><span>Admission availability</span><span className="admin-switch"><input type="checkbox" checked={record.admissions_open === true} onChange={(event) => update('admissions_open', event.target.checked)} /><i /><b>{record.admissions_open === true ? 'Admissions are open' : 'Admissions are closed'}</b></span><em>When switched off, admission calls-to-action and the public enquiry form are hidden. College and course information remains visible.</em></label>
      </div>
      <div className="admin-form-actions"><button type="button" className="admin-primary-button" disabled={save.isPending || incomplete} onClick={() => save.mutate()}><Save size={17} /> {save.isPending ? 'Saving…' : 'Save & Publish'}</button></div>
    </div>
  </section>
}

export function AcademicSettingsPage() {
  const query = useQuery({ queryKey: ['admin', 'academic_settings'], queryFn: () => listAdminRecords<AcademicSettingsDraft>('academic_settings') })
  if (query.isLoading) return <div className="admin-record-skeletons"><i /><i /><i /></div>
  if (query.isError) return <div className="admin-empty-state"><School /><h2>College details could not be loaded</h2><p>Apply the latest Supabase migration, then try again.</p><button className="admin-secondary-button" onClick={() => void query.refetch()}>Try again</button></div>
  const initial = query.data?.find((item) => item.singleton_key === 'default') ?? fallback
  return <AcademicSettingsForm key={String(initial.id ?? 'new')} initial={initial} />
}
