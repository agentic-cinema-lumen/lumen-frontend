import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, BrainCircuit, Check, Cloud, Film, Gauge, GitBranch, Search, Sparkles } from 'lucide-react';

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

    <section className="architecture-section"><div className="architecture-heading"><div><p className="kicker">SYSTEM ARCHITECTURE</p><h2>Agentic training.<br/>Agent-directed recommendations.</h2><p className="architecture-summary">Two connected workflows: an agentic pipeline trains the ML model, then a main agent uses that trained model as a deterministic tool alongside comparison and research tools.</p></div></div>
      <section className="architecture-lane" aria-labelledby="training-title">
        <div className="architecture-lane-heading"><h3 id="training-title">01 · Agentic ML training</h3><span>Trained once today · automation planned</span></div>
        <p className="architecture-lane-copy">The training agent guides feature engineering, model selection and evaluation through a pipeline. Today we run this process once; future automation will trigger and manage repeat training runs.</p>
        <div className="architecture-diagram training-diagram">
          <div className="arch-column"><ArchCard icon={<Film/>} title="Historical film data" copy="Metadata, ratings and derived creative features form the training and evaluation data." /></div>
          <FlowArrow label="prepare" />
          <div className="arch-column"><ArchCard icon={<BrainCircuit/>} title="Agentic training pipeline" copy="Engineer features → train candidate models → evaluate → select the champion." /><div className="loop-arrow">Agent guides iteration and model selection ↻</div></div>
          <FlowArrow label="version" />
          <div className="arch-column"><ArchCard icon={<Gauge/>} title="Trained ML model" copy="A fixed model version, feature schema and evaluation metrics, ready for inference." /></div>
        </div>
      </section>
      <div className="model-handoff">↓ Selected model version becomes the runtime inference tool</div>
      <section className="architecture-lane" aria-labelledby="runtime-title">
        <div className="architecture-lane-heading"><h3 id="runtime-title">02 · Runtime recommendations</h3><span>Agentic orchestration · deterministic ML inference</span></div>
        <p className="architecture-lane-copy">The main agent receives screenshots, frames, story text and project context through the prediction API. It extracts structured features and decides which tools can run concurrently. Calls with dependencies wait for the inputs they need.</p>
        <div className="architecture-diagram runtime-diagram">
          <div className="arch-column"><ArchCard icon={<Cloud/>} title="Submission & feature extraction" copy="Cloud Run API → main Gemini agent → structured visual, story and contextual features." /></div>
          <FlowArrow label="plan" />
          <div className="arch-column"><div className="gemini-orchestrator"><span className="gemini-mark">✦</span><div><b>Main agent chooses tool calls</b><small>The LLM selects tools and schedules independent calls in parallel.</small></div></div><small className="agent-note"><GitBranch/> The execution plan is agentic.</small></div>
          <FlowArrow label="fan out / join" />
          <div className="arch-column"><ArchCard icon={<Gauge/>} title="Trained model tool" copy="Deterministic inference for fixed features and model version. No request-time training." /><ArchCard icon={<Film/>} title="Comparison tool" copy="Compare extracted features with comparable films to identify similarities and differences." /><div className="parallel-card"><Search/><div><b>Parallel Search API</b><span>Retrieve live market and audience evidence when selected by the agent.</span></div></div></div>
          <FlowArrow label="combine" />
          <div className="arch-column"><ArchCard icon={<Sparkles/>} title="Recommendation & explanation" copy="The main agent combines model output, comparisons and retrieved evidence into recommendations with supporting reasons and uncertainty." /></div>
        </div>
      </section>
    </section>

    <section className="agent-detail"><div><p className="kicker">WHY AGENTS</p><h2>The agent chooses.<br/>The model predicts.</h2><p>Training decisions and runtime tool selection are agentic. The trained ML model is a deterministic tool: the same validated features and model version produce the same prediction. The agent’s plan and final explanation can vary with the request and available evidence.</p></div><div className="agent-steps"><Step n="1" title="Extract" text="Read screenshots, frames and text into structured features that match the trained model’s input schema."/><Step n="2" title="Choose & schedule" text="Select the model, comparison and research calls needed for this request; run independent calls concurrently."/><Step n="3" title="Compare & combine" text="Join tool results and assess similarities, differences and conflicting evidence."/><Step n="4" title="Recommend" text="Explain the recommendation using model predictions, comparison findings and relevant market evidence."/></div></section>

    <section className="compliance-section"><div><p className="kicker">BUILT FOR AGENTIC CINEMA</p><h2>Each component has a clear role.</h2></div><div className="compliance-grid"><Rule title="Gemini multimodal intake" text="The main agent extracts features from creative materials and directs runtime tool use."/><Rule title="Agentic model training" text="A pipeline trains and evaluates the ML model. It is run once today, with automated repeat runs planned."/><Rule title="Parallel live evidence" text="Parallel Search is a research tool. Concurrent execution is a separate scheduling decision made by the main agent."/><Rule title="Deterministic model serving" text="The prediction API exposes the trained model as a tool; inference uses a fixed model version without retraining."/></div></section>

    <section className="team-section"><div><p className="kicker">THE TEAM</p><h2>Built in Stockholm.<br/>Made for the screen.</h2><p>Three builders working across product, cinema, data and engineering.</p></div><div className="team-grid">{team.map(member=><a href={member.href} target="_blank" rel="noreferrer" key={member.name} className="team-card"><span className={`team-avatar ${member.color}`}><Image src={member.image} alt={`${member.name}, Lumen co-creator`} width={1536} height={1536} unoptimized priority/></span><div><b>{member.name}</b><small>Co-creator · Stockholm</small></div><ArrowRight/></a>)}</div></section>
    <footer className="about-footer"><div className="g-brand"><span className="lumen-glyph"><i/><i/><i/><i/></span><b>Lumen</b></div><p>Built for the Agentic Cinema Hackathon · Parallel track</p><Link href="/">Open intelligence studio <ArrowRight/></Link></footer>
  </main>;
}

function ArchCard({icon,title,copy}:{icon:React.ReactNode;title:string;copy:string}){return <div className="arch-card"><span>{icon}</span><div><b>{title}</b><small>{copy}</small></div></div>}
function FlowArrow({label}:{label:string}){return <div className="flow-arrow"><span>{label}</span><ArrowRight/></div>}
function Step({n,title,text}:{n:string;title:string;text:string}){return <div><span>{n}</span><div><b>{title}</b><p>{text}</p></div></div>}
function Rule({title,text}:{title:string;text:string}){return <div><span><Check/></span><div><b>{title}</b><p>{text}</p></div></div>}
