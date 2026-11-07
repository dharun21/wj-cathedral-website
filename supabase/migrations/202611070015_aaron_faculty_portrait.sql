begin;

update public.ministries
set image_url = './academics/faculty/aaron-jebaraj.jpg',
    updated_at = timezone('utc', now())
where slug = 'faculty-aaron-jebaraj';

commit;
