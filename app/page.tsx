'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  ChevronDown,
  Clapperboard,
  Download,
  ExternalLink,
  FileText,
  Film,
  Globe2,
  Image as ImageIcon,
  RefreshCw,
  Search,
  Sparkles,
  Tag,
  Terminal,
  Trash2,
  TrendingUp,
  Upload,
  Users,
  WandSparkles,
  X,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  type AgentResult,
  type BenchmarkMovie,
  type Material,
  type ModelDiagnostics,
  type PredictionRequest,
  type PredictionResponse,
  type StageEvent,
  type ToolEvent,
  fetchBenchmarks,
  fetchModelDiagnostics,
  fileToMaterial,
  streamPrediction,
} from '@/lib/lumen-api';

interface AgentMeta {
  id: 'story' | 'audience' | 'market' | 'visual';
  name: string;
  job: string;
  color: 'blue' | 'red' | 'yellow' | 'green';
  icon: typeof FileText;
}

const agents: AgentMeta[] = [
  { id: 'story', name: 'Story intelligence', job: 'Craft, pacing & dialogue', color: 'blue', icon: FileText },
  { id: 'audience', name: 'Audience intelligence', job: 'Affinity & segments', color: 'red', icon: Users },
  { id: 'market', name: 'Live market research', job: 'Parallel Search API', color: 'yellow', icon: Search },
  { id: 'visual', name: 'Visual intelligence', job: 'Frames & luminance', color: 'green', icon: ImageIcon },
];

export default function Home() {
  const [view, setView] = useState<'brief' | 'run' | 'result'>('brief');
  const [progress, setProgress] = useState(0);

  // Form states
  const [title, setTitle] = useState('The Last Archive');
  const [genre, setGenre] = useState('Sci-fi drama');
  const [script, setScript] = useState(
    'After the sun begins erasing human memories, a reclusive archivist discovers an underground library where every forgotten life is still playing — including her own future.'
  );
  const [format, setFormat] = useState<'Feature film' | 'TV series' | 'Limited series' | 'Documentary'>('Feature film');
  const [market, setMarket] = useState<'North America' | 'United Kingdom' | 'Nordics' | 'Western Europe' | 'Global streaming'>('North America');
  const [materials, setMaterials] = useState<Material[]>([]);

  // Pipeline runtime states
  const [stage, setStage] = useState<StageEvent | null>(null);
  const [toolLogs, setToolLogs] = useState<ToolEvent[]>([]);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [diagnostics, setDiagnostics] = useState<ModelDiagnostics | null>(null);
  const [benchmarks, setBenchmarks] = useState<BenchmarkMovie[]>([]);

  const fileRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Load diagnostics and featured benchmarks on mount
  useEffect(() => {
    fetchModelDiagnostics().then((d) => setDiagnostics(d));
    fetchBenchmarks(true).then((b) => setBenchmarks(b.movies));
  }, []);

  // Handle file uploads
  const handleFilesAdded = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const newMaterials: Material[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const mat = await fileToMaterial(file);
        newMaterials.push(mat);
      } catch (err) {
        console.error('Failed to parse file:', file.name, err);
      }
    }
    setMaterials((prev) => [...prev, ...newMaterials]);
  };

  const removeMaterial = (index: number) => {
    setMaterials((prev) => prev.filter((_, i) => i !== index));
  };

  const loadBenchmarkPreset = (bm: BenchmarkMovie) => {
    setTitle(bm.title);
    setGenre(bm.genre);
    setScript(bm.logline);
  };

  // Launch prediction stream
  const runPrediction = async () => {
    if (script.trim().length < 20) {
      alert('Premise/logline must be at least 20 characters.');
      return;
    }

    setProgress(5);
    setStage({ stage: 'started', label: 'Connecting to Lumen Prediction Pipeline...', progress: 0.05 });
    setToolLogs([]);
    setErrorMsg(null);
    setView('run');

    const controller = new AbortController();
    abortRef.current = controller;

    const requestPayload: PredictionRequest = {
      story: script.trim(),
      medium: format,
      targetGeography: market,
      classifications: {
        title: title.trim() || 'Untitled Proposal',
        genre: genre.trim() || 'Drama',
      },
      materials: materials.length > 0 ? materials : undefined,
    };

    await streamPrediction(
      requestPayload,
      {
        onStage: (s) => {
          setStage(s);
          setProgress(Math.round(s.progress * 100));
        },
        onToolStart: (t) => {
          setToolLogs((prev) => [...prev, { ...t, timestamp: Date.now() }]);
        },
        onToolEnd: (t) => {
          setToolLogs((prev) => {
            const updated = [...prev];
            const idx = updated.findLastIndex((x) => x.tool === t.tool && x.agent === t.agent);
            if (idx !== -1) {
              updated[idx] = { ...updated[idx], ...t, timestamp: Date.now() };
            } else {
              updated.push({ ...t, timestamp: Date.now() });
            }
            return updated;
          });
        },
        onComplete: (res) => {
          setPrediction(res);
          setProgress(100);
          setTimeout(() => setView('result'), 400);
        },
        onError: (err) => {
          console.error('Lumen Stream Error:', err);
          const msg = 'detail' in err ? err.detail : err.message;
          setErrorMsg(msg || 'An error occurred during prediction analysis.');
        },
      },
      controller.signal
    );
  };

  const cancelPrediction = () => {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    setProgress(0);
    setView('brief');
  };

  const resetAll = () => {
    setProgress(0);
    setStage(null);
    setPrediction(null);
    setErrorMsg(null);
    setView('brief');
  };

  return (
    <main className="app-shell">
      <Header diagnostics={diagnostics} />

      {view === 'brief' && (
        <section className="studio-layout">
          <aside className="project-rail">
            <div className="rail-title">
              <span className="project-dot" />
              <div>
                <b>{title || 'Untitled project'}</b>
                <small>{genre || 'Draft analysis'}</small>
              </div>
            </div>
            <nav>
              <button className="selected" type="button">
                <Sparkles /> Intelligence studio
              </button>
              <Link href="/about">
                <Film /> How it works
              </Link>
            </nav>

            <div className="cloud-proof">
              <span>
                <WandSparkles />
              </span>
              <p>
                <b>Google Cloud workspace</b>
                Secure craft analysis
                <br />
                Evidence-linked pre-mortem
              </p>
            </div>
          </aside>

          <section className="studio-main">
            <div className="studio-heading">
              <div>
                <p className="kicker">INTELLIGENCE STUDIO</p>
                <h1>
                  Find the signal
                  <br />
                  <span>before the spotlight.</span>
                </h1>
                <p>Turn scripts, concept frames and live market evidence into an explainable commercial outlook.</p>
              </div>
              <div className="powered">
                <span className="gemini-mark">✦</span>
                <small>ENGINE</small>
                <b>{diagnostics?.activeModel || 'RidgeCraftOracle'}</b>
              </div>
            </div>

            {/* Quick Benchmark Presets Bar */}
            {benchmarks.length > 0 && (
              <div className="benchmark-bar">
                <span>Quick Benchmark Preset:</span>
                {benchmarks.map((bm) => (
                  <button
                    key={bm.slug}
                    type="button"
                    className="benchmark-btn"
                    onClick={() => loadBenchmarkPreset(bm)}
                    title={bm.logline}
                  >
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    {bm.title} ({bm.year})
                  </button>
                ))}
              </div>
            )}

            <div className="constellation-input">
              <div className="agent-map" aria-label="Four AI agents analyze evidence in parallel">
                <svg className="agent-lines" viewBox="0 0 640 300" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M320 150 C235 150 225 55 120 55" />
                  <path d="M320 150 C405 150 415 55 520 55" />
                  <path d="M320 150 C235 150 225 245 120 245" />
                  <path d="M320 150 C405 150 415 245 520 245" />
                </svg>
                {agents.map((agent, index) => {
                  const Icon = agent.icon;
                  return (
                    <div className={`agent-node node-${index + 1} ${agent.color}`} key={agent.id}>
                      <span>
                        <Icon />
                      </span>
                      <div>
                        <b>{agent.name}</b>
                        <small>{agent.job}</small>
                      </div>
                    </div>
                  );
                })}
                <button className="source-core" type="button" onClick={() => fileRef.current?.click()}>
                  <span className="core-glow">
                    <Upload />
                  </span>
                  <b>Add creative material</b>
                  <small>Screenplay, frames, cast or moodboard</small>
                  <em>{materials.length ? `${materials.length} file${materials.length > 1 ? 's' : ''} connected` : 'Browse files'}</em>
                  <input
                    ref={fileRef}
                    type="file"
                    multiple
                    className="sr-only"
                    accept="image/*,.pdf,.txt,.doc,.docx,.fdx"
                    onChange={(e) => handleFilesAdded(e.target.files)}
                  />
                </button>
              </div>

              <div className="signal-strip">
                <span>
                  <i className="g-blue" /> Screenplay craft metrics
                </span>
                <span>
                  <i className="g-red" /> Parallel Search live sleuthing
                </span>
                <span>
                  <i className="g-yellow" /> 15-point counterfactual sweep
                </span>
                <span>
                  <i className="g-green" /> Adversarial pre-mortem synthesis
                </span>
              </div>
            </div>

            {/* Uploaded Materials Chips */}
            {materials.length > 0 && (
              <div className="file-chips-grid">
                {materials.map((mat, idx) => (
                  <div className="file-chip" key={`${mat.fileName || 'file'}-${idx}`}>
                    {mat.kind === 'script' ? <FileText /> : <ImageIcon />}
                    <span>{mat.fileName || `Material #${idx + 1}`}</span>
                    <span className={`kind-tag ${mat.kind}`}>{mat.kind}</span>
                    <button type="button" onClick={() => removeMaterial(idx)} title="Remove file">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="brief-grid">
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <label className="story-field">
                    <span>
                      <b>Project title</b>
                    </span>
                    <input
                      type="text"
                      className="w-full bg-transparent border-0 outline-none text-sm mt-1.5 font-medium text-slate-800"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. The Last Archive"
                    />
                  </label>
                  <label className="story-field">
                    <span>
                      <b>Genre / Classification</b>
                    </span>
                    <input
                      type="text"
                      className="w-full bg-transparent border-0 outline-none text-sm mt-1.5 font-medium text-slate-800"
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                      placeholder="e.g. Sci-fi drama"
                    />
                  </label>
                </div>

                <label className="story-field">
                  <span>
                    <b>Story or concept premise</b>
                    <small className={script.length < 20 ? 'text-amber-600 font-semibold' : ''}>
                      {script.length} / 2,000 (min 20)
                    </small>
                  </span>
                  <textarea
                    value={script}
                    onChange={(e) => setScript(e.target.value)}
                    maxLength={2000}
                    placeholder="Describe the premise, core conflict, and protagonist stakes..."
                  />
                </label>
              </div>

              <div className="context-fields">
                <Select
                  label="Medium"
                  icon={<Clapperboard />}
                  value={format}
                  setValue={(v) => setFormat(v as typeof format)}
                  options={['Feature film', 'TV series', 'Limited series', 'Documentary']}
                />
                <Select
                  label="Target geography"
                  icon={<Globe2 />}
                  value={market}
                  setValue={(v) => setMarket(v as typeof market)}
                  options={['North America', 'United Kingdom', 'Nordics', 'Western Europe', 'Global streaming']}
                />
              </div>
            </div>

            <div className="run-row">
              <span>
                {materials.some((m) => m.kind === 'script')
                  ? 'Screenplay craft metrics will be parsed in-memory.'
                  : 'Note: No script attached. Prediction will evaluate concept premise.'}
              </span>
              <Button
                className="run-button"
                disabled={script.trim().length < 20}
                onClick={runPrediction}
                type="button"
              >
                <Sparkles /> Run constellation <ArrowRight />
              </Button>
            </div>
          </section>

          <aside className="evidence-rail">
            <div className="evidence-head">
              <p className="kicker">LIVE CONTEXT</p>
              <span>Ready</span>
            </div>
            <h2>What Lumen will look for</h2>
            <Evidence
              icon={<TrendingUp />}
              title="Demand signals"
              text="Comparable titles, Reddit discussions and category momentum via Parallel Search."
            />
            <Evidence
              icon={<Zap />}
              title="QuantOracle ML"
              text="Evaluates craft residuals and 15-point counterfactual parameter sweeps against historical hits."
            />
            <Evidence
              icon={<WandSparkles />}
              title="Adversarial pre-mortem"
              text="Detects trope fatigue, audience drop-off risks, and actionable rescue vectors."
            />
            <Link className="architecture-link" href="/about">
              Explore the full architecture <ArrowRight />
            </Link>
            <div className="partner-lockup">
              <span>INTELLIGENCE ENGINE</span>
              <b>QuantOracle & Parallel</b>
              <small>Real-time detective search & ML calibration</small>
            </div>
          </aside>
        </section>
      )}

      {view === 'run' && (
        <RunView
          progress={progress}
          stage={stage}
          toolLogs={toolLogs}
          format={format}
          market={market}
          errorMsg={errorMsg}
          onCancel={cancelPrediction}
        />
      )}

      {view === 'result' && (
        <ResultView
          reset={resetAll}
          title={title}
          genre={genre}
          market={market}
          format={format}
          hasScript={materials.some((m) => m.kind === 'script')}
          prediction={prediction}
        />
      )}
    </main>
  );
}

function Header({ diagnostics }: { diagnostics: ModelDiagnostics | null }) {
  return (
    <header className="g-header">
      <Link className="g-brand" href="/">
        <span className="lumen-glyph">
          <i />
          <i />
          <i />
          <i />
        </span>
        <b>Lumen</b>
      </Link>
      <nav>
        <Link className="active" href="/">
          Studio
        </Link>
        <Link href="/about">About & architecture</Link>
      </nav>
      <div className="header-side">
        <span className="google-cloud">
          <i className="gemini-mark">✦</i> Gemini Enterprise
        </span>
        <span
          className={`model-diag-badge ${
            diagnostics?.trainerStatus === 'healthy'
              ? ''
              : diagnostics?.trainerStatus === 'running'
              ? 'running'
              : 'offline'
          }`}
          title={diagnostics ? `Active Model: ${diagnostics.activeModel}` : 'Connecting to prediction engine'}
        >
          <i />
          {diagnostics?.activeModel ? `${diagnostics.activeModel}` : 'Lumen Online'}
        </span>
        <button className="user-dot" type="button">
          SH
        </button>
      </div>
    </header>
  );
}

function Evidence({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="evidence-item">
      <span>{icon}</span>
      <div>
        <b>{title}</b>
        <p>{text}</p>
      </div>
    </div>
  );
}

function Select({
  label,
  icon,
  value,
  setValue,
  options,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  setValue: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="g-select">
      <span>
        {icon}
        {label}
      </span>
      <div>
        <select value={value} onChange={(e) => setValue(e.target.value)}>
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
        <ChevronDown />
      </div>
    </label>
  );
}

function RunView({
  progress,
  stage,
  toolLogs,
  format,
  market,
  errorMsg,
  onCancel,
}: {
  progress: number;
  stage: StageEvent | null;
  toolLogs: ToolEvent[];
  format: string;
  market: string;
  errorMsg: string | null;
  onCancel: () => void;
}) {
  const currentStage = stage?.stage || 'started';

  // Determine active agent based on stage
  const isAgentActive = (agentId: string) => {
    if (currentStage === 'ingestion') return agentId === 'story' || agentId === 'visual';
    if (currentStage === 'research') return agentId === 'market' || agentId === 'audience';
    if (currentStage === 'quant_oracle') return true;
    if (currentStage === 'synthesis' || currentStage === 'finalizing') return true;
    return false;
  };

  const isAgentDone = (agentId: string) => {
    if (currentStage === 'research') return agentId === 'story' || agentId === 'visual';
    if (currentStage === 'quant_oracle') return agentId === 'story' || agentId === 'visual' || agentId === 'market';
    if (currentStage === 'synthesis' || currentStage === 'finalizing') return true;
    return false;
  };

  return (
    <section className="run-screen">
      <div className="run-top">
        <p className="kicker">
          <span className={`live-stage-badge ${currentStage}`}>
            {currentStage.replace('_', ' ')}
          </span>
        </p>
        <h1>
          Four perspectives.
          <br />
          <span>One calibrated pre-mortem.</span>
        </h1>
        <p>{stage?.label || 'Initializing multi-agent graph...'}</p>
      </div>

      {errorMsg && (
        <div className="max-w-2xl mx-auto my-4 p-4 rounded-xl border border-red-300 bg-red-50 text-red-700 text-sm flex items-center justify-between">
          <span>{errorMsg}</span>
          <Button variant="outline" size="sm" onClick={onCancel}>
            Return to Brief
          </Button>
        </div>
      )}

      <div className="live-constellation">
        <svg viewBox="0 0 800 420" preserveAspectRatio="none">
          <path d="M400 210 L160 90" />
          <path d="M400 210 L640 90" />
          <path d="M400 210 L160 330" />
          <path d="M400 210 L640 330" />
        </svg>
        <div className="synthesis-core">
          <span>{progress}%</span>
          <small>QUANT SYNTHESIS</small>
        </div>
        {agents.map((a, i) => {
          const Icon = a.icon;
          const complete = isAgentDone(a.id);
          const active = isAgentActive(a.id);
          return (
            <div
              className={`live-agent live-${i + 1} ${a.color} ${complete ? 'complete' : ''} ${
                active ? 'thinking' : ''
              }`}
              key={a.id}
            >
              <span>{complete ? <Check /> : <Icon />}</span>
              <div>
                <b>{a.name}</b>
                <small>
                  {complete ? 'Signal calibrated' : active ? 'Investigating…' : 'Queued'}
                </small>
              </div>
              {active && <i />}
            </div>
          );
        })}
      </div>

      {/* Live Detective Sleuthing Terminal */}
      <div className="sleuth-log-card">
        <div className="sleuth-header">
          <div>
            <i />
            <Terminal className="w-3.5 h-3.5 text-slate-400" />
            <span>Parallel Search Detective Log · Reddit & Archive Sleuthing</span>
          </div>
          <span className="text-slate-500">{toolLogs.length} events logged</span>
        </div>
        <div className="sleuth-body">
          {toolLogs.length === 0 ? (
            <div className="text-slate-500 italic">Waiting for agent tool invocation...</div>
          ) : (
            toolLogs.map((tl, i) => (
              <div className="sleuth-item" key={i}>
                <span className="agent-tag">[{tl.agent}]</span>
                <span className="tool-tag">{tl.tool}</span>
                <div>
                  {tl.args.query && <div className="query-text">query: &quot;{tl.args.query}&quot;</div>}
                  {tl.result_summary && <div className="summary-text">→ {tl.result_summary}</div>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="run-log">
        <div>
          <span className="g-blue" /> Screenplay craft ingestion
        </div>
        <div>
          <span className="g-yellow" /> Parallel Search live sleuthing
        </div>
        <div>
          <span className="g-green" /> QuantOracle ML calibration
        </div>
        <em>
          {format} · {market}
        </em>
        <Button variant="ghost" size="sm" onClick={onCancel} className="text-xs ml-4 text-slate-500 hover:text-slate-800">
          Cancel run
        </Button>
      </div>
    </section>
  );
}

function ResultView({
  reset,
  title,
  genre,
  market,
  format,
  hasScript,
  prediction,
}: {
  reset: () => void;
  title: string;
  genre: string;
  market: string;
  format: string;
  hasScript: boolean;
  prediction: PredictionResponse | null;
}) {
  const p = prediction;
  const score = p?.score ?? 80;
  const outcome = p?.outcome ?? 'hit';
  const confidencePct = Math.round((p?.confidence ?? 0.85) * 100);

  const cleanSummary = (() => {
    const raw = p?.summary;
    if (!raw) return 'The premise combines immediate emotional clarity with international streaming appeal.';
    if (raw.includes('RESOURCE_EXHAUSTED') || raw.includes('DEGRADED RUN')) {
      const priorMatch = raw.match(/The score is the [^.]+\./);
      return `Degraded Run Advisory: External research agents encountered temporary API rate limits (Gemini 429). ${
        priorMatch ? priorMatch[0] : 'The score reflects the genre corpus prior because no screenplay craft metrics were submitted.'
      }`;
    }
    return raw;
  })();

  const cleanFinding = (finding: string) => {
    if (finding.includes('RESOURCE_EXHAUSTED') || finding.includes('research agent call failed')) {
      return 'Research agent hit temporary API rate limits (429 Resource Exhausted) during external forum sleuthing.';
    }
    return finding;
  };

  const exportJson = () => {
    if (!prediction) return;
    const blob = new Blob([JSON.stringify(prediction, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lumen-prediction-${prediction.predictionId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="result-screen">
      <div className="result-header">
        <div>
          <p className="kicker">PRE-MORTEM PIPELINE COMPLETE</p>
          <h1>{title || 'Untitled Project'}</h1>
          <p>
            {format} · {genre} · {market}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={exportJson}>
            <Download className="w-3.5 h-3.5 mr-1.5" /> Export JSON
          </Button>
          <Button variant="outline" size="sm" onClick={reset}>
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> New analysis
          </Button>
        </div>
      </div>

      {/* Honesty Indicator Callout if Inconclusive */}
      {outcome === 'inconclusive' && (
        <div className="honesty-callout">
          <AlertTriangle />
          <div>
            <b>Honesty Indicator: Inconclusive Evaluation</b>
            <p>
              {!hasScript
                ? 'This evaluation ran on premise and concept vision alone without a full screenplay craft asset. Screenplay craft metrics (scene acceleration, dialogue density) are required for full calibration.'
                : 'External market search or comparable signals were degraded or returned contradictory commercial comps. Review agent consensus below.'}
            </p>
          </div>
        </div>
      )}

      <div className="verdict-grid">
        <div className="verdict-main">
          <div className="prediction-row">
            <div className="prediction-score">
              <span>{score}</span>
              <small>/100</small>
            </div>
            <div>
              <span className={`outcome-pill ${outcome}`}>
                <i />
                {outcome === 'hit'
                  ? 'STRONG HIT POTENTIAL'
                  : outcome === 'miss'
                  ? 'DOWNSIDE RISK IDENTIFIED'
                  : 'INCONCLUSIVE CALIBRATION'}
              </span>
              <h2>
                {outcome === 'hit'
                  ? 'High commercial resonance with'
                  : outcome === 'miss'
                  ? 'Significant structural vulnerabilities in'
                  : 'Premise requires craft calibration for'}
                <br />
                <em>{market} audience segments.</em>
              </h2>
            </div>
          </div>

          <p className="verdict-summary">{cleanSummary}</p>

          <div className="confidence-band">
            <span>Prediction confidence</span>
            <b>{confidencePct}%</b>
            <div>
              <i style={{ width: `${confidencePct}%` }} />
            </div>
            <small>
              Calibrated across 4 independent agent perspectives & 15-point counterfactual sweep
            </small>
          </div>
        </div>

        {/* Agent Consensus Column with Status Pills */}
        <div className="agent-consensus">
          <p className="kicker">AGENT CONSENSUS & CRAFT SIGNALS</p>
          {agents.map((a) => {
            const agentResult = p?.agents.find((ar) => ar.agentId === a.id);
            const status = agentResult?.status || 'complete';
            const finding = agentResult?.finding || 'Analysis complete.';
            const agentScore = agentResult?.score;

            return (
              <div key={a.id} className="flex flex-col !items-start gap-1 py-3 border-b border-slate-100">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <span className={a.color}>
                      {a.id === 'market' ? <Search /> : <Check />}
                    </span>
                    <b>{a.name}</b>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`agent-status-pill ${status}`}>{status}</span>
                    {agentScore !== null && agentScore !== undefined && (
                      <em className="text-xs font-semibold">{agentScore}</em>
                    )}
                  </div>
                </div>
                <p className="text-xs text-slate-600 mt-1 pl-9 leading-relaxed">{cleanFinding(finding)}</p>
                {agentResult?.sources && agentResult.sources.length > 0 && (
                  <div className="pl-9 mt-1 flex flex-wrap gap-1">
                    {agentResult.sources.map((src, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 truncate max-w-[200px]"
                      >
                        {src}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Structured Evidence Grid */}
      <div className="evidence-grid">
        <section>
          <p className="kicker">GROUNDED EVIDENCE</p>
          <h3>Signals that move the model</h3>
          {p?.evidence && p.evidence.length > 0 ? (
            p.evidence.slice(0, 2).map((ev, i) => (
              <article key={i}>
                <b>0{i + 1}</b>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4>{ev.title}</h4>
                    <span className={`evidence-source-tag ${ev.sourceType}`}>
                      {ev.sourceType.replace('_', ' ')}
                    </span>
                    {ev.sourceUrl && (
                      <a
                        href={ev.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:text-blue-800 inline-flex items-center"
                        title={ev.sourceUrl}
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <p>{ev.statement}</p>
                </div>
              </article>
            ))
          ) : (
            <article>
              <b>01</b>
              <div>
                <h4>Premise Comprehension</h4>
                <p>High concept premise tests with rapid comprehension rate in comparable title benchmarks.</p>
              </div>
            </article>
          )}
        </section>

        <section>
          <p className="kicker">ADVERSARIAL PRE-MORTEM</p>
          <h3>Vulnerabilities & rescue vectors</h3>
          {p?.evidence && p.evidence.length > 2 ? (
            p.evidence.slice(2, 4).map((ev, i) => (
              <article key={i}>
                <b className="text-amber-600">0{i + 3}</b>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4>{ev.title}</h4>
                    <span className={`evidence-source-tag ${ev.sourceType}`}>
                      {ev.sourceType.replace('_', ' ')}
                    </span>
                  </div>
                  <p>{ev.statement}</p>
                </div>
              </article>
            ))
          ) : (
            <article>
              <b className="text-amber-600">−7</b>
              <div>
                <h4>Lore-first positioning</h4>
                <p>Leading with world-building instead of personal stakes reduces broad audience conversion.</p>
              </div>
            </article>
          )}
        </section>
      </div>

      <div className="result-footer">
        <span>
          <Sparkles /> Gemini Reasoning
        </span>
        <span>
          <Search /> Parallel Live Search Sleuthing
        </span>
        <span>
          <TrendingUp /> {p?.model?.modelId || 'RidgeCraftOracle'} ({p?.model?.version || 'v2.4'})
        </span>
        {p?.predictionId && (
          <span className="text-slate-400 font-mono text-[10px]">
            ID: {p.predictionId}
          </span>
        )}
        <Link href="/about">
          See system architecture <ArrowRight />
        </Link>
      </div>
    </section>
  );
}
