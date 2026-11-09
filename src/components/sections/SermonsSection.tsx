import { ArrowRight, ExternalLink, Headphones, Play, Radio, SquarePlay } from 'lucide-react'
import { sermons, youtubeChannelUrl } from '../../data/sermons'
import { useLanguage } from '../../context/LanguageContext'
import { usePublishedAudioAlbumSummary, usePublishedVideoRows } from '../../hooks/usePublishedContent'
import { Reveal } from '../common/Reveal'

export function SermonsSection() {
  const { localize, language } = useLanguage()
  const publishedVideos = usePublishedVideoRows()
  const audioAlbums = usePublishedAudioAlbumSummary()
  const managedLive = (publishedVideos.data ?? [])
    .filter((video) => video.category === 'live-session' || video.live_status !== 'recorded')
    .sort((first, second) => second.created_at.localeCompare(first.created_at) || first.display_order - second.display_order)
  const managedRegular = (publishedVideos.data ?? []).filter((video) => video.category !== 'live-session' && video.live_status === 'recorded')
  const fallbackLive = sermons.filter((video) => video.mediaType === 'live-session')
  const fallbackRegular = sermons.filter((video) => video.mediaType !== 'live-session')
  const latestManaged = managedLive[0]
  const latestFallback = fallbackLive[0]
  const latestVideoId = latestManaged?.youtube_id ?? latestFallback?.videoId
  const latestTitle = latestManaged
    ? language === 'ta' ? latestManaged.title_ta : latestManaged.title_en
    : latestFallback ? localize(latestFallback.title) : localize({ en: 'Latest WJ Cathedral live session', ta: 'சமீபத்திய WJ Cathedral நேரலை நிகழ்வு' })
  const liveCount = publishedVideos.data ? managedLive.length : fallbackLive.length
  const videoCount = publishedVideos.data ? managedRegular.length : fallbackRegular.length
  const albumCount = audioAlbums.data?.filter((album) => album.trackCount > 0).length ?? 0

  const pathways = [
    { href: '#media-live', Icon: Radio, count: liveCount, title: { en: 'Live Sessions', ta: 'நேரலை நிகழ்வுகள்' }, body: { en: 'Church services, prayers and gatherings originally shared through YouTube Live.', ta: 'YouTube நேரலை வழியாகப் பகிரப்பட்ட திருச்சபை ஆராதனைகள், ஜெபங்கள் மற்றும் கூடுகைகள்.' } },
    { href: '#media-videos', Icon: SquarePlay, count: videoCount, title: { en: 'Videos', ta: 'காணொளிகள்' }, body: { en: 'Messages, morning devotions, worship and original Christian songs.', ta: 'செய்திகள், காலை வேத தியானங்கள், ஆராதனை மற்றும் புதிய கிறிஸ்தவப் பாடல்கள்.' } },
    { href: '#media-audio', Icon: Headphones, count: albumCount, title: { en: 'Audio Albums', ta: 'ஒலி ஆல்பங்கள்' }, body: { en: 'Listen to church-approved audio messages arranged into convenient albums.', ta: 'ஆல்பங்களாக ஒழுங்குபடுத்தப்பட்ட திருச்சபை அங்கீகரித்த ஒலிச் செய்திகளைக் கேளுங்கள்.' } },
  ] as const

  return <section id="sermons" className="section home-media-hub">
    <div className="container">
      <div className="home-media-hub__heading">
        <Reveal><p>{localize({ en: 'Watch & listen', ta: 'கண்டு கேளுங்கள்' })}</p><h2>{localize({ en: 'Every message. Every gathering. One media home.', ta: 'ஒவ்வொரு செய்தியும். ஒவ்வொரு கூடுகையும். ஒரே ஊடக இல்லத்தில்.' })}</h2></Reveal>
        <Reveal delay={0.06}><span>{localize({ en: 'Choose how you want to connect—with recent church live sessions, official YouTube videos or audio albums for listening anywhere.', ta: 'சமீபத்திய திருச்சபை நேரலைகள், அதிகாரப்பூர்வ YouTube காணொளிகள் அல்லது எங்கிருந்தும் கேட்கக்கூடிய ஒலி ஆல்பங்கள் வழியாக இணையுங்கள்.' })}</span><div><a className="button button--red" href="#media">{localize({ en: 'Open the media library', ta: 'ஊடகத் தொகுப்பைத் திறக்கவும்' })} <ArrowRight size={17} /></a><a href={youtubeChannelUrl} target="_blank" rel="noreferrer">YouTube <ExternalLink size={15} /></a></div></Reveal>
      </div>

      <div className="home-media-hub__layout">
        <Reveal className="home-media-feature">
          {latestVideoId && <img src={`https://i.ytimg.com/vi/${latestVideoId}/maxresdefault.jpg`} alt="" loading="lazy" />}
          <span className="home-media-feature__shade" />
          <div className="home-media-feature__badge"><Radio size={16} />{localize({ en: 'Latest live session', ta: 'சமீபத்திய நேரலை நிகழ்வு' })}</div>
          <div className="home-media-feature__copy"><h3>{latestTitle}</h3><a href="#media-live"><span><Play fill="currentColor" /></span>{localize({ en: 'Watch session', ta: 'நிகழ்வைக் காணுங்கள்' })}<ArrowRight size={17} /></a></div>
        </Reveal>
        <div className="home-media-pathways">
          {pathways.map(({ href, Icon, count, title, body }, index) => <Reveal key={href} delay={index * 0.05}><a href={href}><span className="home-media-pathways__icon"><Icon /></span><div><small>{count ? `${count} ${localize({ en: count === 1 ? 'item' : 'items', ta: 'பதிவுகள்' })}` : localize({ en: 'Ready for published content', ta: 'வெளியிடப்பட்ட உள்ளடக்கத்திற்குத் தயார்' })}</small><h3>{localize(title)}</h3><p>{localize(body)}</p></div><ArrowRight className="home-media-pathways__arrow" /></a></Reveal>)}
        </div>
      </div>
    </div>
  </section>
}
