-- Add the approved bilingual ministries introduction to the Home carousel.
begin;

insert into public.hero_slides (
  id, scope, eyebrow_en, eyebrow_ta, title_en, title_ta,
  description_en, description_ta, image_url, image_alt_en, image_alt_ta,
  cta_label_en, cta_label_ta, cta_href,
  secondary_cta_label_en, secondary_cta_label_ta, secondary_cta_href,
  enabled, status, display_order
) values (
  '10000000-0000-4000-8000-000000000005', 'home',
  'Ministries for every generation', 'ஒவ்வொரு தலைமுறைக்குமான ஊழியங்கள்',
  'Grow in faith. Serve with purpose.', 'விசுவாசத்தில் வளருங்கள். நோக்கத்துடன் சேவை செய்யுங்கள்.',
  'Explore children’s and youth ministry, family counselling, leadership and church-planting seminars, and Gospel ministries.',
  'சிறுவர் மற்றும் வாலிபர் ஊழியங்கள், குடும்ப ஆலோசனை, தலைமைத்துவ மற்றும் திருச்சபை நிறுவுதல் கருத்தரங்குகள், சுவிசேஷ ஊழியங்கள் ஆகியவற்றை அறியுங்கள்.',
  './hero/ministries-leadership.jpg',
  'WJ Cathedral ministry leadership artwork featuring Rev. Pr. A. Paulraj, Pr. Zeehan Paul and Bro. Aaron Jebaraj',
  'Rev. Pr. A. Paulraj, Pr. Zeehan Paul மற்றும் Bro. Aaron Jebaraj இடம்பெறும் WJ Cathedral ஊழியத் தலைமைப் படம்',
  'Explore our ministries', 'எங்கள் ஊழியங்களை அறியுங்கள்', '#church',
  'Connect with the church', 'திருச்சபையுடன் இணையுங்கள்', '#contact',
  true, 'published', 4
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
  display_order = 4,
  updated_at = timezone('utc', now());

commit;
