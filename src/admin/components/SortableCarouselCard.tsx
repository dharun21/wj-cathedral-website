import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'
import { GripVertical, LockKeyhole, Pencil, Presentation, Trash2 } from 'lucide-react'
import type { HeroSlideRow } from '../../types/database'

type SlideRecord = Partial<HeroSlideRow> & Record<string, unknown>

function statusLabel(status: unknown) {
  return status === 'published' ? 'Published' : status === 'pending_review' ? 'Pending approval' : status === 'archived' ? 'Archived' : 'Draft'
}

export function SortableCarouselCard({ slide, index, builtIn, fixedButton, owner, onEdit, onDelete }: { slide: SlideRecord; index: number; builtIn: boolean; fixedButton?: string | undefined; owner: boolean; onEdit: () => void; onDelete: () => void }) {
  const sortable = useSortable({ id: String(slide.id), disabled: !owner })
  const style = { transform: CSS.Transform.toString(sortable.transform), transition: sortable.transition }
  return <article ref={sortable.setNodeRef} style={style} className="academic-slide-admin-card">
    <div className="academic-slide-admin-card__visual">
      {slide.image_url ? <img src={String(slide.image_url)} alt="" /> : <Presentation size={30} />}
      <span>{String(index + 1).padStart(2, '0')}</span>
      {/* oxlint-disable-next-line react/refs -- dnd-kit exposes listener props through its sortable hook. */}
      {owner && <button type="button" className="admin-drag-handle" {...sortable.attributes} {...sortable.listeners} aria-label="Drag to change slide order"><GripVertical size={18} /></button>}
    </div>
    <div className="academic-slide-admin-card__body"><div><small className={builtIn ? 'is-default' : 'is-custom'}>{builtIn ? 'Default slide' : 'Custom slide'}</small><span className={`admin-status admin-status--${slide.status ?? 'draft'}`}>{statusLabel(slide.status)}</span></div><h2>{String(slide.title_en || 'Untitled slide')}</h2><p>{String(slide.description_en || 'No supporting text')}</p>{builtIn && <em><LockKeyhole size={13} /> Fixed button: {fixedButton || 'Protected'}</em>}</div>
    <footer><button type="button" onClick={onEdit} aria-label="Edit slide"><Pencil size={17} /></button>{owner && !builtIn && <button type="button" className="is-danger" onClick={onDelete} aria-label="Delete custom slide"><Trash2 size={17} /></button>}</footer>
  </article>
}
