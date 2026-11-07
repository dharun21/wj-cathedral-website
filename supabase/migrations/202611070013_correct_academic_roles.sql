begin;

update public.ministries
set eyebrow_en = case slug
      when 'faculty-a-paulraj' then 'Founder & Teacher'
      when 'faculty-a-george-edward' then 'Principal & Teacher'
      else 'Teacher'
    end,
    eyebrow_ta = case slug
      when 'faculty-a-paulraj' then 'நிறுவனர் மற்றும் ஆசிரியர்'
      when 'faculty-a-george-edward' then 'முதல்வர் மற்றும் ஆசிரியர்'
      else 'ஆசிரியர்'
    end,
    updated_at = timezone('utc', now())
where slug in (
  'faculty-a-paulraj',
  'faculty-a-george-edward',
  'faculty-a-john-wilmet',
  'faculty-p-ceehan-paul-thuthiraj',
  'faculty-aaron-jebaraj'
);

commit;
