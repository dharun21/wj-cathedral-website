begin;

-- Notify a signed-in CMS user immediately when the owner revokes, restores or
-- deletes that user's membership. RLS still remains the security boundary.
do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'admin_memberships'
  ) then
    alter publication supabase_realtime add table public.admin_memberships;
  end if;
end
$$;

commit;
