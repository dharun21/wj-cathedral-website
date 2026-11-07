begin;

-- Client-supplied contact details remain draft until the church approves them for public use.
insert into public.site_settings (
  id, singleton_key, display_name, short_name, phone, address_en, address_ta, maps_url,
  youtube_url, footer_en, footer_ta, status
) values (
  '70000000-0000-4000-8000-000000000001', 'default', 'Worship to Jesus Cathedral', 'WJ Cathedral',
  '+919788056467',
  'Near Telephone Exchange, Sothakudi Road, Nannilam, Tamil Nadu',
  'தொலைபேசி நிலையம் அருகில், சோத்தக்குடி சாலை, நன்னிலம், தமிழ்நாடு',
  'https://maps.app.goo.gl/Dc9ohp6aNdBD265K9?g_st=ic',
  'https://www.youtube.com/@wjcathedralnannilam1376',
  'A local Christian worship community in Nannilam, Tamil Nadu.',
  'தமிழ்நாட்டின் நன்னிலத்தில் அமைந்துள்ள உள்ளூர் கிறிஸ்தவ ஆராதனைச் சமூகம்.',
  'draft'
) on conflict (id) do nothing;

insert into public.hero_slides (
  id, scope, eyebrow_en, eyebrow_ta, title_en, title_ta, description_en, description_ta,
  image_url, image_alt_en, image_alt_ta, cta_label_en, cta_label_ta, cta_href,
  secondary_cta_label_en, secondary_cta_label_ta, secondary_cta_href,
  enabled, status, display_order
) values
(
  '10000000-0000-4000-8000-000000000001', 'home',
  'A place to worship, pray and belong', 'ஆராதிக்கவும், ஜெபிக்கவும், ஒன்றிணையவும் ஓர் இடம்',
  'Welcome to WJ Cathedral', 'WJ Cathedral-க்கு அன்புடன் வரவேற்கிறோம்',
  'Worship to Jesus Cathedral welcomes families, neighbours and first-time visitors in Nannilam.',
  'நன்னிலத்தில் உள்ள குடும்பங்கள், அயலார்கள் மற்றும் முதன்முறையாக வருகை தருபவர்கள் அனைவரையும் Worship to Jesus Cathedral அன்புடன் வரவேற்கிறது.',
  './hero/welcome-wj-cathedral.jpg',
  'WJ Cathedral church building with the congregation gathered outside in Nannilam',
  'நன்னிலத்தில் உள்ள WJ Cathedral திருச்சபைக் கட்டிடத்தின் முன் ஒன்றுகூடியுள்ள சபையார்',
  'Plan your visit', 'உங்கள் வருகையைத் திட்டமிடுங்கள்', '#contact',
  'Watch sermons', 'செய்திகளைக் காணுங்கள்', '#sermons', true, 'published', 0
),
(
  '10000000-0000-4000-8000-000000000002', 'home',
  'Gather with us', 'எங்களோடு இணைந்திடுங்கள்',
  'Come as you are this Sunday', 'இந்த ஞாயிறு அப்படியே வாருங்கள்',
  'A simple invitation to worship, hear God’s word and share fellowship with the church family.',
  'ஆராதிக்கவும், தேவ வார்த்தையைக் கேட்கவும், திருச்சபைக் குடும்பத்தோடு ஐக்கியப்படவும் அன்புடன் அழைக்கிறோம்.',
  './hero/come-as-you-are-sunday.jpg',
  'A speaker sharing a joyful Sunday message at WJ Cathedral',
  'WJ Cathedral மேடையில் மகிழ்ச்சியுடன் ஞாயிறு செய்தியைப் பகிரும் பேச்சாளர்',
  'See worship timings', 'ஆராதனை நேரங்களைப் பாருங்கள்', '#worship',
  null, null, null, true, 'published', 1
),
(
  '10000000-0000-4000-8000-000000000003', 'home',
  'Prayer and fellowship', 'ஜெபமும் ஐக்கியமும்',
  'You are not alone', 'நீங்கள் தனியாக இல்லை',
  'Find a welcoming place to pause, pray and connect with people in your community.',
  'அமைதியாய் நின்று, ஜெபித்து, உங்கள் சமூக மக்களோடு இணைய அன்பான ஓர் இடம்.',
  './banners/prayer.svg',
  'Decorative midnight artwork reserved for an approved prayer gathering photograph',
  'அங்கீகரிக்கப்பட்ட ஜெபக் கூடுகைப் புகைப்படத்திற்கான இரவுநேர அலங்காரப் படம்',
  'Contact the church', 'திருச்சபையைத் தொடர்புகொள்ளுங்கள்', '#contact',
  null, null, null, true, 'published', 2
) on conflict (id) do nothing;

insert into public.videos (
  id, youtube_id, youtube_url, title_en, title_ta, description_en, description_ta,
  category, featured, live_status, status, display_order
) values
(
  '40000000-0000-4000-8000-000000000001', 'ul8G9GUBCXA', 'https://www.youtube.com/watch?v=ul8G9GUBCXA',
  'Good Friday Service 03-04-2026 | TAMIL CHRISTIAN MESSAGE | #WJCATHEDRAL #sundayservice | NANNILAM',
  'Good Friday Service 03-04-2026 | TAMIL CHRISTIAN MESSAGE | #WJCATHEDRAL #sundayservice | NANNILAM',
  'Good Friday service from the official WJ Cathedral Nannilam YouTube channel.',
  'அதிகாரப்பூர்வ WJ Cathedral Nannilam YouTube சேனலின் புனித வெள்ளி ஆராதனை.',
  'service', true, 'recorded', 'published', 0
),
(
  '40000000-0000-4000-8000-000000000002', 'aYlDedVM1us', 'https://www.youtube.com/watch?v=aYlDedVM1us',
  'Enna Marakala / என்ன மறக்கல | Aaron Jebaraj | Tamil Christian Song',
  'Enna Marakala / என்ன மறக்கல | Aaron Jebaraj | Tamil Christian Song',
  'Tamil Christian song from the official WJ Cathedral Nannilam YouTube channel.',
  'அதிகாரப்பூர்வ WJ Cathedral Nannilam YouTube சேனலின் தமிழ் கிறிஸ்தவப் பாடல்.',
  'song', false, 'recorded', 'published', 1
),
(
  '40000000-0000-4000-8000-000000000003', 'Zgd1Oxj7HiA', 'https://www.youtube.com/watch?v=Zgd1Oxj7HiA',
  'Sunday Service / 10-08-2025 | TAMIL CHRISTIAN MESSAGE | WJ CATHEDRAL NANNILAM',
  'Sunday Service / 10-08-2025 | TAMIL CHRISTIAN MESSAGE | WJ CATHEDRAL NANNILAM',
  'Sunday service from the official WJ Cathedral Nannilam YouTube channel.',
  'அதிகாரப்பூர்வ WJ Cathedral Nannilam YouTube சேனலின் ஞாயிறு ஆராதனை.',
  'service', true, 'recorded', 'published', 2
) on conflict (id) do nothing;

-- Supplied schedules are intentionally drafts and cannot be published until verified=true.
insert into public.worship_services (
  id, name_en, name_ta, day_en, day_ta, start_time, end_time, time_display_en, time_display_ta,
  description_en, description_ta, location_en, location_ta, active, verified, status, display_order
) values
(
  '50000000-0000-4000-8000-000000000001', 'Sunday Worship', 'ஞாயிறு ஆராதனை',
  'Every Sunday', 'ஒவ்வொரு ஞாயிற்றுக்கிழமையும்', '07:30', '11:30', '7:30 AM – 11:30 AM', 'காலை 7:30 – 11:30',
  'A time of worship, prayer and hearing God’s word together.', 'ஒன்றிணைந்து ஆராதித்து, ஜெபித்து, தேவ வார்த்தையைக் கேட்கும் நேரம்.',
  'WJ Cathedral, Nannilam', 'WJ Cathedral, நன்னிலம்', true, false, 'draft', 0
),
(
  '50000000-0000-4000-8000-000000000002', 'Night Prayer', 'இரவு ஜெபம்',
  'Day to be confirmed', 'நாள் உறுதிப்படுத்தப்பட வேண்டும்', '21:00', '23:59', '9:00 PM – 12:00 AM', 'இரவு 9:00 – 12:00',
  'Please confirm the weekday before planning a visit.', 'வருகையைத் திட்டமிடுவதற்கு முன் நாளை உறுதிப்படுத்துங்கள்.',
  'WJ Cathedral, Nannilam', 'WJ Cathedral, நன்னிலம்', true, false, 'draft', 1
) on conflict (id) do nothing;

insert into public.gallery_albums (id, slug, title_en, title_ta, status, display_order) values
  ('20000000-0000-4000-8000-000000000001', 'church-building', 'Church Building', 'திருச்சபைக் கட்டிடம்', 'published', 0),
  ('20000000-0000-4000-8000-000000000002', 'vacation-bible-school', 'Vacation Bible School', 'விடுமுறை வேதாகமப் பள்ளி', 'published', 1),
  ('20000000-0000-4000-8000-000000000003', 'prayer', 'Prayer', 'ஜெபம்', 'published', 2)
on conflict (id) do nothing;

insert into public.gallery_images (
  id, album_id, image_url, caption_en, caption_ta, alt_en, alt_ta, featured, status, display_order
) values
(
  '30000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', './gallery/church-building/church-building-01.jpg',
  'WJ Cathedral church building', 'WJ Cathedral திருச்சபைக் கட்டிடம்',
  'WJ Cathedral church building with the congregation gathered outside', 'வெளியில் சபையார் ஒன்றுகூடியுள்ள WJ Cathedral திருச்சபைக் கட்டிடம்', true, 'published', 0
),
(
  '30000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000002', './gallery/vacation-bible-school-2026/vbs-2026-01.jpg',
  'A child speaking during Vacation Bible School 2026', '2026 விடுமுறை வேதாகமப் பள்ளியில் பேசும் சிறுமி',
  'A child speaking on stage with an adult leader during Vacation Bible School 2026', '2026 விடுமுறை வேதாகமப் பள்ளியில் ஒரு பெரியவர் வழிநடத்த, மேடையில் பேசும் சிறுமி', true, 'published', 0
),
(
  '30000000-0000-4000-8000-000000000003', '20000000-0000-4000-8000-000000000002', './gallery/vacation-bible-school-2026/vbs-2026-02.jpg',
  'Children and families gathered in prayer', 'ஜெபத்தில் ஒன்றுகூடிய சிறுவர்களும் குடும்பங்களும்',
  'Children and families gathered together in prayer during Vacation Bible School 2026', '2026 விடுமுறை வேதாகமப் பள்ளியில் ஒன்றுகூடி ஜெபிக்கும் சிறுவர்களும் குடும்பங்களும்', false, 'published', 1
),
(
  '30000000-0000-4000-8000-000000000004', '20000000-0000-4000-8000-000000000002', './gallery/vacation-bible-school-2026/vbs-2026-03.jpg',
  'An action song during Vacation Bible School', 'விடுமுறை வேதாகமப் பள்ளியின் செய்கைப் பாடல்',
  'A teacher leading an action song on stage during Vacation Bible School 2026', '2026 விடுமுறை வேதாகமப் பள்ளியில் மேடையில் செய்கைப் பாடலை வழிநடத்தும் ஆசிரியை', false, 'published', 2
),
(
  '30000000-0000-4000-8000-000000000005', '20000000-0000-4000-8000-000000000002', './gallery/vacation-bible-school-2026/vbs-2026-04.jpg',
  'Children’s stage teaching', 'சிறுவர்களுக்கான மேடைப் போதனை',
  'A leader teaching children from the stage during Vacation Bible School 2026', '2026 விடுமுறை வேதாகமப் பள்ளியில் மேடையிலிருந்து சிறுவர்களுக்கு கற்பிக்கும் தலைவர்', false, 'published', 3
),
(
  '30000000-0000-4000-8000-000000000006', '20000000-0000-4000-8000-000000000002', './gallery/vacation-bible-school-2026/vbs-2026-05.jpg',
  'Girls taking part in a learning activity', 'கற்றல் செயல்பாட்டில் பங்கேற்கும் சிறுமிகள்',
  'Girls taking part in a cup-and-ball activity during Vacation Bible School 2026', '2026 விடுமுறை வேதாகமப் பள்ளியில் கோப்பை மற்றும் பந்து விளையாட்டில் பங்கேற்கும் சிறுமிகள்', false, 'published', 4
),
(
  '30000000-0000-4000-8000-000000000007', '20000000-0000-4000-8000-000000000002', './gallery/vacation-bible-school-2026/vbs-2026-06.jpg',
  'A young speaker during Vacation Bible School', 'விடுமுறை வேதாகமப் பள்ளியில் இளம் பேச்சாளர்',
  'A young woman speaking with a microphone during Vacation Bible School 2026', '2026 விடுமுறை வேதாகமப் பள்ளியில் ஒலிவாங்கியுடன் பேசும் இளம்பெண்', false, 'published', 5
),
(
  '30000000-0000-4000-8000-000000000008', '20000000-0000-4000-8000-000000000002', './gallery/vacation-bible-school-2026/vbs-2026-07.jpg',
  'Boys taking part in a learning activity', 'கற்றல் செயல்பாட்டில் பங்கேற்கும் சிறுவர்கள்',
  'Boys taking part in a cup-and-ball activity during Vacation Bible School 2026', '2026 விடுமுறை வேதாகமப் பள்ளியில் கோப்பை மற்றும் பந்து விளையாட்டில் பங்கேற்கும் சிறுவர்கள்', false, 'published', 6
),
(
  '30000000-0000-4000-8000-000000000009', '20000000-0000-4000-8000-000000000002', './gallery/vacation-bible-school-2026/vbs-2026-08.jpg',
  'Teachers guiding a child during an activity', 'செயல்பாட்டில் சிறுமியை வழிநடத்தும் ஆசிரியர்கள்',
  'Teachers encouraging a child during an activity at Vacation Bible School 2026', '2026 விடுமுறை வேதாகமப் பள்ளிச் செயல்பாட்டில் ஒரு சிறுமியை ஊக்குவிக்கும் ஆசிரியர்கள்', false, 'published', 7
),
(
  '30000000-0000-4000-8000-000000000010', '20000000-0000-4000-8000-000000000003', './gallery/prayer/prayer-01.jpg',
  'A prayer message at WJ Cathedral', 'WJ Cathedral-ல் ஜெபச் செய்தி',
  'A church elder sharing a prayer message from the lectern at WJ Cathedral', 'WJ Cathedral மேடையில் ஜெபச் செய்தியைப் பகிரும் திருச்சபை மூத்தவர்', false, 'published', 0
),
(
  '30000000-0000-4000-8000-000000000011', '20000000-0000-4000-8000-000000000003', './gallery/prayer/prayer-02.jpg',
  'Prayer leaders sharing with the congregation', 'சபையாரோடு பகிரும் ஜெபத் தலைவர்கள்',
  'Two prayer leaders sharing with the congregation from the lectern at WJ Cathedral', 'WJ Cathedral மேடையிலிருந்து சபையாரோடு பகிரும் இரண்டு ஜெபத் தலைவர்கள்', true, 'published', 1
),
(
  '30000000-0000-4000-8000-000000000012', '20000000-0000-4000-8000-000000000003', './gallery/prayer/prayer-03.jpg',
  'Prayer leaders worshipping together', 'ஒன்றிணைந்து ஆராதிக்கும் ஜெபத் தலைவர்கள்',
  'Prayer leaders worshipping together on stage at WJ Cathedral', 'WJ Cathedral மேடையில் ஒன்றிணைந்து ஜெபித்து ஆராதிக்கும் ஜெபத் தலைவர்கள்', false, 'published', 2
) on conflict (id) do nothing;

-- Ministry content is client-supplied but operational details remain unverified, so it starts as draft.
insert into public.ministries (
  id, slug, group_key, title_en, title_ta, eyebrow_en, eyebrow_ta, description_en, description_ta,
  icon_key, featured, status, display_order
) values
('60000000-0000-4000-8000-000000000001','children-ministry','church','Children’s Ministry','சிறுவர் ஊழியம்','Belong · Learn · Grow','இணைதல் · கற்றல் · வளர்தல்','A caring, age-appropriate ministry where children can discover biblical truth, learn to pray and grow within the life of the church.','சிறுவர்கள் வேதாகமச் சத்தியத்தை அறிந்து, ஜெபிக்கக் கற்று, திருச்சபை வாழ்க்கையில் வளர உதவும் அன்பான வயதுக்கேற்ற ஊழியம்.','children',true,'draft',0),
('60000000-0000-4000-8000-000000000002','youth-ministry','church','Youth Ministry','வாலிபர் ஊழியம்','Faith · Friendship · Purpose','விசுவாசம் · நட்பு · நோக்கம்','A place for young people to deepen their faith, build healthy friendships and serve Christ with purpose.','இளைஞர்கள் விசுவாசத்தில் வளர்ந்து, நல்ல நட்புகளை உருவாக்கி, நோக்கத்துடன் கிறிஸ்துவைச் சேவிக்கும் இடம்.','youth',true,'draft',1),
('60000000-0000-4000-8000-000000000003','family-counselling','church','Family Counselling','குடும்ப ஆலோசனை','Listen · Encourage · Restore','செவிகொடுத்தல் · ஊக்குதல் · புதுப்பித்தல்','Confidential pastoral listening and biblical encouragement for individuals, couples and families.','தனிநபர்கள், தம்பதிகள் மற்றும் குடும்பங்களுக்கு இரகசியமான மேய்ப்புப் பராமரிப்பும் வேதாகம ஊக்கமும்.','family',true,'draft',2),
('60000000-0000-4000-8000-000000000004','church-planting-seminar','church','Church Planting Seminar','திருச்சபை நிறுவுதல் கருத்தரங்கு','Prepare · Plant · Nurture','ஆயத்தம் · நிறுவுதல் · வளர்த்தல்','Biblical and practical preparation for those exploring church planting.','திருச்சபை நிறுவுதலை ஆராய்வோருக்கான வேதாகம மற்றும் நடைமுறை ஆயத்தம்.','planting',false,'draft',3),
('60000000-0000-4000-8000-000000000005','leaders-seminar','church','Leaders’ Seminar','தலைவர்கள் கருத்தரங்கு','Character · Wisdom · Service','நற்குணம் · ஞானம் · சேவை','Biblical formation for pastors, ministry leaders and emerging servants.','போதகர்கள், ஊழியத் தலைவர்கள் மற்றும் வளர்ந்து வரும் ஊழியர்களுக்கான வேதாகம உருவாக்கம்.','leaders',false,'draft',4),
('60000000-0000-4000-8000-000000000006','gospel-ministries','church','Gospel Ministries','சுவிசேஷ ஊழியங்கள்','Pray · Go · Share','ஜெபம் · செல்லுதல் · பகிர்தல்','Prayerful Gospel outreach sharing the message of Jesus Christ clearly and compassionately.','இயேசு கிறிஸ்துவின் செய்தியைத் தெளிவாகவும் இரக்கத்துடனும் பகிரும் ஜெபமுள்ள சுவிசேஷப் பணி.','gospel',false,'draft',5),
('60000000-0000-4000-8000-000000000007','tree-planting','community','One Crore Tree Planting Mission','ஒரு கோடி மரநடுகைப் பணி','Creation care','படைப்பைப் பேணுதல்','A long-term vision for organised planting, local participation and continued care.','திட்டமிட்ட மரநடுகை, உள்ளூர் பங்கேற்பு மற்றும் தொடர்ந்து பராமரித்தலுக்கான நீண்டகால நோக்கம்.','tree',true,'draft',0),
('60000000-0000-4000-8000-000000000008','family-relief','community','Family Relief & Essential Support','குடும்ப நிவாரணமும் அத்தியாவசிய உதவியும்','Compassionate care','இரக்கமுள்ள அக்கறை','Need-based assistance for low-income families facing difficult seasons.','சிரமங்களை எதிர்கொள்ளும் குறைந்த வருமானக் குடும்பங்களுக்கு தேவைக்கேற்ற உதவி.','family',true,'draft',1),
('60000000-0000-4000-8000-000000000009','widow-care','community','Widow Care & Encouragement','விதவைகளுக்கான அக்கறையும் ஊக்கமும்','Compassionate care','இரக்கமுள்ள அக்கறை','Pastoral encouragement and practical assistance for widows.','விதவைகளுக்கு மேய்ப்புப் பராமரிப்பும் நடைமுறை உதவியும்.','widow',false,'draft',2),
('60000000-0000-4000-8000-000000000010','hospital-care','community','Hospital Patient Care','மருத்துவமனை நோயாளர் பராமரிப்பு','Health outreach','நலவாழ்வு சேவை','Prayerful visits and appropriate support for patients and families.','நோயாளிகளுக்கும் குடும்பங்களுக்கும் ஜெபத்துடன் கூடிய சந்திப்பும் ஆதரவும்.','hospital',false,'draft',3),
('60000000-0000-4000-8000-000000000011','medical-camps','community','Community Medical Camps','சமூக மருத்துவ முகாம்கள்','Health outreach','நலவாழ்வு சேவை','Health camps intended to bring screening and awareness closer to the community.','பரிசோதனை மற்றும் விழிப்புணர்வை சமூகத்திற்கு அருகில் கொண்டுவரும் மருத்துவ முகாம்கள்.','camp',false,'draft',4),
('60000000-0000-4000-8000-000000000012','free-tuition','community','Free Neighbourhood Tuition','இலவச பகுதிநேரப் பயிற்சி மையங்கள்','Education support','கல்வி உதவி','Free learning support planned across multiple locations in town.','நகரின் பல பகுதிகளில் திட்டமிடப்படும் இலவச கல்வி உதவி.','tuition',false,'draft',5),
('60000000-0000-4000-8000-000000000013','student-essentials','community','Free School Essentials','இலவச பள்ளி உபகரணங்கள்','Education support','கல்வி உதவி','School bags, writing kits and stationery supplied free to students.','பள்ளிப்பைகள், எழுதுபொருள் தொகுப்புகள் மற்றும் அலுவல் பொருட்கள் மாணவர்களுக்கு இலவசமாக வழங்குதல்.','school-kit',false,'draft',6)
on conflict (id) do nothing;

insert into public.page_content (id, page_key, content_key, content_en, content_ta, status, display_order) values
('80000000-0000-4000-8000-000000000001','home','about.title','A church home in the heart of Nannilam','நன்னிலத்தின் இதயத்தில் ஒரு திருச்சபைக் குடும்பம்','draft',0),
('80000000-0000-4000-8000-000000000002','church','churchPage.hero.title','Forming disciples. Strengthening families. Equipping the Church.','சீஷர்களை உருவாக்குதல். குடும்பங்களை வலுப்படுத்துதல். திருச்சபையை ஆயத்தப்படுத்துதல்.','draft',0),
('80000000-0000-4000-8000-000000000003','prayer','prayerPage.title','A listening heart. A prayerful response.','செவிகொடுக்கும் இதயம். ஜெபத்தோடு பதிலளிக்கும் அன்பு.','draft',0),
('80000000-0000-4000-8000-000000000004','academics','academics.about.title','Church-rooted learning for a life of faithful service','உண்மையுள்ள ஊழிய வாழ்க்கைக்கான திருச்சபை சார்ந்த கல்வி','draft',0),
('80000000-0000-4000-8000-000000000005','community','community.environment.title','A greener future rooted in faithful stewardship','பொறுப்புள்ள பராமரிப்பில் வேரூன்றிய பசுமையான எதிர்காலம்','draft',0)
on conflict (id) do nothing;

commit;
