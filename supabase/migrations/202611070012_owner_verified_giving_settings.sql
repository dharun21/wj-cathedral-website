begin;

alter table public.site_settings
  add column if not exists giving_account_name text,
  add column if not exists giving_bank_name text,
  add column if not exists giving_account_number text,
  add column if not exists giving_ifsc text,
  add column if not exists giving_gpay_number text,
  add column if not exists giving_qr_url text,
  add column if not exists giving_note_en text,
  add column if not exists giving_note_ta text,
  add column if not exists giving_payment_verified boolean not null default false;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'site_settings_giving_qr_url_safe'
  ) then
    alter table public.site_settings
      add constraint site_settings_giving_qr_url_safe
      check (giving_qr_url is null or giving_qr_url ~ '^https://');
  end if;
end $$;

comment on column public.site_settings.giving_payment_verified is
  'Owner confirmation that all public bank, GPay and QR details have been checked.';

commit;
