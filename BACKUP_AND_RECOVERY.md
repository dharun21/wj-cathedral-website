# Backup and recovery

Recommended: weekly database exports, monthly media exports, an extra backup before schema/content imports, three encrypted copies in a church-controlled location and quarterly restoration drills.

Supabase Free does not provide paid-tier backup, point-in-time recovery or availability guarantees. Git protects code/schema—not current rows or Storage objects.

## Export

Using official tooling with locally stored credentials:

```bash
supabase db dump --linked --data-only --use-copy -f backups/wj-data.sql
supabase db dump --linked --schema-only -f backups/wj-schema.sql
```

Keep exports outside Git or in an ignored encrypted location. Export every object from `church-media` and `church-drafts`, preserving bucket/path names and a manifest of path, size and date. Never place private drafts in public backup storage.

## Restore

1. Create a clean church-owned project.
2. Apply migrations in order.
3. Restore database data with PostgreSQL tooling matching the export.
4. Restore Storage objects to original bucket paths.
5. Recreate/invite Auth users through the authorized process, then review membership UUIDs.
6. Update public environment values.
7. Test public, non-admin and admin RLS before switching traffic.
8. Verify images, both languages, events, schedules and password recovery.

Passwords and service-role keys are never stored in application tables or these backups.
