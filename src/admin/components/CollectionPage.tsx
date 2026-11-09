import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { arrayMove, rectSortingStrategy, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Archive, Eye, GripVertical, Pencil, Plus, Search, Trash2, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { invalidatePublishedContent } from '../../lib/contentCache'
import { deleteAdminRecord, listAdminGalleryImages, listAdminRecords, reorderAdminRecords, saveAdminRecord } from '../../services/contentService'
import type { ContentStatus } from '../../types/database'
import { useNotification } from '../context/NotificationContext'
import type { AdminField, AdminModuleDefinition, AdminRecord } from '../types'
import { ConfirmDialog } from './ConfirmDialog'
import { DailyVerseBackgroundControl } from './DailyVerseBackgroundControl'
import { MediaPicker } from './MediaPicker'
import { useAdminAuth } from '../context/AdminAuthContext'

function statusLabel(status: unknown) {
  return status === 'published' ? 'Published' : status === 'archived' ? 'Archived' : status === 'pending_review' ? 'Pending approval' : 'Draft'
}

function displayValue(value: unknown) {
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  return ''
}

function inputValue(field: AdminField, value: unknown) {
  const text = displayValue(value)
  return field.type === 'datetime' && text ? text.slice(0, 16) : text
}

function preparePayload(record: AdminRecord) {
  const payload: AdminRecord = {}
  for (const [key, value] of Object.entries(record)) {
    if (['id', 'created_at', 'updated_at'].includes(key)) continue
    if (['publish_at', 'expires_at', 'starts_at', 'ends_at'].includes(key)) {
      payload[key] = value ? new Date(String(value)).toISOString() : null
      continue
    }
    if (['registration_url', 'secondary_cta_label_en', 'secondary_cta_label_ta', 'secondary_cta_href', 'image_media_id', 'media_asset_id', 'image_url', 'background_image_url', 'cover_image_url', 'location_en', 'location_ta', 'contact', 'scheduled_date', 'translation_en', 'translation_ta'].includes(key) && value === '') {
      payload[key] = null
      continue
    }
    payload[key] = value
  }
  return payload
}

function validationErrors(definition: AdminModuleDefinition, record: AdminRecord, targetStatus: ContentStatus) {
  const errors: string[] = []
  if (targetStatus === 'published' || targetStatus === 'pending_review') {
    for (const field of definition.fields) if (field.requiredForPublish && !String(record[field.name] ?? '').trim()) errors.push(`${field.label} is required before publishing.`)
    if (definition.key === 'services' && record.verified !== true) errors.push('Confirm that the schedule was verified by the church before publishing.')
  }
  for (const field of definition.fields) {
    const value = String(record[field.name] ?? '').trim()
    if (field.type === 'url' && value && !/^(https:\/\/|tel:|mailto:)/i.test(value)) errors.push(`${field.label} must use an approved https, telephone or email link.`)
  }
  for (const key of ['cta_href', 'secondary_cta_href']) {
    const value = String(record[key] ?? '').trim()
    if (value && !/^#[a-z0-9\-/_]+$/i.test(value)) errors.push('Carousel button destinations must be internal links beginning with #.')
  }
  if (definition.key === 'events' && record.starts_at && record.ends_at) {
    const startsAt = new Date(String(record.starts_at)).getTime()
    const endsAt = new Date(String(record.ends_at)).getTime()
    if (Number.isFinite(startsAt) && Number.isFinite(endsAt) && endsAt < startsAt) errors.push('End date and time must be after the start date and time.')
  }
  if ((definition.key === 'ministries' || definition.key === 'academic-courses') && record.slug && !/^[a-z0-9-]+$/.test(String(record.slug))) errors.push('The internal identifier can contain only lowercase letters, numbers and hyphens.')
  return errors
}

function SortableRecord({ record, definition, owner, onEdit, onDelete }: { record: AdminRecord; definition: AdminModuleDefinition; owner: boolean; onEdit: () => void; onDelete: () => void }) {
  const id = String(record.id)
  const editorCanEdit = record.status === 'draft'
  const sortable = useSortable({ id, disabled: !definition.orderable || !owner })
  const style = { transform: CSS.Transform.toString(sortable.transform), transition: sortable.transition }
  return (
    <article ref={sortable.setNodeRef} style={style} className="admin-record-card">
      {/* oxlint-disable-next-line react/refs -- dnd-kit exposes listener props through its sortable hook. */}
      {definition.orderable && owner && <button type="button" className="admin-drag-handle" {...sortable.attributes} {...sortable.listeners} aria-label="Drag to change display order"><GripVertical size={19} /></button>}
      <div className="admin-record-card__body"><strong>{displayValue(record[definition.titleField]) || `Untitled ${definition.singular}`}</strong>{definition.subtitleField && <small>{displayValue(record[definition.subtitleField])}</small>}</div>
      <span className={`admin-status admin-status--${record.status || 'draft'}`}>{statusLabel(record.status)}</span>
      <div className="admin-record-card__actions"><button type="button" onClick={onEdit} disabled={!owner && !editorCanEdit} aria-label={owner || editorCanEdit ? 'Edit' : 'Awaiting owner action'} title={!owner && !editorCanEdit ? 'Only an owner can change published or submitted content.' : undefined}><Pencil size={17} /></button>{owner && definition.allowDelete !== false && <button type="button" className="is-danger" onClick={onDelete} aria-label="Delete"><Trash2 size={17} /></button>}</div>
    </article>
  )
}

function SortableGalleryPhoto({ record, definition, albumName, orderNumber, owner, onEdit, onDelete }: { record: AdminRecord; definition: AdminModuleDefinition; albumName: string; orderNumber: number; owner: boolean; onEdit: () => void; onDelete: () => void }) {
  const id = String(record.id)
  const editorCanEdit = record.status === 'draft'
  const sortable = useSortable({ id, disabled: !definition.orderable || !owner })
  const style = { transform: CSS.Transform.toString(sortable.transform), transition: sortable.transition }
  const imageUrl = displayValue(record.image_url)
  return (
    <article ref={sortable.setNodeRef} style={style} className="admin-gallery-photo-card">
      <div className="admin-gallery-photo-card__image">
        {imageUrl ? <img src={imageUrl} alt={displayValue(record.alt_en) || displayValue(record.caption_en)} /> : <div>Image unavailable</div>}
        {/* oxlint-disable-next-line react/refs -- dnd-kit exposes listener props through its sortable hook. */}
        {definition.orderable && owner && <button type="button" className="admin-drag-handle" {...sortable.attributes} {...sortable.listeners} aria-label="Drag to change display order"><GripVertical size={19} /></button>}
        <span className={`admin-status admin-status--${record.status || 'draft'}`}>{statusLabel(record.status)}</span>
        <span className="admin-gallery-photo-card__order">Order {String(orderNumber).padStart(2, '0')}</span>
      </div>
      <div className="admin-gallery-photo-card__body">
        <small>Album · {albumName}</small>
        <strong>{displayValue(record.alt_en) || 'Photo description pending'}</strong>
      </div>
      <div className="admin-gallery-photo-card__actions"><button type="button" onClick={onEdit} disabled={!owner && !editorCanEdit} aria-label={owner || editorCanEdit ? 'Edit photo' : 'Awaiting owner action'}><Pencil size={17} /></button>{owner && definition.allowDelete !== false && <button type="button" className="is-danger" onClick={onDelete} aria-label="Delete photo"><Trash2 size={17} /></button>}</div>
    </article>
  )
}

function RecordEditor({ definition, initial, saving, owner, onSave, onClose }: { definition: AdminModuleDefinition; initial: AdminRecord; saving: boolean; owner: boolean; onSave: (record: AdminRecord, status: ContentStatus) => void; onClose: () => void }) {
  const [record, setRecord] = useState<AdminRecord>(initial)
  const [errors, setErrors] = useState<string[]>([])
  const [preview, setPreview] = useState(false)
  const [mediaField, setMediaField] = useState<string | null>(null)
  const latestRecord = useRef<AdminRecord>(initial)
  const lastValidationStatus = useRef<ContentStatus | null>(null)
  const commitRecord = (next: AdminRecord) => {
    latestRecord.current = next
    setRecord(next)
    if (lastValidationStatus.current) setErrors(validationErrors(definition, next, lastValidationStatus.current))
  }
  const update = (name: string, value: unknown) => commitRecord({ ...latestRecord.current, [name]: value })
  const submit = (status: ContentStatus) => {
    lastValidationStatus.current = status
    const next = { ...latestRecord.current, status }
    latestRecord.current = next
    setRecord(next)
    const nextErrors = validationErrors(definition, next, status)
    setErrors(nextErrors)
    if (!nextErrors.length) onSave(next, status)
  }
  return (
    <div className="admin-editor" role="dialog" aria-modal="true" aria-labelledby="editor-title">
      <button type="button" className="admin-editor__backdrop" onClick={onClose} aria-label="Close editor" />
      <div className="admin-editor__panel">
        <header><div><small>{initial.id ? 'Edit' : 'Add'} {definition.singular}</small><h2 id="editor-title">{displayValue(record[definition.titleField]) || `New ${definition.singular}`}</h2></div><button type="button" onClick={onClose} aria-label="Close"><X /></button></header>
        <div className="admin-editor__content">
          {errors.length > 0 && <div className="admin-validation" role="alert"><strong>Review before saving</strong><ul>{errors.map((error) => <li key={error}>{error}</li>)}</ul></div>}
          {preview && <div className="admin-content-preview"><span>Preview</span>{Boolean(record.image_url) && <img src={String(record.image_url)} alt="" />}<h3>{displayValue(record.title_en) || displayValue(record.name_en) || displayValue(record.content_en)}</h3><p lang="ta">{displayValue(record.title_ta) || displayValue(record.name_ta) || displayValue(record.content_ta)}</p><p>{displayValue(record.description_en)}</p></div>}
          <div className="admin-form-grid">
            {definition.fields.filter((field) => field.name !== 'status').map((field) => <label className={field.fullWidth ? 'is-full' : ''} key={field.name}><span>{field.label}{field.tamilLabel && <small lang="ta">{field.tamilLabel}</small>}</span>
              {field.type === 'textarea' ? <textarea rows={5} value={inputValue(field, record[field.name])} onChange={(event) => update(field.name, event.target.value)} />
                : field.type === 'select' ? <select value={inputValue(field, record[field.name])} onChange={(event) => update(field.name, event.target.value)}>{field.options?.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}</select>
                : field.type === 'boolean' ? <span className="admin-switch"><input type="checkbox" checked={record[field.name] === true} onChange={(event) => update(field.name, event.target.checked)} /><i /><b>{record[field.name] === true ? 'Yes' : 'No'}</b></span>
                : <><input type={field.type === 'number' ? 'number' : field.type === 'datetime' ? 'datetime-local' : field.type === 'date' ? 'date' : field.type === 'time' ? 'time' : field.type === 'url' ? 'url' : 'text'} value={inputValue(field, record[field.name])} onChange={(event) => update(field.name, field.type === 'number' ? Number(event.target.value) : event.target.value)} placeholder={field.placeholder} />{(field.name === 'image_url' || field.name === 'background_image_url' || field.name === 'cover_image_url') && <button type="button" className="admin-inline-action" onClick={() => setMediaField(field.name)}>Choose from Upload Library</button>}</>}
              {field.help && <em>{field.help}</em>}
            </label>)}
          </div>
        </div>
        <footer><button type="button" className="admin-secondary-button" onClick={() => setPreview((current) => !current)}><Eye size={17} /> {preview ? 'Hide preview' : 'Preview'}</button><span /><button type="button" className="admin-secondary-button" disabled={saving} onClick={() => submit('draft')}>Save Draft</button><button type="button" className="admin-primary-button" disabled={saving} onClick={() => submit(owner ? 'published' : 'pending_review')}>{saving ? 'Saving…' : owner ? initial.status === 'pending_review' ? 'Approve & Publish' : 'Publish' : 'Send for Approval'}</button></footer>
      </div>
      {mediaField && <MediaPicker onClose={() => setMediaField(null)} onSelect={(asset) => {
        const next = { ...latestRecord.current, [mediaField]: asset.public_url ?? '' }
        delete next.image_media_id
        delete next.media_asset_id
        if (definition.table === 'gallery_images') next.media_asset_id = asset.id
        if (definition.table === 'hero_slides' || definition.table === 'ministries') next.image_media_id = asset.id
        commitRecord(next)
        setMediaField(null)
      }} />}
    </div>
  )
}

export function CollectionPage({ definition }: { definition: AdminModuleDefinition }) {
  const queryClient = useQueryClient()
  const { notify } = useNotification()
  const { isOwner } = useAdminAuth()
  const [search, setSearch] = useState('')
  const routeParameters = useMemo(() => new URLSearchParams(window.location.hash.split('?')[1] ?? ''), [])
  const requestedStatus = routeParameters.get('status')
  const [status, setStatus] = useState(['draft', 'pending_review', 'published', 'archived'].includes(requestedStatus ?? '') ? requestedStatus! : 'all')
  const requestedRecordId = useRef(routeParameters.get('open'))
  const [editor, setEditor] = useState<AdminRecord | null>(null)
  const [deleting, setDeleting] = useState<AdminRecord | null>(null)
  const queryKey = ['admin', definition.table, definition.albumScope ?? '', definition.filters ?? {}, definition.excludeFilters ?? {}]
  const recordsQuery = useQuery({ queryKey, queryFn: () => definition.albumScope
    ? listAdminGalleryImages<AdminRecord>(definition.albumScope)
    : listAdminRecords<AdminRecord>(definition.table, {
      orderBy: definition.orderBy,
      ...(definition.filters ? { filters: definition.filters } : {}),
      ...(definition.excludeFilters ? { excludeFilters: definition.excludeFilters } : {}),
    }) })
  const albumsQuery = useQuery({
    queryKey: ['admin', 'gallery_albums', 'photo-options', definition.albumScope ?? 'gallery'],
    queryFn: () => listAdminRecords<AdminRecord>('gallery_albums', { orderBy: 'display_order', filters: { page_scope: definition.albumScope ?? 'gallery' } }),
    enabled: definition.presentation === 'photo-grid',
  })
  const albumNames = useMemo(() => new Map((albumsQuery.data ?? []).map((album) => [String(album.id), displayValue(album.title_en) || 'Untitled album'])), [albumsQuery.data])
  const editorDefinition = useMemo<AdminModuleDefinition>(() => definition.presentation === 'photo-grid' ? {
    ...definition,
    fields: definition.fields.filter((field) => !(definition.albumScope === 'academics' && field.name === 'album_id')).map((field) => field.name === 'album_id' ? {
      ...field,
      options: [{ value: '', label: 'Choose an album' }, ...(albumsQuery.data ?? []).map((album) => ({ value: String(album.id), label: displayValue(album.title_en) || 'Untitled album' }))],
    } : field),
  } : definition, [albumsQuery.data, definition])
  const saveMutation = useMutation({
    mutationFn: async ({ record, targetStatus }: { record: AdminRecord; targetStatus: ContentStatus }) => {
      const normalized = definition.beforeSave ? definition.beforeSave(record) : record
      return saveAdminRecord(definition.table, preparePayload({ ...normalized, status: targetStatus }), record.id)
    },
    onSuccess: (_data, variables) => { const wasPublished = (recordsQuery.data ?? []).some((record) => record.id === variables.record.id && record.status === 'published'); void queryClient.invalidateQueries({ queryKey }); void queryClient.invalidateQueries({ queryKey: ['admin', 'review-activity'] }); void queryClient.invalidateQueries({ queryKey: ['admin', 'pending-approvals'] }); void queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard-counts'] }); void queryClient.invalidateQueries({ queryKey: ['admin', 'recent-content'] }); if (wasPublished || variables.targetStatus === 'published') void invalidatePublishedContent(queryClient, definition.table); setEditor(null); notify(variables.targetStatus === 'pending_review' ? 'Sent to the owner for approval.' : `${definition.singular[0]?.toUpperCase()}${definition.singular.slice(1)} saved successfully.`) },
    onError: (error) => notify(error instanceof Error ? error.message : 'The content could not be saved.', 'error'),
  })
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAdminRecord(definition.table, id),
    onSuccess: () => { void queryClient.invalidateQueries({ queryKey }); void queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard-counts'] }); void queryClient.invalidateQueries({ queryKey: ['admin', 'recent-content'] }); if (deleting?.status === 'published') void invalidatePublishedContent(queryClient, definition.table); setDeleting(null); notify('Content deleted.') },
    onError: (error) => notify(error instanceof Error ? error.message : 'The content could not be deleted.', 'error'),
  })
  const reorderMutation = useMutation({
    mutationFn: (ids: string[]) => reorderAdminRecords(definition.table, ids),
    onSuccess: () => { void queryClient.invalidateQueries({ queryKey }); void queryClient.invalidateQueries({ queryKey: ['admin', 'recent-content'] }); void invalidatePublishedContent(queryClient, definition.table); notify('Display order updated.') },
    onError: () => { void queryClient.invalidateQueries({ queryKey }); notify('The new order could not be saved.', 'error') },
  })
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }))
  const records = useMemo(() => recordsQuery.data ?? [], [recordsQuery.data])
  const createRecord = () => setEditor({
    ...definition.defaults,
    ...(definition.orderable ? { display_order: records.length } : {}),
    ...(definition.albumScope && (albumsQuery.data?.length ?? 0) === 1 ? { album_id: String(albumsQuery.data?.[0]?.id) } : {}),
  })
  useEffect(() => {
    const recordId = requestedRecordId.current
    if (!recordId || records.length === 0) return
    const requestedRecord = records.find((record) => String(record.id) === recordId)
    requestedRecordId.current = null
    if (requestedRecord) setEditor({ ...requestedRecord })
    const cleaned = new URLSearchParams(window.location.hash.split('?')[1] ?? '')
    cleaned.delete('open')
    const base = window.location.hash.split('?')[0]
    window.history.replaceState(null, '', `${window.location.pathname}${base}${cleaned.size ? `?${cleaned}` : ''}`)
  }, [records])
  const filtered = useMemo(() => records.filter((record) => {
    const haystack = Object.values(record).filter((value) => typeof value === 'string').join(' ').toLowerCase()
    return (!search || haystack.includes(search.toLowerCase())) && (status === 'all' || record.status === status)
  }), [records, search, status])
  const galleryGroups = useMemo(() => {
    if (definition.presentation !== 'photo-grid') return []
    const albumOrder = new Map((albumsQuery.data ?? []).map((album, index) => [String(album.id), index]))
    const albumIds = [...new Set(filtered.map((record) => String(record.album_id)))]
    return albumIds
      .sort((a, b) => (albumOrder.get(a) ?? Number.MAX_SAFE_INTEGER) - (albumOrder.get(b) ?? Number.MAX_SAFE_INTEGER))
      .map((albumId) => ({
        id: albumId,
        name: albumNames.get(albumId) ?? 'Album unavailable',
        records: filtered.filter((record) => String(record.album_id) === albumId).sort((a, b) => Number(a.display_order ?? 0) - Number(b.display_order ?? 0)),
      }))
  }, [albumNames, albumsQuery.data, definition.presentation, filtered])
  const dragEnd = (event: DragEndEvent) => {
    if (!isOwner) return
    if (!event.over || event.active.id === event.over.id) return
    if (definition.presentation === 'photo-grid') {
      const activeRecord = records.find((record) => String(record.id) === String(event.active.id))
      const overRecord = records.find((record) => String(record.id) === String(event.over?.id))
      if (!activeRecord || !overRecord) return
      if (activeRecord.album_id !== overRecord.album_id) {
        notify('Photos can only be reordered inside the same album.', 'error')
        return
      }
      const albumRecords = records.filter((record) => record.album_id === activeRecord.album_id).sort((a, b) => Number(a.display_order ?? 0) - Number(b.display_order ?? 0))
      const oldIndex = albumRecords.findIndex((record) => String(record.id) === String(event.active.id))
      const newIndex = albumRecords.findIndex((record) => String(record.id) === String(event.over?.id))
      const reorderedAlbum = arrayMove(albumRecords, oldIndex, newIndex).map((record, index) => ({ ...record, display_order: index }))
      let albumIndex = 0
      const reorderedRecords = records.map((record) => record.album_id === activeRecord.album_id ? reorderedAlbum[albumIndex++]! : record)
      queryClient.setQueryData(queryKey, reorderedRecords)
      reorderMutation.mutate(reorderedAlbum.map((record) => String(record.id)))
      return
    }
    const oldIndex = records.findIndex((record) => record.id === event.active.id)
    const newIndex = records.findIndex((record) => record.id === event.over?.id)
    const reordered = arrayMove(records, oldIndex, newIndex)
    queryClient.setQueryData(queryKey, reordered)
    reorderMutation.mutate(reordered.map((record) => String(record.id)))
  }
  return (
    <section className="admin-module-page">
      <div className="admin-page-heading"><div><p>Content management</p><h1>{definition.title}</h1><span>{definition.description}</span></div>{definition.allowCreate !== false && <button className="admin-primary-button" onClick={createRecord} disabled={Boolean(definition.albumScope && !albumsQuery.data?.length)}><Plus size={18} /> Add {definition.singular}</button>}</div>
      {definition.key === 'verses' && <DailyVerseBackgroundControl />}
      <div className="admin-toolbar"><label><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={`Search ${definition.title.toLowerCase()}…`} /></label><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">All statuses</option><option value="draft">Draft</option><option value="pending_review">Pending approval</option><option value="published">Published</option><option value="archived">Archived</option></select><span>{filtered.length} item{filtered.length === 1 ? '' : 's'}</span></div>
      {recordsQuery.isLoading ? <div className="admin-record-skeletons">{[1, 2, 3].map((item) => <i key={item} />)}</div>
        : recordsQuery.isError ? <div className="admin-empty-state"><Archive /><h2>Content could not be loaded</h2><p>Check the Supabase connection and try again.</p><button className="admin-secondary-button" onClick={() => void recordsQuery.refetch()}>Try again</button></div>
        : filtered.length === 0 ? <div className="admin-empty-state"><Archive /><h2>No {definition.title.toLowerCase()} yet</h2><p>{definition.allowCreate === false ? 'No matching records are available.' : definition.albumScope && !albumsQuery.data?.length ? 'Create the page album before adding photos.' : 'Create the first item or change your filters.'}</p>{definition.allowCreate !== false && (!definition.albumScope || Boolean(albumsQuery.data?.length)) && <button className="admin-primary-button" onClick={createRecord}><Plus size={17} /> Add {definition.singular}</button>}</div>
        : <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={dragEnd}>{definition.presentation === 'photo-grid'
          ? <div className="admin-gallery-album-groups">{galleryGroups.map((group) => <section className="admin-gallery-album-group" key={group.id}><header><div><small>Gallery album</small><h2>{group.name}</h2></div><span>{group.records.length} photo{group.records.length === 1 ? '' : 's'}</span></header><SortableContext items={group.records.map((record) => String(record.id))} strategy={rectSortingStrategy}><div className="admin-gallery-photo-grid">{group.records.map((record) => <SortableGalleryPhoto key={String(record.id)} record={record} definition={definition} albumName={group.name} orderNumber={Number(record.display_order ?? 0) + 1} owner={isOwner} onEdit={() => setEditor({ ...record })} onDelete={() => setDeleting(record)} />)}</div></SortableContext></section>)}</div>
          : <SortableContext items={filtered.map((record) => String(record.id))} strategy={verticalListSortingStrategy}><div className="admin-record-list">{filtered.map((record) => <SortableRecord key={String(record.id)} record={record} definition={definition} owner={isOwner} onEdit={() => setEditor({ ...record })} onDelete={() => setDeleting(record)} />)}</div></SortableContext>}</DndContext>}
      {editor && <RecordEditor definition={editorDefinition} initial={editor} saving={saveMutation.isPending} owner={isOwner} onSave={(record, targetStatus) => saveMutation.mutate({ record, targetStatus })} onClose={() => setEditor(null)} />}
      {isOwner && definition.allowDelete !== false && deleting?.id && <ConfirmDialog title={`Delete this ${definition.singular}?`} message="This action cannot be undone. Referenced media and protected records may be blocked by the database." confirmLabel="Delete permanently" busy={deleteMutation.isPending} onCancel={() => setDeleting(null)} onConfirm={() => deleteMutation.mutate(String(deleting.id))} />}
    </section>
  )
}
