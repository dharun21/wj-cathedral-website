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

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;
revoke all on function public.media_reference_count(uuid) from public;
grant execute on function public.media_reference_count(uuid) to authenticated;

alter table public.admin_memberships enable row level security;
alter table public.site_settings enable row level security;
alter table public.page_content enable row level security;
alter table public.media_assets enable row level security;
alter table public.hero_slides enable row level security;
alter table public.gallery_albums enable row level security;
alter table public.gallery_images enable row level security;
alter table public.announcements enable row level security;
alter table public.events enable row level security;
alter table public.videos enable row level security;
alter table public.worship_services enable row level security;
alter table public.ministries enable row level security;

create policy "members can read own membership" on public.admin_memberships
for select to authenticated using (user_id = auth.uid());

create policy "published settings are public" on public.site_settings
for select to anon, authenticated using (status = 'published');
create policy "published page content is public" on public.page_content
for select to anon, authenticated using (status = 'published');
create policy "approved media metadata is public" on public.media_assets
for select to anon, authenticated using (approval_status = 'approved' and storage_bucket = 'church-media');
create policy "published active slides are public" on public.hero_slides
for select to anon, authenticated using (status = 'published' and enabled = true);
create policy "published albums are public" on public.gallery_albums
for select to anon, authenticated using (status = 'published');
create policy "published gallery images are public" on public.gallery_images
for select to anon, authenticated using (status = 'published');
create policy "active announcements are public" on public.announcements
for select to anon, authenticated using (
  status = 'published'
  and (publish_at is null or publish_at <= now())
  and (expires_at is null or expires_at > now())
);
create policy "published events are public" on public.events
for select to anon, authenticated using (status = 'published');
create policy "published videos are public" on public.videos
for select to anon, authenticated using (status = 'published');
create policy "verified services are public" on public.worship_services
for select to anon, authenticated using (status = 'published' and verified = true and active = true);
create policy "published ministries are public" on public.ministries
for select to anon, authenticated using (status = 'published');

do $$
declare table_name text;
begin
  foreach table_name in array array['site_settings','page_content','media_assets','hero_slides','gallery_albums','gallery_images','announcements','events','videos','worship_services','ministries']
  loop
    execute format('create policy "admins select %1$s" on public.%1$I for select to authenticated using (public.is_admin())', table_name);
    execute format('create policy "admins insert %1$s" on public.%1$I for insert to authenticated with check (public.is_admin())', table_name);
    execute format('create policy "admins update %1$s" on public.%1$I for update to authenticated using (public.is_admin()) with check (public.is_admin())', table_name);
    execute format('create policy "admins delete %1$s" on public.%1$I for delete to authenticated using (public.is_admin())', table_name);
  end loop;
end $$;

commit;
