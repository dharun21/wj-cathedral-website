begin;

update public.ministries
set image_url = './academics/faculty/ceehan-paul-thuthiraj.jpg',
    updated_at = timezone('utc', now())
where slug = 'faculty-p-ceehan-paul-thuthiraj';

commit;
