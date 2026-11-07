begin;

update public.ministries
set image_url = './academics/faculty/george-edward.jpg',
    updated_at = timezone('utc', now())
where slug = 'faculty-a-george-edward';

commit;
