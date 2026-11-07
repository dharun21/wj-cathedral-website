-- Apply the client-supplied WJ Cathedral building photograph to the welcome slide.
begin;

update public.hero_slides
set
  image_url = './hero/welcome-wj-cathedral.jpg',
  image_alt_en = 'WJ Cathedral church building with the congregation gathered outside in Nannilam',
  image_alt_ta = 'நன்னிலத்தில் உள்ள WJ Cathedral திருச்சபைக் கட்டிடத்தின் முன் ஒன்றுகூடியுள்ள சபையார்',
  updated_at = timezone('utc', now())
where id = '10000000-0000-4000-8000-000000000001';

commit;
