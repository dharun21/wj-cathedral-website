alter table public.site_settings
  add column if not exists prayer_247_confirmed boolean not null default false;

comment on column public.site_settings.prayer_247_confirmed is
  'Must be explicitly enabled by an authorized church administrator before public 24/7 availability wording is shown.';
