begin;

-- Church-approved public Instagram profile. Preserve any later owner-entered URL.
update public.site_settings
set
  instagram_url = 'https://www.instagram.com/wj_cathedral_nnm/'
where singleton_key = 'default'
  and (instagram_url is null or btrim(instagram_url) = '');

commit;
