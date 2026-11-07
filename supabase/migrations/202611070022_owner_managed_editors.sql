-- Owner-managed editor access. The first owner is still provisioned manually.
-- A database trigger enforces at most two active editor memberships.

begin;

alter table public.admin_memberships
  add column if not exists email text,
  add column if not exists is_active boolean not null default true,
  add column if not exists revoked_at timestamptz,
  add column if not exists revoked_by uuid references auth.users(id) on delete set null;

create unique index if not exists admin_memberships_email_idx
  on public.admin_memberships (lower(email))
  where email is not null;
create index if not exists admin_memberships_active_role_idx
  on public.admin_memberships (role, is_active);

create or replace function public.enforce_active_editor_limit()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  active_editor_count integer;
begin
  if new.role = 'editor' and new.is_active = true then
    perform pg_advisory_xact_lock(hashtext('wj-cathedral-active-editor-limit'));
    select count(*) into active_editor_count
    from public.admin_memberships membership
    where membership.role = 'editor'
      and membership.is_active = true
      and membership.user_id <> new.user_id;
    if active_editor_count >= 2 then
      raise exception 'Only two editors can have active access at the same time.';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists enforce_active_editor_limit on public.admin_memberships;
create trigger enforce_active_editor_limit
before insert or update on public.admin_memberships
for each row execute function public.enforce_active_editor_limit();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_memberships
    where user_id = auth.uid() and is_active = true and role in ('owner', 'editor')
  );
$$;

create or replace function public.is_owner()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_memberships
    where user_id = auth.uid() and is_active = true and role = 'owner'
  );
$$;

create or replace function public.is_editor()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_memberships
    where user_id = auth.uid() and is_active = true and role = 'editor'
  );
$$;

drop policy if exists "owners read memberships" on public.admin_memberships;
create policy "owners read memberships" on public.admin_memberships
for select to authenticated using (public.is_owner());

comment on column public.admin_memberships.is_active is
  'False revokes CMS authorization while retaining the Auth user and membership record.';

commit;
