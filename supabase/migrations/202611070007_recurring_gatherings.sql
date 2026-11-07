-- Client-supplied gathering names. Operational days and times remain unverified,
-- so every new record begins as a draft and cannot be publicly selected by RLS.
insert into public.worship_services (
  id, name_en, name_ta, day_en, day_ta, start_time, end_time,
  time_display_en, time_display_ta, description_en, description_ta,
  location_en, location_ta, active, verified, status, display_order
) values
(
  '50000000-0000-4000-8000-000000000003', 'Promise Service', 'வாக்குத்தத்த ஆராதனை',
  'Schedule to be confirmed', 'அட்டவணை உறுதிப்படுத்தப்பட வேண்டும்', null, null,
  'Time to be confirmed', 'நேரம் உறுதிப்படுத்தப்பட வேண்டும்',
  'A worship and prayer gathering centred on the promises of God and encouragement from Scripture.',
  'தேவனுடைய வாக்குத்தத்தங்களையும் வேதாகம ஊக்கத்தையும் மையமாகக் கொண்ட ஆராதனை மற்றும் ஜெபக் கூடுகை.',
  'WJ Cathedral, Nannilam', 'WJ Cathedral, நன்னிலம்', true, false, 'draft', 1
),
(
  '50000000-0000-4000-8000-000000000004', 'Sunday School', 'ஞாயிறு பள்ளி',
  'Schedule to be confirmed', 'அட்டவணை உறுதிப்படுத்தப்பட வேண்டும்', null, null,
  'Time to be confirmed', 'நேரம் உறுதிப்படுத்தப்பட வேண்டும்',
  'Bible-centred learning that helps children understand faith, prayer and Christian living.',
  'சிறுவர்கள் விசுவாசம், ஜெபம் மற்றும் கிறிஸ்தவ வாழ்க்கையைப் புரிந்துகொள்ள உதவும் வேதாகம மையக் கற்றல்.',
  'WJ Cathedral, Nannilam', 'WJ Cathedral, நன்னிலம்', true, false, 'draft', 2
),
(
  '50000000-0000-4000-8000-000000000005', 'Fasting Prayers', 'உபவாச ஜெபங்கள்',
  'Schedule to be confirmed', 'அட்டவணை உறுதிப்படுத்தப்பட வேண்டும்', null, null,
  'Time to be confirmed', 'நேரம் உறுதிப்படுத்தப்பட வேண்டும்',
  'A time set apart for fasting, Scripture, prayer and intercession for the church and community.',
  'திருச்சபைக்கும் சமூகத்திற்கும் உபவாசம், வேதாகம தியானம், ஜெபம் மற்றும் பரிந்துரைக்காக ஒதுக்கப்பட்ட நேரம்.',
  'WJ Cathedral, Nannilam', 'WJ Cathedral, நன்னிலம்', true, false, 'draft', 4
),
(
  '50000000-0000-4000-8000-000000000006', 'Chain Prayer', 'சங்கிலி ஜெபம்',
  'Schedule to be confirmed', 'அட்டவணை உறுதிப்படுத்தப்பட வேண்டும்', null, null,
  'Time to be confirmed', 'நேரம் உறுதிப்படுத்தப்பட வேண்டும்',
  'A coordinated prayer fellowship in which participants pray across assigned periods with a shared purpose.',
  'ஒரே நோக்கத்துடன் பங்கேற்பாளர்கள் ஒதுக்கப்பட்ட நேரங்களில் தொடர்ந்து ஜெபிக்கும் ஒருங்கிணைந்த ஜெப ஐக்கியம்.',
  'WJ Cathedral, Nannilam', 'WJ Cathedral, நன்னிலம்', true, false, 'draft', 5
) on conflict (id) do nothing;

-- Align the supplied names while retaining the original unverified schedules.
update public.worship_services
set name_en = 'Sunday Service', display_order = 0
where id = '50000000-0000-4000-8000-000000000001' and status = 'draft';

update public.worship_services
set name_en = 'Night Prayers', name_ta = 'இரவு ஜெபங்கள்', display_order = 3
where id = '50000000-0000-4000-8000-000000000002' and status = 'draft';
