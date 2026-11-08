import type { LocalizedText } from '../types/content'

export interface ChurchHistorySection {
  number: string
  title: LocalizedText
  paragraphs: LocalizedText[]
  image?: string
  imagePosition?: 'left' | 'right'
}

export const churchOrigin: ChurchHistorySection = {
  number: '1',
  title: { en: 'Origin of Worship to Jesus Cathedral', ta: 'இயேசுவுக்கே ஆராதனை திருச்சபையின் தோற்றம்' },
  paragraphs: [
    {
      en: 'Worship to Jesus Ministries (WTJ) was formed by Rev. Pr. A. Paulraj, who later established many churches in the Thiruvarur district of Tamil Nadu. As the founder of the mission, he carried a vision to plant many churches throughout the district. In the early days he began ministry in Nannilam, sharing the Gospel with villagers every day and intentionally reaching people who had not yet heard it.',
      ta: 'இயேசுவுக்கே ஆராதனை ஊழியங்கள்—WTJ, Worship to Jesus Cathedral—Rev. Pr. A. Paulraj அவர்களால் தொடங்கப்பட்டது. பின்னர் அவர் தமிழ்நாட்டின் திருவாரூர் மாவட்டத்தில் பல திருச்சபைகளை நிறுவினார். இந்த ஊழியத்தின் நிறுவுநராக மாவட்டம் முழுவதும் பல திருச்சபைகளை நிறுவும் தரிசனத்தை அவர் சுமந்தார். ஆரம்ப நாட்களில் நன்னிலத்தில் ஊழியத்தைத் தொடங்கி, தினமும் கிராம மக்களிடம் சுவிசேஷத்தைப் பகிர்ந்து, இதுவரை அதை அறியாத மக்களை அக்கறையுடன் சென்றடைந்தார்.',
    },
    {
      en: 'The church began through a Sunday school ministry for children aged fifteen and below. After several months, the Sunday school developed into a small prayer group where people gathered for healing prayer. The number of people grew, many became followers of Jesus Christ, and they grew in faith in his name. This was the early establishment of the ministry in Nannilam. The journey was not without difficulty: challenges arose from political and religious groups, but Rev. Pr. A. Paulraj held firmly to the vision and mission God had given him and continued moving forward.',
      ta: 'பதினைந்து வயதிற்குட்பட்ட சிறுவர்களுக்கான ஞாயிறு பள்ளி ஊழியத்தின் மூலம் திருச்சபை ஆரம்பமானது. சில மாதங்களுக்குப் பிறகு, மக்கள் சுகமளிக்கும் ஜெபத்திற்காக கூடும் சிறிய ஜெபக் குழுவாக அது வளர்ந்தது. மக்கள் எண்ணிக்கை அதிகரித்து, பலர் இயேசு கிறிஸ்துவைப் பின்பற்றத் தொடங்கி, அவருடைய நாமத்தில் விசுவாசத்தில் வளர்ந்தனர். இதுவே நன்னிலத்தில் ஊழியத்தின் ஆரம்ப நிறுவலாக அமைந்தது. அரசியல் மற்றும் மத அமைப்புகளிடமிருந்து பல சவால்கள் எழுந்தபோதிலும், தேவன் கொடுத்த தரிசனத்தையும் பணியையும் Rev. Pr. A. Paulraj உறுதியாகப் பற்றிக்கொண்டு தொடர்ந்து முன்னேறினார்.',
    },
  ],
}

export const churchVision = {
  number: '2',
  title: { en: 'The vision of Worship to Jesus Cathedral', ta: 'இயேசுவுக்கே ஆராதனை திருச்சபையின் தரிசனம்' } satisfies LocalizedText,
  quote: {
    en: 'All the nations, all the states, all the districts, all the villages and all the homes should worship God alone.',
    ta: 'எல்லா தேசங்களும், எல்லா மாநிலங்களும், எல்லா மாவட்டங்களும், எல்லா கிராமங்களும், எல்லா வீடுகளும் தேவனை மட்டுமே ஆராதிக்க வேண்டும்.',
  } satisfies LocalizedText,
  paragraphs: [
    {
      en: 'This declaration formed the vision and mission of Worship to Jesus Ministries. It remained the burden of Rev. Pr. A. Paulraj, who trusted God for its fulfilment. With confidence in God, he continued working toward establishing that vision.',
      ta: 'இந்த அறிக்கையே இயேசுவுக்கே ஆராதனை ஊழியங்களின் தரிசனமும் பணியும் ஆனது. அதன் நிறைவேற்றத்திற்காக தேவனை நம்பிய Rev. Pr. A. Paulraj அவர்களின் இருதயப் பாரமாக அது தொடர்ந்து இருந்தது. தேவன்மேல் கொண்ட நம்பிக்கையுடன் அந்தத் தரிசனத்தை நிறுவ அவர் தொடர்ந்து உழைத்தார்.',
    },
  ] satisfies LocalizedText[],
}

export const churchGrowthIntro: LocalizedText = {
  en: 'The ministry did not begin in one permanent building. Because the early gathering places were rented rather than owned, the church moved through eight locations within the Nannilam area while continuing its ministry and pursuing the vision of a permanent home.',
  ta: 'இந்த ஊழியம் ஒரு நிரந்தரக் கட்டிடத்தில் தொடங்கவில்லை. ஆரம்பத்தில் பயன்படுத்தப்பட்ட இடங்கள் சொந்தமானவை அல்லாமல் வாடகை இடங்களாக இருந்ததால், ஊழியத்தைத் தொடர்ந்து நடத்தியும் நிரந்தர இல்லத்தின் தரிசனத்தைப் பின்தொடர்ந்தும் நன்னிலம் பகுதியில் எட்டு இடங்களுக்கு திருச்சபை மாறியது.',
}

export const churchHistoryLocations: ChurchHistorySection[] = [
  {
    number: '3.1',
    title: { en: 'Thalaiyari Street', ta: 'தலையாரி தெரு' },
    image: './about/history/3-1-thalaiyari-street.jpg',
    imagePosition: 'right',
    paragraphs: [
      {
        en: 'Pastor R. Titus and Pastor T. Daniel Devadhas—the spiritual father of Rev. Pr. A. Paulraj—helped him plant the church in a rented house on Thalaiyari Street. On 7 April 1995, Worship to Jesus Cathedral was inaugurated by Pastor Titus and Pastor Daniel. From that point, the mission expanded through Gospel preaching in village streets, house visits and house-prayer fellowships organised by believers and elders.',
        ta: 'Rev. Pr. A. Paulraj அவர்களின் ஆவிக்குரிய தந்தையான Pastor T. Daniel Devadhas மற்றும் Pastor R. Titus ஆகியோர் தலையாரி தெருவில் வாடகை வீட்டில் திருச்சபையை நிறுவ உதவினர். 7 ஏப்ரல் 1995 அன்று Pastor Titus மற்றும் Pastor Daniel அவர்களால் இயேசுவுக்கே ஆராதனை திருச்சபை திறக்கப்பட்டது. அதன்பின், கிராமத் தெருக்களில் சுவிசேஷப் பிரசங்கம், வீடு சந்திப்பு மற்றும் விசுவாசிகளும் மூப்பர்களும் ஏற்பாடு செய்த வீட்டு ஜெப ஐக்கியங்கள் வழியாக ஊழியம் விரிவடைந்தது.',
      },
      {
        en: 'At first, five to ten people attended regularly. Within a few months, thirty to forty people were gathering to worship God, and people were becoming believers in Christ. Despite political and religious opposition, the house filled with worshippers. When the space became too small, the church moved to Meal Agragaram near Thalaiyari Street.',
        ta: 'ஆரம்பத்தில் ஐந்து முதல் பத்து பேர் தொடர்ந்து வந்தனர். சில மாதங்களுக்குள் முப்பது முதல் நாற்பது பேர் தேவனை ஆராதிக்கக் கூடினர்; பலர் கிறிஸ்துவில் விசுவாசிகளானார்கள். அரசியல் மற்றும் மத எதிர்ப்புகள் இருந்தபோதிலும் வீடு ஆராதகர்களால் நிரம்பியது. இடம் போதாமையால், தலையாரி தெருவுக்கு அருகிலுள்ள மேல் அக்ரகாரத்திற்கு திருச்சபை மாறியது.',
      },
    ],
  },
  {
    number: '3.2',
    title: { en: 'Meal Agragaram', ta: 'மேல் அக்ரகாரம்' },
    image: './about/history/3-2-meal-agragaram.jpg',
    imagePosition: 'left',
    paragraphs: [
      {
        en: 'In Meal Agragaram, people became followers of Christ and gathered regularly for worship. The church grew numerically, and within one year the congregation reached approximately fifty to seventy-five people. This became one of the ministry’s successful early mission locations.',
        ta: 'மேல் அக்ரகாரத்தில் மக்கள் கிறிஸ்துவைப் பின்பற்றத் தொடங்கி, தொடர்ந்து ஆராதிக்கக் கூடினர். திருச்சபை எண்ணிக்கையில் வளர்ந்து, ஒரு ஆண்டிற்குள் சுமார் ஐம்பது முதல் எழுபத்தைந்து பேர் கொண்ட சபையாக ஆனது. இது ஊழியத்தின் வெற்றிகரமான ஆரம்பப் பணியிடங்களில் ஒன்றாக அமைந்தது.',
      },
      {
        en: 'Rev. Pr. A. Paulraj’s family supported him, and his sons worked alongside him in the mission field. Their support strengthened the whole family’s service. After a few years, the place was again filled with believers, so the church moved from Meal Agragaram to Regina Studio.',
        ta: 'Rev. Pr. A. Paulraj அவர்களின் குடும்பம் அவருக்கு துணையாக இருந்தது; அவரது மகன்களும் அவருடன் ஊழியத் துறையில் பணியாற்றினர். அவர்களின் ஆதரவு முழுக் குடும்பத்தின் சேவையையும் பலப்படுத்தியது. சில ஆண்டுகளில் அந்த இடமும் விசுவாசிகளால் நிரம்பியதால், திருச்சபை மேல் அக்ரகாரத்திலிருந்து ரெஜினா ஸ்டூடியோவுக்கு மாறியது.',
      },
    ],
  },
  {
    number: '3.3',
    title: { en: 'Regina Studio house', ta: 'ரெஜினா ஸ்டூடியோ வீடு' },
    image: './about/history/3-3-regina-studio-house.jpg',
    imagePosition: 'right',
    paragraphs: [
      {
        en: 'Before the church moved to Regina Studio, a Roman Catholic service was held there every Sunday from 9:00 AM to 10:00 AM. Rev. Pr. A. Paulraj therefore began the church service after 10:00 AM. The owner of the house was favourable toward the ministry, and the two worship services took place according to their shared arrangement.',
        ta: 'திருச்சபை ரெஜினா ஸ்டூடியோவுக்கு மாறுவதற்கு முன்பு, அங்கு ஒவ்வொரு ஞாயிற்றுக்கிழமையும் காலை 9:00 முதல் 10:00 வரை ரோமன் கத்தோலிக்க ஆராதனை நடைபெற்றது. எனவே Rev. Pr. A. Paulraj காலை 10:00 மணிக்குப் பிறகு திருச்சபை ஆராதனையை நடத்தினார். வீட்டு உரிமையாளர் ஊழியத்திற்கு சாதகமாக இருந்ததால், பரஸ்பர ஏற்பாட்டின்படி இரண்டு ஆராதனைகளும் நடைபெற்றன.',
      },
      {
        en: 'Evangelistic work continued through healing and deliverance ministry, village Gospel meetings and weekly public Gospel meetings. After several years, the congregation grew beyond one hundred people. Through the continuing work of the Gospel team, people from other religious backgrounds—including Muslims and Hindus—also began attending to worship God.',
        ta: 'சுகமளிக்கும் மற்றும் விடுதலை ஊழியம், கிராம சுவிசேஷக் கூட்டங்கள் மற்றும் வாரந்தோறும் நடைபெற்ற பொது சுவிசேஷக் கூட்டங்கள் வழியாக நற்செய்திப் பணி தொடர்ந்தது. சில ஆண்டுகளுக்குப் பிறகு சபையார் எண்ணிக்கை நூற்றைக் கடந்தது. சுவிசேஷக் குழுவின் தொடர்ந்த பணியால் முஸ்லிம் மற்றும் இந்து பின்னணியிலிருந்த மக்களும் தேவனை ஆராதிக்க வரத் தொடங்கினர்.',
      },
    ],
  },
  {
    number: '3.4',
    title: { en: 'Thiruvalluvar School building', ta: 'திருவள்ளுவர் பள்ளிக் கட்டிடம்' },
    image: './about/history/3-4-thiruvalluvar-school.jpg',
    imagePosition: 'left',
    paragraphs: [
      {
        en: 'The fourth location was a school named Thiruvalluvar School, rented and used as a church building for seven months. During this period, Rev. Pr. A. Paulraj faced health problems, and his entire family also suffered illness, affecting the ministry. He held to the promise found in Psalm 128. The family experienced healing, and after a few weeks they became involved in ministry again.',
        ta: 'நான்காவது இடம் திருவள்ளுவர் பள்ளி எனப்படும் பள்ளிக் கட்டிடமாகும். அது ஏழு மாதங்கள் வாடகைக்கு எடுக்கப்பட்டு திருச்சபைக் கட்டிடமாகப் பயன்படுத்தப்பட்டது. இந்தக் காலத்தில் Rev. Pr. A. Paulraj உடல்நலப் பிரச்சினைகளைச் சந்தித்தார்; அவரது முழுக் குடும்பமும் நோயால் பாதிக்கப்பட்டதால் ஊழியமும் பாதிக்கப்பட்டது. சங்கீதம் 128-ல் உள்ள வாக்குத்தத்தத்தை அவர் உறுதியாகப் பற்றிக்கொண்டார். குடும்பம் அற்புதமான சுகமடைந்து, சில வாரங்களுக்குப் பிறகு மீண்டும் ஊழியத்தில் இணைந்தது.',
      },
      {
        en: 'Opposition then arose from local people, who argued that the school should not be used for religious activity and demanded another arrangement. As a result, the church moved to another place owned by a shopkeeper.',
        ta: 'பின்னர் உள்ளூர் மக்களிடமிருந்து எதிர்ப்பு எழுந்தது. பள்ளிக் கட்டிடம் மதச் செயல்பாட்டிற்கு பயன்படுத்தப்படக்கூடாது என்றும் வேறு ஏற்பாடு செய்ய வேண்டும் என்றும் அவர்கள் வலியுறுத்தினர். இதனால் திருச்சபை ஒரு கடை உரிமையாளருக்குச் சொந்தமான மற்றொரு இடத்திற்கு மாறியது.',
      },
    ],
  },
  {
    number: '3.5',
    title: { en: 'Tea vendor’s house', ta: 'தேநீர் விற்பனையாளரின் வீடு' },
    image: './about/history/3-5-tea-vendors-house.jpg',
    imagePosition: 'right',
    paragraphs: [
      {
        en: 'The tea vendor’s house stood opposite Regina Studio, where the church had previously met. The church began functioning there by God’s grace. Challenges from religious groups continued, but they were overcome. Although there were no cell groups or organised prayer groups at first, people gathered because of the healings and miracles they received through the ministry. Many came to believe in Jesus Christ as Saviour, and the congregation grew.',
        ta: 'தேநீர் விற்பனையாளரின் வீடு, முன்பு திருச்சபை கூடிய ரெஜினா ஸ்டூடியோவுக்கு எதிரே இருந்தது. தேவனுடைய கிருபையால் அங்கு திருச்சபை செயல்படத் தொடங்கியது. மதக் குழுக்களிடமிருந்து வந்த சவால்கள் தொடர்ந்தபோதிலும் அவை வெல்லப்பட்டன. ஆரம்பத்தில் செல் குழுக்களோ ஒழுங்குபடுத்தப்பட்ட ஜெபக் குழுக்களோ இல்லாவிட்டாலும், ஊழியத்தின் மூலம் பெற்ற சுகமளிப்புகளும் அற்புதங்களும் காரணமாக மக்கள் கூடினர். பலர் இயேசு கிறிஸ்துவை இரட்சகராக விசுவாசித்ததால் சபை வளர்ந்தது.',
      },
      {
        en: 'When the owner decided to alter and rebuild the house, the church had to move to Vallalar Gurukulam Matriculation School in Nannilam. During this period, believers supported Rev. Pr. A. Paulraj physically, financially and through prayer. Their support was especially important as the church moved repeatedly from one location to another.',
        ta: 'வீட்டு உரிமையாளர் வீட்டை மாற்றியமைத்து மறுகட்ட முடிவு செய்தபோது, திருச்சபை நன்னிலத்தில் உள்ள வள்ளலார் குருகுலம் மெட்ரிகுலேஷன் பள்ளிக்கு மாற வேண்டியிருந்தது. இந்தக் காலத்தில் விசுவாசிகள் Rev. Pr. A. Paulraj அவர்களுக்கு உடல் உழைப்பு, பொருளாதாரம் மற்றும் ஜெபம் மூலம் ஆதரவளித்தனர். திருச்சபை பல இடங்களுக்கு தொடர்ந்து மாறியபோது அவர்களின் ஆதரவு மிக முக்கியமானதாக இருந்தது.',
      },
    ],
  },
  {
    number: '3.6',
    title: { en: 'Vallalar Gurukulam Matriculation School', ta: 'வள்ளலார் குருகுலம் மெட்ரிகுலேஷன் பள்ளி' },
    paragraphs: [
      {
        en: 'At Vallalar Gurukulam Matriculation School, Rev. Pr. A. Paulraj encountered the same challenge that had arisen at Thiruvalluvar School: people opposed the use of a school building for religious activity. This led the church to move to rented empty land near the Nannilam bus stand. There the congregation found a more workable setting and continued its worship services. During this season, developing and establishing the church in Nannilam remained the central challenge.',
        ta: 'வள்ளலார் குருகுலம் மெட்ரிகுலேஷன் பள்ளியிலும் Rev. Pr. A. Paulraj, திருவள்ளுவர் பள்ளியில் ஏற்பட்ட அதே சவாலை எதிர்கொண்டார். பள்ளிக் கட்டிடம் மதச் செயல்பாட்டிற்கு பயன்படுத்தப்படுவதற்கு மக்கள் எதிர்ப்பு தெரிவித்தனர். இதனால் நன்னிலம் பேருந்து நிலையம் அருகிலுள்ள வாடகை காலி நிலத்திற்கு திருச்சபை மாறியது. அங்கு சபையார் ஏற்ற சூழலைக் கண்டடைந்து ஆராதனையைத் தொடர்ந்தனர். நன்னிலத்தில் திருச்சபையை வளர்த்து நிலைநிறுத்துவது இந்தக் காலத்தின் முக்கிய சவாலாக இருந்தது.',
      },
    ],
  },
  {
    number: '3.7',
    title: { en: 'Near Nannilam bus stand—rented empty land', ta: 'நன்னிலம் பேருந்து நிலையம் அருகிலுள்ள வாடகை காலி நிலம்' },
    image: './about/history/3-7-nannilam-bus-stand.jpg',
    imagePosition: 'left',
    paragraphs: [
      {
        en: 'People were comfortable with the move near Nannilam bus stand because transport was easily available. During the period around the move from Vallalar Gurukulam, Rev. Pr. A. Paulraj faced difficulties both outside and inside the church because the congregation had become large. He therefore gave close attention to the believers and their pastoral needs.',
        ta: 'எளிதான போக்குவரத்து வசதி இருந்ததால் நன்னிலம் பேருந்து நிலையம் அருகிலுள்ள இடத்திற்கு மாறியது மக்களுக்கு வசதியாக இருந்தது. வள்ளலார் குருகுலத்திலிருந்து மாறிய காலத்தில், சபையார் எண்ணிக்கை அதிகமாக இருந்ததால் Rev. Pr. A. Paulraj திருச்சபைக்கு வெளியிலும் உள்ளேயும் சிரமங்களைச் சந்தித்தார். ஆகவே விசுவாசிகளையும் அவர்களின் மேய்ப்புப் பராமரிப்பையும் அவர் அதிக அக்கறையுடன் கவனித்தார்.',
      },
      {
        en: 'Pastor Titus and Pastor Daniel Devadhas visited once each month for a special meeting and encouraged the congregation. They were a strong support to the ministry and to Rev. Pr. A. Paulraj, continually strengthening the work through prayer.',
        ta: 'Pastor Titus மற்றும் Pastor Daniel Devadhas ஒவ்வொரு மாதமும் சிறப்புக் கூட்டத்திற்காக வந்து சபையாரை ஊக்குவித்தனர். அவர்கள் இந்த ஊழியத்திற்கும் Rev. Pr. A. Paulraj அவர்களுக்கும் உறுதியான ஆதரவாக இருந்து, ஜெபத்தின் மூலம் பணியை தொடர்ந்து பலப்படுத்தினர்.',
      },
    ],
  },
  {
    number: '3.8',
    title: { en: 'Church at the chicken-market ground', ta: 'கோழிச் சந்தை மைதானத்தில் திருச்சபை' },
    image: './about/history/3-8-chicken-market-ground.jpg',
    imagePosition: 'right',
    paragraphs: [
      {
        en: 'As the congregation continued to grow, Rev. Pr. A. Paulraj searched for another place. No one initially offered land for a church building. After several months, he found a place near a drainage area where waste and garbage had been collected; it was known as the chicken-market ground. By God’s grace the church was built there, and almost 180 people gathered regularly. Cell groups began, and house prayers were conducted especially for healing and deliverance.',
        ta: 'சபையார் தொடர்ந்து வளர்ந்ததால் Rev. Pr. A. Paulraj மற்றொரு இடத்தைத் தேடினார். ஆரம்பத்தில் திருச்சபைக் கட்டிடத்திற்காக யாரும் நிலம் வழங்கவில்லை. பல மாதத் தேடலுக்குப் பிறகு கழிவுகளும் குப்பைகளும் சேர்க்கப்பட்ட வடிகால் பகுதியருகே கோழிச் சந்தை மைதானம் என அழைக்கப்பட்ட இடத்தை அவர் கண்டார். தேவனுடைய கிருபையால் அங்கு திருச்சபை கட்டப்பட்டு, சுமார் 180 பேர் தொடர்ந்து கூடினர். செல் குழுக்கள் தொடங்கப்பட்டு, குறிப்பாக சுகமளிப்பு மற்றும் விடுதலைக்காக வீட்டு ஜெபங்கள் நடத்தப்பட்டன.',
      },
      {
        en: 'After several years, opposition from local people and continuing drainage problems again made a move necessary. When Rev. Pr. A. Paulraj first came to Nannilam, God had shown him in a vision the land where believers would worship. He held to that personal promise. God enabled the pastor and believers to purchase their own land for one lakh rupees, and the church finally moved to the very place shown in that vision.',
        ta: 'சில ஆண்டுகளுக்குப் பிறகு உள்ளூர் மக்களின் எதிர்ப்பும் தொடர்ந்த வடிகால் பிரச்சினைகளும் மீண்டும் இடமாற்றத்தை அவசியமாக்கின. Rev. Pr. A. Paulraj முதன்முதலில் நன்னிலம் வந்தபோது, விசுவாசிகள் ஆராதிக்க வேண்டிய நிலத்தை தேவன் தரிசனத்தில் காட்டியிருந்தார். அந்த தனிப்பட்ட வாக்குத்தத்தத்தை அவர் பற்றிக்கொண்டிருந்தார். தேவன் போதகருக்கும் விசுவாசிகளுக்கும் ஒரு லட்சம் ரூபாய்க்கு சொந்த நிலம் வாங்க உதவினார்; இறுதியில் தரிசனத்தில் காட்டப்பட்ட அதே இடத்திற்கு திருச்சபை மாறியது.',
      },
    ],
  },
  {
    number: '3.9',
    title: { en: 'Church on its own land', ta: 'சொந்த நிலத்தில் திருச்சபை' },
    image: './about/history/3-9-church-on-own-land.jpg',
    imagePosition: 'left',
    paragraphs: [
      {
        en: 'The move to the church’s own land was made possible through the prayers of believers and pastors. This answer to prayer strengthened the believers in faith. The first structure was a thatched koorai, or roof house. It was destroyed in 2006 by the cyclone that devastated the agricultural district, after which the church planned a new structure using iron and cement sheets.',
        ta: 'விசுவாசிகளும் போதகர்களும் செய்த ஜெபங்களின் மூலம் சொந்த நிலத்திற்கு மாறுதல் சாத்தியமானது. இந்த ஜெபப் பதில் விசுவாசிகளை விசுவாசத்திலும் ஜெபத்திலும் பலப்படுத்தியது. முதலில் கூரை அமைப்புடன் ஒரு கட்டிடம் எழுப்பப்பட்டது. விவசாய மாவட்டத்தைப் பெரிதும் சேதப்படுத்திய 2006-ஆம் ஆண்டு புயலில் அது அழிந்தது. பின்னர் இரும்பு மற்றும் சிமெண்டு தகடுகளைக் கொண்டு புதிய அமைப்பை கட்ட திருச்சபை திட்டமிட்டது.',
      },
      {
        en: 'The ministry endured many difficult situations, and Rev. Pr. A. Paulraj faced division among younger and older believers. By God’s grace he led the congregation through those challenges. In time, unity was restored and the church grew both numerically and spiritually.',
        ta: 'ஊழியம் பல கடினமான சூழ்நிலைகளைச் சந்தித்தது; இளைஞர்களும் மூத்தவர்களும் இடையே ஏற்பட்ட பிரிவுகளையும் Rev. Pr. A. Paulraj எதிர்கொண்டார். தேவனுடைய கிருபையால் அவர் சபையை அந்தச் சவால்களைக் கடந்து வழிநடத்தினார். காலப்போக்கில் ஒற்றுமை மீண்டும் நிலைபெற்று, திருச்சபை எண்ணிக்கையிலும் ஆவிக்குரிய வகையிலும் வளர்ந்தது.',
      },
      {
        en: 'In 2004, Worship to Jesus Cathedral became the Worship to Jesus Trust. Through the Trust, the ministry expanded into social work and medical camps. It planted churches throughout Thiruvarur district and trained pastors to build and lead local churches. By 2019, the mission had planted twenty-five churches functioning as branches of Worship to Jesus Cathedral.',
        ta: '2004-ஆம் ஆண்டு இயேசுவுக்கே ஆராதனை திருச்சபை, இயேசுவுக்கே ஆராதனை அறக்கட்டளையாக அமைந்தது. அறக்கட்டளையின் மூலம் சமூக சேவையும் மருத்துவ முகாம்களும் நடைபெற்றன. திருவாரூர் மாவட்டம் முழுவதும் திருச்சபைகள் நிறுவப்பட்டு, உள்ளூர் திருச்சபைகளை வளர்த்து வழிநடத்த போதகர்களுக்கு பயிற்சி அளிக்கப்பட்டது. 2019-ஆம் ஆண்டுக்குள் இயேசுவுக்கே ஆராதனை திருச்சபையின் கிளைகளாக செயல்பட்ட 25 திருச்சபைகள் இந்த ஊழியத்தின் மூலம் நிறுவப்பட்டிருந்தன.',
      },
    ],
  },
]

export const churchHistoryFinal: ChurchHistorySection = {
  number: '2007',
  title: { en: 'Church on its own land with a new building', ta: 'சொந்த நிலத்தில் புதிய திருச்சபைக் கட்டிடம்' },
  image: './about/history/2007-new-church-building.jpg',
  paragraphs: [
    {
      en: 'In 2007, a new church building stood on the congregation’s own land. It marked a new chapter after years of prayer, repeated relocation, opposition, sacrifice and faithful ministry in Nannilam.',
      ta: '2007-ஆம் ஆண்டு சபையின் சொந்த நிலத்தில் புதிய திருச்சபைக் கட்டிடம் எழுந்தது. பல ஆண்டுகளான ஜெபம், தொடர்ந்த இடமாற்றம், எதிர்ப்பு, தியாகம் மற்றும் நன்னிலத்தில் நடைபெற்ற உண்மையுள்ள ஊழியத்திற்குப் பிறகு அது ஒரு புதிய அத்தியாயத்தைத் தொடங்கியது.',
    },
  ],
}
