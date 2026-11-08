-- Classify the supplied official YouTube links into past live sessions and
-- regular uploaded videos. Past live recordings are never labelled as
-- currently live; the newest approved session is featured first.
begin;

update public.videos
set category = 'live-session', featured = false, live_status = 'recorded', display_order = 4,
    updated_at = timezone('utc', now())
where youtube_id = 'ul8G9GUBCXA';

update public.videos
set category = 'live-session', featured = false, live_status = 'recorded', display_order = 5,
    updated_at = timezone('utc', now())
where youtube_id = 'Zgd1Oxj7HiA';

update public.videos
set category = 'song', featured = false, live_status = 'recorded', display_order = 16,
    updated_at = timezone('utc', now())
where youtube_id = 'aYlDedVM1us';

insert into public.videos (
  id, youtube_id, youtube_url, title_en, title_ta, description_en, description_ta,
  category, featured, live_status, status, display_order
) values
('40000000-0000-4000-8000-000000000004','8yLNqfqYa90','https://www.youtube.com/watch?v=8yLNqfqYa90','Sunday Service | 08-Nov-2026 | Tamil Christian Message | WJ Cathedral Nannilam','Sunday Service | 08-Nov-2026 | Tamil Christian Message | WJ Cathedral Nannilam','A church live-session recording from the official WJ Cathedral Nannilam YouTube channel.','அதிகாரப்பூர்வ WJ Cathedral Nannilam YouTube சேனலின் திருச்சபை நேரலைப் பதிவு.','live-session',true,'recorded','published',0),
('40000000-0000-4000-8000-000000000005','yGO76A0DVkk','https://www.youtube.com/watch?v=yGO76A0DVkk','Sunday Service | 11-Oct-2026 | Tamil Christian Message | WJ Cathedral Nannilam','Sunday Service | 11-Oct-2026 | Tamil Christian Message | WJ Cathedral Nannilam','A church live-session recording from the official WJ Cathedral Nannilam YouTube channel.','அதிகாரப்பூர்வ WJ Cathedral Nannilam YouTube சேனலின் திருச்சபை நேரலைப் பதிவு.','live-session',false,'recorded','published',1),
('40000000-0000-4000-8000-000000000006','Rc40JjZwdxI','https://www.youtube.com/watch?v=Rc40JjZwdxI','Night Prayer | 25-Sep-2026 | Tamil Christian Message | WJ Cathedral Nannilam','Night Prayer | 25-Sep-2026 | Tamil Christian Message | WJ Cathedral Nannilam','A church live-session recording from the official WJ Cathedral Nannilam YouTube channel.','அதிகாரப்பூர்வ WJ Cathedral Nannilam YouTube சேனலின் திருச்சபை நேரலைப் பதிவு.','live-session',false,'recorded','published',2),
('40000000-0000-4000-8000-000000000007','n_hTLKBX0Dc','https://www.youtube.com/watch?v=n_hTLKBX0Dc','Sunday Service | 20-Sep-2026 | Tamil Christian Message | WJ Cathedral Nannilam','Sunday Service | 20-Sep-2026 | Tamil Christian Message | WJ Cathedral Nannilam','A church live-session recording from the official WJ Cathedral Nannilam YouTube channel.','அதிகாரப்பூர்வ WJ Cathedral Nannilam YouTube சேனலின் திருச்சபை நேரலைப் பதிவு.','live-session',false,'recorded','published',3),
('40000000-0000-4000-8000-000000000008','neStPykiPUE','https://www.youtube.com/watch?v=neStPykiPUE','06 காலை வேத தியானம் | Tamil Christian Morning Devotion | Pr. Zeehan Paul','06 காலை வேத தியானம் | Tamil Christian Morning Devotion | Pr. Zeehan Paul','An official video from the WJ Cathedral Nannilam YouTube channel.','அதிகாரப்பூர்வ WJ Cathedral Nannilam YouTube சேனலின் காணொளி.','sermon',false,'recorded','published',10),
('40000000-0000-4000-8000-000000000009','1t1sBeO2sPA','https://www.youtube.com/watch?v=1t1sBeO2sPA','எல்ஷடாய் எந்தன் துணை நீரே | Zeehan Paul & Christy Zeehan | Tamil Christian Song','எல்ஷடாய் எந்தன் துணை நீரே | Zeehan Paul & Christy Zeehan | Tamil Christian Song','An official video from the WJ Cathedral Nannilam YouTube channel.','அதிகாரப்பூர்வ WJ Cathedral நன்னிலம் YouTube சேனலின் காணொளி.','song',false,'recorded','published',11),
('40000000-0000-4000-8000-000000000010','lPpKKqVshaQ','https://www.youtube.com/watch?v=lPpKKqVshaQ','Enakaga Yesu Piranthare | Aaron Jebaraj | Tamil Christian Song','Enakaga Yesu Piranthare | Aaron Jebaraj | Tamil Christian Song','An official video from the WJ Cathedral Nannilam YouTube channel.','அதிகாரப்பூர்வ WJ Cathedral Nannilam YouTube சேனலின் காணொளி.','song',false,'recorded','published',12),
('40000000-0000-4000-8000-000000000011','j926cuMGwNY','https://www.youtube.com/watch?v=j926cuMGwNY','Ithaiyathai Kollaikondavare | Aaron Jebaraj | Tamil Christian Song','Ithaiyathai Kollaikondavare | Aaron Jebaraj | Tamil Christian Song','An official video from the WJ Cathedral Nannilam YouTube channel.','அதிகாரப்பூர்வ WJ Cathedral நன்னிலம் YouTube சேனலின் காணொளி.','song',false,'recorded','published',13),
('40000000-0000-4000-8000-000000000012','KJd46k2KLZY','https://www.youtube.com/watch?v=KJd46k2KLZY','En Ithaiyathai Kollaikondavare | Aaron Jebaraj | Tamil Christian Song','En Ithaiyathai Kollaikondavare | Aaron Jebaraj | Tamil Christian Song','An official video from the WJ Cathedral Nannilam YouTube channel.','அதிகாரப்பூர்வ WJ Cathedral நன்னிலம் YouTube சேனலின் காணொளி.','song',false,'recorded','published',14),
('40000000-0000-4000-8000-000000000013','EYF7dgKcXxQ','https://www.youtube.com/watch?v=EYF7dgKcXxQ','11 காலை வேத தியானம் | Tamil Christian Morning Devotion | Pr. Zeehan Paul','11 காலை வேத தியானம் | Tamil Christian Morning Devotion | Pr. Zeehan Paul','An official video from the WJ Cathedral Nannilam YouTube channel.','அதிகாரப்பூர்வ WJ Cathedral நன்னிலம் YouTube சேனலின் காணொளி.','sermon',false,'recorded','published',15)
on conflict (youtube_id) do update set
  youtube_url = excluded.youtube_url,
  title_en = excluded.title_en,
  title_ta = excluded.title_ta,
  description_en = excluded.description_en,
  description_ta = excluded.description_ta,
  category = excluded.category,
  featured = excluded.featured,
  live_status = excluded.live_status,
  status = excluded.status,
  display_order = excluded.display_order,
  updated_at = timezone('utc', now());

commit;
