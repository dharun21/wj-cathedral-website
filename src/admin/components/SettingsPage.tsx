import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { invalidatePublishedContent } from '../../lib/contentCache'
import { listAdminRecords, saveAdminRecord } from '../../services/contentService'
import { useNotification } from '../context/NotificationContext'
import type { AdminRecord } from '../types'

const fields = [['display_name', 'Church display name'], ['short_name', 'Short name'], ['phone', 'Public phone'], ['public_email', 'Public email'], ['address_en', 'Address — English'], ['address_ta', 'Address — Tamil'], ['maps_url', 'Google Maps link'], ['instagram_url', 'Instagram URL'], ['facebook_url', 'Facebook URL'], ['youtube_url', 'YouTube channel URL'], ['footer_en', 'Footer text — English'], ['footer_ta', 'Footer text — Tamil'], ['giving_account_name', 'Giving account holder name'], ['giving_bank_name', 'Giving bank name'], ['giving_bank_branch', 'Giving bank branch'], ['giving_account_number', 'Giving account number'], ['giving_ifsc', 'Giving IFSC code'], ['giving_gpay_number', 'Approved GPay number'], ['giving_gpay_name', 'Approved GPay recipient name'], ['giving_upi_id', 'Approved UPI ID'], ['giving_qr_url', 'Approved GPay QR image URL']] as const

const defaultSettings: AdminRecord = { singleton_key: 'default', status: 'draft', display_name: 'WJ Cathedral', short_name: 'WJ Cathedral', prayer_247_confirmed: false, giving_payment_verified: false }

function SettingsEditor({ initial }: { initial: AdminRecord }) {
  const { notify } = useNotification(); const queryClient = useQueryClient()
  const [record, setRecord] = useState<AdminRecord>(initial)
  const save = useMutation({ mutationFn: (status: 'draft' | 'published') => saveAdminRecord('site_settings', { ...record, status, singleton_key: 'default' }, record.id), onSuccess: (_data, status) => { void queryClient.invalidateQueries({ queryKey: ['admin', 'site_settings'] }); if (record.status === 'published' || status === 'published') void invalidatePublishedContent(queryClient, 'site_settings'); notify('Website settings saved.') }, onError: (error) => notify(error instanceof Error ? error.message : 'Settings could not be saved.', 'error') })
  return <section className="admin-module-page"><div className="admin-page-heading"><div><p>Configuration</p><h1>Website & Giving Settings</h1><span>Manage public identity, contact details, official links and giving information.</span></div></div><div className="admin-settings-card"><div className="admin-form-grid">{fields.map(([name, label]) => { const isLong = name.startsWith('address') || name.startsWith('footer'); return <label className={isLong ? 'is-full' : ''} key={name}><span>{label}</span>{isLong ? <textarea rows={3} value={String(record[name] ?? '')} onChange={(event) => setRecord((current) => ({ ...current, [name]: event.target.value }))} /> : <input value={String(record[name] ?? '')} type={name.endsWith('_url') || name === 'maps_url' ? 'url' : name === 'public_email' ? 'email' : 'text'} onChange={(event) => setRecord((current) => ({ ...current, [name]: event.target.value }))} />}</label>})}</div><div className="admin-form-actions"><button className="admin-secondary-button" onClick={() => save.mutate('draft')} disabled={save.isPending}>Save Draft</button><button className="admin-primary-button" onClick={() => save.mutate('published')} disabled={save.isPending}>Publish Settings</button></div></div></section>
}

export function SettingsPage() {
  const query = useQuery({ queryKey: ['admin', 'site_settings'], queryFn: () => listAdminRecords<AdminRecord>('site_settings') })
  if (query.isLoading) return <div className="admin-record-skeletons"><i /><i /><i /></div>
  const initial = query.data?.[0] ?? defaultSettings
  return <SettingsEditor key={String(initial.id ?? 'new')} initial={initial} />
}
