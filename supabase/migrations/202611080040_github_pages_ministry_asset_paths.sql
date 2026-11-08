update public.ministries
set image_url = '.' || image_url,
    updated_at = now()
where image_url like '/church/%';

update public.gallery_images
set image_url = '.' || image_url,
    updated_at = now()
where image_url like '/church/%';
