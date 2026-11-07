update public.ministries
set image_url = '/church/church-planting-seminar.jpg',
    updated_at = now()
where slug = 'church-planting-seminar'
  and group_key = 'church';
