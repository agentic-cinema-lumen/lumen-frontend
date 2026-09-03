'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Check, ChevronDown, Clapperboard, FileText, Globe2, Info, Lightbulb, LockKeyhole, RefreshCw, ShieldAlert, Sparkles, Target, TrendingUp, Upload, WandSparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const sampleSynopsis = 'After the sun begins erasing human memories, a reclusive archivist discovers an underground library where every forgotten life is still playing — including her own future.';
const agents = [
  { name: 'Story Agent', note: 'Narrative shape & emotional engine' },
  { name: 'Audience Agent', note: 'Viewer affinity & discoverability' },
  { name: 'Market Agent', note: 'Demand, timing & comparables' },
  { name: 'Visual Agent', note: 'Concept clarity & campaign potential' },
];

export default function Home() {
  const [phase, setPhase] = useState<'input' | 'analyzing' | 'result'>('input');
  const [progress, setProgress] = useState(0);
  const [synopsis, setSynopsis] = useState(sampleSynopsis);
  const [format, setFormat] = useState('Feature film');
  const [genre, setGenre] = useState('Sci-fi drama');
  const [market, setMarket] = useState('North America');
  const [audience, setAudience] = useState('Adults 25–44');
  const [files, setFiles] = useState<File[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (phase !== 'analyzing') return;
    const timer = window.setInterval(() => setProgress((value) => {
      if (value >= 100) { window.clearInterval(timer); window.setTimeout(() => setPhase('result'), 450); return 100; }
      return Math.min(100, value + 2);
    }), 55);
    return () => window.clearInterval(timer);
  }, [phase]);

  const beginAnalysis = () => { setProgress(0); setPhase('analyzing'); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const restart = () => { setPhase('input'); setProgress(0); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="site-header">
        <button className="brand" onClick={restart} aria-label="Lumen home"><span className="brand-mark"><span /></span><span>LUMEN</span></button>
        <div className="header-meta"><span className="secure"><LockKeyhole /> Private workspace</span><span className="demo-pill">DEMO</span><button className="avatar" aria-label="Account menu">HS</button></div>
      </header>
      {phase === 'input' && <InputExperience synopsis={synopsis} setSynopsis={setSynopsis} format={format} setFormat={setFormat} genre={genre} setGenre={setGenre} market={market} setMarket={setMarket} audience={audience} setAudience={setAudience} files={files} setFiles={setFiles} fileInput={fileInput} beginAnalysis={beginAnalysis} />}
      {phase === 'analyzing' && <AnalysisExperience progress={progress} synopsis={synopsis} market={market} />}
      {phase === 'result' && <ResultExperience format={format} genre={genre} market={market} audience={audience} restart={restart} />}
    </main>
  );
}

function Steps({ current }: { current: number }) {
  return <aside className="step-rail" aria-label="Analysis steps"><p className="eyebrow">NEW ANALYSIS</p><ol>{[['Project brief','Story & assets'],['Market context','Audience & release'],['Signal review','AI assessment']].map(([title,note], index) => <li key={title} className={index + 1 <= current ? 'active' : ''}><span>{index + 1 < current ? <Check /> : `0${index + 1}`}</span><div><b>{title}</b><small>{note}</small></div></li>)}</ol><div className="rail-note"><Sparkles /><div><b>4 specialist agents</b><p>Story, audience, market and visual signals work together.</p></div></div></aside>;
}

function InputExperience(props: InputProps) {
  const { synopsis, setSynopsis, format, setFormat, genre, setGenre, market, setMarket, audience, setAudience, files, setFiles, fileInput, beginAnalysis } = props;
  return <div className="workspace-shell">
    <Steps current={1} />
    <section className="brief-panel">
      <div className="section-heading"><div><p className="eyebrow amber">PROJECT 01 · UNTITLED</p><h1>What are we evaluating?</h1><p>Give Lumen the materials you have. A synopsis is enough to begin.</p></div><span className="step-count">1 of 3</span></div>
      <div className="field-block"><div className="field-label"><span>Story or concept</span><small>{synopsis.length} / 2,000</small></div><textarea value={synopsis} maxLength={2000} onChange={(event) => setSynopsis(event.target.value)} placeholder="Paste a synopsis, treatment, logline or a section of your script…" /><div className="textarea-foot"><FileText /> You can paste up to roughly two script pages for this demo.</div></div>
      <div className="field-block"><div className="field-label"><span>Visual material</span><small>Optional</small></div><button className="upload-zone" type="button" onClick={() => fileInput.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); setFiles(Array.from(event.dataTransfer.files)); }}><input ref={fileInput} className="sr-only" type="file" multiple accept="image/*,.pdf,.doc,.docx" onChange={(event) => setFiles(Array.from(event.target.files ?? []))} /><span className="upload-icon"><Upload /></span><span><b>{files.length ? `${files.length} file${files.length > 1 ? 's' : ''} ready` : 'Drop frames, concept art or a script'}</b><small>{files.length ? files.map((file) => file.name).join(' · ') : 'PDF, DOCX, PNG or JPG · up to 25 MB'}</small></span><span className="browse">Browse files</span></button></div>
      <div className="context-grid"><SelectField icon={<Clapperboard />} label="Format" value={format} setValue={setFormat} options={['Feature film','TV series','Limited series','Short film']} /><SelectField icon={<Sparkles />} label="Genre" value={genre} setValue={setGenre} options={['Sci-fi drama','Thriller','Comedy','Romance','Documentary']} /><SelectField icon={<Globe2 />} label="Primary market" value={market} setValue={setMarket} options={['North America','United Kingdom','Nordics','Western Europe','Global streaming']} /><SelectField icon={<Target />} label="Core audience" value={audience} setValue={setAudience} options={['Adults 25–44','Adults 18–34','Family','Young adults','Broad audience']} /></div>
      <div className="action-row"><p><Info /> Results are directional signals, not a guarantee of performance.</p><Button className="evaluate" size="lg" disabled={!synopsis.trim()} onClick={beginAnalysis}>Evaluate potential <ArrowRight /></Button></div>
    </section>
    <aside className="preview-panel"><div className="preview-card"><div className="preview-art image-art"><Image src="/lumen-concept-social.png" alt="A lone figure entering a luminous archive in a mountain" fill sizes="350px" /></div><div className="preview-body"><p className="eyebrow">EARLY READ</p><h2>The Last Archive</h2><p>A high-concept, emotionally grounded sci-fi drama with clear prestige positioning.</p><div className="signal-chips"><span>Prestige sci-fi</span><span>Adult drama</span><span>Global</span></div></div></div><div className="what-next"><span><Sparkles /></span><div><b>What happens next?</b><p>Lumen’s agents compare your creative signals with audience patterns and market context.</p></div></div></aside>
  </div>;
}

function AnalysisExperience({ progress, synopsis, market }: { progress: number; synopsis: string; market: string }) {
  const active = Math.min(3, Math.floor(progress / 25));
  return <section className="analysis-page"><div className="analysis-intro"><p className="eyebrow amber">SIGNAL ANALYSIS IN PROGRESS</p><h1>Reading between the frames.</h1><p>Four specialist agents are testing the creative idea against audience and market signals.</p></div><div className="analysis-stage"><div className="analysis-visual"><Image src="/lumen-concept-social.png" alt="The Last Archive concept visualization" fill priority sizes="(max-width: 800px) 100vw, 485px" /><div className="scanline" /><span>{progress}%</span></div><div className="analysis-copy"><div className="progress-heading"><span>Composite analysis</span><span>{progress}%</span></div><div className="progress-track"><div style={{ width: `${progress}%` }} /></div><div className="agent-list">{agents.map((agent,index) => <div key={agent.name} className={index < active || progress === 100 ? 'done' : index === active ? 'working' : ''}><span className="agent-status">{index < active || progress === 100 ? <Check /> : index === active ? <span className="pulse" /> : index + 1}</span><div><b>{agent.name}</b><small>{agent.note}</small></div><em>{index < active || progress === 100 ? 'Complete' : index === active ? 'Working' : 'Queued'}</em></div>)}</div></div></div><div className="analysis-context"><div><span>INPUT</span><p>“{synopsis.slice(0,110)}…”</p></div><div><span>PRIMARY MARKET</span><p>{market}</p></div><div><span>MODEL VIEW</span><p>Directional · v1.4</p></div></div></section>;
}

function ResultExperience({ format, genre, market, audience, restart }: { format: string; genre: string; market: string; audience: string; restart: () => void }) {
  return <div className="result-shell">
    <div className="result-topbar"><button onClick={restart}><ArrowLeft /> New analysis</button><div><span>{format}</span><span>{genre}</span><span>{market}</span><span>{audience}</span></div><Button variant="outline" onClick={() => window.print()}>Export brief</Button></div>
    <section className="verdict-hero"><div className="verdict-copy"><p className="eyebrow amber">LUMEN VERDICT · PROJECT 01</p><div className="verdict-label"><span /> PROMISING</div><h1>The Last Archive has<br /><em>breakout potential.</em></h1><p>A distinctive, globally legible premise with a strong emotional engine. Success depends on making the human relationship—not the mythology—the campaign’s center.</p><div className="result-actions"><Button className="evaluate" onClick={restart}><RefreshCw /> Evaluate another</Button><button className="text-action">See how we scored this <ArrowRight /></button></div></div><div className="score-cluster"><div className="score-ring"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" /><circle className="score-value" cx="60" cy="60" r="52" /></svg><div><strong>78</strong><span>/ 100</span></div></div><b>Commercial potential</b><p>Upper quartile for its category</p><div className="confidence"><span>Model confidence</span><b>84%</b><div><i style={{width:'84%'}} /></div></div></div></section>
    <section className="result-grid"><div className="main-findings">
      <div className="finding-section"><div className="finding-heading"><span className="positive"><TrendingUp /></span><div><p className="eyebrow">STRONGEST SIGNALS</p><h2>Why it could connect</h2></div></div><div className="finding-list"><Finding n="01" title="A premise you can repeat in one breath" copy="The memory-erasing sun creates immediate stakes and a clear visual hook—strong ingredients for trailers, key art and word of mouth." /><Finding n="02" title="Emotion travels better than lore" copy="The archivist’s personal future gives the high concept a human center that can translate across markets without heavy cultural context." /><Finding n="03" title="A well-defined prestige audience" copy="The project aligns with adult viewers who over-index on thoughtful speculative drama and premium streaming discovery." /></div></div>
      <div className="finding-section risk-section"><div className="finding-heading"><span className="risk"><ShieldAlert /></span><div><p className="eyebrow">WATCHOUTS</p><h2>What could hold it back</h2></div></div><div className="risk-grid"><div><b>Familiar category cues</b><p>Memory and archive themes are crowded. The character relationship needs a proprietary twist.</p></div><div><b>Marketing clarity</b><p>Avoid selling the mythology first. Lead with the impossible personal choice at the center.</p></div><div><b>Budget sensitivity</b><p>The visual promise implies scale; contained world-building will protect the concept from feeling under-realized.</p></div></div></div>
    </div><aside className="market-card"><p className="eyebrow">MARKET FIT</p><h2>Where it travels</h2><div className="fit-score"><span>82</span><div><b>North America</b><small>Strong initial fit</small></div></div><div className="bar-set"><Metric label="Concept clarity" value={91} /><Metric label="Audience appetite" value={79} /><Metric label="Distinctiveness" value={76} /><Metric label="Visual potential" value={88} /><Metric label="Execution risk" value={61} /></div><div className="secondary-markets"><span>SECONDARY MARKETS</span><div><b>UK & Ireland</b><em>76</em></div><div><b>Nordics</b><em>74</em></div><div><b>Western Europe</b><em>70</em></div></div></aside></section>
    <section className="recommendation"><span><Lightbulb /></span><div><p className="eyebrow">LUMEN RECOMMENDS</p><h2>Make the promise personal.</h2><p>Build the pitch and first-look materials around one question: <em>what if the only place your future still existed was somewhere you were forbidden to enter?</em> It turns an expansive world into an urgent, intimate choice.</p></div><button>View positioning brief <ArrowRight /></button></section>
    <footer className="result-footer"><span><WandSparkles /> Generated by four specialist AI agents</span><p>Directional creative intelligence—not a guarantee of commercial performance.</p></footer>
  </div>;
}

function Finding({ n, title, copy }: { n: string; title: string; copy: string }) { return <div><span>{n}</span><div><b>{title}</b><p>{copy}</p></div></div>; }
function Metric({ label, value }: { label: string; value: number }) { return <div className="metric"><div><span>{label}</span><b>{value}</b></div><div><i style={{width:`${value}%`}} /></div></div>; }
function SelectField({ icon, label, value, setValue, options }: { icon: React.ReactNode; label: string; value: string; setValue: (value: string) => void; options: string[] }) { return <label className="select-field"><span>{icon}<small>{label}</small></span><span className="select-wrap"><select value={value} onChange={(event) => setValue(event.target.value)}>{options.map((option) => <option key={option}>{option}</option>)}</select><ChevronDown /></span></label>; }
type InputProps = { synopsis:string; setSynopsis:(v:string)=>void; format:string; setFormat:(v:string)=>void; genre:string; setGenre:(v:string)=>void; market:string; setMarket:(v:string)=>void; audience:string; setAudience:(v:string)=>void; files:File[]; setFiles:(v:File[])=>void; fileInput:React.RefObject<HTMLInputElement | null>; beginAnalysis:()=>void };
