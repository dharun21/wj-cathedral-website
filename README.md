# WJ Cathedral website and CMS

A bilingual React website and Supabase-backed content management system for Worship to Jesus Cathedral, Nannilam. The public design remains available with local fallback content; once Supabase is configured, published database records become the source of truth and ordinary content updates require no code change or redeployment.

## Local development

Requirements: Node.js 20+ and npm.

```bash
npm install
copy .env.example .env.local
npm run dev
```

Public website: `http://localhost:5173/`  
Admin panel: `http://localhost:5173/#/admin`

Before adding Supabase values, the public site deliberately uses approved local fallback content and the admin route displays a setup screen.

## Quality commands

```bash
npm run typecheck
npm run lint
npm run test
npm run build
npm run preview
```

## Architecture

- React 19, Vite 8 and strict TypeScript
- Existing CSS/Tailwind design system, Motion, Embla and Lucide
- Supabase PostgreSQL, Auth, Data API and Storage
- TanStack Query, React Hook Form and Zod
- Hash routes with route-level lazy loading, including a separate admin bundle
- SQL migrations in `supabase/migrations`
- Typed public services in `src/services` and hooks in `src/hooks`

Static files in `src/data` are retained as reviewed local fallbacks. Database content overrides them only when Supabase is configured and records are published. Draft content is never returned by public RLS policies.

## Documentation

- [SUPABASE_SETUP.md](SUPABASE_SETUP.md) — project creation, migrations and first administrator
- [ADMIN_GUIDE.md](ADMIN_GUIDE.md) — publishing workflow
- [DATABASE.md](DATABASE.md) — schema, security and content-source policy
- [BACKUP_AND_RECOVERY.md](BACKUP_AND_RECOVERY.md) — database/media export and restoration
- [OPERATIONS.md](OPERATIONS.md) — costs, service limits and upgrade thresholds
- [CONTENT_CHECKLIST.md](CONTENT_CHECKLIST.md) — remaining church approvals
- [DEPLOYMENT.md](DEPLOYMENT.md) — future deployment checklist

## Security boundary

Only `VITE_SUPABASE_URL` and the public anon key belong in the browser environment. Never add a service-role key, administrator password or database password to this repository. Administrator authority comes from protected `admin_memberships` rows and PostgreSQL RLS—not hidden UI controls or user-editable metadata.
