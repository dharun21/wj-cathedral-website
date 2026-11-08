import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CheckCircle2, FileAudio, Headphones, Send, Trash2, Upload } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { deleteAdminRecord, listAdminRecords, saveAdminRecord } from '../../services/contentService'
import { deleteMediaAsset, getMediaPreviewUrl, publishMediaAsset, uploadDraftAudio } from '../../services/mediaService'
import type { AudioAlbumRow, AudioTrackRow, MediaAssetRow } from '../../types/database'
import { useAdminAuth } from '../context/AdminAuthContext'
import { useNotification } from '../context/NotificationContext'
import { ConfirmDialog } from './ConfirmDialog'

interface AudioTrackWithAsset extends AudioTrackRow {
  asset: MediaAssetRow | undefined
  album: AudioAlbumRow | undefined
}

function AudioAdminCard({ item, owner, busy, onPublish, onSubmit, onDelete }: { item: AudioTrackWithAsset; owner: boolean; busy: boolean; onPublish: () => void; onSubmit: () => void; onDelete: () => void }) {
  const [previewUrl, setPreviewUrl] = useState(item.asset?.public_url ?? '')
  useEffect(() => {
    if (!previewUrl && item.asset) void getMediaPreviewUrl(item.asset).then(setPreviewUrl).catch(() => setPreviewUrl(''))
  }, [item.asset, previewUrl])
  const status = item.status === 'published' ? 'published' : item.status === 'pending_review' ? 'pending_review' : 'draft'
  return <article className="admin-audio-card">
    <div className="admin-audio-card__icon"><Headphones aria-hidden="true" /></div>
    <div className="admin-audio-card__copy"><span className={`admin-status admin-status--${status}`}>{status.replace('_', ' ')}</span><small>{item.album?.title_en ?? 'Album unavailable'}</small><h2>{item.title_en}</h2><p lang="ta">{item.title_ta}</p>{previewUrl ? <audio controls preload="metadata" src={previewUrl} /> : <em>Private preview unavailable</em>}</div>
    <div className="admin-audio-card__actions">
      {owner && item.status !== 'published' && <button type="button" className="admin-primary-button" disabled={busy || !item.asset} onClick={onPublish}><CheckCircle2 size={16} /> Approve &amp; publish</button>}
      {!owner && item.status === 'draft' && <button type="button" className="admin-primary-button" disabled={busy} onClick={onSubmit}><Send size={16} /> Send for approval</button>}
      {owner && <button type="button" className="admin-icon-danger" disabled={busy} onClick={onDelete} aria-label={`Delete ${item.title_en}`}><Trash2 size={17} /></button>}
    </div>
  </article>
}

export function AudioLibraryPage() {
  const queryClient = useQueryClient()
  const { notify } = useNotification()
  const { isOwner } = useAdminAuth()
  const [file, setFile] = useState<File | null>(null)
  const [albumId, setAlbumId] = useState('')
  const [titleEn, setTitleEn] = useState('')
  const [titleTa, setTitleTa] = useState('')
  const [descriptionEn, setDescriptionEn] = useState('')
  const [descriptionTa, setDescriptionTa] = useState('')
  const [progress, setProgress] = useState(0)
  const [deleting, setDeleting] = useState<AudioTrackWithAsset | null>(null)
  const albumsQuery = useQuery({ queryKey: ['admin', 'audio_albums'], queryFn: () => listAdminRecords<AudioAlbumRow & Record<string, unknown>>('audio_albums', { orderBy: 'display_order' }) })
  const tracksQuery = useQuery({ queryKey: ['admin', 'audio_tracks'], queryFn: () => listAdminRecords<AudioTrackRow & Record<string, unknown>>('audio_tracks', { orderBy: 'display_order' }) })
  const mediaQuery = useQuery({ queryKey: ['admin', 'media_assets'], queryFn: () => listAdminRecords<MediaAssetRow & Record<string, unknown>>('media_assets', { orderBy: 'created_at', ascending: false }) })
  const albums = useMemo(() => albumsQuery.data ?? [], [albumsQuery.data])
  const tracks = useMemo(() => {
    const albumMap = new Map(albums.map((album) => [album.id, album]))
    const mediaMap = new Map((mediaQuery.data ?? []).filter((asset) => asset.mime_type.startsWith('audio/')).map((asset) => [asset.id, asset]))
    return (tracksQuery.data ?? []).map((track) => ({ ...track, album: albumMap.get(track.album_id), asset: mediaMap.get(track.media_asset_id) }))
  }, [albums, mediaQuery.data, tracksQuery.data])
  const refresh = () => {
    void queryClient.invalidateQueries({ queryKey: ['admin', 'audio_tracks'] })
    void queryClient.invalidateQueries({ queryKey: ['admin', 'media_assets'] })
    void queryClient.invalidateQueries({ queryKey: ['admin', 'pending-approvals'] })
    void queryClient.invalidateQueries({ queryKey: ['admin', 'review-activity'] })
    void queryClient.invalidateQueries({ queryKey: ['public', 'audio-library'] })
  }
  const upload = useMutation({
    mutationFn: async () => {
      if (!file || !albumId || !titleEn.trim() || !titleTa.trim()) throw new Error('Choose an album and audio file, then complete both titles.')
      const asset = await uploadDraftAudio(file, titleEn, titleTa, setProgress)
      try {
        return await saveAdminRecord('audio_tracks', {
          album_id: albumId,
          media_asset_id: asset.id,
          title_en: titleEn.trim(),
          title_ta: titleTa.trim(),
          description_en: descriptionEn.trim(),
          description_ta: descriptionTa.trim(),
          duration_seconds: null,
          status: 'draft',
          display_order: tracks.length,
        })
      } catch (error) {
        await deleteMediaAsset(asset)
        throw error
      }
    },
    onSuccess: () => { refresh(); setFile(null); setTitleEn(''); setTitleTa(''); setDescriptionEn(''); setDescriptionTa(''); setProgress(0); notify('Audio uploaded as a private draft.') },
    onError: (error) => notify(error instanceof Error ? error.message : 'Audio upload failed.', 'error'),
  })
  const publish = useMutation({
    mutationFn: async (item: AudioTrackWithAsset) => {
      if (!item.asset) throw new Error('The audio file record is missing.')
      if (item.album?.status !== 'published') throw new Error('Publish this audio album before publishing its tracks.')
      await publishMediaAsset(item.asset)
      return saveAdminRecord('audio_tracks', { status: 'published' }, item.id)
    },
    onSuccess: () => { refresh(); notify('Audio approved and published. Ensure its album is also published.') },
    onError: (error) => notify(error instanceof Error ? error.message : 'Audio approval failed.', 'error'),
  })
  const submit = useMutation({
    mutationFn: (item: AudioTrackWithAsset) => saveAdminRecord('audio_tracks', { status: 'pending_review' }, item.id),
    onSuccess: () => { refresh(); notify('Audio sent to the owner for approval.') },
    onError: (error) => notify(error instanceof Error ? error.message : 'The audio could not be submitted.', 'error'),
  })
  const remove = useMutation({
    mutationFn: async (item: AudioTrackWithAsset) => {
      await deleteAdminRecord('audio_tracks', item.id)
      if (item.asset) await deleteMediaAsset(item.asset)
    },
    onSuccess: () => { refresh(); setDeleting(null); notify('Audio track deleted.') },
    onError: (error) => notify(error instanceof Error ? error.message : 'The audio track could not be deleted.', 'error'),
  })
  const busy = upload.isPending || publish.isPending || submit.isPending || remove.isPending

  return <section className="admin-module-page">
    <div className="admin-page-heading"><div><p>Audio media</p><h1>Audio Library</h1><span>Upload church audio, assign it to an album and publish it after owner approval.</span></div><button type="button" className="admin-secondary-button" onClick={() => { window.location.hash = '#/admin/audio-albums' }}>Manage albums</button></div>
    {!albums.length && !albumsQuery.isLoading && <div className="admin-private-notice"><FileAudio size={20} /><div><strong>Create an album before uploading audio</strong><p>Use Manage albums, complete both languages and save the album. Then return here to add its tracks.</p></div></div>}
    <form className="admin-upload-panel admin-audio-upload" onSubmit={(event) => { event.preventDefault(); upload.mutate() }}>
      <div className="admin-upload-drop"><FileAudio size={28} /><label><strong>{file?.name ?? 'Choose a church audio file'}</strong><span>MP3, M4A, WAV or OGG · maximum 50 MB</span><input required type="file" accept="audio/mpeg,audio/mp3,audio/mp4,audio/x-m4a,audio/wav,audio/x-wav,audio/ogg,.mp3,.m4a,.wav,.ogg" onChange={(event) => setFile(event.target.files?.[0] ?? null)} /></label></div>
      <div className="admin-form-grid"><label className="is-full"><span>Album</span><select required value={albumId} onChange={(event) => setAlbumId(event.target.value)}><option value="">Choose an album</option>{albums.map((album) => <option value={album.id} key={album.id}>{album.title_en} · {album.status}</option>)}</select></label><label><span>English track title</span><input required value={titleEn} onChange={(event) => setTitleEn(event.target.value)} /></label><label><span>Tamil track title <small lang="ta">தமிழ் தலைப்பு</small></span><input required lang="ta" value={titleTa} onChange={(event) => setTitleTa(event.target.value)} /></label><label><span>English description</span><textarea rows={3} value={descriptionEn} onChange={(event) => setDescriptionEn(event.target.value)} /></label><label><span>Tamil description <small lang="ta">தமிழ் விளக்கம்</small></span><textarea lang="ta" rows={3} value={descriptionTa} onChange={(event) => setDescriptionTa(event.target.value)} /></label></div>
      {upload.isPending && <div className="admin-progress"><i style={{ width: `${progress}%` }} /><span>{progress}%</span></div>}
      <button className="admin-primary-button" disabled={busy || !albums.length}><Upload size={17} /> Upload private audio draft</button>
    </form>
    {tracksQuery.isLoading || mediaQuery.isLoading ? <div className="admin-record-skeletons"><i /><i /><i /></div> : tracks.length ? <div className="admin-audio-list">{tracks.map((item) => <AudioAdminCard key={item.id} item={item} owner={isOwner} busy={busy} onPublish={() => publish.mutate(item)} onSubmit={() => submit.mutate(item)} onDelete={() => setDeleting(item)} />)}</div> : <div className="admin-empty-state"><Headphones /><h2>No audio tracks yet</h2><p>Uploaded drafts and published album tracks will appear here.</p></div>}
    {isOwner && deleting && <ConfirmDialog title={`Delete ${deleting.title_en}?`} message="This removes the track and its stored audio file. This action cannot be undone." confirmLabel="Delete audio" busy={remove.isPending} onCancel={() => setDeleting(null)} onConfirm={() => remove.mutate(deleting)} />}
  </section>
}
