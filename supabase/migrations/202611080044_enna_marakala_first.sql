-- Keep the existing Enna Marakala song first in the regular Videos section.
begin;

update public.videos
set display_order = 0,
    featured = false,
    category = 'song',
    live_status = 'recorded',
    updated_at = timezone('utc', now())
where youtube_id = 'aYlDedVM1us';

commit;
