import { useEffect, useRef, useState } from 'react';
import { ExternalLink, Heart, Music2, Pause, Play, Search, Sparkles, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { birthdayLines, chordShapes, tracks } from '@/lib/birthday';
import { searchSpotify, type SpotifyResult } from '@/lib/spotify.functions';
import cover from '@/assets/sunset-memory.jpg';

type SpotifyController = { play: () => void; pause: () => void; resume: () => void; loadUri: (uri: string) => void; addListener: (name: string, cb: (event: { data: { position: number; isPaused: boolean } }) => void) => void; destroy: () => void };
type SpotifyApi = { createController: (element: HTMLElement, options: { uri: string; width: string; height: number }, callback: (controller: SpotifyController) => void) => void };
declare global { interface Window { onSpotifyIframeApiReady?: (api: SpotifyApi) => void; } }

export function BirthdayMusic({ entered, onUnlock }: { entered: boolean; onUnlock: () => void }) {
  const [track, setTrack] = useState(tracks[0]);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SpotifyResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState('C');
  const [strumming, setStrumming] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [message, setMessage] = useState('');
  const [step, setStep] = useState(0);
  const mount = useRef<HTMLDivElement>(null);
  const controller = useRef<SpotifyController | null>(null);
  const audio = useRef<AudioContext | null>(null);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wasPlaying = useRef(false);
  const playingRef = useRef(false);
  const enteredRef = useRef(entered);
  const [ready, setReady] = useState(false);
  useEffect(() => { enteredRef.current = entered; }, [entered]);
  useEffect(() => {
    const enter = () => controller.current?.play();
    window.addEventListener('oasis-enter', enter);
    return () => window.removeEventListener('oasis-enter', enter);
  }, []);
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(''), 6000);
    return () => clearTimeout(timer);
  }, [message]);
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) { setResults([]); setSearching(false); return; }
    setSearching(true);
    const timer = setTimeout(() => {
      searchSpotify({ data: { query: q } })
        .then(setResults)
        .catch(() => setResults([]))
        .finally(() => setSearching(false));
    }, 350);
    return () => clearTimeout(timer);
  }, [query]);
  function selectResult(result: SpotifyResult) {
    controller.current?.pause();
    setTrack({ id: result.id, title: result.title, artist: result.artist, chords: track.chords });
    setCoverUrl(result.image);
    setPosition(0); setPlaying(false); setStep(0); setQuery(''); setResults([]);
    setMessage('happy birthday to my favorite person, keneisya! 🤍');
    controller.current?.loadUri(`spotify:track:${result.id}`);
    controller.current?.play();
  }
  useEffect(() => {
    window.onSpotifyIframeApiReady = (api) => {
      if (!mount.current) return;
      api.createController(mount.current, { uri: 'spotify:track:3HEfLSVUo9rxdD0JxbLAUU', width: '100%', height: 80 }, (c) => {
        controller.current = c;
        setReady(true);
        c.addListener('playback_update', ({ data }) => { setPosition(data.position / 1000); setPlaying(!data.isPaused); playingRef.current = !data.isPaused; });
        if (enteredRef.current) c.play();
      });
    };
    const script = document.createElement('script');
    script.src = 'https://open.spotify.com/embed/iframe-api/v1';
    script.async = true;
    document.body.appendChild(script);
    return () => { controller.current?.destroy(); script.remove(); delete window.onSpotifyIframeApiReady; if (resumeTimer.current) clearTimeout(resumeTimer.current); void audio.current?.close(); };
  }, []);
  useEffect(() => { if (entered && ready && track.id) controller.current?.play(); }, [entered, ready, track.id]);
  useEffect(() => {
    if (track.id || !playing || strumming) return;
    const timer = setInterval(() => { setPosition(p => p + 1); }, 1000);
    return () => clearInterval(timer);
  }, [playing, track.id, strumming]);
  function note(frequency: number, delay = 0) {
    const ctx = audio.current ?? new AudioContext();
    audio.current = ctx;
    void ctx.resume();
    const now = ctx.currentTime + delay;
    const oscillator = ctx.createOscillator();
    const overtone = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    oscillator.type = 'triangle'; oscillator.frequency.value = frequency;
    overtone.type = 'sine'; overtone.frequency.value = frequency * 2;
    filter.type = 'lowpass'; filter.frequency.setValueAtTime(2400, now); filter.frequency.exponentialRampToValueAtTime(400, now + 1.4);
    gain.gain.setValueAtTime(0, now); gain.gain.linearRampToValueAtTime(.13, now + .008); gain.gain.exponentialRampToValueAtTime(.001, now + 1.8);
    oscillator.connect(filter); overtone.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
    oscillator.start(now); overtone.start(now); oscillator.stop(now + 2); overtone.stop(now + 2);
  }
  function strum(chord: string, frequency?: number) {
    if (!strumming) wasPlaying.current = playingRef.current || (!track.id && playing);
    controller.current?.pause(); setStrumming(true); setSelected(chord);
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    if (frequency) note(frequency); else chordShapes[chord]?.notes.forEach((f, i) => note(f, i * .035));
    if (!frequency) {
      const next = chord === track.chords[step] ? step + 1 : chord === track.chords[0] ? 1 : 0;
      if (next === 4) { setStep(0); onUnlock(); setMessage('a little love letter, unlocked just for you ♡'); } else setStep(next);
    }
    resumeTimer.current = setTimeout(() => { setStrumming(false); if (wasPlaying.current && track.id) controller.current?.resume(); }, 2300);
  }
  function selectTrack(index: number) {
    const next = tracks[index]; if (!next) return;
    controller.current?.pause(); setTrack(next); setPosition(0); setPlaying(false); setStep(0); setQuery(''); setSelected(next.chords[0]);
    setMessage('happy birthday to my favorite person, keneisya! 🤍');
    if (next.id) { controller.current?.loadUri(`spotify:track:${next.id}`); controller.current?.play(); }
  }
  function toggle() {
    if (track.id) { if (playing) controller.current?.pause(); else controller.current?.play(); }
    else { if (!playing) { chordShapes[track.chords[0]]?.notes.forEach((f, i) => note(f, i * .08)); } setPlaying(!playing); }
  }
  useEffect(() => {
    if (track.id || !playing || strumming) return;
    const chord = track.chords[Math.floor(position / 3) % 4] ?? 'G';
    if (position % 3 === 0) chordShapes[chord]?.notes.forEach((f, i) => note(f, i * .06));
  }, [position, track.id, playing, strumming, track.chords]);
  const lyric = birthdayLines[Math.floor(position / 12) % birthdayLines.length];
  return <section id="soundscape" className="section music-section"><div className="page-width">
    <div className="section-intro"><div><div className="eyebrow"><Music2 size={12} /> our little soundtrack</div><h2 className="section-title">some songs feel like you.</h2><p className="section-subtitle">a melody for the moments when words aren’t quite enough.</p></div><span className="connection-badge"><span className="connection-dot" /> a little harmony, a lot of love</span></div>
    <div className="music-grid">
      <div className="glass-panel"><div className="panel-top"><span className="panel-title"><Music2 size={15} className="text-spotify" /> your soundscape</span><span className="pill">made for your ears ♡</span></div>
      <div className="music-body"><div className="search-box"><Search /><input aria-label="Search songs" placeholder="find a song that feels like us..." value={query} onChange={e => setQuery(e.target.value)} /></div>
      {query && <div className="search-results">{searching && <p className="player-message">searching spotify…</p>}{results.map(r => <Button key={r.id} variant="ghost" onClick={() => selectResult(r)}>{r.title}<span>{r.artist}</span></Button>)}<a href={`https://open.spotify.com/search/${encodeURIComponent(query)}`} target="_blank" rel="noreferrer">search Spotify for “{query}”<ExternalLink size={13} /></a></div>}
      <div className="now-playing"><img src={coverUrl ?? cover} width={74} height={74} className="album-art" alt="Pink sunset, a little birthday keepsake" /><div className="min-w-0"><h3 className="track-title">{track.title}</h3><p className="track-artist">{track.artist}</p><p className="track-note"><Heart size={10} /> this one reminds me of you</p></div><Button size="icon" variant="ghost" title={playing ? 'Pause song' : 'Play song'} aria-label={playing ? 'Pause song' : 'Play song'} onClick={toggle}>{playing ? <Pause /> : <Play />}</Button></div>
      <div className={`spotify-embed ${track.id ? '' : 'hidden'}`}><div ref={mount} /></div>
      {!ready && <p className="player-message">Spotify is getting ready… <a href="https://open.spotify.com/track/3HEfLSVUo9rxdD0JxbLAUU" target="_blank" rel="noreferrer" className="underline">open the song</a></p>}
      {!track.id && <p className="player-message">an original instrumental birthday serenade</p>}
      <div className="lyrics"><div className="lyrics-label"><Sparkles size={10} /> a birthday lyric, from me</div><p className="lyric-line" key={lyric}>{message || lyric}</p></div>
      <p className="player-message">{strumming ? 'the music is resting. this moment is your solo ♡' : 'a little letter alongside our song'}</p>
      </div></div>
      <div className="glass-panel"><div className="panel-top"><span className="panel-title"><Music2 size={14} /> the fender serenade</span><span className="pill">{strumming ? 'your solo moment' : 'a little pink telecaster'}</span></div>
      <div className="guitar-stage"><svg viewBox="0 0 500 190" className="guitar-svg" role="img" aria-label="Pink Telecaster guitar with six playable strings">
        <path className="guitar-body" d="M105 37 C75 26 35 40 34 72 C5 97 21 137 52 150 C79 180 133 168 149 141 C179 127 179 101 155 90 C147 78 166 54 143 40 C130 52 118 60 108 60 Z" />
        <path className="guitar-guard" d="M94 52 C67 45 53 61 56 85 C38 103 42 130 66 140 C99 157 127 143 132 125 L148 119 L149 93 L107 87 L105 59 Z" />
        <path className="guitar-neck" d="M122 86 L404 86 L404 111 L122 111 Z" />
        <path className="guitar-neck" d="M404 86 C426 77 423 77 446 83 L478 86 C493 91 489 102 476 106 L446 111 L404 111 Z" />
        <rect className="guitar-hardware" x="78" y="86" width="18" height="27" rx="2" /><rect className="guitar-hardware" x="112" y="88" width="5" height="22" rx="2" /><rect className="guitar-hardware" x="103" y="120" width="49" height="8" rx="4" />
        {[145,175,204,232,257,280,302,323,342,360,377,393].map(x => <line key={x} x1={x} x2={x} y1="87" y2="110" className="guitar-fret" />)}
        {[190,244,291,333,386].map(x => <circle key={x} cx={x} cy="98" r="2" className="guitar-hardware" />)}
        {[425,437,449,461,473,481].map(x => <circle key={x} cx={x} cy="82" r="3" className="guitar-hardware" />)}
        {[82.41,110,146.83,196,246.94,329.63].map((f,i) => <g key={f}><line x1="81" x2="477" y1={89+i*3.4} y2={89+i*3.4} className={`guitar-string ${strumming ? 'active' : ''}`} /><line x1="81" x2="477" y1={89+i*3.4} y2={89+i*3.4} className="string-hit" role="button" aria-label={`Play guitar string ${i+1}`} tabIndex={0} onPointerDown={() => strum(selected,f)} onKeyDown={e => { if(e.key==='Enter' || e.key===' ') {e.preventDefault(); strum(selected,f);} }} /></g>)}
        <text x="424" y="102" className="guitar-mark">Fender</text>
      </svg></div>
      <div className="chord-row">{track.chords.map(chord => <Button key={chord} variant="ghost" className={`chord-button ${selected === chord ? 'selected' : ''}`} aria-label={`Strum ${chord} chord`} onClick={() => strum(chord)}><span>{chord}</span><small>{chordShapes[chord]?.tab.replaceAll(' ', '')}</small></Button>)}</div>
      <div className="chord-detail"><Volume2 size={14} className="text-rose-gold" /><code>{selected}: {chordShapes[selected]?.tab}</code><span>{step ? `${step} of 4 notes in your little love sequence` : 'practice chords · E A D G B e'}</span></div>
      <div className="panel-bottom">{track.id ? 'practice arrangement · not verified song tabs' : 'G → D → Em → C'} · {track.chords.join(' → ')} ♡</div>
      </div>
    </div>
  </div></section>;
}