'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Check, ChevronDown, Clapperboard, FileText, Film, Globe2, Image as ImageIcon, RefreshCw, Search, Sparkles, Target, TrendingUp, Upload, Users, WandSparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const agents = [
  { id: 'story', name: 'Story intelligence', job: 'Narrative & character', color: 'blue', icon: FileText },
  { id: 'audience', name: 'Audience intelligence', job: 'Affinity & segments', color: 'red', icon: Users },
  { id: 'market', name: 'Live market research', job: 'Parallel Search API', color: 'yellow', icon: Search },
  { id: 'visual', name: 'Visual intelligence', job: 'Frames & campaign', color: 'green', icon: ImageIcon },
];

export default function Home() {
  const [view, setView] = useState<'brief'|'run'|'result'>('brief');
  const [progress, setProgress] = useState(0);
  const [script, setScript] = useState('After the sun begins erasing human memories, a reclusive archivist discovers an underground library where every forgotten life is still playing — including her own future.');
  const [format, setFormat] = useState('Feature film');
  const [market, setMarket] = useState('North America');
  const [files, setFiles] = useState<File[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (view !== 'run') return;
    const timer = window.setInterval(() => setProgress((p) => {
      if (p >= 100) { window.clearInterval(timer); window.setTimeout(() => setView('result'), 500); return 100; }
      return p + 2;
    }), 65);
    return () => window.clearInterval(timer);
  }, [view]);

  const run = () => { setProgress(0); setView('run'); };
  const reset = () => { setProgress(0); setView('brief'); };

  return <main className="app-shell">
    <Header />
    {view === 'brief' && <section className="studio-layout">
      <aside className="project-rail">
        <div className="rail-title"><span className="project-dot" /> <div><b>Untitled project</b><small>Draft analysis</small></div></div>
        <nav><button className="selected"><Sparkles /> Intelligence studio</button><Link href="/about"><Film /> How it works</Link></nav>
        <div className="cloud-proof"><span><WandSparkles /></span><p><b>Google Cloud workspace</b>Secure analysis<br />Evidence-linked results</p></div>
      </aside>
      <section className="studio-main">
        <div className="studio-heading"><div><p className="kicker">INTELLIGENCE STUDIO</p><h1>Find the signal<br /><span>before the spotlight.</span></h1><p>Turn scripts, frames and market context into an explainable commercial outlook.</p></div><div className="powered"><span className="gemini-mark">✦</span><small>BUILT WITH</small><b>Gemini on Google Cloud</b></div></div>
        <div className="constellation-input">
          <div className="agent-map" aria-label="Four AI agents analyze evidence in parallel">
            <svg className="agent-lines" viewBox="0 0 640 300" preserveAspectRatio="none" aria-hidden="true"><path d="M320 150 C235 150 225 55 120 55" /><path d="M320 150 C405 150 415 55 520 55" /><path d="M320 150 C235 150 225 245 120 245" /><path d="M320 150 C405 150 415 245 520 245" /></svg>
            {agents.map((agent,index) => { const Icon = agent.icon; return <div className={`agent-node node-${index+1} ${agent.color}`} key={agent.id}><span><Icon /></span><div><b>{agent.name}</b><small>{agent.job}</small></div></div>; })}
            <button className="source-core" onClick={() => fileRef.current?.click()}><span className="core-glow"><Upload /></span><b>Add creative material</b><small>Script, frames, cast or concept art</small><em>{files.length ? `${files.length} file${files.length > 1 ? 's' : ''} connected` : 'Browse files'}</em><input ref={fileRef} type="file" multiple className="sr-only" accept="image/*,.pdf,.doc,.docx" onChange={(e) => setFiles(Array.from(e.target.files ?? []))} /></button>
          </div>
          <div className="signal-strip"><span><i className="g-blue" /> Parallel agent analysis</span><span><i className="g-red" /> Evidence-linked reasoning</span><span><i className="g-yellow" /> Live market context</span><span><i className="g-green" /> Confidence-aware output</span></div>
        </div>
        <div className="brief-grid">
          <label className="story-field"><span><b>Story or concept</b><small>{script.length} / 2,000</small></span><textarea value={script} onChange={(e) => setScript(e.target.value)} maxLength={2000} /></label>
          <div className="context-fields"><Select label="Medium" icon={<Clapperboard />} value={format} setValue={setFormat} options={['Feature film','TV series','Limited series','Documentary']} /><Select label="Target geography" icon={<Globe2 />} value={market} setValue={setMarket} options={['North America','United Kingdom','Nordics','Western Europe','Global streaming']} /></div>
        </div>
        <div className="run-row"><span>Your materials stay within the project workspace.</span><Button className="run-button" disabled={!script.trim()} onClick={run}><Sparkles /> Run constellation <ArrowRight /></Button></div>
      </section>
      <aside className="evidence-rail"><div className="evidence-head"><p className="kicker">LIVE CONTEXT</p><span>Ready</span></div><h2>What Lumen will look for</h2><Evidence icon={<TrendingUp />} title="Demand signals" text="Comparable titles, audience interest and category momentum." /><Evidence icon={<Target />} title="Positioning gaps" text="Where the concept feels distinct—or disappears into the market." /><Evidence icon={<Zap />} title="Execution risk" text="Creative choices most likely to move the prediction." /><Link className="architecture-link" href="/about">Explore the full architecture <ArrowRight /></Link><div className="partner-lockup"><span>TRACK PARTNER</span><b>Parallel</b><small>Live web intelligence via Search API</small></div></aside>
    </section>}
    {view === 'run' && <RunView progress={progress} format={format} market={market} />}
    {view === 'result' && <ResultView reset={reset} market={market} />}
  </main>;
}

function Header(){ return <header className="g-header"><Link className="g-brand" href="/"><span className="lumen-glyph"><i/><i/><i/><i/></span><b>Lumen</b></Link><nav><Link className="active" href="/">Studio</Link><Link href="/about">About & architecture</Link></nav><div className="header-side"><span className="google-cloud"><i className="gemini-mark">✦</i> Gemini Enterprise</span><button className="user-dot">SH</button></div></header>; }
function Evidence({icon,title,text}:{icon:React.ReactNode;title:string;text:string}){ return <div className="evidence-item"><span>{icon}</span><div><b>{title}</b><p>{text}</p></div></div>; }
function Select({label,icon,value,setValue,options}:{label:string;icon:React.ReactNode;value:string;setValue:(v:string)=>void;options:string[]}){ return <label className="g-select"><span>{icon}{label}</span><div><select value={value} onChange={(e)=>setValue(e.target.value)}>{options.map(o=><option key={o}>{o}</option>)}</select><ChevronDown /></div></label>; }

function RunView({progress,format,market}:{progress:number;format:string;market:string}){
  const done=Math.floor(progress/25); return <section className="run-screen"><div className="run-top"><p className="kicker">AGENT CONSTELLATION · LIVE</p><h1>Four perspectives.<br /><span>One calibrated signal.</span></h1><p>Gemini is orchestrating independent analysis while Parallel grounds the market agent in current evidence.</p></div><div className="live-constellation"><svg viewBox="0 0 800 420" preserveAspectRatio="none"><path d="M400 210 L160 90"/><path d="M400 210 L640 90"/><path d="M400 210 L160 330"/><path d="M400 210 L640 330"/></svg><div className="synthesis-core"><span>{progress}</span><small>SYNTHESIS</small></div>{agents.map((a,i)=>{const Icon=a.icon;const complete=i<done||progress===100;const active=i===done&&progress<100;return <div className={`live-agent live-${i+1} ${a.color} ${complete?'complete':''} ${active?'thinking':''}`} key={a.id}><span>{complete?<Check/>:<Icon/>}</span><div><b>{a.name}</b><small>{complete?'Signal delivered':active?'Investigating…':'Waiting'}</small></div>{active&&<i/>}</div>})}</div><div className="run-log"><div><span className="g-blue"/> Gemini agent orchestration</div><div><span className="g-yellow"/> Parallel Search API · live grounding</div><div><span className="g-green"/> Calibrated hit-or-miss signal</div><em>{format} · {market}</em></div></section>;
}

function ResultView({reset,market}:{reset:()=>void;market:string}){ return <section className="result-screen"><div className="result-header"><div><p className="kicker">CONSTELLATION COMPLETE</p><h1>The Last Archive</h1><p>Feature film · Sci-fi drama · {market}</p></div><Button variant="outline" onClick={reset}><RefreshCw /> New analysis</Button></div><div className="verdict-grid"><div className="verdict-main"><div className="prediction-row"><div className="prediction-score"><span>82</span><small>/100</small></div><div><span className="outcome-pill"><i/> STRONG POTENTIAL</span><h2>A clear concept with<br/><em>international reach.</em></h2></div></div><p className="verdict-summary">The premise is instantly legible, visually ownable and emotionally grounded. Its strongest path is premium streaming, led by the relationship rather than the mythology.</p><div className="confidence-band"><span>Prediction confidence</span><b>87%</b><div><i/></div><small>High agreement across 4 agents · grounded in 38 external signals</small></div></div><div className="agent-consensus"><p className="kicker">AGENT CONSENSUS</p>{agents.map((a,i)=><div key={a.id}><span className={a.color}>{i===2?<Search/>:<Check/>}</span><div><b>{a.name}</b><small>{['Strong emotional engine','Clear 25–44 affinity','Category demand is rising','High campaign potential'][i]}</small></div><em>{[88,79,76,91][i]}</em></div>)}</div></div><div className="evidence-grid"><section><p className="kicker">WHY IT COULD WIN</p><h3>Signals that move the model</h3><article><b>01</b><div><h4>One-sentence clarity</h4><p>The memory-erasing sun is immediately understood and easy to carry into trailers, social clips and key art.</p></div></article><article><b>02</b><div><h4>Emotion crosses borders</h4><p>The archivist’s future creates a human question that remains meaningful across target geographies.</p></div></article></section><section><p className="kicker">MODEL WATCHOUT</p><h3>What changes the outcome</h3><article><b>−7</b><div><h4>Lore-first positioning</h4><p>Leading with world-building instead of the personal choice reduces predicted broad-audience conversion.</p></div></article><article><b>+9</b><div><h4>Character-led campaign</h4><p>A campaign focused on the forbidden future raises intent across all measured audience clusters.</p></div></article></section></div><div className="result-footer"><span><Sparkles/> Gemini reasoning</span><span><Search/> Parallel-grounded research</span><span><TrendingUp/> BigQuery ML prediction</span><Link href="/about">See system architecture <ArrowRight/></Link></div></section>; }
