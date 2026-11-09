begin;

create or replace function public.get_owner_visitor_trend(p_from date, p_to date)
returns table(visited_on date, visitors bigint)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not public.is_owner() then
    raise exception 'Only an active owner can view visitor activity.' using errcode = '42501';
  end if;

  if p_from is null or p_to is null or p_from > p_to or p_to - p_from > 366 then
    raise exception 'Choose a valid visitor activity range of 367 days or fewer.' using errcode = '22023';
  end if;

  return query
  select day.value::date,
    count(distinct visitor.visitor_id)::bigint
  from generate_series(p_from::timestamp, p_to::timestamp, interval '1 day') as day(value)
  left join public.website_daily_visitors visitor
    on visitor.visited_on = day.value::date
  group by day.value
  order by day.value;
end;
$$;

revoke all on function public.get_owner_visitor_trend(date, date) from public;
grant execute on function public.get_owner_visitor_trend(date, date) to authenticated;

comment on function public.get_owner_visitor_trend(date, date) is
  'Returns owner-only daily aggregate visitor totals without exposing visitor identifiers.';

commit;
