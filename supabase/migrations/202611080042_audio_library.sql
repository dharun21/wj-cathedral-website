-- Audio albums and tracks with the same owner/editor publishing workflow as
-- the rest of the CMS. Draft audio remains private until owner approval.
begin;

alter table public.media_assets drop constraint if exists media_assets_mime_type_check;
alter table public.media_assets drop constraint if exists media_assets_file_size_check;
alter table public.media_assets
  add constraint media_assets_mime_type_check check (
    mime_type in (
      'image/jpeg', 'image/png', 'image/webp', 'image/avif',
      'audio/mpeg', 'audio/mp3', 'audio/mp4', 'audio/x-m4a', 'audio/wav', 'audio/x-wav', 'audio/ogg'
    )
  ),
  add constraint media_assets_file_size_check check (file_size > 0 and file_size <= 52428800);

update storage.buckets
set file_size_limit = 52428800,
    allowed_mime_types = array[
      'image/jpeg', 'image/png', 'image/webp', 'image/avif',
      'audio/mpeg', 'audio/mp3', 'audio/mp4', 'audio/x-m4a', 'audio/wav', 'audio/x-wav', 'audio/ogg'
    ]
where id in ('church-drafts', 'church-media');

create table if not exists public.audio_albums (
  id uuid primary key default gen_random_uuid(),
  title_en text not null,
  title_ta text not null,
  description_en text not null default '',
  description_ta text not null default '',
  cover_image_url text,
  status public.content_status not null default 'draft',
  display_order integer not null default 0 check (display_order >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  updated_by uuid references auth.users(id) on delete set null
);

create table if not exists public.audio_tracks (
  id uuid primary key default gen_random_uuid(),
  album_id uuid not null references public.audio_albums(id) on delete restrict,
  media_asset_id uuid not null references public.media_assets(id) on delete restrict,
  title_en text not null,
  title_ta text not null,
  description_en text not null default '',
  description_ta text not null default '',
  duration_seconds integer check (duration_seconds is null or duration_seconds > 0),
  status public.content_status not null default 'draft',
  display_order integer not null default 0 check (display_order >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  updated_by uuid references auth.users(id) on delete set null
);

create index if not exists audio_albums_public_idx
  on public.audio_albums (status, display_order);
create index if not exists audio_tracks_public_idx
  on public.audio_tracks (album_id, status, display_order);

drop trigger if exists set_audio_albums_updated_at on public.audio_albums;
create trigger set_audio_albums_updated_at
before update on public.audio_albums
for each row execute function public.set_updated_at();

drop trigger if exists set_audio_tracks_updated_at on public.audio_tracks;
create trigger set_audio_tracks_updated_at
before update on public.audio_tracks
for each row execute function public.set_updated_at();

alter table public.audio_albums enable row level security;
alter table public.audio_tracks enable row level security;

grant select on public.audio_albums, public.audio_tracks to anon, authenticated;
grant insert, update, delete on public.audio_albums, public.audio_tracks to authenticated;

create policy "published audio albums are public" on public.audio_albums
for select to anon, authenticated using (status = 'published');
create policy "published audio tracks are public" on public.audio_tracks
for select to anon, authenticated using (status = 'published');

create policy "owners select audio albums" on public.audio_albums
for select to authenticated using (public.is_owner());
create policy "owners insert audio albums" on public.audio_albums
for insert to authenticated with check (public.is_owner());
create policy "owners update audio albums" on public.audio_albums
for update to authenticated using (public.is_owner()) with check (public.is_owner());
create policy "owners delete audio albums" on public.audio_albums
for delete to authenticated using (public.is_owner());

create policy "owners select audio tracks" on public.audio_tracks
for select to authenticated using (public.is_owner());
create policy "owners insert audio tracks" on public.audio_tracks
for insert to authenticated with check (public.is_owner());
create policy "owners update audio tracks" on public.audio_tracks
for update to authenticated using (public.is_owner()) with check (public.is_owner());
create policy "owners delete audio tracks" on public.audio_tracks
for delete to authenticated using (public.is_owner());

create policy "editors select audio albums" on public.audio_albums
for select to authenticated using (public.is_editor());
create policy "editors insert draft audio albums" on public.audio_albums
for insert to authenticated with check (public.is_editor() and status in ('draft', 'pending_review'));
create policy "editors update draft audio albums" on public.audio_albums
for update to authenticated using (public.is_editor() and status = 'draft')
with check (public.is_editor() and status in ('draft', 'pending_review'));

create policy "editors select audio tracks" on public.audio_tracks
for select to authenticated using (public.is_editor());
create policy "editors insert draft audio tracks" on public.audio_tracks
for insert to authenticated with check (public.is_editor() and status in ('draft', 'pending_review'));
create policy "editors update draft audio tracks" on public.audio_tracks
for update to authenticated using (public.is_editor() and status = 'draft')
with check (public.is_editor() and status in ('draft', 'pending_review'));

alter table public.content_review_requests
  drop constraint if exists content_review_requests_table_name_check;
alter table public.content_review_requests
  add constraint content_review_requests_table_name_check check (table_name in (
    'page_content', 'hero_slides', 'gallery_albums', 'gallery_images',
    'announcements', 'events', 'videos', 'worship_services', 'ministries',
    'daily_bible_verses', 'media_assets', 'audio_albums', 'audio_tracks'
  ));

drop trigger if exists track_content_review_request on public.audio_albums;
create trigger track_content_review_request
after insert or update or delete on public.audio_albums
for each row execute function public.track_content_review_request();

drop trigger if exists track_content_review_request on public.audio_tracks;
create trigger track_content_review_request
after insert or update or delete on public.audio_tracks
for each row execute function public.track_content_review_request();

create or replace function public.media_reference_count(asset_id uuid)
returns integer
language sql
stable
security definer
set search_path = ''
as $$
  select
    (select count(*) from public.site_settings where logo_media_id = asset_id)::integer +
    (select count(*) from public.hero_slides where image_media_id = asset_id)::integer +
    (select count(*) from public.gallery_images where media_asset_id = asset_id)::integer +
    (select count(*) from public.announcements where image_media_id = asset_id)::integer +
    (select count(*) from public.events where image_media_id = asset_id)::integer +
    (select count(*) from public.ministries where image_media_id = asset_id)::integer +
    (select count(*) from public.audio_tracks where media_asset_id = asset_id)::integer;
$$;

commit;
