begin;

create extension if not exists pgcrypto;

do $$ begin
  create type public.content_status as enum ('draft', 'pending_review', 'published', 'archived');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.approval_status as enum ('pending', 'approved', 'rejected');
exception when duplicate_object then null;
end $$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.admin_memberships (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'editor' check (role in ('owner', 'editor')),
  display_name text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  storage_bucket text not null check (storage_bucket in ('church-drafts', 'church-media')),
  storage_path text not null,
  public_url text,
  original_name text not null,
  mime_type text not null check (mime_type in ('image/jpeg', 'image/png', 'image/webp', 'image/avif')),
  file_size bigint not null check (file_size > 0 and file_size <= 8388608),
  width integer check (width is null or width > 0),
  height integer check (height is null or height > 0),
  alt_en text not null default '',
  alt_ta text not null default '',
  approval_status public.approval_status not null default 'pending',
  created_at timestamptz not null default timezone('utc', now()),
  created_by uuid references auth.users(id) on delete set null,
  unique (storage_bucket, storage_path),
  check ((approval_status = 'approved' and storage_bucket = 'church-media' and public_url is not null) or approval_status <> 'approved')
);

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  singleton_key text not null default 'default' unique check (singleton_key = 'default'),
  display_name text not null,
  short_name text not null,
  logo_media_id uuid references public.media_assets(id) on delete set null,
  phone text,
  public_email text,
  address_en text,
  address_ta text,
  maps_url text,
  instagram_url text,
  facebook_url text,
  youtube_url text,
  footer_en text,
  footer_ta text,
  status public.content_status not null default 'draft',
  updated_at timestamptz not null default timezone('utc', now()),
  updated_by uuid references auth.users(id) on delete set null,
  check (maps_url is null or maps_url ~ '^https://'),
  check (instagram_url is null or instagram_url ~ '^https://'),
  check (facebook_url is null or facebook_url ~ '^https://'),
  check (youtube_url is null or youtube_url ~ '^https://')
);

create table if not exists public.page_content (
  id uuid primary key default gen_random_uuid(),
  page_key text not null,
  content_key text not null,
  content_en text not null,
  content_ta text not null,
  metadata jsonb not null default '{}'::jsonb,
  status public.content_status not null default 'draft',
  display_order integer not null default 0 check (display_order >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  updated_by uuid references auth.users(id) on delete set null,
  unique (page_key, content_key)
);

create table if not exists public.hero_slides (
  id uuid primary key default gen_random_uuid(),
  scope text not null check (scope in ('home', 'academics', 'community')),
  eyebrow_en text not null,
  eyebrow_ta text not null,
  title_en text not null,
  title_ta text not null,
  description_en text not null,
  description_ta text not null,
  image_media_id uuid references public.media_assets(id) on delete restrict,
  image_url text,
  image_alt_en text not null,
  image_alt_ta text not null,
  cta_label_en text not null,
  cta_label_ta text not null,
  cta_href text not null check (cta_href ~ '^#[a-zA-Z0-9/_-]+$'),
  secondary_cta_label_en text,
  secondary_cta_label_ta text,
  secondary_cta_href text check (secondary_cta_href is null or secondary_cta_href ~ '^#[a-zA-Z0-9/_-]+$'),
  enabled boolean not null default true,
  status public.content_status not null default 'draft',
  display_order integer not null default 0 check (display_order >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  updated_by uuid references auth.users(id) on delete set null
);

create table if not exists public.gallery_albums (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  title_en text not null,
  title_ta text not null,
  description_en text,
  description_ta text,
  status public.content_status not null default 'draft',
  display_order integer not null default 0 check (display_order >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  album_id uuid not null references public.gallery_albums(id) on delete restrict,
  media_asset_id uuid references public.media_assets(id) on delete restrict,
  image_url text,
  caption_en text not null default '',
  caption_ta text not null default '',
  alt_en text not null,
  alt_ta text not null,
  featured boolean not null default false,
  status public.content_status not null default 'draft',
  display_order integer not null default 0 check (display_order >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  updated_by uuid references auth.users(id) on delete set null,
  check (media_asset_id is not null or image_url is not null)
);

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title_en text not null,
  title_ta text not null,
  description_en text not null,
  description_ta text not null,
  image_media_id uuid references public.media_assets(id) on delete restrict,
  publish_at timestamptz,
  expires_at timestamptz,
  featured boolean not null default false,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  updated_by uuid references auth.users(id) on delete set null,
  check (expires_at is null or publish_at is null or expires_at > publish_at)
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title_en text not null,
  title_ta text not null,
  description_en text not null,
  description_ta text not null,
  image_media_id uuid references public.media_assets(id) on delete restrict,
  starts_at timestamptz not null,
  ends_at timestamptz,
  venue_en text not null,
  venue_ta text not null,
  contact text,
  category text not null default 'church',
  featured boolean not null default false,
  registration_url text,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  updated_by uuid references auth.users(id) on delete set null,
  check (ends_at is null or ends_at > starts_at),
  check (registration_url is null or registration_url ~ '^(https://|tel:|mailto:)')
);

create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  youtube_id text not null unique check (youtube_id ~ '^[a-zA-Z0-9_-]{11}$'),
  youtube_url text not null check (youtube_url ~ '^https://'),
  title_en text not null,
  title_ta text not null,
  description_en text not null,
  description_ta text not null,
  category text not null default 'sermon',
  featured boolean not null default false,
  live_status text not null default 'recorded' check (live_status in ('recorded', 'scheduled', 'live_confirmed')),
  status public.content_status not null default 'draft',
  display_order integer not null default 0 check (display_order >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  updated_by uuid references auth.users(id) on delete set null
);

create table if not exists public.worship_services (
  id uuid primary key default gen_random_uuid(),
  name_en text not null,
  name_ta text not null,
  day_en text not null,
  day_ta text not null,
  start_time time,
  end_time time,
  time_display_en text not null,
  time_display_ta text not null,
  description_en text not null,
  description_ta text not null,
  location_en text,
  location_ta text,
  active boolean not null default true,
  verified boolean not null default false,
  status public.content_status not null default 'draft',
  display_order integer not null default 0 check (display_order >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  updated_by uuid references auth.users(id) on delete set null,
  check (status <> 'published' or verified = true)
);

create table if not exists public.ministries (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  group_key text not null check (group_key in ('church', 'community', 'academics', 'homepage')),
  title_en text not null,
  title_ta text not null,
  eyebrow_en text,
  eyebrow_ta text,
  description_en text not null,
  description_ta text not null,
  image_media_id uuid references public.media_assets(id) on delete restrict,
  icon_key text,
  metadata jsonb not null default '{}'::jsonb,
  featured boolean not null default false,
  status public.content_status not null default 'draft',
  display_order integer not null default 0 check (display_order >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  updated_by uuid references auth.users(id) on delete set null
);

create index if not exists page_content_public_idx on public.page_content (status, page_key, display_order);
create index if not exists hero_slides_public_idx on public.hero_slides (scope, status, enabled, display_order);
create index if not exists gallery_images_public_idx on public.gallery_images (album_id, status, featured, display_order);
create index if not exists announcements_active_idx on public.announcements (status, publish_at, expires_at);
create index if not exists events_date_idx on public.events (status, starts_at);
create index if not exists videos_public_idx on public.videos (status, featured, display_order);
create index if not exists services_public_idx on public.worship_services (status, verified, active, display_order);
create index if not exists ministries_public_idx on public.ministries (group_key, status, display_order);

do $$
declare table_name text;
begin
  foreach table_name in array array['site_settings','page_content','hero_slides','gallery_albums','gallery_images','announcements','events','videos','worship_services','ministries']
  loop
    execute format('drop trigger if exists set_%I_updated_at on public.%I', table_name, table_name);
    execute format('create trigger set_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()', table_name, table_name);
  end loop;
end $$;

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
    (select count(*) from public.ministries where image_media_id = asset_id)::integer;
$$;

commit;
