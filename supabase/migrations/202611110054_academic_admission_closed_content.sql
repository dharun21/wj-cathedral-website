begin;

alter table public.hero_slides
  add column if not exists closed_title_en text,
  add column if not exists closed_title_ta text,
  add column if not exists closed_description_en text,
  add column if not exists closed_description_ta text;

update public.hero_slides
set closed_title_en = coalesce(closed_title_en, 'Worship To Jesus Bible Institute & College'),
    closed_title_ta = coalesce(closed_title_ta, 'Worship To Jesus வேதாகம நிறுவனம் மற்றும் கல்லூரி'),
    closed_description_en = coalesce(closed_description_en, 'Bible-centred theological education, ministry formation and practical training for faithful service.'),
    closed_description_ta = coalesce(closed_description_ta, 'வேதாகமத்தை மையமாகக் கொண்ட இறையியல் கல்வி, ஊழிய உருவாக்கம் மற்றும் உண்மையுள்ள சேவைக்கான நடைமுறை பயிற்சி.'),
    updated_at = timezone('utc', now())
where scope = 'academics' and default_key = 'admissions';

commit;
