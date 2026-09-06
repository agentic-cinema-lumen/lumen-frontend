# Lumen backend contract

The customer-facing workflow is intentionally small: a producer submits a story, medium, geography, optional classifications, and creative materials. `POST /v1/predictions` launches the Story, Audience, Market, and Visual agents. Agents can call the active trained model and, for market evidence, Parallel Search. The response says whether the project is likely to be a `hit`, `miss`, or `inconclusive`, with a 0–100 score, confidence, structured agent findings, and evidence.

Training is not part of the producer UI. `GET /v1/diagnostics/model` is an internal diagnostics endpoint for trainer health, active model version, latest run, feature count, and evaluation metrics.

The OpenAPI source is `openapi/lumen-api.yaml`. The runnable Bruno collection is under `bruno/lumen-api`; select the `local` environment and point `baseUrl` at the backend mock. Bruno is useful now for contract-driven mock development; the frontend can later replace its local simulation with the same request and response shapes.
