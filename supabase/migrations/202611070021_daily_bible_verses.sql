-- Hybrid Daily Bible Verse system:
-- 1. A published verse scheduled for the requested India date wins.
-- 2. Otherwise published unscheduled verses rotate deterministically by date.
-- No Scripture text is seeded here; church staff add approved bilingual text.

begin;

create table if not exists public.daily_bible_verses (
  id uuid primary key default gen_random_uuid(),
  verse_en text not null check (char_length(verse_en) between 2 and 1000),
  verse_ta text not null check (char_length(verse_ta) between 2 and 1500),
  reference_en text not null check (char_length(reference_en) between 2 and 120),
  reference_ta text not null check (char_length(reference_ta) between 2 and 160),
  translation_en text check (translation_en is null or char_length(translation_en) <= 100),
  translation_ta text check (translation_ta is null or char_length(translation_ta) <= 120),
  background_image_url text,
  scheduled_date date,
  active boolean not null default true,
  status public.content_status not null default 'draft',
  display_order integer not null default 0 check (display_order >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  updated_by uuid references auth.users(id) on delete set null,
  check (background_image_url is null or background_image_url ~ '^(https://|\./|/)')
);

create unique index if not exists daily_bible_verses_published_schedule_idx
  on public.daily_bible_verses (scheduled_date)
  where scheduled_date is not null and status = 'published' and active = true;
create index if not exists daily_bible_verses_rotation_idx
  on public.daily_bible_verses (display_order, id)
  where scheduled_date is null and status = 'published' and active = true;

drop trigger if exists set_daily_bible_verses_updated_at on public.daily_bible_verses;
create trigger set_daily_bible_verses_updated_at
before update on public.daily_bible_verses
for each row execute function public.set_updated_at();

alter table public.daily_bible_verses enable row level security;

create policy "published daily verses are public" on public.daily_bible_verses
for select to anon, authenticated using (status = 'published' and active = true);
create policy "owners select daily verses" on public.daily_bible_verses
for select to authenticated using (public.is_owner());
create policy "owners insert daily verses" on public.daily_bible_verses
for insert to authenticated with check (public.is_owner());
create policy "owners update daily verses" on public.daily_bible_verses
for update to authenticated using (public.is_owner()) with check (public.is_owner());
create policy "owners delete daily verses" on public.daily_bible_verses
for delete to authenticated using (public.is_owner());
create policy "editors select daily verses" on public.daily_bible_verses
for select to authenticated using (public.is_editor());
create policy "editors insert draft daily verses" on public.daily_bible_verses
for insert to authenticated with check (public.is_editor() and status in ('draft','pending_review'));
create policy "editors update draft daily verses" on public.daily_bible_verses
for update to authenticated using (public.is_editor() and status = 'draft')
with check (public.is_editor() and status in ('draft','pending_review'));

create or replace function public.get_daily_bible_verse(p_date date)
returns setof public.daily_bible_verses
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  verse_count integer;
  verse_offset integer;
begin
  return query
    select verse.* from public.daily_bible_verses verse
    where verse.status = 'published'
      and verse.active = true
      and verse.scheduled_date = p_date
    order by verse.updated_at desc
    limit 1;
  if found then return; end if;

  select count(*) into verse_count
  from public.daily_bible_verses verse
  where verse.status = 'published'
    and verse.active = true
    and verse.scheduled_date is null;

  if verse_count = 0 then return; end if;
  verse_offset := mod((p_date - date '2026-01-01'), verse_count);

  return query
    select verse.* from public.daily_bible_verses verse
    where verse.status = 'published'
      and verse.active = true
      and verse.scheduled_date is null
    order by verse.display_order, verse.id
    offset verse_offset limit 1;
end;
$$;

revoke all on function public.get_daily_bible_verse(date) from public;
grant execute on function public.get_daily_bible_verse(date) to anon, authenticated;

-- Retire the former "You are not alone" slide. The frontend inserts the
-- dynamic Daily Verse slot in the same third position.
update public.hero_slides
set enabled = false, status = 'archived', updated_at = timezone('utc', now())
where id = '10000000-0000-4000-8000-000000000003';

comment on table public.daily_bible_verses is
  'Church-approved bilingual Scripture excerpts used by the daily homepage carousel slot.';

commit;
