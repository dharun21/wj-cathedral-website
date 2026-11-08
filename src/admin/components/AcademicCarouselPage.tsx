import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { LockKeyhole, Pencil, Plus, Presentation, Trash2, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { academicHeroSlides } from '../../data/academics'
import { deleteAdminRecord, listAdminRecords, saveAdminRecord } from '../../services/contentService'
import type { ContentStatus, HeroSlideRow, MediaAssetRow } from '../../types/database'
import { useAdminAuth } from '../context/AdminAuthContext'
import { useNotification } from '../context/NotificationContext'
import { ConfirmDialog } from './ConfirmDialog'
import { MediaPicker } from './MediaPicker'

type SlideDraft = Partial<HeroSlideRow> & Record<string, unknown>

function statusLabel(status: unknown) {
  return status === 'published' ? 'Published' : status === 'pending_review' ? 'Pending approval' : status === 'archived' ? 'Archived' : 'Draft'
}

function slideType(slide: SlideDraft) {
  return slide.slide_kind === 'default' ? 'Built-in slide' : 'Custom slide'
}

function fixedButton(slide: SlideDraft) {
  if (slide.slide_kind !== 'default' || !slide.default_key) return null
  return academicHeroSlides.find((item) => item.id === slide.default_key)
}

function AcademicSlideEditor({ initial, owner, saving, onClose, onSave }: { initial: SlideDraft; owner: boolean; saving: boolean; onClose: () => void; onSave: (record: SlideDraft, status: ContentStatus) => void }) {
  const [record, setRecord] = useState(initial)
  const [mediaPicker, setMediaPicker] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const isDefault = record.slide_kind === 'default'
  const canEdit = owner || record.status === 'draft' || !record.id
  const button = fixedButton(record)
  const update = (name: string, value: unknown) => {
    setRecord((current) => ({ ...current, [name]: value }))
    setErrors([])
  }
  const submit = (status: ContentStatus) => {
    const requiredFields: Array<[string, string]> = [
      ['title_en', 'English heading'], ['title_ta', 'Tamil heading'],
      ['description_en', 'English supporting text'], ['description_ta', 'Tamil supporting text'],
      ...(!isDefault ? [['image_url', 'Background image']] : []),
    ]
    const missing = requiredFields.filter(([name]) => !String(record[name] ?? '').trim()).map(([, label]) => `${label} is required.`)
    setErrors(missing)
    if (!missing.length) onSave(record, status)
  }
  const chooseImage = (asset: MediaAssetRow) => {
    setRecord((current) => ({ ...current, image_url: asset.public_url ?? '', image_media_id: asset.id }))
    setMediaPicker(false)
    setErrors([])
  }

  return <div className="admin-editor" role="dialog" aria-modal="true" aria-labelledby="academic-slide-title">
    <button type="button" className="admin-editor__backdrop" onClick={onClose} aria-label="Close editor" />
    <div className="admin-editor__panel">
      <header><div><small>{record.id ? 'Edit' : 'Add'} {slideType(record)}</small><h2 id="academic-slide-title">{String(record.title_en || 'New academic slide')}</h2></div><button type="button" onClick={onClose} aria-label="Close"><X /></button></header>
      <div className="admin-editor__content">
        {!canEdit && <div className="admin-private-notice"><LockKeyhole size={19} /><div><strong>This published slide is locked for editors</strong><p>An owner can edit it directly. Editors can add and submit new custom slides for approval.</p></div></div>}
        {errors.length > 0 && <div className="admin-validation" role="alert"><strong>Review before saving</strong><ul>{errors.map((error) => <li key={error}>{error}</li>)}</ul></div>}
        <div className="academic-slide-kind"><span className={isDefault ? 'is-default' : 'is-custom'}>{slideType(record)}</span><p>{isDefault ? 'Edit the heading and supporting text only. The design and button remain fixed.' : 'Custom slides contain only a heading, supporting text and background image. No public button is added.'}</p></div>
        {!isDefault && record.image_url && <div className="academic-slide-preview"><img src={String(record.image_url)} alt="Custom slide background preview" /><span>Background preview</span></div>}
        <div className="admin-form-grid">
          <label><span>English heading</span><input disabled={!canEdit} value={String(record.title_en ?? '')} onChange={(event) => update('title_en', event.target.value)} placeholder="Enter the main slide heading" /></label>
          <label><span>Tamil heading <small lang="ta">தமிழ் தலைப்பு</small></span><input disabled={!canEdit} lang="ta" value={String(record.title_ta ?? '')} onChange={(event) => update('title_ta', event.target.value)} placeholder="முக்கிய தலைப்பை உள்ளிடவும்" /></label>
          <label className="is-full"><span>English supporting text</span><textarea disabled={!canEdit} rows={4} value={String(record.description_en ?? '')} onChange={(event) => update('description_en', event.target.value)} placeholder="Add a short supporting sentence" /></label>
          <label className="is-full"><span>Tamil supporting text <small lang="ta">தமிழ் துணை உரை</small></span><textarea disabled={!canEdit} lang="ta" rows={4} value={String(record.description_ta ?? '')} onChange={(event) => update('description_ta', event.target.value)} placeholder="குறுகிய துணை உரையை உள்ளிடவும்" /></label>
          {isDefault && button && <label className="is-full academic-fixed-button"><span>Fixed public button</span><input readOnly value={`${button.ctaLabel.en} → ${button.ctaHref}`} /><em>The button and destination remain exactly as they are in the current Academics carousel.</em></label>}
          {!isDefault && <label className="is-full"><span>Background image</span><input readOnly value={String(record.image_url ?? '')} placeholder="Choose an approved image from the Upload Library" /><button type="button" className="admin-inline-action" disabled={!canEdit} onClick={() => setMediaPicker(true)}>Choose from Upload Library</button><em>Custom slides intentionally have no button fields.</em></label>}
        </div>
      </div>
      <footer><span />{canEdit && <><button type="button" className="admin-secondary-button" disabled={saving} onClick={() => submit('draft')}>Save Draft</button><button type="button" className="admin-primary-button" disabled={saving} onClick={() => submit(owner ? 'published' : 'pending_review')}>{saving ? 'Saving…' : owner ? 'Publish' : 'Send for Approval'}</button></>}</footer>
    </div>
    {mediaPicker && <MediaPicker onClose={() => setMediaPicker(false)} onSelect={chooseImage} />}
  </div>
}

export function AcademicCarouselPage() {
  const { isOwner } = useAdminAuth()
  const { notify } = useNotification()
  const queryClient = useQueryClient()
  const queryKey = ['admin', 'hero_slides', 'academics']
  const slidesQuery = useQuery({ queryKey, queryFn: () => listAdminRecords<SlideDraft>('hero_slides', { orderBy: 'display_order', filters: { scope: 'academics' } }) })
  const [editor, setEditor] = useState<SlideDraft | null>(null)
  const [deleting, setDeleting] = useState<SlideDraft | null>(null)
  const requestedRecordId = useRef(new URLSearchParams(window.location.hash.split('?')[1] ?? '').get('open'))
  const slides = useMemo(() => slidesQuery.data ?? [], [slidesQuery.data])

  useEffect(() => {
    if (!requestedRecordId.current || !slides.length) return
    const requested = slides.find((slide) => String(slide.id) === requestedRecordId.current)
    requestedRecordId.current = null
    if (requested) setEditor({ ...requested })
  }, [slides])

  const save = useMutation({
    mutationFn: ({ record, status }: { record: SlideDraft; status: ContentStatus }) => {
      const isDefault = record.slide_kind === 'default'
      const payload: Record<string, unknown> = {
        title_en: String(record.title_en ?? '').trim(),
        title_ta: String(record.title_ta ?? '').trim(),
        description_en: String(record.description_en ?? '').trim(),
        description_ta: String(record.description_ta ?? '').trim(),
        status,
      }
      if (!record.id) Object.assign(payload, {
        scope: 'academics', slide_kind: 'custom', default_key: null,
        eyebrow_en: '', eyebrow_ta: '',
        image_url: record.image_url, image_media_id: record.image_media_id ?? null,
        image_alt_en: String(record.title_en ?? '').trim(), image_alt_ta: String(record.title_ta ?? '').trim(),
        cta_label_en: '', cta_label_ta: '', cta_href: '#academics',
        secondary_cta_label_en: null, secondary_cta_label_ta: null, secondary_cta_href: null,
        enabled: true, display_order: slides.length,
      })
      if (record.id && !isDefault) Object.assign(payload, {
        image_url: record.image_url,
        image_media_id: record.image_media_id ?? null,
        image_alt_en: String(record.title_en ?? '').trim(),
        image_alt_ta: String(record.title_ta ?? '').trim(),
      })
      return saveAdminRecord('hero_slides', payload, record.id)
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey })
      void queryClient.invalidateQueries({ queryKey: ['public', 'hero-slides', 'academics'] })
      void queryClient.invalidateQueries({ queryKey: ['admin', 'review-activity'] })
      void queryClient.invalidateQueries({ queryKey: ['admin', 'pending-approvals'] })
      setEditor(null)
      notify(variables.status === 'pending_review' ? 'Academic slide sent to the owner for approval.' : 'Academic carousel slide saved.')
    },
    onError: (error) => notify(error instanceof Error ? error.message : 'The slide could not be saved.', 'error'),
  })
  const remove = useMutation({
    mutationFn: (id: string) => deleteAdminRecord('hero_slides', id),
    onSuccess: () => { void queryClient.invalidateQueries({ queryKey }); setDeleting(null); notify('Custom academic slide deleted.') },
    onError: (error) => notify(error instanceof Error ? error.message : 'The slide could not be deleted.', 'error'),
  })
  const createCustom = () => setEditor({
    slide_kind: 'custom', default_key: null, scope: 'academics', title_en: '', title_ta: '', description_en: '', description_ta: '', image_url: '', status: 'draft', enabled: true,
  })

  return <section className="admin-module-page">
    <div className="admin-page-heading"><div><p>Academics</p><h1>Admission Carousel</h1><span>Built-in slides keep their existing buttons. New custom slides contain only a heading, supporting text and background image.</span></div><button className="admin-primary-button" onClick={createCustom}><Plus size={18} /> Add custom slide</button></div>
    <div className="academic-carousel-note"><LockKeyhole size={20} /><div><strong>Buttons are protected</strong><p>The three default slide buttons and destinations cannot be changed here. Custom slides never display a button.</p></div></div>
    {slidesQuery.isLoading ? <div className="admin-record-skeletons"><i /><i /><i /></div>
      : slidesQuery.isError ? <div className="admin-empty-state"><Presentation /><h2>Academic slides could not be loaded</h2><p>Apply the latest Supabase migration, then try again.</p><button className="admin-secondary-button" onClick={() => void slidesQuery.refetch()}>Try again</button></div>
      : slides.length === 0 ? <div className="admin-empty-state"><Presentation /><h2>No academic slides yet</h2><p>Apply the latest migration to install the three protected default slides.</p></div>
      : <div className="academic-slide-admin-grid">{slides.map((slide, index) => <article className="academic-slide-admin-card" key={String(slide.id)}>
        <div className="academic-slide-admin-card__visual">{slide.slide_kind === 'custom' && slide.image_url ? <img src={String(slide.image_url)} alt="" /> : <Presentation size={30} />}<span>{String(index + 1).padStart(2, '0')}</span></div>
        <div className="academic-slide-admin-card__body"><div><small className={slide.slide_kind === 'default' ? 'is-default' : 'is-custom'}>{slideType(slide)}</small><span className={`admin-status admin-status--${slide.status ?? 'draft'}`}>{statusLabel(slide.status)}</span></div><h2>{String(slide.title_en || 'Untitled slide')}</h2><p>{String(slide.description_en || 'No supporting text')}</p>{slide.slide_kind === 'default' && <em><LockKeyhole size={13} /> Fixed button: {fixedButton(slide)?.ctaLabel.en}</em>}</div>
        <footer><button type="button" onClick={() => setEditor({ ...slide })} aria-label="Edit slide"><Pencil size={17} /></button>{isOwner && slide.slide_kind === 'custom' && <button type="button" className="is-danger" onClick={() => setDeleting(slide)} aria-label="Delete custom slide"><Trash2 size={17} /></button>}</footer>
      </article>)}</div>}
    {editor && <AcademicSlideEditor initial={editor} owner={isOwner} saving={save.isPending} onClose={() => setEditor(null)} onSave={(record, status) => save.mutate({ record, status })} />}
    {isOwner && deleting?.id && <ConfirmDialog title="Delete this custom slide?" message="This removes the slide from the Academics carousel and cannot be undone." confirmLabel="Delete slide" busy={remove.isPending} onCancel={() => setDeleting(null)} onConfirm={() => remove.mutate(String(deleting.id))} />}
  </section>
}
