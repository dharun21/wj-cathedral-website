alter table public.ministries
  add column if not exists image_url text;

alter table public.ministries
  add constraint ministries_image_url_safe check (image_url is null or image_url ~ '^(https://|\./|/)');
