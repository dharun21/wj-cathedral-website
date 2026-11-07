update public.ministries
set image_url = '/church/family-counselling.jpg',
    updated_at = now()
where slug = 'family-counselling'
  and group_key = 'church';
