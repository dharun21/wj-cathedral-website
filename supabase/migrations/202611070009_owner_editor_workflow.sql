begin;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_memberships
    where user_id = auth.uid() and role in ('owner', 'editor')
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
    where user_id = auth.uid() and role = 'owner'
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
    where user_id = auth.uid() and role = 'editor'
  );
$$;

revoke all on function public.is_owner() from public;
revoke all on function public.is_editor() from public;
grant execute on function public.is_owner() to authenticated;
grant execute on function public.is_editor() to authenticated;

do $$
declare table_name text;
begin
  foreach table_name in array array['site_settings','page_content','media_assets','hero_slides','gallery_albums','gallery_images','announcements','events','videos','worship_services','ministries']
  loop
    execute format('drop policy if exists "admins select %1$s" on public.%1$I', table_name);
    execute format('drop policy if exists "admins insert %1$s" on public.%1$I', table_name);
    execute format('drop policy if exists "admins update %1$s" on public.%1$I', table_name);
    execute format('drop policy if exists "admins delete %1$s" on public.%1$I', table_name);

    execute format('create policy "owners select %1$s" on public.%1$I for select to authenticated using (public.is_owner())', table_name);
    execute format('create policy "owners insert %1$s" on public.%1$I for insert to authenticated with check (public.is_owner())', table_name);
    execute format('create policy "owners update %1$s" on public.%1$I for update to authenticated using (public.is_owner()) with check (public.is_owner())', table_name);
    execute format('create policy "owners delete %1$s" on public.%1$I for delete to authenticated using (public.is_owner())', table_name);
  end loop;
end $$;

-- Editors can inspect content required for their work, but cannot alter the
-- singleton site settings or approved media.
do $$
declare table_name text;
begin
  foreach table_name in array array['page_content','hero_slides','gallery_albums','gallery_images','announcements','events','videos','worship_services','ministries']
  loop
    execute format('create policy "editors select %1$s" on public.%1$I for select to authenticated using (public.is_editor())', table_name);
    execute format('create policy "editors insert draft %1$s" on public.%1$I for insert to authenticated with check (public.is_editor() and status in (''draft'', ''pending_review''))', table_name);
    execute format('create policy "editors update draft %1$s" on public.%1$I for update to authenticated using (public.is_editor() and status = ''draft'') with check (public.is_editor() and status in (''draft'', ''pending_review''))', table_name);
  end loop;
end $$;

create policy "editors select media" on public.media_assets
for select to authenticated using (public.is_editor());

create policy "editors insert pending media" on public.media_assets
for insert to authenticated with check (
  public.is_editor()
  and approval_status = 'pending'
  and storage_bucket = 'church-drafts'
  and created_by = auth.uid()
);

create policy "editors update own pending media" on public.media_assets
for update to authenticated using (
  public.is_editor() and created_by = auth.uid() and approval_status = 'pending'
) with check (
  public.is_editor()
  and created_by = auth.uid()
  and approval_status = 'pending'
  and storage_bucket = 'church-drafts'
);

-- Replace Storage policies with role-aware rules.
drop policy if exists "admins can view draft media" on storage.objects;
drop policy if exists "admins can upload church media" on storage.objects;
drop policy if exists "admins can update church media" on storage.objects;
drop policy if exists "admins can delete church media" on storage.objects;

create policy "cms members view draft media" on storage.objects
for select to authenticated using (bucket_id = 'church-drafts' and public.is_admin());

create policy "owners manage church media inserts" on storage.objects
for insert to authenticated with check (
  bucket_id in ('church-drafts','church-media') and public.is_owner()
);

create policy "editors upload own drafts" on storage.objects
for insert to authenticated with check (
  bucket_id = 'church-drafts'
  and public.is_editor()
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "owners update church media" on storage.objects
for update to authenticated using (bucket_id in ('church-drafts','church-media') and public.is_owner())
with check (bucket_id in ('church-drafts','church-media') and public.is_owner());

create policy "owners delete church media" on storage.objects
for delete to authenticated using (bucket_id in ('church-drafts','church-media') and public.is_owner());

commit;
