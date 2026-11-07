-- Apply the client-supplied leadership artwork to the Home ministries slide.
begin;

update public.hero_slides
set
  image_url = './hero/ministries-leadership.jpg',
  image_alt_en = 'WJ Cathedral ministry leadership artwork featuring Rev. Pr. A. Paulraj, Pr. Zeehan Paul and Bro. Aaron Jebaraj',
  image_alt_ta = 'Rev. Pr. A. Paulraj, Pr. Zeehan Paul மற்றும் Bro. Aaron Jebaraj இடம்பெறும் WJ Cathedral ஊழியத் தலைமைப் படம்',
  updated_at = timezone('utc', now())
where id = '10000000-0000-4000-8000-000000000005';

commit;
