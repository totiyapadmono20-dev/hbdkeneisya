import { useEffect, useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ArrowDown, ArrowLeft, ArrowRight, Check, ChevronLeft, ChevronRight, Coffee, Film, Heart, ImagePlus, Mail, Moon, Pause, Play, Send, Smile, Sparkles, Sun, Trophy, Upload, Volume2, VolumeX, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';
import { BirthdayMusic } from '@/components/BirthdayMusic';
import { birthdayLetter } from '@/lib/birthday';
import flowers from '@/assets/birthday-flowers.jpg';
import cake from '@/assets/birthday-cake.jpg';
import sunset from '@/assets/sunset-memory.jpg';
import cutestGirl from '@/assets/cutest-girl.mp4.asset.json';
import cutestGirlPoster from '@/assets/cutest-girl-poster.jpg.asset.json';
import prettyGirl from '@/assets/pretty-girl.jpg.asset.json';

type Memory = { src: string; title: string; kind: 'photo' | 'video'; example?: boolean; poster?: string; visitOnly?: boolean };
const initialMemories: Memory[] = [
  { src: cake, title: 'a wish, just for you', kind: 'photo', example: true },
  { src: sunset, title: 'under the same sky', kind: 'photo', example: true },
  { src: cutestGirl.url, title: 'cutest girl', kind: 'video', poster: cutestGirlPoster.url },
  { src: flowers, title: 'flowers for my favorite', kind: 'photo', example: true },
  { src: prettyGirl.url, title: 'pretty girl', kind: 'photo' },
];
const winLabels = ['survived a super busy day', 'found a reason to smile', 'took a well-deserved rest', 'was a little kinder to myself'];
const winNotes = ['even on the hard days, you keep going. i’m so proud of you, neis. ♡', 'your smile is my favorite little thing in the whole world. ♡', 'rest isn’t something you have to earn. you deserve softness, always. ♡', 'you deserve the same kindness you give everyone else. always. ♡'];
const petNotes = ['you did amazing today, keneisya!', 'take a deep breath, little sunshine ♡', 'someone loves you so much! ❤️', 'a tiny reminder: you are enough.'];
const zones = ['Asia/Makassar', 'Asia/Jakarta', 'Asia/Jayapura', 'Asia/Singapore', 'Asia/Tokyo', 'Europe/London', 'Europe/Paris', 'America/New_York', 'Australia/Sydney', 'UTC'];
const zoneNames: Record<string,string> = { 'Asia/Makassar':'bali · wita', 'Asia/Jakarta':'bekasi · wib', 'Asia/Jayapura':'papua · wit', 'Asia/Singapore':'singapore', 'Asia/Tokyo':'tokyo', 'Europe/London':'london', 'Europe/Paris':'paris', 'America/New_York':'new york', 'Australia/Sydney':'sydney', 'UTC':'utc' };
const zoneLabel = (zone: string) => zoneNames[zone] ?? zone.toLowerCase().replaceAll('_',' ');

function celebration() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const canvas = document.createElement('canvas'); const ctx = canvas.getContext('2d');
  const colors = ['--primary','--petal','--gold'].map(token => {
    if (!ctx) return '';
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
    ctx.fillRect(0,0,1,1); const rgba = ctx.getImageData(0,0,1,1).data;
    return '#' + [rgba[0] ?? 0,rgba[1] ?? 0,rgba[2] ?? 0].map(n => n.toString(16).padStart(2,'0')).join('');
  }).filter(Boolean);
  void confetti({ particleCount: 100, spread: 100, origin: { y: .72 }, colors, disableForReducedMotion: true, scalar: .85 });
}

export function BirthdayOasis() {
  const [entered,setEntered] = useState(false);
  const [memories,setMemories] = useState(initialMemories);
  const [activeMemory,setActiveMemory] = useState<number | null>(null);
  const [letterOpen,setLetterOpen] = useState(false);
  const [wins,setWins] = useState<boolean[]>([false,false,false,false]);
  const [labels,setLabels] = useState(winLabels);
  const [editing,setEditing] = useState(false);
  const [note,setNote] = useState('');
  const [now,setNow] = useState<Date | null>(null);
  const [yourZone,setYourZone] = useState('Asia/Makassar');
  const [myZone,setMyZone] = useState('Asia/Jakarta');
  const [hug,setHug] = useState(false);
  const [copied,setCopied] = useState(false);
  const [burst,setBurst] = useState(0);
  const [petMessage,setPetMessage] = useState('');
  const [petting,setPetting] = useState(false);
  const [petIndex,setPetIndex] = useState(0);
  const [videoPlaying,setVideoPlaying] = useState(false);
  const [videoProgress,setVideoProgress] = useState(0);
  const [muted,setMuted] = useState(false);
  const filmRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const petTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mediaUrls = useRef<string[]>([]);
  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()),1000);
    return () => { clearInterval(timer); if(petTimer.current) clearTimeout(petTimer.current); mediaUrls.current.forEach(url => URL.revokeObjectURL(url)); };
  },[]);
  function enter() { window.dispatchEvent(new Event('oasis-enter')); setEntered(true); }
  function pet() {
    setPetting(true); setPetMessage(petNotes[petIndex % petNotes.length] ?? 'you are so loved ♡'); setPetIndex(i => i+1);
    if(petTimer.current) clearTimeout(petTimer.current);
    petTimer.current = setTimeout(() => {setPetting(false); setPetMessage('');},4500);
  }
  function win(index: number) {
    const checked = !wins[index]; setWins(old => old.map((v,i) => i===index ? checked : v));
    if(checked) { celebration(); setNote(winNotes[index] ?? 'i’m so proud of you ♡'); }
  }
  function sendHug() {
    setHug(true); setBurst(v => v+1); celebration();
    void navigator.clipboard?.writeText('keneisya just claimed her birthday hug!').then(() => setCopied(true)).catch(() => setCopied(false));
  }
  function upload(files: FileList | null) {
    if(!files?.length) return;
    const media = Array.from(files).filter(f => f.type.startsWith('image/') || f.type.startsWith('video/')).map(f => {
      const src = URL.createObjectURL(f); mediaUrls.current.push(src);
      return {src,title:f.name.replace(/\.[^.]+$/,''),kind:f.type.startsWith('video/') ? 'video' as const : 'photo' as const,visitOnly:true};
    });
    const first = media[0];
    if(!first) return;
    if(activeMemory !== null && !memories[activeMemory]?.src) { setMemories(old => old.map((m,i) => i===activeMemory ? first : m).concat(media.slice(1))); }
    else setMemories(old => [...old,...media]);
    if(fileRef.current) fileRef.current.value = '';
  }
  function moveMemory(direction: number) { if(activeMemory===null)return; setActiveMemory((activeMemory+direction+memories.length)%memories.length); setVideoProgress(0); setVideoPlaying(false); }
  const current = activeMemory === null ? null : memories[activeMemory];
  function clock(zone: string) { return now ? new Intl.DateTimeFormat('en-GB',{timeZone:zone,hour:'2-digit',minute:'2-digit'}).format(now) : '––:––'; }
  return <div className="oasis">
    <div className={`splash ${entered ? 'splash-gone' : ''}`} aria-hidden={entered} inert={entered}>
      <img src={flowers} width={1536} height={1024} alt="" className="splash-image" />
      <div className="splash-content"><Heart className="splash-heart" /><div className="eyebrow">a little love, across the distance</div><h2>for you, Keneisya</h2><p>a special digital space crafted just for you.</p><Button className="birthday-button" onClick={enter}>enter keneisya’s oasis ✨</Button><small>a quiet little corner of the world. all yours.</small></div>
    </div>
    <div inert={!entered}>
    <header className="site-header"><div className="page-width"><a className="brand" href="#home"><Heart size={24} /> keneisya’s oasis<span className="text-primary">.</span></a><div className="header-right"><nav className="nav-links" aria-label="Birthday sections"><a href="#soundscape">our soundtrack</a><a href="#memories">little memories</a><a href="#reminders">for you</a><a href="#connection">across the miles</a></nav><span className="birthday-tag"><Sparkles size={12} /> it’s your day, neis</span></div></div></header>
    <main>
      <section id="home" className="hero"><img src={flowers} width={1536} height={1024} className="hero-image" alt="Blush roses, a love letter, and pink ribbon for Keneisya" /><div className="page-width hero-content"><div className="eyebrow"><Sparkles size={13} /> today, the world is a little sweeter</div><h1>happy birthday,<span>Keneisya ♡</span></h1><p className="hero-copy">to my favorite person, my sweetest hello, and the place that always feels like home.<br />this little corner of the internet? it’s all for you.</p><div className="hero-actions"><Button className="birthday-button" onClick={() => {setLetterOpen(true);}}><Mail size={14} /> a little letter for you</Button><Button className="birthday-button" variant="outline" asChild><a href="#soundscape">stay a little while <ArrowDown size={13} /></a></Button></div><p className="hero-footnote">made with love, and a little bit of missing you.</p></div></section>
      <BirthdayMusic entered={entered} onUnlock={() => {celebration(); setLetterOpen(true);}} />
      <section id="memories" className="section gallery-section"><div className="page-width section-intro"><div><div className="eyebrow"><Film size={12} /> the moments i keep</div><h2 className="section-title">little memories, endless love.</h2><p className="section-subtitle">if i could bottle up a feeling, it would be these.</p></div><div className="flex gap-2 shrink-0"><Button variant="outline" size="icon" title="Previous memories" aria-label="Previous memories" onClick={() => filmRef.current?.scrollBy({left:-280,behavior:'smooth'})}><ArrowLeft /></Button><Button variant="outline" size="icon" title="Next memories" aria-label="Next memories" onClick={() => filmRef.current?.scrollBy({left:280,behavior:'smooth'})}><ArrowRight /></Button></div></div>
      <div className="filmstrip"><div className="film-scroll" ref={filmRef}>{memories.map((m,i) => <div className="film-frame" key={m.src || i}>{m.src && m.kind==='photo' ? <img src={m.src} alt={m.title} width={260} height={245} loading="lazy" /> : <div className="film-placeholder">{m.kind==='video' ? <Film /> : <ImagePlus />}</div>}<Button variant="ghost" className="film-open" aria-label={`Open ${m.title}`} onClick={() => {setActiveMemory(i);setVideoPlaying(false);setVideoProgress(0);}}><span className="film-number">{String(i+1).padStart(2,'0')} / {m.kind==='video' ? 'motion' : 'still'}</span>{m.kind==='video' && <span className="video-icon"><Play size={17} /></span>}<span className="film-caption">{m.title}</span></Button></div>)}</div></div>
      <div className="page-width"><p className="gallery-note">some pretty keepsakes, waiting for our real memories. ♡</p><div className="flex justify-center mt-3"><Button variant="ghost" size="sm" onClick={() => fileRef.current?.click()}><Upload size={12} /> add our photos & videos</Button></div><input type="file" accept="image/*,video/*" multiple hidden ref={fileRef} onChange={e => upload(e.target.files)} /></div></section>
      <section className="section"><div className="page-width life-grid">
      <div id="reminders"><div className="eyebrow"><Trophy size={12} /> even the little things count</div><h2 className="section-title">keneisya’s daily<br />reminders & trophies</h2><p className="section-subtitle">you don’t have to move mountains to make me proud.</p><div className="wins">{labels.map((label,i) => {const Icon=[Sun,Smile,Moon,Coffee][i] ?? Sun;return <div className={`win-row ${wins[i] ? 'done' : ''}`} key={i}><input type="checkbox" id={`win-${i}`} checked={wins[i]} onChange={() => win(i)} />{editing ? <input className="w-full min-w-0 bg-transparent border-b border-border text-xs outline-none py-1" value={label} aria-label={`Edit reminder ${i+1}`} onChange={e => setLabels(old => old.map((v,n) => n===i ? e.target.value : v))} /> : <label htmlFor={`win-${i}`}>{label}</label>}<Icon className="win-icon" /></div>;})}</div><div className="flex justify-between items-center mt-3"><span className="text-[10px] text-rose-gold">{wins.filter(Boolean).length} / 4 little victories today</span><Button variant="ghost" size="sm" onClick={() => setEditing(!editing)}>{editing ? <><Check size={12} /> done</> : 'make them yours'}</Button></div>{note && <p className="appreciation" role="status">{note}</p>}</div>
      <div id="connection"><div className="eyebrow"><Heart size={12} /> different places. the same love.</div><h2 className="section-title">a little closer,<br />even from here.</h2><p className="section-subtitle">bekasi &amp; bali, terhalang jarak, but never far from my heart.</p><div className="clock-grid"><div className="clock"><div className="clock-label">your little world</div><div className="clock-time">{clock(yourZone)}</div><select aria-label="Keneisya timezone" value={yourZone} onChange={e => setYourZone(e.target.value)}>{[...new Set([...zones,yourZone])].map(z => <option key={z} value={z}>{zoneLabel(z)}</option>)}</select></div><div className="distance-line"><Heart /></div><div className="clock"><div className="clock-label">my little world</div><div className="clock-time">{clock(myZone)}</div><select aria-label="Partner timezone" value={myZone} onChange={e => setMyZone(e.target.value)}>{zones.map(z => <option key={z} value={z}>{zoneLabel(z)}</option>)}</select></div></div><div className="hug-area"><Button className="birthday-button" onClick={sendHug}><Heart size={14} /> send a virtual hug</Button><p>until i can give you a real one.</p>{hug && <div className="hug-result" role="status">a hug, wrapped in all my love, across the distance! ❤️<br />{copied ? 'your birthday hug message is copied. send it to me on discord ♡' : 'send me: “keneisya just claimed her birthday hug!”'}<br /><Button variant="link" asChild><a href="https://discord.com/users/557942087446953985" target="_blank" rel="noreferrer"><Send size={12} /> open our discord chat</a></Button></div>}</div></div>
      </div></section>
      <section className="letter-section"><div className="eyebrow"><Heart size={11} /> always, in all ways</div><h2>you make ordinary days feel special.</h2><p>wherever life takes us, i hope you always remember this:<br />you are so loved. not just today, but on every ordinary tuesday, too.</p><div className="letter-sign">yours, across every distance ♡</div></section>
    </main><footer className="page-width footer"><span><Heart size={11} /> made with a full heart, just for keneisya.</span><span>a little oasis. an endless kind of love.</span></footer>
    <div className="pet"><div aria-live="polite">{petMessage && <div className="pet-bubble">{petMessage}</div>}</div><Button variant="ghost" className={`pet-button ${petting ? 'petting' : ''}`} aria-label="Pet your little companion" onClick={pet} onPointerEnter={() => { if(!petting)pet(); }}><svg viewBox="0 0 32 32" className="pixel-cat" aria-hidden="true"><path className="cat-coat" d="M5 4h6v3h10V4h6v18h-3v6H8v-3H5Z" /><path className="cat-inner" d="M7 6h3v5H7zm15 0h3v5h-3z" /><path className="cat-light" d="M8 17h16v5h-3v5H11v-5H8z" /><path className="cat-eye" d="M9 13h3v3H9zm11 0h3v3h-3zm-6 5h4v2h-4zm1 2h2v2h-2z" /><path className="cat-inner" d="M7 17h4v2H7zm15 0h4v2h-4z" /><path className="cat-coat" d="M24 21h4v-5h3v9h-7z" /></svg></Button></div>
    </div>
    {entered && <div className="particle-layer ambient" aria-hidden="true">{Array.from({length:8},(_,i) => <span key={i} className="particle" style={{left:`${(i*13+7)%100}%`,animationDelay:`${i*2}s`,animationIterationCount:'infinite'}}>♡</span>)}</div>}
    {burst>0 && <div key={burst} className="particle-layer" aria-hidden="true">{Array.from({length:36},(_,i) => <span key={i} className={`particle ${i%3===0 ? 'gold' : ''}`} style={{left:`${(i*17+3)%100}%`,animationDelay:`${i*.045}s`,fontSize:`${16+(i%5)*5}px`}}>{i%3===0 ? '✦' : '♥'}</span>)}</div>}
    <Dialog.Root open={letterOpen} onOpenChange={setLetterOpen}><Dialog.Portal><Dialog.Overlay className="lightbox"><Dialog.Content className="lightbox-content"><Dialog.Close asChild><Button size="icon" variant="ghost" className="lightbox-close" aria-label="Close birthday letter"><X /></Button></Dialog.Close><div className="letter-section border-0"><div className="eyebrow"><Mail size={12} /> a little piece of my heart</div><Dialog.Title asChild><h2>my favorite person,</h2></Dialog.Title><Dialog.Description asChild><p>{birthdayLetter}</p></Dialog.Description><div className="letter-sign">all my love, always ♡</div></div></Dialog.Content></Dialog.Overlay></Dialog.Portal></Dialog.Root>
    <Dialog.Root open={activeMemory!==null} onOpenChange={open => {if(!open){setActiveMemory(null);setVideoPlaying(false);}}}><Dialog.Portal><Dialog.Overlay className="lightbox"><Dialog.Content className="lightbox-content"><Dialog.Close asChild><Button size="icon" variant="ghost" className="lightbox-close" aria-label="Close memory"><X /></Button></Dialog.Close>{current?.src ? current.kind==='video' ? <><video ref={videoRef} src={current.src} playsInline muted={muted} onTimeUpdate={e => {const v=e.currentTarget;if(v.duration)setVideoProgress(v.currentTime/v.duration*100);}} onPlay={() => setVideoPlaying(true)} onPause={() => setVideoPlaying(false)} /><div className="video-controls"><Button variant="ghost" size="icon" aria-label={videoPlaying ? 'Pause video' : 'Play video'} onClick={() => {if(videoPlaying)videoRef.current?.pause();else void videoRef.current?.play();}}>{videoPlaying ? <Pause /> : <Play />}</Button><input type="range" min={0} max={100} value={videoProgress} aria-label="Video timeline" onChange={e => {const v=videoRef.current;if(v && Number.isFinite(v.duration))v.currentTime=Number(e.target.value)/100*v.duration;}} /><Button size="icon" variant="ghost" aria-label={muted ? 'Unmute video' : 'Mute video'} onClick={() => setMuted(!muted)}>{muted ? <VolumeX /> : <Volume2 />}</Button></div></> : <img src={current.src} alt={current.title} /> : <div className="upload-placeholder"><Film size={38} className="text-primary" /><p>a little memory belongs here ♡</p><Button className="birthday-button" onClick={() => fileRef.current?.click()}><Upload size={13} /> choose a photo or video</Button></div>}<div className="lightbox-footer"><div><Dialog.Title className="text-xl">{current?.title}</Dialog.Title><Dialog.Description className="text-[10px] font-sans text-muted-foreground mt-1">{current?.example ? 'a generated birthday keepsake · add your own favorite moments' : current?.src ? 'a memory for this visit ♡' : 'your memories stay here for this visit'}</Dialog.Description></div><div className="flex gap-1"><Button size="icon" variant="ghost" aria-label="Previous memory" onClick={() => moveMemory(-1)}><ChevronLeft /></Button><Button size="icon" variant="ghost" aria-label="Next memory" onClick={() => moveMemory(1)}><ChevronRight /></Button></div></div></Dialog.Content></Dialog.Overlay></Dialog.Portal></Dialog.Root>
  </div>;
}