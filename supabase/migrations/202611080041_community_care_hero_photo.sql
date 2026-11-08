-- Use the approved Community Care collage on the sixth Home hero slide.
begin;

update public.hero_slides
set
  image_url = './hero/community-care-in-action.jpg',
  image_alt_en = 'A collage of WJ Cathedral Community Care activities including tree planting, children''s programmes and community gatherings',
  image_alt_ta = 'மரநடுகை, சிறுவர் நிகழ்ச்சிகள் மற்றும் சமூக ஒன்றுகூடல்கள் உள்ளிட்ட WJ Cathedral சமூக அக்கறைப் பணிகளின் படத்தொகுப்பு',
  updated_at = timezone('utc', now())
where id = '10000000-0000-4000-8000-000000000006';

commit;
