-- Adds the remaining owner-controlled giving fields and records the details
-- explicitly supplied by the client. The existing content status is retained;
-- publishing the settings remains an owner action in the admin dashboard.

alter table public.site_settings
  add column if not exists giving_bank_branch text,
  add column if not exists giving_gpay_name text,
  add column if not exists giving_upi_id text;

alter table public.site_settings
  drop constraint if exists site_settings_giving_qr_url_safe;

alter table public.site_settings
  add constraint site_settings_giving_qr_url_safe
  check (giving_qr_url is null or giving_qr_url ~ '^(https://|\./|/)');

update public.site_settings
set
  giving_account_name = 'WORSHIP TO JESUS MINISTRIES',
  giving_bank_name = 'State Bank of India (SBI)',
  giving_bank_branch = 'Nannilam',
  giving_account_number = '31416070895',
  giving_ifsc = 'SBIN0000261',
  giving_gpay_number = '9788056467',
  giving_gpay_name = 'Zeehan Paul (Pastor of Worship to Jesus Cathedral)',
  giving_upi_id = 'zeehan739@okaxis',
  giving_qr_url = './giving/gpay-qr.jpg',
  giving_payment_verified = true,
  updated_at = now()
where singleton_key = 'default';

comment on column public.site_settings.giving_gpay_name is
  'Owner-approved recipient name displayed beside the public GPay details.';
