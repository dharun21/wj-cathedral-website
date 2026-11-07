begin;

update public.ministries
set image_url = './academics/faculty/paulraj.jpg',
    updated_at = timezone('utc', now())
where slug = 'faculty-a-paulraj';

commit;
