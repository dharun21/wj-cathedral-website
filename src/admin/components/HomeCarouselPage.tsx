import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { arrayMove, rectSortingStrategy, SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { LockKeyhole, Plus, Presentation, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { HOME_LIVE_SLIDE_SLOT_ID } from '../../constants/heroSlides'
import { invalidatePublishedContent } from '../../lib/contentCache'
import { deleteAdminRecord, listAdminRecords, reorderAdminRecords, saveAdminRecord } from '../../services/contentService'
import type { ContentStatus, HeroSlideRow, MediaAssetRow } from '../../types/database'
import { useAdminAuth } from '../context/AdminAuthContext'
import { useNotification } from '../context/NotificationContext'
import { ConfirmDialog } from './ConfirmDialog'
import { MediaPicker } from './MediaPicker'
import { SortableCarouselCard } from './SortableCarouselCard'

type SlideDraft = Partial<HeroSlideRow> & Record<string, unknown>

const builtInIds = new Set([
  '10000000-0000-4000-8000-000000000001',
  '10000000-0000-4000-8000-000000000002',
  '10000000-0000-4000-8000-000000000004',
  '10000000-0000-4000-8000-000000000005',
  '10000000-0000-4000-8000-000000000006',
])

function isBuiltIn(slide: SlideDraft) {
  return slide.slide_kind === 'default' || builtInIds.has(String(slide.id ?? ''))
}

function isLiveSystemSlide(slide: SlideDraft) {
  return String(slide.id ?? '') === HOME_LIVE_SLIDE_SLOT_ID || slide.default_key === 'home-live'
}

function HomeSlideEditor({ initial, owner, saving, onClose, onSave }: { initial: SlideDraft; owner: boolean; saving: boolean; onClose: () => void; onSave: (record: SlideDraft, status: ContentStatus) => void }) {
  const [record, setRecord] = useState(initial)
  const [mediaPicker, setMediaPicker] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const builtIn = isBuiltIn(record)
  const canEdit = owner || record.status === 'draft' || !record.id
  const update = (name: string, value: unknown) => { setRecord((current) => ({ ...current, [name]: value })); setErrors([]) }
  const submit = (status: ContentStatus) => {
    const required: Array<[string, string]> = [
      ['title_en', 'English heading'], ['title_ta', 'Tamil heading'],
      ['description_en', 'English supporting text'], ['description_ta', 'Tamil supporting text'],
    ]
    if (!builtIn) required.push(['image_url', 'Background image'])
    const missing = required.filter(([name]) => !String(record[name] ?? '').trim()).map(([, label]) => `${label} is required.`)
    setErrors(missing)
    if (!missing.length) onSave(record, status)
  }
  const chooseImage = (asset: MediaAssetRow) => {
    setRecord((current) => ({ ...current, image_url: asset.public_url ?? '', image_media_id: asset.id }))
    setMediaPicker(false)
    setErrors([])
  }

  return <div className="admin-editor" role="dialog" aria-modal="true" aria-labelledby="home-slide-title">
    <button type="button" className="admin-editor__backdrop" onClick={onClose} aria-label="Close editor" />
    <div className="admin-editor__panel">
      <header><div><small>{record.id ? 'Edit' : 'Add'} {builtIn ? 'default slide' : 'custom slide'}</small><h2 id="home-slide-title">{String(record.title_en || 'New homepage slide')}</h2></div><button type="button" onClick={onClose} aria-label="Close"><X /></button></header>
      <div className="admin-editor__content">
        {!canEdit && <div className="admin-private-notice"><LockKeyhole size={19} /><div><strong>This published slide is locked for editors</strong><p>An owner can edit it directly. Editors can add a custom slide and send it for approval.</p></div></div>}
        {errors.length > 0 && <div className="admin-validation" role="alert"><strong>Review before saving</strong><ul>{errors.map((error) => <li key={error}>{error}</li>)}</ul></div>}
        <div className="academic-slide-kind"><span className={builtIn ? 'is-default' : 'is-custom'}>{builtIn ? 'Default slide' : 'Custom slide'}</span><p>{builtIn ? 'Edit the heading, supporting text and background image. Its existing button and destination remain protected.' : 'Custom slides contain only a heading, supporting text and background image. They never display a button.'}</p></div>
        {record.image_url && <div className="academic-slide-preview"><img src={String(record.image_url)} alt={`${builtIn ? 'Default' : 'Custom'} homepage slide preview`} /><span>Background preview</span></div>}
        <div className="admin-form-grid">
          <label><span>English heading</span><input disabled={!canEdit} value={String(record.title_en ?? '')} onChange={(event) => update('title_en', event.target.value)} placeholder="Enter the main slide heading" /></label>
          <label><span>Tamil heading <small lang="ta">தமிழ் தலைப்பு</small></span><input disabled={!canEdit} lang="ta" value={String(record.title_ta ?? '')} onChange={(event) => update('title_ta', event.target.value)} placeholder="முக்கிய தலைப்பை உள்ளிடவும்" /></label>
          <label className="is-full"><span>English supporting text</span><textarea disabled={!canEdit} rows={4} value={String(record.description_en ?? '')} onChange={(event) => update('description_en', event.target.value)} placeholder="Add a short supporting sentence" /></label>
          <label className="is-full"><span>Tamil supporting text <small lang="ta">தமிழ் துணை உரை</small></span><textarea disabled={!canEdit} lang="ta" rows={4} value={String(record.description_ta ?? '')} onChange={(event) => update('description_ta', event.target.value)} placeholder="குறுகிய துணை உரையை உள்ளிடவும்" /></label>
          <label className="is-full"><span>Background image</span><input readOnly value={String(record.image_url ?? '')} placeholder="Choose an approved image from the Upload Library" /><button type="button" className="admin-inline-action" disabled={!canEdit} onClick={() => setMediaPicker(true)}>Choose from Upload Library</button><em>{builtIn ? 'Changing this image does not change the protected button.' : 'There are intentionally no button options for custom slides.'}</em></label>
          {builtIn && <label className="is-full academic-fixed-button"><span>Protected public button</span><input readOnly value={`${String(record.cta_label_en ?? '')} → ${String(record.cta_href ?? '')}`} /><em>Button text and destination stay unchanged.</em></label>}
        </div>
      </div>
      <footer><span />{canEdit && <><button type="button" className="admin-secondary-button" disabled={saving} onClick={() => submit('draft')}>Save Draft</button><button type="button" className="admin-primary-button" disabled={saving} onClick={() => submit(owner ? 'published' : 'pending_review')}>{saving ? 'Saving…' : owner ? 'Publish' : 'Send for Approval'}</button></>}</footer>
    </div>
    {mediaPicker && <MediaPicker onClose={() => setMediaPicker(false)} onSelect={chooseImage} />}
  </div>
}

export function HomeCarouselPage() {
  const { isOwner } = useAdminAuth()
  const { notify } = useNotification()
  const queryClient = useQueryClient()
  const queryKey = ['admin', 'hero_slides', 'home']
  const query = useQuery({ queryKey, queryFn: () => listAdminRecords<SlideDraft>('hero_slides', { orderBy: 'display_order', filters: { scope: 'home' } }) })
  const slides = useMemo(() => (query.data ?? []).filter((slide) => String(slide.id) !== '10000000-0000-4000-8000-000000000003'), [query.data])
  const [editor, setEditor] = useState<SlideDraft | null>(null)
  const [deleting, setDeleting] = useState<SlideDraft | null>(null)
  const requestedId = useRef(new URLSearchParams(window.location.hash.split('?')[1] ?? '').get('open'))
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }))

  useEffect(() => {
    if (!requestedId.current || !slides.length) return
    const requested = slides.find((slide) => String(slide.id) === requestedId.current)
    requestedId.current = null
    if (requested && !isLiveSystemSlide(requested)) setEditor({ ...requested })
  }, [slides])

  const save = useMutation({
    mutationFn: ({ record, status }: { record: SlideDraft; status: ContentStatus }) => {
      const payload: Record<string, unknown> = {
        title_en: String(record.title_en ?? '').trim(), title_ta: String(record.title_ta ?? '').trim(),
        description_en: String(record.description_en ?? '').trim(), description_ta: String(record.description_ta ?? '').trim(),
        image_url: record.image_url || null, image_media_id: record.image_media_id ?? null,
        image_alt_en: String(record.title_en ?? '').trim(), image_alt_ta: String(record.title_ta ?? '').trim(), status,
      }
      if (!record.id) Object.assign(payload, {
        scope: 'home', slide_kind: 'custom', default_key: null,
        eyebrow_en: 'WJ Cathedral', eyebrow_ta: 'WJ Cathedral',
        cta_label_en: '', cta_label_ta: '', cta_href: '#home',
        secondary_cta_label_en: null, secondary_cta_label_ta: null, secondary_cta_href: null,
        enabled: true, display_order: slides.length,
      })
      return saveAdminRecord('hero_slides', payload, record.id)
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey })
      const wasPublished = slides.some((slide) => slide.id === variables.record.id && slide.status === 'published')
      if (wasPublished || variables.status === 'published') void invalidatePublishedContent(queryClient, 'hero_slides')
      void queryClient.invalidateQueries({ queryKey: ['admin', 'review-activity'] })
      void queryClient.invalidateQueries({ queryKey: ['admin', 'pending-approvals'] })
      void queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard-counts'] })
      void queryClient.invalidateQueries({ queryKey: ['admin', 'recent-content'] })
      setEditor(null)
      notify(variables.status === 'pending_review' ? 'Homepage slide sent for approval.' : 'Homepage carousel slide saved.')
    },
    onError: (error) => notify(error instanceof Error ? error.message : 'The slide could not be saved.', 'error'),
  })
  const remove = useMutation({
    mutationFn: (id: string) => deleteAdminRecord('hero_slides', id),
    onSuccess: () => { void queryClient.invalidateQueries({ queryKey }); void queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard-counts'] }); void queryClient.invalidateQueries({ queryKey: ['admin', 'recent-content'] }); if (deleting?.status === 'published') void invalidatePublishedContent(queryClient, 'hero_slides'); setDeleting(null); notify('Custom homepage slide deleted.') },
    onError: (error) => notify(error instanceof Error ? error.message : 'The slide could not be deleted.', 'error'),
  })
  const reorder = useMutation({
    mutationFn: (ids: string[]) => reorderAdminRecords('hero_slides', ids),
    onSuccess: () => { void queryClient.invalidateQueries({ queryKey }); void queryClient.invalidateQueries({ queryKey: ['admin', 'recent-content'] }); void invalidatePublishedContent(queryClient, 'hero_slides'); notify('Homepage slide order updated.') },
    onError: () => { void queryClient.invalidateQueries({ queryKey }); notify('The slide order could not be saved.', 'error') },
  })
  const dragEnd = (event: DragEndEvent) => {
    if (!isOwner || !event.over || event.active.id === event.over.id) return
    const oldIndex = slides.findIndex((slide) => String(slide.id) === String(event.active.id))
    const newIndex = slides.findIndex((slide) => String(slide.id) === String(event.over?.id))
    if (oldIndex < 0 || newIndex < 0) return
    const ordered = arrayMove(slides, oldIndex, newIndex).map((slide, index) => ({ ...slide, display_order: index }))
    queryClient.setQueryData(queryKey, ordered)
    reorder.mutate(ordered.map((slide) => String(slide.id)))
  }

  return <section className="admin-module-page">
    <div className="admin-page-heading"><div><p>Homepage</p><h1>Carousel Slides</h1><span>Default slides retain their approved buttons. Custom slides use only a heading, supporting text and background image.</span></div><button className="admin-primary-button" onClick={() => setEditor({ scope: 'home', slide_kind: 'custom', default_key: null, title_en: '', title_ta: '', description_en: '', description_ta: '', image_url: '', status: 'draft', enabled: true })}><Plus size={18} /> Add custom slide</button></div>
    <div className="academic-carousel-note"><LockKeyhole size={20} /><div><strong>Default buttons and system content are protected</strong><p>Button fields are not shown in the editor. The live-session slide can be reordered, but its content updates automatically from the latest published live session.</p></div></div>
    {query.isLoading ? <div className="admin-record-skeletons"><i /><i /><i /></div>
      : query.isError ? <div className="admin-empty-state"><Presentation /><h2>Homepage slides could not be loaded</h2><p>Check the Supabase connection and apply the latest migration.</p><button className="admin-secondary-button" onClick={() => void query.refetch()}>Try again</button></div>
      : <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={dragEnd}><SortableContext items={slides.map((slide) => String(slide.id))} strategy={rectSortingStrategy}><div className="academic-slide-admin-grid">{slides.map((slide, index) => <SortableCarouselCard key={String(slide.id)} slide={slide} index={index} builtIn={isBuiltIn(slide)} system={isLiveSystemSlide(slide)} fixedButton={String(slide.cta_label_en || 'Protected')} owner={isOwner} onEdit={() => { if (!isLiveSystemSlide(slide)) setEditor({ ...slide }) }} onDelete={() => setDeleting(slide)} />)}</div></SortableContext></DndContext>}
    {editor && <HomeSlideEditor initial={editor} owner={isOwner} saving={save.isPending} onClose={() => setEditor(null)} onSave={(record, status) => save.mutate({ record, status })} />}
    {isOwner && deleting?.id && <ConfirmDialog title="Delete this custom slide?" message="This removes the slide from the homepage carousel and cannot be undone." confirmLabel="Delete slide" busy={remove.isPending} onCancel={() => setDeleting(null)} onConfirm={() => remove.mutate(String(deleting.id))} />}
  </section>
}
