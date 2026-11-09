import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CheckCircle2, ImagePlus, Trash2, Upload } from 'lucide-react'
import { useEffect, useState } from 'react'
import { listAdminMediaAssets } from '../../services/contentService'
import { deleteMediaAsset, getMediaPreviewUrl, publishMediaAsset, uploadDraftImage } from '../../services/mediaService'
import type { MediaAssetRow } from '../../types/database'
import { useNotification } from '../context/NotificationContext'
import { ConfirmDialog } from './ConfirmDialog'
import { useAdminAuth } from '../context/AdminAuthContext'

function MediaCard({ asset, owner, onApprove, onDelete, busy }: { asset: MediaAssetRow; owner: boolean; onApprove: () => void; onDelete: () => void; busy: boolean }) {
  const [url, setUrl] = useState(asset.public_url ?? '')
  useEffect(() => { if (!url) void getMediaPreviewUrl(asset).then(setUrl).catch(() => setUrl('')) }, [asset, url])
  return <article className="admin-media-card">{url ? <img src={url} alt={asset.alt_en} /> : <div className="admin-media-card__missing">Preview unavailable</div>}<div><span className={`admin-status admin-status--${asset.approval_status === 'approved' ? 'published' : 'draft'}`}>{asset.approval_status}</span><h3>{asset.original_name}</h3><p>{asset.alt_en}</p><small>{Math.ceil(asset.file_size / 1024)} KB · {asset.width ?? '?'} × {asset.height ?? '?'}</small></div><footer>{owner && asset.approval_status !== 'approved' && <button className="admin-secondary-button" disabled={busy} onClick={onApprove}><CheckCircle2 size={16} /> Approve & publish</button>}{owner && <button className="admin-icon-danger" disabled={busy} onClick={onDelete} aria-label={`Delete ${asset.original_name}`}><Trash2 size={17} /></button>}{!owner && <small>Awaiting owner approval</small>}</footer></article>
}

export function MediaLibraryPage() {
  const queryClient = useQueryClient(); const { notify } = useNotification()
  const { isOwner } = useAdminAuth()
  const [file, setFile] = useState<File | null>(null); const [altEn, setAltEn] = useState(''); const [altTa, setAltTa] = useState(''); const [progress, setProgress] = useState(0); const [deleting, setDeleting] = useState<MediaAssetRow | null>(null)
  const query = useQuery({ queryKey: ['admin', 'media_assets', 'images'], queryFn: () => listAdminMediaAssets('image') })
  const images = query.data ?? []
  const refresh = () => {
    void queryClient.invalidateQueries({ queryKey: ['admin', 'media_assets'] })
    void queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard-counts'] })
  }
  const upload = useMutation({ mutationFn: () => { if (!file || !altEn.trim() || !altTa.trim()) throw new Error('Choose an image and add English and Tamil alt text.'); return uploadDraftImage(file, altEn, altTa, setProgress) }, onSuccess: () => { refresh(); setFile(null); setAltEn(''); setAltTa(''); setProgress(0); notify('Image uploaded as a private draft.') }, onError: (error) => notify(error instanceof Error ? error.message : 'Upload failed.', 'error') })
  const approve = useMutation({ mutationFn: publishMediaAsset, onSuccess: () => { refresh(); notify('Image approved and available to published content.') }, onError: (error) => notify(error instanceof Error ? error.message : 'Approval failed.', 'error') })
  const remove = useMutation({ mutationFn: deleteMediaAsset, onSuccess: () => { refresh(); setDeleting(null); notify('Image deleted.') }, onError: (error) => notify(error instanceof Error ? error.message : 'This image could not be deleted.', 'error') })
  return <section className="admin-module-page"><div className="admin-page-heading"><div><p>Reusable source files</p><h1>Upload Library</h1><span>Upload and approve files for use elsewhere. Files here are not automatically shown on the Gallery page.</span></div></div>
    <form className="admin-upload-panel" onSubmit={(event) => { event.preventDefault(); upload.mutate() }}><div className="admin-upload-drop"><ImagePlus size={28} /><label><strong>{file?.name ?? 'Choose an approved church image'}</strong><span>JPG, PNG, WebP or AVIF · automatically optimized · final maximum 2 MB</span><input required type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(event) => setFile(event.target.files?.[0] ?? null)} /></label></div><div className="admin-form-grid"><label><span>English alt text</span><input required value={altEn} onChange={(event) => setAltEn(event.target.value)} /></label><label><span>Tamil alt text <small lang="ta">தமிழ் மாற்று உரை</small></span><input required lang="ta" value={altTa} onChange={(event) => setAltTa(event.target.value)} /></label></div>{upload.isPending && <div className="admin-progress"><i style={{ width: `${progress}%` }} /><span>{progress}%</span></div>}<button className="admin-primary-button" disabled={upload.isPending}><Upload size={17} /> Upload private draft</button></form>
    {query.isLoading ? <div className="admin-record-skeletons"><i /><i /><i /></div> : images.length ? <div className="admin-media-grid">{images.map((asset) => <MediaCard key={asset.id} asset={asset} owner={isOwner} busy={approve.isPending || remove.isPending} onApprove={() => approve.mutate(asset)} onDelete={() => setDeleting(asset)} />)}</div> : <div className="admin-empty-state"><ImagePlus /><h2>No images uploaded</h2><p>Your approved and draft images will appear here.</p></div>}
    {isOwner && deleting && <ConfirmDialog title="Delete this image?" message="Deletion is blocked when the image is still referenced by website content." confirmLabel="Delete image" busy={remove.isPending} onCancel={() => setDeleting(null)} onConfirm={() => remove.mutate(deleting)} />}
  </section>
}
