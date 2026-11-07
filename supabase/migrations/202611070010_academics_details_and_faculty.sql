begin;

-- Client-supplied academic leadership and faculty details.
-- Portrait URLs intentionally remain empty until approved photographs are uploaded.
insert into public.ministries (
  id, slug, group_key, title_en, title_ta, eyebrow_en, eyebrow_ta,
  description_en, description_ta, image_url, icon_key, featured, status, display_order
) values
(
  '60000000-0000-4000-8000-000000000014', 'faculty-a-paulraj', 'academics',
  'Rev. Pr. A. Paulraj', 'Rev. Pr. A. Paulraj', 'Founder & Teacher', 'நிறுவனர் மற்றும் ஆசிரியர்',
  '', '', './academics/faculty/paulraj.jpg', 'faculty', false, 'published', 10
),
(
  '60000000-0000-4000-8000-000000000015', 'faculty-a-george-edward', 'academics',
  'Pr. A. George Edward', 'Pr. A. George Edward', 'Principal & Teacher', 'முதல்வர் மற்றும் ஆசிரியர்',
  'M.Th', 'M.Th', './academics/faculty/george-edward.jpg', 'faculty', true, 'published', 11
),
(
  '60000000-0000-4000-8000-000000000016', 'faculty-a-john-wilmet', 'academics',
  'Pr. A. John Wilmet', 'Pr. A. John Wilmet', 'Teacher', 'ஆசிரியர்',
  'M.Div', 'M.Div', './academics/faculty/john-wilmet.jpg', 'faculty', false, 'published', 12
),
(
  '60000000-0000-4000-8000-000000000017', 'faculty-p-ceehan-paul-thuthiraj', 'academics',
  'Pr. P. Ceehan Paul Thuthiraj', 'Pr. P. Ceehan Paul Thuthiraj', 'Teacher', 'ஆசிரியர்',
  'M.Th', 'M.Th', './academics/faculty/ceehan-paul-thuthiraj.jpg', 'faculty', false, 'published', 13
),
(
  '60000000-0000-4000-8000-000000000018', 'faculty-aaron-jebaraj', 'academics',
  'Bro. Aaron Jebaraj', 'Bro. Aaron Jebaraj', 'Teacher', 'ஆசிரியர்',
  'M.Div', 'M.Div', './academics/faculty/aaron-jebaraj.jpg', 'faculty', false, 'published', 14
)
on conflict (slug) do update set
  title_en = excluded.title_en,
  title_ta = excluded.title_ta,
  eyebrow_en = excluded.eyebrow_en,
  eyebrow_ta = excluded.eyebrow_ta,
  description_en = excluded.description_en,
  description_ta = excluded.description_ta,
  icon_key = excluded.icon_key,
  featured = excluded.featured,
  display_order = excluded.display_order,
  updated_at = timezone('utc', now());

update public.page_content
set content_en = 'Bible-centred education for faithful Christian service',
    content_ta = 'உண்மையுள்ள கிறிஸ்தவ ஊழியத்திற்கான வேதாகம மையக் கல்வி',
    updated_at = timezone('utc', now())
where page_key = 'academics' and content_key = 'academics.about.title';

commit;
