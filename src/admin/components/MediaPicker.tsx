import { useQuery } from '@tanstack/react-query'
import { Check, ImageIcon, Search, X } from 'lucide-react'
import { useState } from 'react'
import { listAdminRecords } from '../../services/contentService'
import type { MediaAssetRow } from '../../types/database'

export function MediaPicker({ onSelect, onClose }: { onSelect: (asset: MediaAssetRow) => void; onClose: () => void }) {
  const [search, setSearch] = useState('')
  const query = useQuery({ queryKey: ['admin', 'media_assets'], queryFn: () => listAdminRecords<MediaAssetRow & Record<string, unknown>>('media_assets', { orderBy: 'created_at', ascending: false }) })
  const assets = (query.data ?? []).filter((asset) => asset.approval_status === 'approved' && asset.public_url && `${asset.original_name} ${asset.alt_en} ${asset.alt_ta}`.toLowerCase().includes(search.toLowerCase()))
  return (
    <div className="admin-dialog admin-media-picker" role="dialog" aria-modal="true" aria-label="Choose an approved image">
      <button className="admin-dialog__backdrop" type="button" onClick={onClose} aria-label="Close media picker" />
      <div className="admin-dialog__panel"><header><div><small>Approved media</small><h2>Choose an image</h2></div><button onClick={onClose} aria-label="Close"><X /></button></header><label className="admin-picker-search"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search images…" /></label>
        {query.isLoading ? <div className="admin-record-skeletons"><i /><i /></div> : assets.length === 0 ? <div className="admin-empty-state"><ImageIcon /><h3>No approved images found</h3><p>Upload and approve an image in the Media Library first.</p></div> : <div className="admin-media-picker__grid">{assets.map((asset) => <button key={asset.id} type="button" onClick={() => onSelect(asset)}><img src={asset.public_url ?? ''} alt={asset.alt_en} /><span><Check size={15} /> Use image</span><small>{asset.original_name}</small></button>)}</div>}
      </div>
    </div>
  )
}
