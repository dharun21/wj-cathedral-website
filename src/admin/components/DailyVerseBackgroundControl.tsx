import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Image as ImageIcon } from 'lucide-react'
import { useState } from 'react'
import { invalidatePublishedContent } from '../../lib/contentCache'
import { listAdminRecords, saveAdminRecord } from '../../services/contentService'
import type { MediaAssetRow } from '../../types/database'
import { useAdminAuth } from '../context/AdminAuthContext'
import { useNotification } from '../context/NotificationContext'
import type { AdminRecord } from '../types'
import { MediaPicker } from './MediaPicker'

const fallbackBackground = './hero/daily-bible-verse.jpg'

export function DailyVerseBackgroundControl() {
  const { isOwner } = useAdminAuth()
  const { notify } = useNotification()
  const queryClient = useQueryClient()
  const queryKey = ['admin', 'site_settings']
  const settingsQuery = useQuery({ queryKey, queryFn: () => listAdminRecords<AdminRecord>('site_settings') })
  const settings = settingsQuery.data?.[0]
  const [selection, setSelection] = useState<{ imageUrl: string; mediaId: string } | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const imageUrl = selection?.imageUrl ?? String(settings?.daily_verse_background_url || fallbackBackground)
  const mediaId = selection?.mediaId ?? (settings?.daily_verse_background_media_id ? String(settings.daily_verse_background_media_id) : null)

  const save = useMutation({
    mutationFn: async () => {
      if (!settings?.id) throw new Error('Website settings are not available yet.')
      return saveAdminRecord('site_settings', {
        daily_verse_background_url: imageUrl,
        daily_verse_background_media_id: mediaId,
      }, settings.id)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey })
      await invalidatePublishedContent(queryClient, 'site_settings')
      setSelection(null)
      notify('Shared Daily Bible Verse background updated.')
    },
    onError: (error) => notify(error instanceof Error ? error.message : 'The shared background could not be saved.', 'error'),
  })

  const chooseImage = (asset: MediaAssetRow) => {
    setSelection({ imageUrl: asset.public_url ?? fallbackBackground, mediaId: asset.id })
    setPickerOpen(false)
  }

  return <section className="admin-settings-card admin-daily-verse-background">
    <div className="admin-daily-verse-background__preview"><img src={imageUrl} alt="Shared Daily Bible Verse background preview" /></div>
    <div className="admin-daily-verse-background__copy"><span><ImageIcon size={18} /> Shared background</span><h2>Daily Verse Background</h2><p>This one image is used behind every scheduled and rotating Bible verse. Individual verses do not have separate background images.</p><div>{isOwner ? <><button type="button" className="admin-secondary-button" onClick={() => setPickerOpen(true)}>Choose from Upload Library</button><button type="button" className="admin-primary-button" disabled={save.isPending || settingsQuery.isLoading || !settings?.id} onClick={() => save.mutate()}>{save.isPending ? 'Saving…' : 'Save background'}</button></> : <em>Only the owner can replace the shared background.</em>}</div></div>
    {pickerOpen && <MediaPicker onClose={() => setPickerOpen(false)} onSelect={chooseImage} />}
  </section>
}
