insert into public.gallery_albums (id, slug, title_en, title_ta, status, display_order)
values (
  '20000000-0000-4000-8000-000000000006',
  'youth-ministry',
  'Youth Ministry',
  'வாலிபர் ஊழியம்',
  'published',
  5
)
on conflict (id) do update set
  slug = excluded.slug,
  title_en = excluded.title_en,
  title_ta = excluded.title_ta,
  status = excluded.status,
  display_order = excluded.display_order,
  updated_at = now();

insert into public.gallery_images (
  id, album_id, image_url, caption_en, caption_ta, alt_en, alt_ta,
  featured, status, display_order
)
values
  (
    '30000000-0000-4000-8000-000000000023',
    '20000000-0000-4000-8000-000000000006',
    '/church/youth-ministry/youth-ministry-01.jpg',
    'Youth Ministry fellowship',
    'வாலிபர் ஊழிய ஐக்கியம்',
    'Young men gathered for Youth Ministry at WJ Cathedral',
    'WJ Cathedral வாலிபர் ஊழியத்தில் ஒன்றுகூடிய இளைஞர்கள்',
    true, 'published', 0
  ),
  (
    '30000000-0000-4000-8000-000000000024',
    '20000000-0000-4000-8000-000000000006',
    '/church/youth-ministry/youth-ministry-02.jpg',
    'Young women in fellowship',
    'ஐக்கியத்தில் இளம் பெண்கள்',
    'Young women and church leaders gathered at WJ Cathedral',
    'WJ Cathedral-ல் ஒன்றுகூடிய இளம் பெண்களும் திருச்சபைத் தலைவர்களும்',
    false, 'published', 1
  ),
  (
    '30000000-0000-4000-8000-000000000025',
    '20000000-0000-4000-8000-000000000006',
    '/church/youth-ministry/youth-ministry-03.jpg',
    'Youth Ministry gathering',
    'வாலிபர் ஊழியக் கூடுகை',
    'Youth Ministry group gathered with church leaders',
    'திருச்சபைத் தலைவர்களுடன் ஒன்றுகூடிய வாலிபர் ஊழியக் குழு',
    false, 'published', 2
  ),
  (
    '30000000-0000-4000-8000-000000000026',
    '20000000-0000-4000-8000-000000000006',
    '/church/youth-ministry/youth-ministry-04.jpg',
    'Youth sports fellowship',
    'வாலிபர் விளையாட்டு ஐக்கியம்',
    'Young people gathered for a Youth Ministry sports activity',
    'வாலிபர் ஊழிய விளையாட்டு நிகழ்வில் ஒன்றுகூடிய இளைஞர்கள்',
    false, 'published', 3
  )
on conflict (id) do update set
  album_id = excluded.album_id,
  image_url = excluded.image_url,
  caption_en = excluded.caption_en,
  caption_ta = excluded.caption_ta,
  alt_en = excluded.alt_en,
  alt_ta = excluded.alt_ta,
  featured = excluded.featured,
  status = excluded.status,
  display_order = excluded.display_order,
  updated_at = now();
