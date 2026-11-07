-- Add the approved bilingual Community Care introduction to the Home carousel.
begin;

insert into public.hero_slides (
  id, scope, eyebrow_en, eyebrow_ta, title_en, title_ta,
  description_en, description_ta, image_url, image_alt_en, image_alt_ta,
  cta_label_en, cta_label_ta, cta_href,
  secondary_cta_label_en, secondary_cta_label_ta, secondary_cta_href,
  enabled, status, display_order
) values (
  '10000000-0000-4000-8000-000000000006', 'home',
  'Faith expressed through compassionate action', 'இரக்கச் செயல்களில் வெளிப்படும் விசுவாசம்',
  'Caring for people. Nurturing communities.', 'மக்களுக்கான அக்கறை. சமூகங்களின் வளர்ச்சி.',
  'From tree planting and family relief to hospital care, medical camps, free tuition and school essentials, Community Care turns compassion into practical service.',
  'மரநடுகை மற்றும் குடும்ப நிவாரணம் முதல் மருத்துவமனை உதவி, மருத்துவ முகாம்கள், இலவச பயிற்சி மற்றும் பள்ளி உபகரணங்கள் வரை, சமூக அக்கறை இரக்கத்தை நடைமுறைச் சேவையாக்குகிறது.',
  './hero/welcome-wj-cathedral.jpg',
  'The WJ Cathedral congregation gathered together outside the church in Nannilam',
  'நன்னிலத்தில் உள்ள WJ Cathedral திருச்சபைக்கு வெளியே ஒன்றுகூடியுள்ள சபையார்',
  'Explore Community Care', 'சமூக அக்கறைப் பணிகளை அறியுங்கள்', '#community-care',
  'Support the mission', 'இந்தப் பணியை ஆதரியுங்கள்', '#give',
  true, 'published', 5
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
  display_order = 5,
  updated_at = timezone('utc', now());

commit;
