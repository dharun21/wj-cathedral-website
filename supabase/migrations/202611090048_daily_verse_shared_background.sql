begin;

alter table public.site_settings
  add column if not exists daily_verse_background_url text,
  add column if not exists daily_verse_background_media_id uuid references public.media_assets(id) on delete set null;

alter table public.site_settings
  drop constraint if exists site_settings_daily_verse_background_url_safe,
  add constraint site_settings_daily_verse_background_url_safe check (
    daily_verse_background_url is null
    or daily_verse_background_url ~ '^(https://|\./|/)'
  );

update public.site_settings
set daily_verse_background_url = './hero/daily-bible-verse.jpg'
where singleton_key = 'default' and daily_verse_background_url is null;

create or replace function public.media_reference_count(asset_id uuid)
returns integer
language sql
stable
security definer
set search_path = ''
as $$
  select
    (select count(*) from public.site_settings where logo_media_id = asset_id)::integer +
    (select count(*) from public.site_settings where daily_verse_background_media_id = asset_id)::integer +
    (select count(*) from public.hero_slides where image_media_id = asset_id)::integer +
    (select count(*) from public.gallery_images where media_asset_id = asset_id)::integer +
    (select count(*) from public.announcements where image_media_id = asset_id)::integer +
    (select count(*) from public.events where image_media_id = asset_id)::integer +
    (select count(*) from public.ministries where image_media_id = asset_id)::integer +
    (select count(*) from public.audio_tracks where media_asset_id = asset_id)::integer;
$$;

comment on column public.site_settings.daily_verse_background_url is
  'One owner-managed background image shared by every Daily Bible Verse carousel entry.';

commit;
