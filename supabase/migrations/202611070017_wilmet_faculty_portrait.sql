begin;

update public.ministries
set image_url = './academics/faculty/john-wilmet.jpg',
    updated_at = timezone('utc', now())
where slug = 'faculty-a-john-wilmet';

commit;
