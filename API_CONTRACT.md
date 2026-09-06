# Lumen backend contract

The customer-facing workflow is intentionally small: a producer submits a story, medium, geography, optional classifications, and creative materials. `POST /v1/predictions` launches the Story, Audience, Market, and Visual agents. Agents can call the active trained model and, for market evidence, Parallel Search. The response says whether the project is likely to be a `hit`, `miss`, or `inconclusive`, with a 0–100 score, confidence, structured agent findings, and evidence.

The adjacent `agentic-cinema-hack` project supplies reusable backend building blocks for this contract: script/keyframe ingestion, Gemini visual inspection, `ParallelSearchClient`, the agentic quant trainer, and `QuantOracle`. Its current oracle predicts expected IMDb rating and craft residuals, so the backend still needs a calibrated hit/miss outcome layer (or a retrained commercial-success target) before those values are exposed as hit probability.

Training is not part of the producer UI. `GET /v1/diagnostics/model` is an internal diagnostics endpoint for trainer health, active model version, latest run, feature count, and evaluation metrics.

The OpenAPI source is `openapi/lumen-api.yaml`. The runnable Bruno collection is under `bruno/lumen-api`; select the `local` environment and point `baseUrl` at the backend mock. Bruno is useful now for contract-driven mock development; the frontend can later replace its local simulation with the same request and response shapes.

The proposed visual architecture is in `ARCHITECTURE_MERMAID.md` (with a plain-text fallback in `ARCHITECTURE_ASCII.md`).

## Generic progress events

`GET /v1/predictions/{predictionId}/events` is an SSE stream for the progress screen. It deliberately exposes only operational state: `job.started`, `agent.started`, `agent.progress`, `agent.completed`, `agent.failed`, `job.completed`, and `job.failed`. Each event carries an opaque `agentId` (for example `agent-x`), status, optional 0–100 progress, a short operational message, and an optional `graph` snapshot of nodes and dependency edges. It must not contain agent findings, prompts, search results, model reasoning, or prediction explanations; those belong to the final prediction response.

The frontend can render any number of agents without knowing their roles. It should reconnect with `Last-Event-ID`, and fall back to polling a prediction status endpoint if SSE is unavailable. The current browser animation is a temporary mock of this event stream.
