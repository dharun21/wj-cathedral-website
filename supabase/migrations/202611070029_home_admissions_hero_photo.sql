begin;

-- Client-approved photograph for the 2027 homepage admissions slide.
update public.hero_slides
set
  image_url = './hero/admissions-2027.jpg',
  image_alt_en = 'Bible college graduates wearing academic gowns and holding their certificates',
  image_alt_ta = 'கல்வி அங்கிகளை அணிந்து சான்றிதழ்களை ஏந்தியுள்ள வேதாகமக் கல்லூரிப் பட்டதாரிகள்',
  updated_at = timezone('utc', now())
where id = '10000000-0000-4000-8000-000000000004'
   or (scope = 'home' and title_en = '2027 admissions are now open');

commit;
