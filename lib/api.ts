// Client for the Lumen API (openapi/lumen-api.yaml).
// Vite inlines import.meta.env; `process` does not exist in this browser bundle.
const BASE = import.meta.env.VITE_LUMEN_API ?? 'http://localhost:8787';

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

export type PredictionRequest = {
  story: string;
  medium: string;
  targetGeography: string;
  classifications?: Record<string, string>;
};

export async function predict(body: PredictionRequest): Promise<Prediction> {
  const res = await fetch(`${BASE}/v1/predictions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // ponytail: materials omitted - the spec wants signed URIs, the picker holds local Files
    body: JSON.stringify({ ...body, materials: [] }),
  });
  if (!res.ok) throw new Error(`Prediction failed (${res.status}): ${await res.text()}`);
  return res.json();
}
