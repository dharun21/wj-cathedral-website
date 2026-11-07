import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const migrationPath = fileURLToPath(new URL('./202611070002_rls.sql', import.meta.url))
const sql = readFileSync(migrationPath, 'utf8').toLowerCase()
const workflowPath = fileURLToPath(new URL('./202611070009_owner_editor_workflow.sql', import.meta.url))
const workflowSql = readFileSync(workflowPath, 'utf8').toLowerCase()
const admissionsPath = fileURLToPath(new URL('./202611070020_admission_applications.sql', import.meta.url))
const admissionsSql = readFileSync(admissionsPath, 'utf8').toLowerCase()
const dailyVersePath = fileURLToPath(new URL('./202611070021_daily_bible_verses.sql', import.meta.url))
const dailyVerseSql = readFileSync(dailyVersePath, 'utf8').toLowerCase()
const editorAccessPath = fileURLToPath(new URL('./202611070022_owner_managed_editors.sql', import.meta.url))
const editorAccessSql = readFileSync(editorAccessPath, 'utf8').toLowerCase()
const editorFunctionPath = fileURLToPath(new URL('../functions/manage-editor/index.ts', import.meta.url))
const editorFunction = readFileSync(editorFunctionPath, 'utf8')
const exposedTables = ['admin_memberships', 'site_settings', 'page_content', 'media_assets', 'hero_slides', 'gallery_albums', 'gallery_images', 'announcements', 'events', 'videos', 'worship_services', 'ministries']

describe('RLS migration safeguards', () => {
  it.each(exposedTables)('enables RLS for %s', (table) => {
    expect(sql).toContain(`alter table public.${table} enable row level security`)
  })

  it('uses database membership for administrator authorization', () => {
    expect(sql).toContain('from public.admin_memberships')
    expect(sql).toContain('auth.uid()')
    expect(sql).toContain('public.is_admin()')
  })

  it('restricts public content to published records', () => {
    expect(sql.match(/status = 'published'/g)?.length ?? 0).toBeGreaterThanOrEqual(9)
  })

  it('separates owner approval from editor draft access', () => {
    expect(workflowSql).toContain("role = 'owner'")
    expect(workflowSql).toContain("role = 'editor'")
    expect(workflowSql).toContain("status in (''draft'', ''pending_review'')")
    expect(workflowSql).toContain('owners delete')
    expect(workflowSql).not.toContain("role = 'admin'")
  })

  it('keeps admission applications private to owners', () => {
    expect(admissionsSql).toContain('alter table public.admission_applications enable row level security')
    expect(admissionsSql).toContain('owners read admission applications')
    expect(admissionsSql).toContain('using (public.is_owner())')
    expect(admissionsSql).not.toContain('public read admission applications')
    expect(admissionsSql).not.toContain('editors read admission applications')
  })

  it('accepts public admission submissions only through the validated RPC', () => {
    expect(admissionsSql).toContain('security definer')
    expect(admissionsSql).toContain('grant execute on function public.submit_admission_application')
    expect(admissionsSql).not.toContain('for insert to anon')
    expect(admissionsSql).toContain('consent is required')
  })

  it('publishes only approved active daily verses while preserving editor review', () => {
    expect(dailyVerseSql).toContain('alter table public.daily_bible_verses enable row level security')
    expect(dailyVerseSql).toContain("status = 'published' and active = true")
    expect(dailyVerseSql).toContain('editors insert draft daily verses')
    expect(dailyVerseSql).toContain("status in ('draft','pending_review')")
  })

  it('uses scheduled overrides before deterministic automatic rotation', () => {
    expect(dailyVerseSql).toContain('verse.scheduled_date = p_date')
    expect(dailyVerseSql).toContain('if found then return')
    expect(dailyVerseSql).toContain("p_date - date '2026-01-01'")
    expect(dailyVerseSql).not.toContain('insert into public.daily_bible_verses')
  })

  it('enforces active membership and a database-level two-editor limit', () => {
    expect(editorAccessSql).toContain('is_active = true')
    expect(editorAccessSql).toContain('create trigger enforce_active_editor_limit')
    expect(editorAccessSql).toContain('pg_advisory_xact_lock')
    expect(editorAccessSql).toContain('active_editor_count >= 2')
    expect(editorAccessSql).toContain('owners read memberships')
  })

  it('keeps privileged editor account management in an owner-authorized Edge Function', () => {
    expect(editorFunction).toContain("Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')")
    expect(editorFunction).toContain(".eq('role', 'owner')")
    expect(editorFunction).toContain(".eq('is_active', true)")
    expect(editorFunction).toContain('serviceClient.auth.admin.createUser')
    expect(editorFunction).toContain('serviceClient.auth.admin.deleteUser')
    expect(editorFunction).toContain("role: 'editor'")
    expect(editorFunction).not.toContain('VITE_SUPABASE_SERVICE_ROLE_KEY')
  })
})
