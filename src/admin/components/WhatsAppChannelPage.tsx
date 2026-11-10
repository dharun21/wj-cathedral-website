import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ExternalLink, MessageCircle, QrCode } from 'lucide-react'
import { useState } from 'react'
import { whatsappChannelDefaults } from '../../data/whatsappChannel'
import { invalidatePublishedContent } from '../../lib/contentCache'
import { listAdminRecords, saveAdminRecord } from '../../services/contentService'
import type { MediaAssetRow } from '../../types/database'
import { useNotification } from '../context/NotificationContext'
import type { AdminRecord } from '../types'
import { MediaPicker } from './MediaPicker'

function ChannelEditor({ initial }: { initial: AdminRecord }) {
  const queryClient = useQueryClient()
  const { notify } = useNotification()
  const [pickerOpen, setPickerOpen] = useState(false)
  const [record, setRecord] = useState<AdminRecord>({
    whatsapp_channel_enabled: initial.whatsapp_channel_enabled ?? whatsappChannelDefaults.enabled,
    whatsapp_channel_title_en: initial.whatsapp_channel_title_en ?? whatsappChannelDefaults.titleEn,
    whatsapp_channel_title_ta: initial.whatsapp_channel_title_ta ?? whatsappChannelDefaults.titleTa,
    whatsapp_channel_url: initial.whatsapp_channel_url ?? whatsappChannelDefaults.channelUrl,
    whatsapp_qr_url: initial.whatsapp_qr_url ?? whatsappChannelDefaults.qrUrl,
    whatsapp_qr_media_id: initial.whatsapp_qr_media_id ?? null,
    whatsapp_blog_url: initial.whatsapp_blog_url ?? whatsappChannelDefaults.blogUrl,
  })
  const update = (name: string, value: unknown) => setRecord((current) => ({ ...current, [name]: value }))
  const save = useMutation({
    mutationFn: async () => {
      if (!initial.id) throw new Error('Website settings are not available yet.')
      return saveAdminRecord('site_settings', record, initial.id)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'site_settings'] })
      await invalidatePublishedContent(queryClient, 'site_settings')
      notify('WhatsApp channel settings published.')
    },
    onError: (error) => notify(error instanceof Error ? error.message : 'WhatsApp channel settings could not be saved.', 'error'),
  })
  const chooseQr = (asset: MediaAssetRow) => {
    update('whatsapp_qr_url', asset.public_url ?? whatsappChannelDefaults.qrUrl)
    update('whatsapp_qr_media_id', asset.id)
    setPickerOpen(false)
  }
  const qrUrl = String(record.whatsapp_qr_url || whatsappChannelDefaults.qrUrl)

  return <section className="admin-module-page">
    <div className="admin-page-heading"><div><p>Official channel</p><h1>WhatsApp Channel</h1><span>Control the WhatsApp invitation shown across the public website.</span></div></div>
    <div className="admin-whatsapp-layout">
      <section className="admin-settings-card admin-whatsapp-preview"><div><small>Website preview</small><h2>{String(record.whatsapp_channel_title_en)}</h2><p>Visitors can scan the QR code or open the official channel directly.</p><a href={String(record.whatsapp_channel_url)} target="_blank" rel="noreferrer"><MessageCircle size={17} /> Follow on WhatsApp <ExternalLink size={14} /></a></div><img src={qrUrl} alt="WhatsApp channel QR preview" /></section>
      <form className="admin-settings-card" onSubmit={(event) => { event.preventDefault(); save.mutate() }}>
        <div className="admin-form-grid">
          <label className="is-full"><span>Show WhatsApp channel on website</span><span className="admin-switch"><input type="checkbox" checked={record.whatsapp_channel_enabled === true} onChange={(event) => update('whatsapp_channel_enabled', event.target.checked)} /><i /><b>{record.whatsapp_channel_enabled === true ? 'Visible publicly' : 'Hidden from website'}</b></span></label>
          <label className="is-full"><span>English heading</span><input required maxLength={180} value={String(record.whatsapp_channel_title_en ?? '')} onChange={(event) => update('whatsapp_channel_title_en', event.target.value)} /></label>
          <label className="is-full"><span>Tamil heading <small lang="ta">தமிழ் தலைப்பு</small></span><input required lang="ta" maxLength={180} value={String(record.whatsapp_channel_title_ta ?? '')} onChange={(event) => update('whatsapp_channel_title_ta', event.target.value)} /></label>
          <label className="is-full"><span>WhatsApp channel URL</span><input required type="url" value={String(record.whatsapp_channel_url ?? '')} onChange={(event) => update('whatsapp_channel_url', event.target.value)} /></label>
          <label className="is-full"><span>Blogspot article URL</span><input required type="url" value={String(record.whatsapp_blog_url ?? '')} onChange={(event) => update('whatsapp_blog_url', event.target.value)} /></label>
          <div className="admin-whatsapp-qr-control"><span><QrCode size={19} /> QR image</span><img src={qrUrl} alt="Selected WhatsApp QR code" /><button type="button" className="admin-secondary-button" onClick={() => setPickerOpen(true)}>Choose from Upload Library</button></div>
        </div>
        <div className="admin-form-actions"><button type="submit" className="admin-primary-button" disabled={save.isPending || !initial.id}>{save.isPending ? 'Publishing…' : 'Publish WhatsApp settings'}</button></div>
      </form>
    </div>
    {pickerOpen && <MediaPicker onClose={() => setPickerOpen(false)} onSelect={chooseQr} />}
  </section>
}

export function WhatsAppChannelPage() {
  const query = useQuery({ queryKey: ['admin', 'site_settings'], queryFn: () => listAdminRecords<AdminRecord>('site_settings') })
  if (query.isLoading) return <div className="admin-record-skeletons"><i /><i /><i /></div>
  const settings = query.data?.[0]
  if (!settings) return <div className="admin-empty-state"><MessageCircle /><h2>Website settings are unavailable</h2><p>Create the website settings record before configuring the WhatsApp channel.</p></div>
  return <ChannelEditor key={String(settings.id)} initial={settings} />
}
