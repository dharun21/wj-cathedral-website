update public.ministries
set image_url = '/church/leaders-seminar.jpg',
    updated_at = now()
where slug = 'leaders-seminar'
  and group_key = 'church';
