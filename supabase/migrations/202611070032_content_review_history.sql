begin;

create table if not exists public.content_review_requests (
  id uuid primary key default gen_random_uuid(),
  table_name text not null check (table_name in (
    'page_content', 'hero_slides', 'gallery_albums', 'gallery_images',
    'announcements', 'events', 'videos', 'worship_services', 'ministries',
    'daily_bible_verses', 'media_assets'
  )),
  record_id uuid not null,
  title_snapshot text not null,
  submitted_by uuid references auth.users(id) on delete set null,
  submitted_by_name text not null,
  submitted_by_email text not null,
  submitted_at timestamptz not null default timezone('utc', now()),
  resolution text not null default 'pending' check (resolution in ('pending', 'approved', 'returned', 'rejected')),
  resolved_at timestamptz,
  resolved_by uuid references auth.users(id) on delete set null,
  check (
    (resolution = 'pending' and resolved_at is null)
    or (resolution <> 'pending' and resolved_at is not null)
  )
);

create unique index if not exists content_review_requests_one_pending_idx
  on public.content_review_requests (table_name, record_id)
  where resolution = 'pending';
create index if not exists content_review_requests_submitter_idx
  on public.content_review_requests (submitted_by, submitted_at desc);
create index if not exists content_review_requests_resolution_idx
  on public.content_review_requests (resolution, resolved_at desc);

alter table public.content_review_requests enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'content_review_requests'
  ) then
    alter publication supabase_realtime add table public.content_review_requests;
  end if;
end
$$;

revoke all on table public.content_review_requests from anon, authenticated;
grant select on table public.content_review_requests to authenticated;

drop policy if exists "owners read review activity" on public.content_review_requests;
create policy "owners read review activity" on public.content_review_requests
for select to authenticated using (
  public.is_owner()
  and (resolution = 'pending' or resolved_at >= timezone('utc', now()) - interval '30 days')
);

drop policy if exists "editors read own review activity" on public.content_review_requests;
create policy "editors read own review activity" on public.content_review_requests
for select to authenticated using (
  public.is_editor()
  and submitted_by = auth.uid()
  and (resolution = 'pending' or resolved_at >= timezone('utc', now()) - interval '30 days')
);

create or replace function public.track_content_review_request()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_payload jsonb;
  old_payload jsonb;
  new_status text;
  old_status text;
  pending_status text;
  resolved_status text;
  item_title text;
  member_role text;
  member_name text;
  member_email text;
begin
  -- Visibility is limited to 30 days by RLS. Opportunistic cleanup keeps the
  -- physical history table bounded without requiring a paid scheduler.
  delete from public.content_review_requests
  where resolution <> 'pending'
    and resolved_at < timezone('utc', now()) - interval '30 days';

  if tg_op <> 'DELETE' then
    new_payload := to_jsonb(new);
    new_status := case when tg_table_name = 'media_assets'
      then new_payload ->> 'approval_status'
      else new_payload ->> 'status'
    end;
  end if;

  if tg_op <> 'INSERT' then
    old_payload := to_jsonb(old);
    old_status := case when tg_table_name = 'media_assets'
      then old_payload ->> 'approval_status'
      else old_payload ->> 'status'
    end;
  end if;

  pending_status := case when tg_table_name = 'media_assets' then 'pending' else 'pending_review' end;

  if tg_op <> 'DELETE'
    and new_status = pending_status
    and (tg_op = 'INSERT' or old_status is distinct from pending_status)
  then
    select membership.role, coalesce(membership.display_name, 'Editor'), coalesce(membership.email, '')
      into member_role, member_name, member_email
    from public.admin_memberships membership
    where membership.user_id = auth.uid()
      and membership.is_active = true;

    if member_role = 'editor' then
      item_title := coalesce(
        new_payload ->> 'title_en',
        new_payload ->> 'name_en',
        new_payload ->> 'caption_en',
        new_payload ->> 'content_en',
        new_payload ->> 'verse_en',
        new_payload ->> 'original_name',
        'Untitled submission'
      );

      insert into public.content_review_requests (
        table_name, record_id, title_snapshot, submitted_by,
        submitted_by_name, submitted_by_email
      ) values (
        tg_table_name, (new_payload ->> 'id')::uuid, item_title, auth.uid(),
        member_name, member_email
      )
      on conflict (table_name, record_id) where resolution = 'pending'
      do update set
        title_snapshot = excluded.title_snapshot,
        submitted_by = excluded.submitted_by,
        submitted_by_name = excluded.submitted_by_name,
        submitted_by_email = excluded.submitted_by_email,
        submitted_at = timezone('utc', now());
    end if;
  end if;

  if tg_op = 'DELETE' and old_status = pending_status then
    update public.content_review_requests
    set resolution = 'rejected', resolved_at = timezone('utc', now()), resolved_by = auth.uid()
    where table_name = tg_table_name
      and record_id = (old_payload ->> 'id')::uuid
      and resolution = 'pending';
    return old;
  end if;

  if tg_op = 'UPDATE'
    and old_status = pending_status
    and new_status is distinct from pending_status
  then
    resolved_status := case
      when new_status in ('published', 'approved') then 'approved'
      when new_status = 'draft' then 'returned'
      else 'rejected'
    end;
    update public.content_review_requests
    set resolution = resolved_status, resolved_at = timezone('utc', now()), resolved_by = auth.uid()
    where table_name = tg_table_name
      and record_id = (new_payload ->> 'id')::uuid
      and resolution = 'pending';
  end if;

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

revoke all on function public.track_content_review_request() from public;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'page_content', 'hero_slides', 'gallery_albums', 'gallery_images',
    'announcements', 'events', 'videos', 'worship_services', 'ministries',
    'daily_bible_verses', 'media_assets'
  ]
  loop
    execute format('drop trigger if exists track_content_review_request on public.%I', table_name);
    execute format(
      'create trigger track_content_review_request after insert or update or delete on public.%I for each row execute function public.track_content_review_request()',
      table_name
    );
  end loop;
end
$$;

commit;
