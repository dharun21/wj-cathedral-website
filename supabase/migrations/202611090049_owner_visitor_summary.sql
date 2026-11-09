begin;

create table if not exists public.website_daily_visitors (
  visited_on date not null,
  visitor_id uuid not null,
  first_seen_at timestamptz not null default timezone('utc', now()),
  primary key (visited_on, visitor_id)
);

alter table public.website_daily_visitors enable row level security;

-- No direct table policies are created. Anonymous visitors can only call the
-- narrowly scoped recorder, and owners can only read aggregate totals.
create or replace function public.record_public_visit(p_visitor_id uuid)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  india_today date := (now() at time zone 'Asia/Kolkata')::date;
begin
  if p_visitor_id is null then return false; end if;
  insert into public.website_daily_visitors (visited_on, visitor_id)
  values (india_today, p_visitor_id)
  on conflict (visited_on, visitor_id) do nothing;
  return true;
end;
$$;

create or replace function public.get_owner_visitor_summary()
returns table(today bigint, this_week bigint, this_month bigint)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  india_today date := (now() at time zone 'Asia/Kolkata')::date;
  week_start date := date_trunc('week', india_today::timestamp)::date;
  month_start date := date_trunc('month', india_today::timestamp)::date;
begin
  if not public.is_owner() then
    raise exception 'Only an active owner can view visitor totals.' using errcode = '42501';
  end if;

  return query
  select
    count(distinct visitor.visitor_id) filter (where visitor.visited_on = india_today),
    count(distinct visitor.visitor_id) filter (where visitor.visited_on between week_start and india_today),
    count(distinct visitor.visitor_id) filter (where visitor.visited_on between month_start and india_today)
  from public.website_daily_visitors visitor
  where visitor.visited_on between month_start and india_today;
end;
$$;

revoke all on table public.website_daily_visitors from anon, authenticated;
revoke all on function public.record_public_visit(uuid) from public;
revoke all on function public.get_owner_visitor_summary() from public;
grant execute on function public.record_public_visit(uuid) to anon, authenticated;
grant execute on function public.get_owner_visitor_summary() to authenticated;

comment on table public.website_daily_visitors is
  'Privacy-minimal anonymous daily visitor deduplication. Stores no IP, route, referrer, device, name or email.';

commit;
