update public.ministries
set image_url = '/church/children-ministry.jpg',
    updated_at = now()
where slug = 'children-ministry'
  and group_key = 'church';
