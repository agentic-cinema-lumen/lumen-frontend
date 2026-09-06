import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, BrainCircuit, Check, Cloud, Database, Film, Gauge, GitBranch, Layers3, Search, ShieldCheck, Sparkles } from 'lucide-react';

const team = [
  { name: 'Niklas Norinder', image: '/team/niklas-avatar.webp', href: 'https://www.linkedin.com/in/niklas-norinder/', color: 'blue' },
  { name: 'Melvin Palmquist', image: '/team/melvin-avatar.webp', href: 'https://www.linkedin.com/in/melvin-palmquist-95345524a/', color: 'red' },
  { name: 'Shahzada Hatim', image: '/team/hatim-avatar.webp', href: 'https://www.linkedin.com/in/shahzadahatim/', color: 'green' },
];

export default function AboutPage(){
  return <main className="about-page">
    <header className="g-header about-header"><Link className="g-brand" href="/"><span className="lumen-glyph"><i/><i/><i/><i/></span><b>Lumen</b></Link><nav><Link href="/">Studio</Link><Link className="active" href="/about">About & architecture</Link></nav><div className="header-side"><span className="google-cloud"><i className="gemini-mark">✦</i> Gemini Enterprise</span><span className="track-chip">PARALLEL TRACK</span></div></header>
    <section className="about-hero"><Link href="/"><ArrowLeft/> Back to studio</Link><p className="kicker">ABOUT LUMEN</p><h1>A better way to decide<br/><span>what gets made.</span></h1><p>Lumen turns fragmented creative material and live market evidence into a calibrated, explainable outlook for film and television teams.</p><div className="hero-proof"><span><Sparkles/> Gemini-orchestrated</span><span><Search/> Parallel-grounded</span><span><Cloud/> Google Cloud-native</span></div></section>

    <section className="problem-section"><div><p className="kicker">THE PROBLEM</p><h2>Greenlight decisions are expensive.<br/>The evidence is fragmented.</h2></div><div><p>Studios weigh scripts, talent, audience behavior, market timing, comparable titles and creative instinct—often across disconnected teams and tools.</p><p>Lumen does the repetitive research and calibration work in parallel, while keeping the final reasoning visible to the people making the call.</p></div></section>

    <section className="architecture-section"><div className="architecture-heading"><div><p className="kicker">SYSTEM ARCHITECTURE</p><h2>One deterministic workflow.<br/>Many intelligent workers.</h2></div><div className="legend"><span><i className="g-blue"/> Google Cloud</span><span><i className="g-yellow"/> Parallel</span><span><i className="g-green"/> Model output</span></div></div>
      <div className="architecture-diagram">
        <div className="arch-column sources"><p>01 · EVIDENCE</p><ArchCard icon={<Film/>} title="Known media data" copy="Trailers, frames, metadata, ratings, reviews and historical performance" /><div className="parallel-card"><Search/><div><b>Parallel Search API</b><span>Live market and audience context</span></div></div></div>
        <FlowArrow label="augment" />
        <div className="arch-column foundation"><p>02 · DATA FOUNDATION</p><ArchCard icon={<Database/>} title="BigQuery" copy="Features, outcomes, evaluation sets and comparable-title signals" /><ArchCard icon={<Layers3/>} title="Cloud Storage" copy="Scripts, artwork, video frames and extracted creative features" /></div>
        <FlowArrow label="ground" />
        <div className="arch-column agents"><p>03 · AGENT CONSTELLATION</p><div className="gemini-orchestrator"><span className="gemini-mark">✦</span><div><b>Gemini Enterprise</b><small>Agent Platform orchestrator</small></div></div><div className="mini-agents"><span>Story</span><span>Audience</span><span>Market</span><span>Visual</span></div><small className="agent-note"><GitBranch/> Parallel, bounded tasks with structured outputs</small></div>
        <FlowArrow label="train" />
        <div className="arch-column models"><p>04 · LEARNING LOOP</p><ArchCard icon={<BrainCircuit/>} title="Vertex AI Pipelines" copy="Feature generation, training and experiment orchestration" /><ArchCard icon={<Gauge/>} title="BigQuery ML" copy="Ensemble weight calibration against held-out outcomes" /><div className="loop-arrow">Evaluate → adjust → validate ↻</div></div>
        <FlowArrow label="serve" />
        <div className="arch-column serving"><p>05 · PREDICTION</p><ArchCard icon={<Cloud/>} title="Cloud Run API" copy="Secure multimodal inference and structured prediction response" /><div className="output-card"><b>82</b><div><span>Strong potential</span><small>87% confidence</small></div></div></div>
      </div>
      <div className="guardrail"><ShieldCheck/><div><b>Governed end to end</b><p>Cloud IAM controls access. Cloud Logging and Trace capture every agent step, tool call, model version and prediction for evaluation.</p></div><span>GOOGLE CLOUD ONLY</span></div>
    </section>

    <section className="agent-detail"><div><p className="kicker">WHY AGENTS</p><h2>Parallel by design,<br/>not by decoration.</h2><p>Each agent receives a bounded task, its permitted tools and a typed output contract. Gemini Enterprise orchestrates the sequence and resolves disagreements before the prediction API is called.</p></div><div className="agent-steps"><Step n="1" title="Decompose" text="Turn a submission into independent creative, audience, market and visual questions."/><Step n="2" title="Investigate" text="Run agents concurrently; ground current-market claims through Parallel Search API."/><Step n="3" title="Synthesize" text="Normalize structured signals and surface contradictions instead of hiding them."/><Step n="4" title="Predict" text="Send model-ready features to the calibrated ensemble and explain the result."/></div></section>

    <section className="compliance-section"><div><p className="kicker">BUILT FOR AGENTIC CINEMA</p><h2>The architecture follows the rules.</h2></div><div className="compliance-grid"><Rule title="Gemini + Agent Builder" text="The multi-agent workflow is orchestrated on Gemini Enterprise Agent Platform."/><Rule title="Parallel at runtime" text="The Market Agent calls Parallel Search API for live evidence—not merely during development."/><Rule title="Google-only AI" text="Model training, multimodal understanding and inference stay within approved Google Cloud AI services."/><Rule title="Auditable workflow" text="Every step is deterministic, observable and reproducible from its source evidence."/></div></section>

    <section className="team-section"><div><p className="kicker">THE TEAM</p><h2>Built in Stockholm.<br/>Made for the screen.</h2><p>Three builders working across product, cinema, data and engineering.</p></div><div className="team-grid">{team.map(member=><a href={member.href} target="_blank" rel="noreferrer" key={member.name} className="team-card"><span className={`team-avatar ${member.color}`}><Image src={member.image} alt={`${member.name}, Lumen co-creator`} width={1536} height={1536} unoptimized priority/></span><div><b>{member.name}</b><small>Co-creator · Stockholm</small></div><ArrowRight/></a>)}</div></section>
    <footer className="about-footer"><div className="g-brand"><span className="lumen-glyph"><i/><i/><i/><i/></span><b>Lumen</b></div><p>Built for the Agentic Cinema Hackathon · Parallel track</p><Link href="/">Open intelligence studio <ArrowRight/></Link></footer>
  </main>;
}

function ArchCard({icon,title,copy}:{icon:React.ReactNode;title:string;copy:string}){return <div className="arch-card"><span>{icon}</span><div><b>{title}</b><small>{copy}</small></div></div>}
function FlowArrow({label}:{label:string}){return <div className="flow-arrow"><span>{label}</span><ArrowRight/></div>}
function Step({n,title,text}:{n:string;title:string;text:string}){return <div><span>{n}</span><div><b>{title}</b><p>{text}</p></div></div>}
function Rule({title,text}:{title:string;text:string}){return <div><span><Check/></span><div><b>{title}</b><p>{text}</p></div></div>}
