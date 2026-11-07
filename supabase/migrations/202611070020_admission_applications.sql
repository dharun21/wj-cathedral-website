-- Private admission enquiries. Public visitors submit through one validated
-- RPC; only owners can read or manage the resulting personal information.

begin;

do $$ begin
  create type public.admission_application_status as enum ('new', 'reviewing', 'contacted', 'closed');
exception when duplicate_object then null;
end $$;

create table if not exists public.admission_applications (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(full_name) between 2 and 120),
  phone text not null check (char_length(phone) between 7 and 20),
  email text check (email is null or char_length(email) <= 254),
  town_district text not null check (char_length(town_district) between 2 and 140),
  study_interest text not null check (study_interest in ('bachelor-theology','certificate-theology','diploma-music','other')),
  ministry_experience text check (ministry_experience is null or char_length(ministry_experience) <= 2000),
  study_statement text not null check (char_length(study_statement) between 10 and 3000),
  preferred_language text not null default 'en' check (preferred_language in ('en','ta')),
  consent_at timestamptz not null,
  submitted_at timestamptz not null default timezone('utc', now()),
  status public.admission_application_status not null default 'new',
  owner_notes text not null default '' check (char_length(owner_notes) <= 3000),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists admission_applications_submitted_at_idx
  on public.admission_applications (submitted_at desc);
create index if not exists admission_applications_status_idx
  on public.admission_applications (status, submitted_at desc);

drop trigger if exists set_admission_applications_updated_at on public.admission_applications;
create trigger set_admission_applications_updated_at
before update on public.admission_applications
for each row execute function public.set_updated_at();

create or replace function public.set_admission_review_metadata()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status is distinct from old.status or new.owner_notes is distinct from old.owner_notes then
    new.reviewed_at = timezone('utc', now());
    new.reviewed_by = auth.uid();
  end if;
  return new;
end;
$$;

drop trigger if exists set_admission_review_metadata on public.admission_applications;
create trigger set_admission_review_metadata
before update on public.admission_applications
for each row execute function public.set_admission_review_metadata();

alter table public.admission_applications enable row level security;

create policy "owners read admission applications" on public.admission_applications
for select to authenticated using (public.is_owner());

create policy "owners update admission applications" on public.admission_applications
for update to authenticated using (public.is_owner()) with check (public.is_owner());

create policy "owners delete admission applications" on public.admission_applications
for delete to authenticated using (public.is_owner());

create or replace function public.submit_admission_application(
  p_full_name text,
  p_phone text,
  p_email text,
  p_city text,
  p_study_interest text,
  p_experience text,
  p_statement text,
  p_language text,
  p_consent boolean,
  p_website text default ''
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  application_id uuid;
  clean_name text := btrim(coalesce(p_full_name, ''));
  clean_phone text := btrim(coalesce(p_phone, ''));
  clean_email text := nullif(lower(btrim(coalesce(p_email, ''))), '');
  clean_city text := btrim(coalesce(p_city, ''));
  clean_experience text := nullif(btrim(coalesce(p_experience, '')), '');
  clean_statement text := btrim(coalesce(p_statement, ''));
begin
  -- Honeypot submissions are acknowledged but not stored.
  if btrim(coalesce(p_website, '')) <> '' then
    return gen_random_uuid();
  end if;

  if p_consent is not true then
    raise exception 'Consent is required before submitting an admission enquiry.';
  end if;
  if char_length(clean_name) not between 2 and 120 then
    raise exception 'Please enter a valid full name.';
  end if;
  if char_length(clean_phone) not between 7 and 20 or clean_phone !~ '^[0-9+() -]+$' then
    raise exception 'Please enter a valid phone number.';
  end if;
  if clean_email is not null and (char_length(clean_email) > 254 or clean_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$') then
    raise exception 'Please enter a valid email address.';
  end if;
  if char_length(clean_city) not between 2 and 140 then
    raise exception 'Please enter your town or district.';
  end if;
  if p_study_interest not in ('bachelor-theology','certificate-theology','diploma-music','other') then
    raise exception 'Please select a valid area of study.';
  end if;
  if clean_experience is not null and char_length(clean_experience) > 2000 then
    raise exception 'Ministry experience is too long.';
  end if;
  if char_length(clean_statement) not between 10 and 3000 then
    raise exception 'Please provide a short statement of at least 10 characters.';
  end if;
  if p_language not in ('en','ta') then
    raise exception 'Unsupported language.';
  end if;

  if exists (
    select 1 from public.admission_applications
    where phone = clean_phone
      and study_interest = p_study_interest
      and submitted_at > timezone('utc', now()) - interval '15 minutes'
  ) then
    raise exception 'An enquiry with this phone number was recently submitted. Please wait before trying again.';
  end if;

  insert into public.admission_applications (
    full_name, phone, email, town_district, study_interest,
    ministry_experience, study_statement, preferred_language, consent_at
  ) values (
    clean_name, clean_phone, clean_email, clean_city, p_study_interest,
    clean_experience, clean_statement, p_language, timezone('utc', now())
  ) returning id into application_id;

  return application_id;
end;
$$;

revoke all on function public.submit_admission_application(text,text,text,text,text,text,text,text,boolean,text) from public;
grant execute on function public.submit_admission_application(text,text,text,text,text,text,text,text,boolean,text) to anon, authenticated;

comment on table public.admission_applications is
  'Private admission enquiries. Contains personal information and is readable only by owner administrators.';

commit;
