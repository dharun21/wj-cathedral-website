# Database and security design

| Table | Purpose |
|---|---|
| `admin_memberships` | Explicit administrator authorization; passwords remain in Supabase Auth |
| `site_settings` | Public identity/contact singleton and prayer availability confirmation |
| `page_content` | Bilingual copy keyed by page and translation key |
| `hero_slides` | Ordered Home, Academics and Community Care slides |
| `media_assets` | Storage metadata, approval, dimensions and bilingual alt text |
| `gallery_albums`, `gallery_images` | Ordered albums and reusable images |
| `announcements`, `events`, `videos` | Timed notices, events and official YouTube records |
| `worship_services` | Verified active schedules |
| `ministries` | Church, Community Care, Academics and homepage programme content |

All content uses UUIDs, timestamps, constraints, indexes, display order and publication state where applicable. Bilingual values are explicit columns.

Authorization comes from `admin_memberships` and `auth.uid()`. Exactly two roles exist. Owners have full content and approval access. Editors can create/update drafts and move them to `pending_review`; they cannot publish, approve, archive, delete, change settings or approve media. Submitted records become read-only for editors until the owner acts. PostgreSQL RLS enforces these rules even when someone bypasses the interface.

The first owner is provisioned manually. An active owner can use the `manage-editor` Edge Function to create only editor accounts. Removing access sets `admin_memberships.is_active` to false, so the Auth identity remains but all membership-based RLS checks fail. Restoring reactivates the same identity. Permanent deletion uses Supabase Auth administration and cascades to the membership row. A transaction-level advisory lock and database trigger enforce a maximum of two active editors, independent of the browser UI.

Storage uses private `church-drafts` and publicly readable approved `church-media`. Editors may upload private drafts under their own user path. Only owners can approve, move, update or delete media. MIME and 8 MB restrictions exist in the client and bucket configuration. `media_reference_count()` prevents accidental deletion of referenced media.

When Supabase is absent, reviewed `src/data` modules support local development. When configured, public hooks read published database content. Required bilingual fields block publication when incomplete; no automatic translation service is used.
# Private admission applications

`admission_applications` stores personal information submitted through the Academics admission form. It is intentionally separate from public CMS content. Public users have no table read or insert policy; submissions go through the validated `submit_admission_application` RPC. Only memberships with the `owner` role can select, update or delete rows. Editors have no access.

The admin panel displays `submitted_at` and `consent_at` in `Asia/Kolkata`, while PostgreSQL stores timestamps as UTC `timestamptz` values.

# Daily Bible verse rotation

`daily_bible_verses` stores church-approved bilingual Scripture excerpts, references, translation attribution, optional approved background images and optional special display dates. Public users can read only active published records.

The public `get_daily_bible_verse(date)` function first returns a published verse scheduled for that date. When there is no override, it deterministically selects one unscheduled published verse using the India calendar date and the configured display order. Scripture text is not seeded or embedded in React source code.

