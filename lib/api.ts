// Client for the Lumen API (openapi/lumen-api.yaml).
// Vite inlines import.meta.env; `process` does not exist in this browser bundle.
const BASE = (import.meta.env as unknown as Record<string, string | undefined>).VITE_LUMEN_API
  ?? 'http://localhost:8787';

export type AgentId = 'story' | 'audience' | 'market' | 'visual';

export type AgentResult = {
  agentId: AgentId;
  status: 'complete' | 'partial' | 'failed';
  finding: string;
  score?: number;
  sources?: string[];
};

export type Evidence = {
  title: string;
  statement: string;
  sourceType: 'submission' | 'parallel_search' | 'model_signal';
  sourceUrl?: string | null;
};

export type Prediction = {
  predictionId: string;
  outcome: 'hit' | 'miss' | 'inconclusive';
  score: number;
  confidence: number;
  summary?: string;
  agents: AgentResult[];
  evidence: Evidence[];
  model?: { modelId?: string | null; version?: string | null };
};

// Contract: Material {kind, uri, mimeType, sha256?}; `format: uri` admits data: URIs.
export type Material = {
  kind: 'script' | 'frame' | 'cast' | 'concept_art' | 'trailer' | 'other';
  uri: string;
  mimeType: string;
  sha256?: string;
};

export type PredictionRequest = {
  story: string;
  medium: string;
  targetGeography: string;
  classifications?: Record<string, string>;
};

// The backend uses only script/frame/concept_art; anything else is skipped here.
const kindFor = (f: File): Material['kind'] | null =>
  f.type.startsWith('text/') || /\.(txt|fountain)$/i.test(f.name) ? 'script'
  : f.type.startsWith('image/') ? 'frame'
  : null;

const toMaterial = (f: File, kind: Material['kind']) =>
  new Promise<Material>((resolve, reject) => {
    const r = new FileReader();
    // readAsDataURL yields "data:<mime>;base64,<payload>" - exactly what the backend decodes.
    r.onload = () => resolve({ kind, uri: r.result as string, mimeType: f.type || 'text/plain' });
    r.onerror = () => reject(r.error ?? new Error(`Could not read ${f.name}`));
    r.readAsDataURL(f);
  });

// 20 MB decoded cap per material; base64 inflates by 4/3, so filter on the encoded length.
const MAX_URI_LENGTH = 28 * 1024 * 1024;

// A rejected screenplay answers {"detail": {"error": "not_a_screenplay", "reasons": [...]}}.
function readError(text: string): string {
  try {
    const detail = (JSON.parse(text) as { detail?: unknown }).detail;
    if (detail && typeof detail === 'object' && 'error' in detail) {
      const d = detail as { error: string; reasons?: string[] };
      return [d.error, ...(d.reasons ?? [])].join(' - ');
    }
    return typeof detail === 'string' ? detail : text;
  } catch {
    return text;
  }
}

export async function predict(body: PredictionRequest, files: File[] = []): Promise<Prediction> {
  const picked = files.flatMap((f) => { const k = kindFor(f); return k ? [[f, k] as const] : []; });
  const materials = (await Promise.all(picked.map(([f, k]) => toMaterial(f, k))))
    .filter((m) => m.uri.length <= MAX_URI_LENGTH)
    .slice(0, 30);
  const res = await fetch(`${BASE}/v1/predictions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...body, materials }),
  });
  if (!res.ok) throw new Error(`Prediction failed (${res.status}): ${readError(await res.text())}`);
  return res.json();
}
