begin;

insert into public.gallery_albums (
  id, slug, title_en, title_ta, description_en, description_ta, status, display_order
) values (
  '20000000-0000-4000-8000-000000000004',
  'graduation',
  'Graduation',
  'பட்டமளிப்பு',
  'Bible college graduation ceremony photographs.',
  'வேதாகமக் கல்லூரிப் பட்டமளிப்பு விழாப் புகைப்படங்கள்.',
  'published',
  3
)
on conflict (id) do update set
  slug = excluded.slug,
  title_en = excluded.title_en,
  title_ta = excluded.title_ta,
  description_en = excluded.description_en,
  description_ta = excluded.description_ta,
  status = 'published',
  display_order = excluded.display_order,
  updated_at = timezone('utc', now());

insert into public.gallery_images (
  id, album_id, image_url, caption_en, caption_ta, alt_en, alt_ta,
  featured, status, display_order
) values
(
  '30000000-0000-4000-8000-000000000013', '20000000-0000-4000-8000-000000000004', './academics/graduation/graduation-01.jpg',
  'Certificate presentation', 'சான்றிதழ் வழங்கும் தருணம்',
  'A Bible college graduate receiving a certificate during the graduation ceremony',
  'பட்டமளிப்பு விழாவில் சான்றிதழைப் பெறும் வேதாகமக் கல்லூரிப் பட்டதாரி',
  true, 'published', 0
),
(
  '30000000-0000-4000-8000-000000000014', '20000000-0000-4000-8000-000000000004', './academics/graduation/graduation-02.jpg',
  'Celebrating a graduate', 'பட்டதாரியைக் கொண்டாடும் தருணம்',
  'A woman graduate receiving her certificate during the Bible college graduation ceremony',
  'வேதாகமக் கல்லூரிப் பட்டமளிப்பு விழாவில் சான்றிதழைப் பெறும் பெண் பட்டதாரி',
  false, 'published', 1
),
(
  '30000000-0000-4000-8000-000000000015', '20000000-0000-4000-8000-000000000004', './academics/graduation/graduation-03.jpg',
  'Graduation ceremony address', 'பட்டமளிப்பு விழா உரை',
  'A church leader speaking from the lectern during the graduation ceremony',
  'பட்டமளிப்பு விழாவில் மேடையிலிருந்து உரையாற்றும் திருச்சபைத் தலைவர்',
  false, 'published', 2
),
(
  '30000000-0000-4000-8000-000000000016', '20000000-0000-4000-8000-000000000004', './academics/graduation/graduation-04.jpg',
  'Honouring faithful study', 'உண்மையுள்ள கல்வியை கௌரவித்தல்',
  'A graduate receiving a certificate from a senior church leader at the graduation ceremony',
  'பட்டமளிப்பு விழாவில் மூத்த திருச்சபைத் தலைவரிடமிருந்து சான்றிதழைப் பெறும் பட்டதாரி',
  false, 'published', 3
),
(
  '30000000-0000-4000-8000-000000000017', '20000000-0000-4000-8000-000000000004', './academics/graduation/graduation-05.jpg',
  'A joyful graduation moment', 'மகிழ்ச்சியான பட்டமளிப்புத் தருணம்',
  'A smiling graduate receiving a certificate during the Bible college graduation ceremony',
  'வேதாகமக் கல்லூரிப் பட்டமளிப்பு விழாவில் மகிழ்ச்சியுடன் சான்றிதழைப் பெறும் பட்டதாரி',
  false, 'published', 4
),
(
  '30000000-0000-4000-8000-000000000018', '20000000-0000-4000-8000-000000000004', './academics/graduation/graduation-06.jpg',
  'Graduation certificate presentation', 'பட்டமளிப்புச் சான்றிதழ் வழங்குதல்',
  'A Bible college graduate and ceremony leader presenting a graduation certificate',
  'பட்டமளிப்புச் சான்றிதழை வழங்கும் விழாத் தலைவரும் வேதாகமக் கல்லூரிப் பட்டதாரியும்',
  false, 'published', 5
)
on conflict (id) do update set
  album_id = excluded.album_id,
  image_url = excluded.image_url,
  caption_en = excluded.caption_en,
  caption_ta = excluded.caption_ta,
  alt_en = excluded.alt_en,
  alt_ta = excluded.alt_ta,
  featured = excluded.featured,
  status = 'published',
  display_order = excluded.display_order,
  updated_at = timezone('utc', now());

commit;
