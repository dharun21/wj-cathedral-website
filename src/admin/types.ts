import type { CmsTableName, ContentStatus } from '../types/database'

export type AdminRecord = Record<string, unknown> & {
  id?: string
  status?: ContentStatus
  title_en?: string
  title_ta?: string
  display_order?: number
  updated_at?: string
  created_at?: string
}

export type AdminFieldType = 'text' | 'textarea' | 'url' | 'number' | 'boolean' | 'select' | 'datetime' | 'date' | 'time'

export interface AdminField {
  name: string
  label: string
  tamilLabel?: string
  type: AdminFieldType
  placeholder?: string
  requiredForPublish?: boolean
  options?: readonly { value: string; label: string }[]
  help?: string
  fullWidth?: boolean
}

export interface AdminModuleDefinition {
  key: string
  title: string
  singular: string
  description: string
  table: CmsTableName
  orderBy: string
  orderable?: boolean
  filters?: Readonly<Record<string, string>>
  excludeFilters?: Readonly<Record<string, string>>
  allowCreate?: boolean
  allowDelete?: boolean
  presentation?: 'list' | 'photo-grid'
  albumScope?: 'gallery' | 'academics'
  fields: readonly AdminField[]
  titleField: string
  subtitleField?: string
  defaults: AdminRecord
  beforeSave?: (record: AdminRecord) => AdminRecord
}
