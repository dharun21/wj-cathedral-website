begin;

-- Academics has its own small content model so institute details and courses
-- do not have to be mixed into Church ministries or generic page copy.
create table if not exists public.academic_settings (
  id uuid primary key default gen_random_uuid(),
  singleton_key text not null default 'default' unique,
  college_name text not null,
  affiliation text not null,
  established text not null,
  founder text not null,
  principal text not null,
  address_en text not null,
  address_ta text not null,
  phone_primary text not null,
  phone_secondary text,
  admissions_open boolean not null default true,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  updated_by uuid references auth.users(id) on delete set null
);

create table if not exists public.academic_courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  short_name text not null,
  title_en text not null,
  title_ta text not null,
  duration_en text not null,
  duration_ta text not null,
  status public.content_status not null default 'draft',
  display_order integer not null default 0 check (display_order >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  updated_by uuid references auth.users(id) on delete set null
);

alter table public.hero_slides
  add column if not exists slide_kind text not null default 'custom',
  add column if not exists default_key text;

alter table public.hero_slides
  drop constraint if exists hero_slides_slide_kind_check,
  drop constraint if exists hero_slides_default_key_check,
  add constraint hero_slides_slide_kind_check check (slide_kind in ('default', 'custom')),
  add constraint hero_slides_default_key_check check (
    (slide_kind = 'custom' and default_key is null)
    or (slide_kind = 'default' and default_key in ('admissions', 'licence', 'graduation'))
  );

create unique index if not exists hero_slides_academic_default_key_idx
  on public.hero_slides (scope, default_key)
  where scope = 'academics' and slide_kind = 'default';

insert into public.academic_settings (
  id, singleton_key, college_name, affiliation, established, founder, principal,
  address_en, address_ta, phone_primary, phone_secondary, admissions_open, status
) values (
  'a0000000-0000-4000-8000-000000000001', 'default',
  'Worship To Jesus Bible Institute & College',
  'National Theological Association (NTA)', '2015',
  'Rev. Pr. A. Paulraj', 'Pr. A. George Edward',
  'Worship to Jesus Cathedral, Near Telephone Exchange, Nannilam 610105, Thiruvarur District, Tamil Nadu.',
  'Worship to Jesus Cathedral, தொலைபேசி நிலையம் அருகில், நன்னிலம் 610105, திருவாரூர் மாவட்டம், தமிழ்நாடு.',
  '9750308877', '9788056467', true, 'published'
) on conflict (singleton_key) do nothing;

insert into public.academic_courses (
  id, slug, short_name, title_en, title_ta, duration_en, duration_ta, status, display_order
) values
  ('a1000000-0000-4000-8000-000000000001', 'bachelor-theology', 'B.Th', 'Bachelor of Theology', 'இறையியல் இளங்கலை', '3 years', '3 ஆண்டுகள்', 'published', 0),
  ('a1000000-0000-4000-8000-000000000002', 'certificate-theology', 'C.Th', 'Certificate of Theology', 'இறையியல் சான்றிதழ்', '1 year', '1 ஆண்டு', 'published', 1),
  ('a1000000-0000-4000-8000-000000000003', 'diploma-music', 'Diploma', 'Diploma in Music', 'இசைப் பட்டயப் படிப்பு', '1 year', '1 ஆண்டு', 'published', 2)
on conflict (slug) do nothing;

-- The built-in slides retain their established visual treatment and CTA.
-- The dedicated admin editor only exposes title and supporting copy for them.
insert into public.hero_slides (
  id, scope, slide_kind, default_key, eyebrow_en, eyebrow_ta,
  title_en, title_ta, description_en, description_ta,
  image_alt_en, image_alt_ta, cta_label_en, cta_label_ta, cta_href,
  enabled, status, display_order
) values
  (
    'a2000000-0000-4000-8000-000000000001', 'academics', 'default', 'admissions',
    'Admissions', 'சேர்க்கை',
    '2027 admissions are now open', '2027 ஆம் ஆண்டுக்கான சேர்க்கை தொடங்கியுள்ளது',
    'Applications are being accepted now. Classes begin in January 2027 at Worship To Jesus Bible Institute & College, Nannilam.',
    'விண்ணப்பங்கள் தற்போது ஏற்றுக்கொள்ளப்படுகின்றன. Worship To Jesus Bible Institute & College, நன்னிலத்தில் வகுப்புகள் ஜனவரி 2027-ல் தொடங்குகின்றன.',
    'Worship To Jesus Bible Institute admissions', 'Worship To Jesus Bible Institute சேர்க்கை',
    'View admission form', 'சேர்க்கைப் படிவத்தைப் பாருங்கள்', '#academics-admission',
    true, 'published', 0
  ),
  (
    'a2000000-0000-4000-8000-000000000002', 'academics', 'default', 'licence',
    'Ministry licence pathway', 'ஊழிய உரிமப் பாதை',
    'Clear guidance for responsible ministry preparation', 'பொறுப்பான ஊழிய ஆயத்தத்திற்கு தெளிவான வழிகாட்டுதல்',
    'Approved eligibility, documentation and licence guidance will be published here after confirmation by the college and church leadership.',
    'கல்லூரி மற்றும் திருச்சபைத் தலைமையின் உறுதிப்படுத்தலுக்குப் பிறகு அங்கீகரிக்கப்பட்ட தகுதி, ஆவணங்கள் மற்றும் உரிம வழிகாட்டுதல் இங்கே வெளியிடப்படும்.',
    'Ministry study framework', 'ஊழிய பாடத்திட்ட அமைப்பு',
    'Read the study framework', 'பாடத்திட்ட அமைப்பைப் பாருங்கள்', '#academics-syllabus',
    true, 'published', 1
  ),
  (
    'a2000000-0000-4000-8000-000000000003', 'academics', 'default', 'graduation',
    'Joyful graduation', 'மகிழ்வான பட்டமளிப்பு',
    'Celebrating faithful study and a life prepared for service', 'உண்மையுள்ள கல்வியையும் ஊழியத்திற்காக ஆயத்தமான வாழ்க்கையையும் கொண்டாடுகிறோம்',
    'Graduation honours disciplined learning, spiritual growth and readiness to serve churches and communities with humility.',
    'ஒழுக்கமான கற்றல், ஆவிக்குரிய வளர்ச்சி மற்றும் பணிவுடன் திருச்சபைகளுக்கும் சமூகங்களுக்கும் சேவை செய்யும் ஆயத்தத்தைப் பட்டமளிப்பு கௌரவிக்கிறது.',
    'Bible college graduation', 'வேதாகமக் கல்லூரி பட்டமளிப்பு',
    'View graduation gallery', 'பட்டமளிப்புப் படத்தொகுப்பைப் பாருங்கள்', '#academics-graduation',
    true, 'published', 2
  )
on conflict (id) do nothing;

create index if not exists academic_courses_public_idx
  on public.academic_courses (status, display_order);

drop trigger if exists set_academic_settings_updated_at on public.academic_settings;
create trigger set_academic_settings_updated_at
before update on public.academic_settings
for each row execute function public.set_updated_at();

drop trigger if exists set_academic_courses_updated_at on public.academic_courses;
create trigger set_academic_courses_updated_at
before update on public.academic_courses
for each row execute function public.set_updated_at();

alter table public.academic_settings enable row level security;
alter table public.academic_courses enable row level security;

grant select on public.academic_settings, public.academic_courses to anon, authenticated;
grant insert, update, delete on public.academic_settings, public.academic_courses to authenticated;

create policy "published academic settings are public" on public.academic_settings
for select to anon, authenticated using (status = 'published');
create policy "published academic courses are public" on public.academic_courses
for select to anon, authenticated using (status = 'published');

create policy "owners select academic settings" on public.academic_settings
for select to authenticated using (public.is_owner());
create policy "owners insert academic settings" on public.academic_settings
for insert to authenticated with check (public.is_owner());
create policy "owners update academic settings" on public.academic_settings
for update to authenticated using (public.is_owner()) with check (public.is_owner());
create policy "owners delete academic settings" on public.academic_settings
for delete to authenticated using (public.is_owner());

create policy "owners select academic courses" on public.academic_courses
for select to authenticated using (public.is_owner());
create policy "owners insert academic courses" on public.academic_courses
for insert to authenticated with check (public.is_owner());
create policy "owners update academic courses" on public.academic_courses
for update to authenticated using (public.is_owner()) with check (public.is_owner());
create policy "owners delete academic courses" on public.academic_courses
for delete to authenticated using (public.is_owner());

create policy "editors select academic settings" on public.academic_settings
for select to authenticated using (public.is_editor());
create policy "editors insert draft academic settings" on public.academic_settings
for insert to authenticated with check (public.is_editor() and status in ('draft', 'pending_review'));
create policy "editors update draft academic settings" on public.academic_settings
for update to authenticated using (public.is_editor() and status = 'draft')
with check (public.is_editor() and status in ('draft', 'pending_review'));

create policy "editors select academic courses" on public.academic_courses
for select to authenticated using (public.is_editor());
create policy "editors insert draft academic courses" on public.academic_courses
for insert to authenticated with check (public.is_editor() and status in ('draft', 'pending_review'));
create policy "editors update draft academic courses" on public.academic_courses
for update to authenticated using (public.is_editor() and status = 'draft')
with check (public.is_editor() and status in ('draft', 'pending_review'));

alter table public.content_review_requests
  drop constraint if exists content_review_requests_table_name_check;
alter table public.content_review_requests
  add constraint content_review_requests_table_name_check check (table_name in (
    'page_content', 'hero_slides', 'gallery_albums', 'gallery_images',
    'announcements', 'events', 'videos', 'worship_services', 'ministries',
    'daily_bible_verses', 'media_assets', 'audio_albums', 'audio_tracks',
    'academic_settings', 'academic_courses'
  ));

drop trigger if exists track_content_review_request on public.academic_settings;
create trigger track_content_review_request
after insert or update or delete on public.academic_settings
for each row execute function public.track_content_review_request();

drop trigger if exists track_content_review_request on public.academic_courses;
create trigger track_content_review_request
after insert or update or delete on public.academic_courses
for each row execute function public.track_content_review_request();

commit;
