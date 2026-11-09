import { Headphones, Pause, Play, Radio, SquarePlay, Video } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { sermons } from '../data/sermons'
import { usePublishedAudioLibrary, usePublishedVideoRows } from '../hooks/usePublishedContent'
import { isSupabaseConfigured } from '../lib/env'
import type { PublishedAudioTrack } from '../services/contentService'
import type { VideoRow } from '../types/database'

interface PublicVideo {
  id: string
  videoId: string
  title: string
  description: string
}

function MediaCard({ video }: { video: PublicVideo }) {
  const [play, setPlay] = useState(false)
  const { localize } = useLanguage()
  return <article className="video-card">
    <div className="video-card__media">
      {play
        ? <iframe src={`https://www.youtube-nocookie.com/embed/${video.videoId}?autoplay=1&rel=0`} title={video.title} allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowFullScreen />
        : <button type="button" onClick={() => setPlay(true)} aria-label={`${localize({ en: 'Play', ta: 'இயக்கு' })} ${video.title}`}><img src={`https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`} alt="" loading="lazy" /><span className="video-card__shade" /><span className="video-card__play"><Play fill="currentColor" aria-hidden="true" /><b>{localize({ en: 'Play', ta: 'இயக்கு' })}</b></span></button>}
    </div>
    <div className="video-card__body"><div><h2>{video.title}</h2><p>{video.description}</p></div></div>
  </article>
}

function AudioTrackPlayer({ track, activeTrack, onActivate }: { track: PublishedAudioTrack; activeTrack: string | null; onActivate: (id: string | null) => void }) {
  const { localize } = useLanguage()
  const audioRef = useRef<HTMLAudioElement>(null)
  const isPlaying = activeTrack === track.id

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) void audio.play().catch(() => onActivate(null))
    else audio.pause()
  }, [isPlaying, onActivate])

  const duration = track.duration_seconds
    ? `${Math.floor(track.duration_seconds / 60)}:${String(track.duration_seconds % 60).padStart(2, '0')}`
    : localize({ en: 'Audio message', ta: 'ஒலிச் செய்தி' })

  return <li className={isPlaying ? 'is-playing' : ''}>
    <button type="button" onClick={() => onActivate(isPlaying ? null : track.id)} aria-label={`${isPlaying ? localize({ en: 'Pause', ta: 'இடைநிறுத்து' }) : localize({ en: 'Play', ta: 'இயக்கு' })}: ${localize({ en: track.title_en, ta: track.title_ta })}`}>
      {isPlaying ? <Pause fill="currentColor" aria-hidden="true" /> : <Play fill="currentColor" aria-hidden="true" />}
    </button>
    <span><strong>{localize({ en: track.title_en, ta: track.title_ta })}</strong>{(track.description_en || track.description_ta) && <small>{localize({ en: track.description_en, ta: track.description_ta })}</small>}</span>
    <time>{duration}</time>
    <audio ref={audioRef} src={track.audio_url} preload="none" onEnded={() => onActivate(null)} />
  </li>
}

function EmptyMedia({ icon: Icon, title, body }: { icon: typeof Video; title: string; body: string }) {
  return <div className="public-empty media-empty"><Icon /><h2>{title}</h2><p>{body}</p></div>
}

function mapVideo(row: VideoRow, language: 'en' | 'ta'): PublicVideo {
  return {
    id: row.id,
    videoId: row.youtube_id,
    title: language === 'ta' ? row.title_ta : row.title_en,
    description: language === 'ta' ? row.description_ta : row.description_en,
  }
}

export function MediaPage() {
  const { localize, language } = useLanguage()
  const videoRows = usePublishedVideoRows()
  const audioLibrary = usePublishedAudioLibrary()
  const [activeTrack, setActiveTrack] = useState<string | null>(null)
  const rows = videoRows.data ?? []
  const liveSessions = isSupabaseConfigured
    ? rows.filter((row) => row.category === 'live-session' || row.live_status !== 'recorded').map((row) => mapVideo(row, language))
    : sermons.filter((video) => video.mediaType === 'live-session').map((video) => ({ id: video.id, videoId: video.videoId, title: localize(video.title), description: localize(video.description) }))
  const uploadedVideos = isSupabaseConfigured
    ? rows.filter((row) => row.category !== 'live-session' && row.live_status === 'recorded').map((row) => mapVideo(row, language))
    : sermons.filter((video) => video.mediaType !== 'live-session').map((video) => ({ id: video.id, videoId: video.videoId, title: localize(video.title), description: localize(video.description) }))
  const albums = (audioLibrary.data ?? []).filter((album) => album.tracks.length > 0)

  return <main id="main-content" tabIndex={-1} className="inner-page media-page">
    <section className="inner-hero media-page__hero"><div className="container"><p>{localize({ en: 'Watch. Listen. Worship.', ta: 'காணுங்கள். கேளுங்கள். ஆராதியுங்கள்.' })}</p><h1>{localize({ en: 'WJ Media Library', ta: 'WJ ஊடகத் தொகுப்பு' })}</h1><span>{localize({ en: 'Watch official YouTube videos and church live sessions, or listen to published messages organised into audio albums.', ta: 'அதிகாரப்பூர்வ YouTube காணொளிகள் மற்றும் திருச்சபை நேரலைகளைக் காணுங்கள் அல்லது ஆல்பங்களாக ஒழுங்குபடுத்தப்பட்ட ஒலிச் செய்திகளைக் கேளுங்கள்.' })}</span></div></section>

    <nav className="media-page__nav" aria-label={localize({ en: 'Media sections', ta: 'ஊடகப் பிரிவுகள்' })}><div className="container"><a href="#media-live"><Radio size={17} />{localize({ en: 'Live Sessions', ta: 'நேரலை நிகழ்வுகள்' })}</a><a href="#media-videos"><Video size={17} />{localize({ en: 'Videos', ta: 'காணொளிகள்' })}</a><a href="#media-audio"><Headphones size={17} />{localize({ en: 'Audio Albums', ta: 'ஒலி ஆல்பங்கள்' })}</a></div></nav>

    <section id="media-live" className="section media-library-section media-library-section--live"><div className="container"><header className="media-library-heading"><div><p><Radio size={17} />{localize({ en: 'From the church gathering', ta: 'திருச்சபைக் கூடுகையிலிருந்து' })}</p><h2>{localize({ en: 'Live Sessions', ta: 'நேரலை நிகழ்வுகள்' })}</h2><span>{localize({ en: 'Published church services and sessions that were shared through YouTube Live.', ta: 'YouTube நேரலை வழியாகப் பகிரப்பட்ட வெளியிடப்பட்ட திருச்சபை ஆராதனைகள் மற்றும் நிகழ்வுகள்.' })}</span></div></header>{liveSessions.length ? <div className="video-grid">{liveSessions.map((video) => <MediaCard key={video.id} video={video} />)}</div> : <EmptyMedia icon={Radio} title={localize({ en: 'No live sessions published yet', ta: 'இன்னும் நேரலை நிகழ்வுகள் வெளியிடப்படவில்லை' })} body={localize({ en: 'Approved YouTube Live recordings will appear here.', ta: 'அங்கீகரிக்கப்பட்ட YouTube நேரலைப் பதிவுகள் இங்கே தோன்றும்.' })} />}</div></section>

    <section id="media-videos" className="section section--ivory media-library-section"><div className="container"><header className="media-library-heading"><div><p><SquarePlay size={17} />YouTube</p><h2>{localize({ en: 'Videos', ta: 'காணொளிகள்' })}</h2><span>{localize({ en: 'Messages, worship and ministry videos uploaded to the official YouTube channel.', ta: 'அதிகாரப்பூர்வ YouTube சேனலில் பதிவேற்றப்பட்ட செய்திகள், ஆராதனை மற்றும் ஊழியக் காணொளிகள்.' })}</span></div></header>{uploadedVideos.length ? <div className="video-grid">{uploadedVideos.map((video) => <MediaCard key={video.id} video={video} />)}</div> : <EmptyMedia icon={SquarePlay} title={localize({ en: 'No published videos', ta: 'வெளியிடப்பட்ட காணொளிகள் இல்லை' })} body={localize({ en: 'Published YouTube videos will appear here.', ta: 'வெளியிடப்பட்ட YouTube காணொளிகள் இங்கே தோன்றும்.' })} />}</div></section>

    <section id="media-audio" className="section media-library-section media-library-section--audio"><div className="container"><header className="media-library-heading"><div><p><Headphones size={17} />{localize({ en: 'Listen anywhere', ta: 'எங்கிருந்தும் கேளுங்கள்' })}</p><h2>{localize({ en: 'Audio Albums', ta: 'ஒலி ஆல்பங்கள்' })}</h2><span>{localize({ en: 'Church-approved messages and recordings organised by album. Choose a track and press play to listen.', ta: 'திருச்சபையால் அங்கீகரிக்கப்பட்ட செய்திகள் மற்றும் பதிவுகள் ஆல்பங்களாக ஒழுங்குபடுத்தப்பட்டுள்ளன. கேட்க ஒரு பதிவைத் தேர்ந்தெடுத்து இயக்குங்கள்.' })}</span></div></header>{albums.length ? <div className="audio-album-grid">{albums.map((album) => <article className="audio-album" key={album.id}>{album.cover_image_url ? <img src={album.cover_image_url} alt="" loading="lazy" /> : <div className="audio-album__art"><Headphones aria-hidden="true" /><span>WJ</span></div>}<div className="audio-album__body"><small>{localize({ en: `${album.tracks.length} track${album.tracks.length === 1 ? '' : 's'}`, ta: `${album.tracks.length} ஒலிப்பதிவுகள்` })}</small><h3>{localize({ en: album.title_en, ta: album.title_ta })}</h3>{(album.description_en || album.description_ta) && <p>{localize({ en: album.description_en, ta: album.description_ta })}</p>}<ol>{album.tracks.map((track) => <AudioTrackPlayer key={track.id} track={track} activeTrack={activeTrack} onActivate={setActiveTrack} />)}</ol></div></article>)}</div> : <EmptyMedia icon={Headphones} title={localize({ en: 'No audio albums published yet', ta: 'இன்னும் ஒலி ஆல்பங்கள் வெளியிடப்படவில்லை' })} body={localize({ en: 'When the owner publishes an approved album and its audio tracks, they will appear here.', ta: 'உரிமையாளர் அங்கீகரிக்கப்பட்ட ஆல்பத்தையும் அதன் ஒலிப்பதிவுகளையும் வெளியிட்டதும் அவை இங்கே தோன்றும்.' })} />}</div></section>
  </main>
}
