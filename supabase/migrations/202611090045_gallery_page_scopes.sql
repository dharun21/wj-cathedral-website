begin;

alter table public.gallery_albums
  add column if not exists page_scope text not null default 'gallery';

update public.gallery_albums
set page_scope = case when slug = 'graduation' then 'academics' else 'gallery' end,
    updated_at = now();

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'gallery_albums_page_scope_check'
  ) then
    alter table public.gallery_albums
      add constraint gallery_albums_page_scope_check
      check (page_scope in ('gallery', 'academics'));
  end if;
end
$$;

update public.ministries
set image_url = './church/youth-ministry/youth-ministry-01.jpg',
    image_media_id = null,
    updated_at = now()
where slug = 'youth-ministry';

delete from public.gallery_images
where album_id = (select id from public.gallery_albums where slug = 'youth-ministry');

delete from public.gallery_albums where slug = 'youth-ministry';

commit;
