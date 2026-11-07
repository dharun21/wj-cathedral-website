import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Archive, Eye, GripVertical, Pencil, Plus, Search, Trash2, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { deleteAdminRecord, listAdminRecords, reorderAdminRecords, saveAdminRecord } from '../../services/contentService'
import type { ContentStatus } from '../../types/database'
import { useNotification } from '../context/NotificationContext'
import type { AdminField, AdminModuleDefinition, AdminRecord } from '../types'
import { ConfirmDialog } from './ConfirmDialog'
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
    if (['registration_url', 'secondary_cta_label_en', 'secondary_cta_label_ta', 'secondary_cta_href', 'image_media_id', 'image_url', 'background_image_url', 'location_en', 'location_ta', 'contact', 'scheduled_date', 'translation_en', 'translation_ta'].includes(key) && value === '') {
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
  if (definition.key === 'ministries' && record.slug && !/^[a-z0-9-]+$/.test(String(record.slug))) errors.push('The internal identifier can contain only lowercase letters, numbers and hyphens.')
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
      <div className="admin-record-card__actions"><button type="button" onClick={onEdit} disabled={!owner && !editorCanEdit} aria-label={owner || editorCanEdit ? 'Edit' : 'Awaiting owner action'} title={!owner && !editorCanEdit ? 'Only an owner can change published or submitted content.' : undefined}><Pencil size={17} /></button>{owner && <button type="button" className="is-danger" onClick={onDelete} aria-label="Delete"><Trash2 size={17} /></button>}</div>
    </article>
  )
}

function RecordEditor({ definition, initial, saving, owner, onSave, onClose }: { definition: AdminModuleDefinition; initial: AdminRecord; saving: boolean; owner: boolean; onSave: (record: AdminRecord, status: ContentStatus) => void; onClose: () => void }) {
  const [record, setRecord] = useState<AdminRecord>(initial)
  const [errors, setErrors] = useState<string[]>([])
  const [preview, setPreview] = useState(false)
  const [mediaField, setMediaField] = useState<string | null>(null)
  const update = (name: string, value: unknown) => setRecord((current) => ({ ...current, [name]: value }))
  const submit = (status: ContentStatus) => {
    const next = { ...record, status }
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
                : <><input type={field.type === 'number' ? 'number' : field.type === 'datetime' ? 'datetime-local' : field.type === 'date' ? 'date' : field.type === 'time' ? 'time' : field.type === 'url' ? 'url' : 'text'} value={inputValue(field, record[field.name])} onChange={(event) => update(field.name, field.type === 'number' ? Number(event.target.value) : event.target.value)} placeholder={field.placeholder} />{(field.name === 'image_url' || field.name === 'background_image_url') && <button type="button" className="admin-inline-action" onClick={() => setMediaField(field.name)}>Choose from Media Library</button>}</>}
              {field.help && <em>{field.help}</em>}
            </label>)}
          </div>
        </div>
        <footer><button type="button" className="admin-secondary-button" onClick={() => setPreview((current) => !current)}><Eye size={17} /> {preview ? 'Hide preview' : 'Preview'}</button><span /><button type="button" className="admin-secondary-button" disabled={saving} onClick={() => submit('draft')}>Save Draft</button><button type="button" className="admin-primary-button" disabled={saving} onClick={() => submit(owner ? 'published' : 'pending_review')}>{saving ? 'Saving…' : owner ? initial.status === 'pending_review' ? 'Approve & Publish' : 'Publish' : 'Send for Approval'}</button></footer>
      </div>
      {mediaField && <MediaPicker onClose={() => setMediaField(null)} onSelect={(asset) => { update(mediaField, asset.public_url ?? ''); update('image_media_id', asset.id); setMediaField(null) }} />}
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
  const queryKey = ['admin', definition.table]
  const recordsQuery = useQuery({ queryKey, queryFn: () => listAdminRecords<AdminRecord>(definition.table, { orderBy: definition.orderBy }) })
  const saveMutation = useMutation({
    mutationFn: async ({ record, targetStatus }: { record: AdminRecord; targetStatus: ContentStatus }) => {
      const normalized = definition.beforeSave ? definition.beforeSave(record) : record
      return saveAdminRecord(definition.table, preparePayload({ ...normalized, status: targetStatus }), record.id)
    },
    onSuccess: (_data, variables) => { void queryClient.invalidateQueries({ queryKey }); void queryClient.invalidateQueries({ queryKey: ['admin', 'review-activity'] }); void queryClient.invalidateQueries({ queryKey: ['admin', 'pending-approvals'] }); void queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard-counts'] }); setEditor(null); notify(variables.targetStatus === 'pending_review' ? 'Sent to the owner for approval.' : `${definition.singular[0]?.toUpperCase()}${definition.singular.slice(1)} saved successfully.`) },
    onError: (error) => notify(error instanceof Error ? error.message : 'The content could not be saved.', 'error'),
  })
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAdminRecord(definition.table, id),
    onSuccess: () => { void queryClient.invalidateQueries({ queryKey }); setDeleting(null); notify('Content deleted.') },
    onError: (error) => notify(error instanceof Error ? error.message : 'The content could not be deleted.', 'error'),
  })
  const reorderMutation = useMutation({
    mutationFn: (ids: string[]) => reorderAdminRecords(definition.table, ids),
    onSuccess: () => { void queryClient.invalidateQueries({ queryKey }); notify('Display order updated.') },
    onError: () => { void queryClient.invalidateQueries({ queryKey }); notify('The new order could not be saved.', 'error') },
  })
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }))
  const records = useMemo(() => recordsQuery.data ?? [], [recordsQuery.data])
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
  const dragEnd = (event: DragEndEvent) => {
    if (!isOwner) return
    if (!event.over || event.active.id === event.over.id) return
    const oldIndex = records.findIndex((record) => record.id === event.active.id)
    const newIndex = records.findIndex((record) => record.id === event.over?.id)
    const reordered = arrayMove(records, oldIndex, newIndex)
    queryClient.setQueryData(queryKey, reordered)
    reorderMutation.mutate(reordered.map((record) => String(record.id)))
  }
  return (
    <section className="admin-module-page">
      <div className="admin-page-heading"><div><p>Content management</p><h1>{definition.title}</h1><span>{definition.description}</span></div><button className="admin-primary-button" onClick={() => setEditor({ ...definition.defaults })}><Plus size={18} /> Add {definition.singular}</button></div>
      <div className="admin-toolbar"><label><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={`Search ${definition.title.toLowerCase()}…`} /></label><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">All statuses</option><option value="draft">Draft</option><option value="pending_review">Pending approval</option><option value="published">Published</option><option value="archived">Archived</option></select><span>{filtered.length} item{filtered.length === 1 ? '' : 's'}</span></div>
      {recordsQuery.isLoading ? <div className="admin-record-skeletons">{[1, 2, 3].map((item) => <i key={item} />)}</div>
        : recordsQuery.isError ? <div className="admin-empty-state"><Archive /><h2>Content could not be loaded</h2><p>Check the Supabase connection and try again.</p><button className="admin-secondary-button" onClick={() => void recordsQuery.refetch()}>Try again</button></div>
        : filtered.length === 0 ? <div className="admin-empty-state"><Archive /><h2>No {definition.title.toLowerCase()} yet</h2><p>Create the first item or change your filters.</p><button className="admin-primary-button" onClick={() => setEditor({ ...definition.defaults })}><Plus size={17} /> Add {definition.singular}</button></div>
        : <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={dragEnd}><SortableContext items={filtered.map((record) => String(record.id))} strategy={verticalListSortingStrategy}><div className="admin-record-list">{filtered.map((record) => <SortableRecord key={String(record.id)} record={record} definition={definition} owner={isOwner} onEdit={() => setEditor({ ...record })} onDelete={() => setDeleting(record)} />)}</div></SortableContext></DndContext>}
      {editor && <RecordEditor definition={definition} initial={editor} saving={saveMutation.isPending} owner={isOwner} onSave={(record, targetStatus) => saveMutation.mutate({ record, targetStatus })} onClose={() => setEditor(null)} />}
      {isOwner && deleting?.id && <ConfirmDialog title={`Delete this ${definition.singular}?`} message="This action cannot be undone. Referenced media and protected records may be blocked by the database." confirmLabel="Delete permanently" busy={deleteMutation.isPending} onCancel={() => setDeleting(null)} onConfirm={() => deleteMutation.mutate(String(deleting.id))} />}
    </section>
  )
}
