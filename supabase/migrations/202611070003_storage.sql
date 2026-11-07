begin;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('church-media', 'church-media', true, 8388608, array['image/jpeg','image/png','image/webp','image/avif']),
  ('church-drafts', 'church-drafts', false, 8388608, array['image/jpeg','image/png','image/webp','image/avif'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "public can view approved media" on storage.objects
for select to public using (bucket_id = 'church-media');

create policy "admins can view draft media" on storage.objects
for select to authenticated using (bucket_id = 'church-drafts' and public.is_admin());

create policy "admins can upload church media" on storage.objects
for insert to authenticated with check (
  bucket_id in ('church-drafts','church-media')
  and public.is_admin()
  and (bucket_id <> 'church-drafts' or (storage.foldername(name))[1] = auth.uid()::text)
);

create policy "admins can update church media" on storage.objects
for update to authenticated using (bucket_id in ('church-drafts','church-media') and public.is_admin())
with check (bucket_id in ('church-drafts','church-media') and public.is_admin());

create policy "admins can delete church media" on storage.objects
for delete to authenticated using (bucket_id in ('church-drafts','church-media') and public.is_admin());

commit;
