update public.ministries
set image_url = '/church/gospel-ministries.jpg',
    updated_at = now()
where slug = 'gospel-ministries'
  and group_key = 'church';
