begin;

-- The latest-live slide is generated from the newest published live-session
-- video. This protected row stores only its carousel position, allowing the
-- owner to reorder it without duplicating or editing dynamic video content.
alter table public.hero_slides
  drop constraint if exists hero_slides_default_key_check;
alter table public.hero_slides
  add constraint hero_slides_default_key_check check (
    (slide_kind = 'custom' and default_key is null)
    or (slide_kind = 'default' and default_key in (
      'admissions', 'licence', 'graduation',
      'home-welcome', 'home-sunday', 'home-admissions',
      'home-ministries', 'home-community', 'home-live'
    ))
  );

insert into public.hero_slides (
  id, scope, slide_kind, default_key, eyebrow_en, eyebrow_ta,
  title_en, title_ta, description_en, description_ta,
  image_alt_en, image_alt_ta, cta_label_en, cta_label_ta, cta_href,
  enabled, status, display_order
) values (
  '10000000-0000-4000-8000-000000000007', 'home', 'default', 'home-live',
  'Latest church live session', 'சமீபத்திய திருச்சபை நேரலை நிகழ்வு',
  'Live from WJ Cathedral', 'WJ Cathedral-இலிருந்து நேரலை',
  'This protected slide automatically uses the latest published live-session video.',
  'இந்தப் பாதுகாக்கப்பட்ட ஸ்லைடு சமீபத்தில் வெளியிடப்பட்ட நேரலைக் காணொளியைத் தானாகப் பயன்படுத்தும்.',
  'Latest WJ Cathedral live-session preview', 'சமீபத்திய WJ Cathedral நேரலை நிகழ்வின் முன்னோட்டம்',
  'Watch the latest session', 'சமீபத்திய நிகழ்வைக் காணுங்கள்', '#media-live',
  true, 'published', 999
)
on conflict (id) do update
set scope = excluded.scope,
    slide_kind = excluded.slide_kind,
    default_key = excluded.default_key,
    enabled = true,
    status = 'published';

commit;
