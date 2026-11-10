begin;

alter table public.site_settings
  add column if not exists whatsapp_channel_enabled boolean not null default true,
  add column if not exists whatsapp_channel_title_en text not null default 'Follow the WJ Cathedral, Nnm channel on WhatsApp' check (char_length(whatsapp_channel_title_en) between 1 and 180),
  add column if not exists whatsapp_channel_title_ta text not null default 'WhatsApp-ல் WJ Cathedral, Nnm சேனலைப் பின்தொடருங்கள்' check (char_length(whatsapp_channel_title_ta) between 1 and 180),
  add column if not exists whatsapp_channel_url text not null default 'https://whatsapp.com/channel/0029Vb6W8Q7E50Ug2nOAjX2j' check (whatsapp_channel_url ~ '^https://'),
  add column if not exists whatsapp_qr_url text not null default '/social/whatsapp-channel-qr.jpg' check (whatsapp_qr_url ~ '^(https://|/)'),
  add column if not exists whatsapp_qr_media_id uuid references public.media_assets(id) on delete set null,
  add column if not exists whatsapp_blog_url text not null default 'https://worshiptojesusministries.blogspot.com/2026/11/jesus-loves-people.html' check (whatsapp_blog_url ~ '^https://');

comment on column public.site_settings.whatsapp_channel_url is 'Official WJ Cathedral WhatsApp channel link.';
comment on column public.site_settings.whatsapp_blog_url is 'Related public Blogspot article link shown with the WhatsApp invitation.';

commit;
