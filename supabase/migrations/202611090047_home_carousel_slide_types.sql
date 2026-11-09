begin;

-- Protect the established homepage slides and their approved CTA destinations.
-- Any later slide is a custom visual slide and intentionally has no public CTA.
alter table public.hero_slides
  drop constraint if exists hero_slides_default_key_check;
alter table public.hero_slides
  add constraint hero_slides_default_key_check check (
    (slide_kind = 'custom' and default_key is null)
    or (slide_kind = 'default' and default_key in (
      'admissions', 'licence', 'graduation',
      'home-welcome', 'home-sunday', 'home-admissions',
      'home-ministries', 'home-community'
    ))
  );

update public.hero_slides
set slide_kind = 'default',
    default_key = case id
      when '10000000-0000-4000-8000-000000000001'::uuid then 'home-welcome'
      when '10000000-0000-4000-8000-000000000002'::uuid then 'home-sunday'
      when '10000000-0000-4000-8000-000000000004'::uuid then 'home-admissions'
      when '10000000-0000-4000-8000-000000000005'::uuid then 'home-ministries'
      when '10000000-0000-4000-8000-000000000006'::uuid then 'home-community'
    end,
    updated_at = timezone('utc', now())
where id in (
  '10000000-0000-4000-8000-000000000001'::uuid,
  '10000000-0000-4000-8000-000000000002'::uuid,
  '10000000-0000-4000-8000-000000000004'::uuid,
  '10000000-0000-4000-8000-000000000005'::uuid,
  '10000000-0000-4000-8000-000000000006'::uuid
);

commit;
