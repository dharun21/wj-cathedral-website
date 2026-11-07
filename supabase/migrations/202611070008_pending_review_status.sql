-- This migration is intentionally isolated because PostgreSQL requires a newly
-- added enum value to be committed before later migrations reference it.
alter type public.content_status add value if not exists 'pending_review' after 'draft';

update public.admin_memberships set role = 'editor' where role = 'admin';

alter table public.admin_memberships drop constraint if exists admin_memberships_role_check;
alter table public.admin_memberships alter column role set default 'editor';
alter table public.admin_memberships
  add constraint admin_memberships_role_check check (role in ('owner', 'editor'));
