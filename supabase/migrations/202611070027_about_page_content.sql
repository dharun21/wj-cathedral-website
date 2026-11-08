-- Publish the client-confirmed About Us story as editable bilingual page content.
-- The unconfirmed church founding year is intentionally not asserted.
begin;

insert into public.page_content (
  page_key, content_key, content_en, content_ta, status, display_order
) values
('about','aboutPage.hero.title','A church family growing in worship, faith and service.','ஆராதனை, விசுவாசம் மற்றும் சேவையில் வளரும் ஒரு திருச்சபைக் குடும்பம்.','published',0),
('about','aboutPage.hero.intro','Worship to Jesus Cathedral is a Christian worship community serving families, visitors and neighbours in Nannilam, Tamil Nadu.','Worship to Jesus Cathedral தமிழ்நாட்டின் நன்னிலத்தில் குடும்பங்கள், வருகையாளர்கள் மற்றும் அயலார்களுக்கு சேவை செய்யும் ஒரு கிறிஸ்தவ ஆராதனைச் சமூகம்.','published',1),
('about','aboutPage.story.title','Rooted in Nannilam. Reaching every generation.','நன்னிலத்தில் வேரூன்றி. ஒவ்வொரு தலைமுறையையும் சென்றடைந்து.','published',2),
('about','aboutPage.story.body1','WJ Cathedral’s story is carried through a local community gathering for worship, prayer, biblical learning and fellowship. It is a place where families and first-time visitors are welcomed to seek Jesus together.','WJ Cathedral-ன் பயணம் ஆராதனை, ஜெபம், வேதாகமக் கற்றல் மற்றும் ஐக்கியத்திற்காக ஒன்றுகூடும் உள்ளூர் சமூகத்தின் மூலம் தொடர்கிறது. குடும்பங்களும் முதன்முறையாக வருகை தருபவர்களும் ஒன்றாக இயேசுவைத் தேட வரவேற்கப்படும் இடம் இது.','published',3),
('about','aboutPage.story.body2','That life now extends through ministries for children, young people and families, leadership formation, Gospel ministry, theological education and practical Community Care.','இந்த வாழ்க்கை இன்று சிறுவர்கள், இளைஞர்கள் மற்றும் குடும்பங்களுக்கான ஊழியங்கள், தலைமைத்துவ உருவாக்கம், சுவிசேஷ ஊழியம், இறையியல் கல்வி மற்றும் நடைமுறை சமூக அக்கறை வழியாக விரிகிறது.','published',4),
('about','aboutPage.founder.statement','A legacy of worship, biblical teaching and service.','ஆராதனை, வேதாகமப் போதனை மற்றும் சேவையின் பாரம்பரியம்.','published',5),
('about','aboutPage.founder.body1','The church identifies Rev. Pr. A. Paulraj as the founder of Worship to Jesus Cathedral. His founding leadership is part of the church’s continuing life of worship, prayer and Gospel-centred ministry in Nannilam.','Worship to Jesus Cathedral-ன் நிறுவனராக Rev. Pr. A. Paulraj அவர்களை திருச்சபை அடையாளப்படுத்துகிறது. அவரது நிறுவனத் தலைமை நன்னிலத்தில் தொடரும் திருச்சபையின் ஆராதனை, ஜெபம் மற்றும் சுவிசேஷ மைய ஊழிய வாழ்க்கையின் ஒரு பகுதியாகும்.','published',6),
('about','aboutPage.founder.body2','He also serves as founder and teacher of Worship To Jesus Bible Institute & College, connecting local church life with the preparation of people for faithful Christian service.','அவர் Worship To Jesus Bible Institute & College-ன் நிறுவனராகவும் ஆசிரியராகவும் சேவை செய்து, உள்ளூர் திருச்சபை வாழ்க்கையை உண்மையுள்ள கிறிஸ்தவ சேவைக்கான ஆயத்தத்துடன் இணைக்கிறார்.','published',7),
('about','aboutPage.journey.foundationBody','Under the founding leadership of Rev. Pr. A. Paulraj, WJ Cathedral has grown as a local community centred on worship, prayer, fellowship and Gospel ministry.','Rev. Pr. A. Paulraj அவர்களின் நிறுவனத் தலைமையின் கீழ், WJ Cathedral ஆராதனை, ஜெபம், ஐக்கியம் மற்றும் சுவிசேஷ ஊழியத்தை மையமாகக் கொண்ட உள்ளூர் சமூகமாக வளர்ந்துள்ளது.','published',8),
('about','aboutPage.journey.collegeBody','Worship To Jesus Bible Institute & College was established in 2015 to provide church-rooted theological and music education.','திருச்சபையை மையமாகக் கொண்ட இறையியல் மற்றும் இசைக் கல்வியை வழங்க Worship To Jesus Bible Institute & College 2015-ல் தொடங்கப்பட்டது.','published',9),
('about','aboutPage.journey.ministriesBody','Children’s Ministry, Youth Ministry, Family Counselling, Church Planting and Leaders’ Seminars, and Gospel Ministries create pathways for growth and service.','சிறுவர் ஊழியம், வாலிபர் ஊழியம், குடும்ப ஆலோசனை, திருச்சபை நிறுவுதல் மற்றும் தலைவர்கள் கருத்தரங்குகள், சுவிசேஷ ஊழியங்கள் ஆகியவை வளர்ச்சிக்கும் சேவைக்கும் பாதைகளை உருவாக்குகின்றன.','published',10),
('about','aboutPage.journey.careBody','Community Care extends through environmental stewardship, family and widow support, hospital assistance, medical camps, tuition and school essentials.','சுற்றுச்சூழல் பராமரிப்பு, குடும்ப மற்றும் விதவை ஆதரவு, மருத்துவமனை உதவி, மருத்துவ முகாம்கள், இலவச பயிற்சி மற்றும் பள்ளி உபகரணங்கள் வழியாக சமூக அக்கறை விரிகிறது.','published',11),
('about','aboutPage.values.jesusBody','Church life begins with worship and a shared desire to know and honour Jesus Christ.','ஆராதனையுடனும் இயேசு கிறிஸ்துவை அறிந்து கனப்படுத்தும் பகிர்ந்த விருப்பத்துடனும் திருச்சபை வாழ்க்கை தொடங்குகிறது.','published',12),
('about','aboutPage.values.prayerBody','Prayer, encouragement and fellowship help people walk through every season together.','ஜெபம், ஊக்கம் மற்றும் ஐக்கியம் ஒவ்வொரு பருவத்திலும் மக்கள் ஒன்றாக நடக்க உதவுகின்றன.','published',13),
('about','aboutPage.values.wordBody','Teaching and theological education equip children, families and leaders for faithful service.','போதனையும் இறையியல் கல்வியும் சிறுவர்கள், குடும்பங்கள் மற்றும் தலைவர்களை உண்மையுள்ள சேவைக்காக ஆயத்தப்படுத்துகின்றன.','published',14),
('about','aboutPage.values.serviceBody','Practical care seeks to serve neighbours with dignity, responsibility and love.','நடைமுறை அக்கறை அயலார்களுக்கு கண்ணியம், பொறுப்பு மற்றும் அன்புடன் சேவை செய்ய முனைகிறது.','published',15)
on conflict (page_key, content_key) do update set
  content_en = excluded.content_en,
  content_ta = excluded.content_ta,
  status = excluded.status,
  display_order = excluded.display_order,
  updated_at = timezone('utc', now());

commit;
