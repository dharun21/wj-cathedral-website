begin;

-- Client-approved 2027 Bible college admissions promotion for the homepage.
insert into public.hero_slides (
  id, scope, eyebrow_en, eyebrow_ta, title_en, title_ta,
  description_en, description_ta, image_url, image_alt_en, image_alt_ta,
  cta_label_en, cta_label_ta, cta_href,
  secondary_cta_label_en, secondary_cta_label_ta, secondary_cta_href,
  enabled, status, display_order
) values (
  '10000000-0000-4000-8000-000000000004', 'home',
  'Bible college admissions', 'வேதாகமக் கல்லூரி சேர்க்கை',
  '2027 admissions are now open', '2027 சேர்க்கை தொடங்கியுள்ளது',
  'Apply to Worship To Jesus Bible Institute & College. B.Th, C.Th and Diploma in Music classes begin in January 2027.',
  'Worship To Jesus Bible Institute & College-ல் விண்ணப்பிக்கலாம். B.Th, C.Th மற்றும் இசைப் பட்டயப் படிப்பு வகுப்புகள் ஜனவரி 2027-ல் தொடங்குகின்றன.',
  './banners/academics.svg',
  'Decorative Bible college admissions artwork with an open book and cross',
  'திறந்த புத்தகமும் சிலுவையும் கொண்ட வேதாகமக் கல்லூரி சேர்க்கை அலங்காரப் படம்',
  'Apply now', 'இப்போதே விண்ணப்பிக்கவும்', '#academics-admission',
  'View courses', 'பாடநெறிகளைப் பாருங்கள்', '#academics-syllabus',
  true, 'published', 3
)
on conflict (id) do update set
  eyebrow_en = excluded.eyebrow_en,
  eyebrow_ta = excluded.eyebrow_ta,
  title_en = excluded.title_en,
  title_ta = excluded.title_ta,
  description_en = excluded.description_en,
  description_ta = excluded.description_ta,
  image_url = excluded.image_url,
  image_alt_en = excluded.image_alt_en,
  image_alt_ta = excluded.image_alt_ta,
  cta_label_en = excluded.cta_label_en,
  cta_label_ta = excluded.cta_label_ta,
  cta_href = excluded.cta_href,
  secondary_cta_label_en = excluded.secondary_cta_label_en,
  secondary_cta_label_ta = excluded.secondary_cta_label_ta,
  secondary_cta_href = excluded.secondary_cta_href,
  enabled = true,
  status = 'published',
  display_order = 3,
  updated_at = timezone('utc', now());

commit;
