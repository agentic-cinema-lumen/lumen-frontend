# What I know about the Lumen / Agentic Cinema build

_Prepared by OpenAI/Codex from the current Lumen frontend, the adjacent `agentic-cinema-hack` repository, and the project documentation. This is a comparison note, not a claim that every proposed backend component is already deployed._

## Product in one sentence

Lumen is a producer-facing greenlight intelligence tool that analyzes a film or television project and predicts whether it is more likely to be a hit, a miss, or inconclusive—then explains the evidence and factors behind that outcome.

The product is not intended to make a creative decision for a producer. It turns fragmented creative material and current market context into a calibrated, explainable signal for a human greenlight discussion.

## Who uses it and what they provide

A producer or development executive submits:

- story or concept text;
- medium: feature film, TV series, limited series, or documentary;
- target geography;
- optional classifications such as genre, audience, rating, or budget band; and
- creative materials such as scripts, frames, cast references, concept art, or trailers.

The current UI accepts story text, medium, geography, and multiple local files. The API contract adds classifications and project-scoped material URIs.

## What happens at runtime

1. The site creates a prediction job from the producer submission.
2. A generic progress stream reports job and agent state only: queued, running, progress, completed, or failed.
3. A Gemini-orchestrated set of agents investigates in parallel. The current conceptual agents are Story, Audience, Market, and Visual, but the progress API is intentionally generic and can display Agent X, Agent Y, or any future set of agents.
4. The Market agent uses Parallel Search for current comparable-title, demand, audience, release-timing, and competitive evidence.
5. Agents write structured findings and source-linked claims into an investigation case file.
6. The active trained model is invoked through an inference tool. An outcome adapter converts model signals and uncertainty into `hit`, `miss`, or `inconclusive`.
7. The API returns the outcome, 0–100 score, confidence, summary, agent findings, and evidence explaining why.

The progress stream must not expose prompts, findings, search content, or model reasoning. Those belong in the final result and restricted diagnostics surfaces.

## Proposed architecture

```text
INTERNAL TRAINING (not producer-facing)
Historical film data + derived craft features
                    |
                    v
Agentic trainer on Google Cloud
feature engineering -> model tournament -> evaluation
                    |
                    v
Versioned model artifact + training diagnostics

PRODUCER REQUEST
Story + images/frames + classifications + medium/geography
                    |
                    v
Cloud Run Prediction API
                    |
                    v
Gemini agent orchestrator
       +------------+------------+------------+
       |            |            |            |
    Story       Audience       Visual       Market
     agent       agent         agent        agent
                                                |
                                                v
                                      Parallel Search API
                                                |
                                                v
                                   Claims + evidence case file
                                                |
                                                v
                                   Model inference + calibration
                                                |
                                                v
                             Hit / miss / inconclusive + why

RESTRICTED DIAGNOSTICS
Model health, active version, trainer run, feature count, metrics
```

The rendered Mermaid version is in [ARCHITECTURE_MERMAID.md](ARCHITECTURE_MERMAID.md). The plain-text version is in [ARCHITECTURE_ASCII.md](ARCHITECTURE_ASCII.md).

## What Google Cloud is for

The intended Google Cloud boundary is:

- Gemini for multimodal understanding and agent reasoning;
- Vertex AI Pipelines (or an equivalent Google Cloud pipeline) for agentic model training and evaluation;
- BigQuery ML and/or a versioned Vertex model for calibration and inference;
- Cloud Storage for project-scoped scripts, images, frames, and model artifacts;
- Cloud Run for the prediction API and eventually an event/progress endpoint;
- IAM, Secret Manager, Cloud Logging, and Trace for access control and auditability.

Training is an internal lifecycle and should not appear in the main producer UI. The UI may later have a restricted diagnostics view for trainer health, model version, last run, evaluation metrics, and drift.

## What Parallel is for

Parallel is the live external-evidence tool. It is most useful for:

- comparable films and series;
- current audience discussion and demand signals;
- market/category momentum;
- release-window and competitive context; and
- validating or challenging an agent hypothesis with current sources.

Parallel should not be used as the model registry, upload store, or source of the final calibrated prediction. Its results should enter the case file as source-linked evidence.

## What exists in `agentic-cinema-hack`

The adjacent repository is an investigation system for explaining why released TV episodes succeeded or failed relative to historical expectations. It already contains useful building blocks:

- ingestion of scripts, transcripts, video shots, and keyframes;
- Gemini multimodal visual inspection;
- `ParallelSearchClient` with live API and offline cache/mock fallback;
- a Blind Cinema Critic concept;
- a Lead Investigator / pre-mortem agent;
- an adversarial judge and investigation-board pattern;
- `AgenticQuantTrainer` for iterative feature engineering and model selection;
- `QuantAgent` for model tournament and champion selection; and
- `QuantOracle` for fast inference, attributions, confidence intervals, and vulnerability flags.

The strongest reuse path is:

```text
agentic-cinema-hack ingestion + agents + Parallel client + QuantOracle
                              |
                              v
                    Lumen /v1/predictions adapter
                              |
                   producer-facing hit/miss result
```

## Important mismatch to resolve

The adjacent project currently predicts expected IMDb rating and a craft residual. Its `champion_model.joblib` is a prototype artifact for that target. Lumen's product promise is commercial hit/miss prediction. An IMDb rating must not be presented as a hit probability without an explicit definition of “hit,” a labeled target, calibration, and evaluation.

The backend therefore needs one of these deliberate choices:

1. define a commercial-success target and retrain the model; or
2. expose the existing rating/craft model as an intermediate craft signal, then combine it with market and commercial labels in a separately calibrated hit/miss layer.

This is the main scientific/product decision still open.

## Current website implementation

The deployed frontend is a realistic product mock. It currently implements:

- a producer input form;
- story/concept text entry;
- medium and geography selectors;
- multiple creative-material file selection;
- a four-agent visual progress animation;
- a fixture result with score, confidence, agent consensus, evidence, and watchouts;
- the About & architecture explanation page; and
- team/avatar presentation.

The run is simulated in the browser. It does not yet call a backend prediction API, stream real agent events, persist uploads, or perform live inference. The UI is therefore useful for validating the producer experience and response shape, not for claiming that the production model is connected.

## API and mock development

The proposed backend contract is in [openapi/lumen-api.yaml](openapi/lumen-api.yaml):

- `POST /v1/predictions` creates a prediction job;
- `GET /v1/predictions/{predictionId}/events` streams generic SSE progress events;
- `GET /v1/diagnostics/model` exposes restricted model/trainer diagnostics.

The Bruno collection is in [bruno/lumen-api](bruno/lumen-api). It includes a prediction request, model-health request, and generic progress-stream request. The frontend mock should keep using the same request and response shapes so replacing the timer with `EventSource` later is small and mechanical.

## Progress event contract

Progress is intentionally generic:

```json
{
  "eventId": "evt-42",
  "predictionId": "pred-123",
  "type": "agent.progress",
  "agentId": "agent-x",
  "label": "Agent X",
  "status": "running",
  "progress": 40,
  "message": "Processing",
  "graph": { "nodes": [], "edges": [] }
}
```

The optional graph is an execution/dependency graph, not an explanation graph. It shows which jobs are queued, running, complete, or failed. Findings and reasoning arrive only in the final prediction response.

## Deployment and operations known today

- Source repository: `okay-lets-go-org/frontend`.
- Main branch pushes trigger Google Cloud Build.
- Cloud Build builds a container, pushes it to Artifact Registry, and deploys Cloud Run service `lumen` in `europe-north1`.
- The current public URL is `https://lumen-480750414136.europe-north1.run.app`.
- The site has been built successfully through the GitHub-to-Cloud Build pipeline.
- A lifecycle note and scheduled expiry automation exist for the current temporary Google Cloud project; see [GOOGLE_CLOUD_LIFECYCLE.md](GOOGLE_CLOUD_LIFECYCLE.md).

## Open decisions for the team

- What exactly defines a commercial “hit” and “miss” (box office, streaming completion, revenue multiple, audience score, or a composite)?
- Which labels and training corpus support that target without leakage from post-release variables?
- Is the first backend response synchronous, job-based, or job-based with SSE only?
- Which upload types and maximum sizes are accepted, and how long are they retained?
- Which agents are real in the first backend slice, and which remain mocked?
- What authentication protects uploads, predictions, and diagnostics?
- Which Parallel sources are permitted, cached, attributed, and refreshed?
- What producer-facing explanation is safe and useful without exposing private prompts or unsupported causal claims?

## Bottom line

The coherent near-term build is a contract-driven producer workflow: accept multimodal creative input, launch generic observable agent jobs, use Parallel for current market evidence, invoke a versioned Google Cloud model, and return a calibrated hit/miss assessment with evidence. The current site proves the interaction and visual language. The adjacent repository provides much of the investigative and quantitative prototype. The central backend task is integrating those pieces behind the API and resolving the rating-residual-to-commercial-hit target gap.
