insert into public.worship_services (
  id, name_en, name_ta, day_en, day_ta, start_time, end_time,
  time_display_en, time_display_ta, description_en, description_ta,
  location_en, location_ta, active, verified, status, display_order
)
values
  ('50000000-0000-4000-8000-000000000001','Sunday Service','ஞாயிறு ஆராதனை','Every Sunday','ஒவ்வொரு ஞாயிற்றுக்கிழமையும்','08:00','23:00','8:00 AM – 11:00 PM','காலை 8:00 – இரவு 11:00','The cathedral family gathers for worship, prayer, fellowship and the ministry of God’s Word.','ஆராதனை, ஜெபம், ஐக்கியம் மற்றும் தேவ வார்த்தையின் ஊழியத்திற்காக திருச்சபைக் குடும்பம் ஒன்றுகூடுகிறது.','WJ Cathedral, Nannilam','WJ Cathedral, நன்னிலம்',true,true,'published',0),
  ('50000000-0000-4000-8000-000000000005','Church Fasting Prayer','திருச்சபை உபவாச ஜெபம்','Thursday','வியாழக்கிழமை','10:00','12:00','10:00 AM – 12:00 PM','காலை 10:00 – மதியம் 12:00','A dedicated time of fasting, Scripture meditation and united intercession for the church and community.','திருச்சபைக்கும் சமூகத்திற்கும் உபவாசம், வேதாகம தியானம் மற்றும் ஒருமித்த பரிந்துரை ஜெபத்திற்கான சிறப்பு நேரம்.','WJ Cathedral, Nannilam','WJ Cathedral, நன்னிலம்',true,true,'published',1),
  ('50000000-0000-4000-8000-000000000007','Preparation Prayer','ஆயத்த ஜெபம்','Saturday','சனிக்கிழமை','18:00','19:00','6:00 PM – 7:00 PM','மாலை 6:00 – 7:00','A prayer gathering that prepares hearts and ministry teams for Sunday worship and service.','ஞாயிறு ஆராதனை மற்றும் ஊழியத்திற்காக இருதயங்களையும் ஊழியக் குழுக்களையும் ஆயத்தப்படுத்தும் ஜெபக் கூடுகை.','WJ Cathedral, Nannilam','WJ Cathedral, நன்னிலம்',true,true,'published',2),
  ('50000000-0000-4000-8000-000000000002','Night Prayer','இரவு ஜெபம்','During the last week of every month','ஒவ்வொரு மாதத்தின் கடைசி வாரத்தில்',null,null,'Time to be confirmed','நேரம் உறுதிப்படுத்தப்பட வேண்டும்','A monthly night of worship, united prayer and intercession. Please contact the church for that month’s confirmed date and time.','மாதாந்திர இரவு ஆராதனை, ஒருமித்த ஜெபம் மற்றும் பரிந்துரை நேரம். அந்த மாதத்தின் உறுதிப்படுத்தப்பட்ட நாள் மற்றும் நேரத்திற்கு திருச்சபையைத் தொடர்புகொள்ளுங்கள்.','WJ Cathedral, Nannilam','WJ Cathedral, நன்னிலம்',true,true,'published',3),
  ('50000000-0000-4000-8000-000000000006','Chain Prayer','சங்கிலி ஜெபம்','One day every month','ஒவ்வொரு மாதமும் ஒரு நாள்',null,null,'Time to be confirmed','நேரம் உறுதிப்படுத்தப்பட வேண்டும்','A coordinated day of continuous prayer across assigned periods. The monthly date and timings will be confirmed by the church.','ஒதுக்கப்பட்ட நேரங்களில் தொடர்ச்சியாக நடைபெறும் ஒருங்கிணைந்த ஜெப நாள். மாதாந்திர நாளும் நேரங்களும் திருச்சபையால் உறுதிப்படுத்தப்படும்.','WJ Cathedral, Nannilam','WJ Cathedral, நன்னிலம்',true,true,'published',4),
  ('50000000-0000-4000-8000-000000000003','Early Morning Promise Worship Service','அதிகாலை வாக்குத்தத்த ஆராதனை','First day of every month','ஒவ்வொரு மாதத்தின் முதல் நாள்','05:00','06:30','5:00 AM – 6:30 AM','அதிகாலை 5:00 – காலை 6:30','Begin each month in worship and prayer, receiving biblical encouragement for the days ahead.','ஒவ்வொரு மாதத்தையும் ஆராதனை மற்றும் ஜெபத்துடன் தொடங்கி, வரவிருக்கும் நாட்களுக்கு வேதாகம ஊக்கத்தைப் பெறும் நேரம்.','WJ Cathedral, Nannilam','WJ Cathedral, நன்னிலம்',true,true,'published',5),
  ('50000000-0000-4000-8000-000000000008','Family Gathering of WJ Pastors','WJ போதகர்களின் குடும்பக் கூடுகை','First Monday of every month','ஒவ்வொரு மாதத்தின் முதல் திங்கட்கிழமை',null,null,'Time to be confirmed','நேரம் உறுதிப்படுத்தப்பட வேண்டும்','A monthly time of fellowship, encouragement and prayer for WJ pastors and their families.','WJ போதகர்களும் அவர்களின் குடும்பங்களும் ஐக்கியம், ஊக்கம் மற்றும் ஜெபத்திற்காக மாதந்தோறும் ஒன்றுகூடும் நேரம்.','WJ Cathedral, Nannilam','WJ Cathedral, நன்னிலம்',true,true,'published',6)
on conflict (id) do update set
  name_en=excluded.name_en,name_ta=excluded.name_ta,day_en=excluded.day_en,day_ta=excluded.day_ta,
  start_time=excluded.start_time,end_time=excluded.end_time,time_display_en=excluded.time_display_en,time_display_ta=excluded.time_display_ta,
  description_en=excluded.description_en,description_ta=excluded.description_ta,location_en=excluded.location_en,location_ta=excluded.location_ta,
  active=excluded.active,verified=excluded.verified,status=excluded.status,display_order=excluded.display_order,updated_at=now();

update public.worship_services
set active=false,status='archived',updated_at=now()
where id='50000000-0000-4000-8000-000000000004';

update public.gallery_albums
set title_en='WJCM – Vacation Bible School',title_ta='WJCM – விடுமுறை வேதாகமப் பள்ளி',updated_at=now()
where slug='vacation-bible-school';

update public.gallery_images
set caption_en=replace(caption_en,'Vacation Bible School','WJCM – Vacation Bible School'),
    caption_ta=replace(caption_ta,'விடுமுறை வேதாகமப் பள்ளி','WJCM – விடுமுறை வேதாகமப் பள்ளி'),
    alt_en=replace(alt_en,'Vacation Bible School','WJCM – Vacation Bible School'),
    alt_ta=replace(alt_ta,'விடுமுறை வேதாகமப் பள்ளி','WJCM – விடுமுறை வேதாகமப் பள்ளி'),
    updated_at=now()
where album_id=(select id from public.gallery_albums where slug='vacation-bible-school');
