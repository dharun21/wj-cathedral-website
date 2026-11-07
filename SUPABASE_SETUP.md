# Supabase setup

These steps require the project owner to create or select a Supabase project. No credentials are needed in chat and no external project was created during local development.

## Project and migrations

Create the project in a church-controlled organization, choose a nearby region, enable MFA and record billing/recovery ownership. Keep the database password in an approved password manager.

Using the official CLI:

```bash
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

Alternatively, run each file in `supabase/migrations` in filename order through SQL Editor. The seed uses stable IDs and `ON CONFLICT DO NOTHING`. Inspect the target before running either method.

Copy `.env.example` to `.env.local`:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_KEY
```

Never put a service-role or secret key in a `VITE_` variable.

## First administrator

There is intentionally no public registration.

1. Dashboard → Authentication → Users: invite/create the approved administrator.
2. Copy the Auth user UUID.
3. As the project owner, run:

```sql
insert into public.admin_memberships (user_id, role, display_name, email, is_active)
values ('AUTH_USER_UUID', 'owner', 'Approved administrator', 'OWNER_EMAIL', true);
```

The account is authorized only when both the Auth user and membership row exist. The CMS has exactly two roles:

- `owner` — full direct access, approval, publication, deletion, settings and media approval.
- `editor` — prepares drafts and submits them for owner approval.

Do not manually create ordinary editors. After the first owner signs in, use **Administration → Team & Access**. There is no general `admin` role.

## Owner-managed editor accounts

Apply migration `202611070022_owner_managed_editors.sql`, then deploy the trusted account-management function:

```bash
supabase functions deploy manage-editor
```

Supabase supplies `SUPABASE_URL`, `SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` to the deployed Edge Function. Never copy the service-role key into `.env.local`, a `VITE_` variable or browser code.

Test the complete flow before launch:

1. Sign in as the manually provisioned owner and create two editors.
2. Confirm each editor can sign in but sees editor-only draft and approval-submission actions.
3. Confirm creating or restoring a third active editor is rejected.
4. Remove one editor's access and confirm their CMS access and database policies stop immediately while their user remains listed.
5. Restore that editor while a place is available.
6. Permanently delete a disposable test editor and confirm the Auth user and membership are removed.

The browser calls the Edge Function with the owner's session. The function independently verifies an active owner membership, creates only `editor` accounts and keeps privileged Auth administration on the server.

Migration `202611070031_admin_membership_realtime.sql` adds only `admin_memberships` to the Realtime publication so the visible admin session reacts immediately to removal, restoration or deletion. RLS remains the authorization boundary, and the client also rechecks membership when the tab regains focus and every 60 seconds.

Migration `202611070032_content_review_history.sql` creates the editor submission ledger, owner decision history, 30-day visibility/cleanup rules and Realtime synchronization used by **Pending Approval** and **Attention Required**.

## Authentication settings

- Add local and eventual production `/#/admin/reset-password` redirect URLs.
- Set the production Site URL only after domain approval.
- Keep secure recovery enabled and configure project-owned SMTP if default email limits are insufficient.
- Test valid/invalid login, reset, expired session, logout and a signed-in non-member.

Seeded approved media/videos are published where approval was available. Unverified schedules, ministries, page claims and contact settings remain drafts. Review `CONTENT_CHECKLIST.md` before publishing.

Local SQL-text tests verify policy coverage but do not replace live RLS/Storage testing with anon, authenticated non-admin and admin sessions.

## Admission applications

Migration `202611070020_admission_applications.sql` creates the private admissions table and validated public submission function. After migrations and environment variables are configured:

1. Submit a test enquiry from the public Academics page.
2. Sign in as an `owner` and open **Administration → Admission Applications**.
3. Confirm the submission date/time, applicant details and consent record.
4. Confirm an `editor` account cannot see the navigation item or query the table.
5. Delete the test record and agree on a real applicant-data retention period before public launch.

Until Supabase is configured, online submission is disabled and the existing print/save option remains available.

## Daily verse activation

Migration `202611070021_daily_bible_verses.sql` creates the verse library, secure policies and daily-selection function. It deliberately seeds no Bible text. After applying migrations, sign in to the CMS, open **Homepage → Daily Bible Verses**, add church-approved bilingual verses and publish them. The former “You are not alone” database slide is archived automatically and the daily verse occupies the third carousel position.
